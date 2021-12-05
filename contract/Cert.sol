// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol';

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract CertERC721 is ERC721Enumerable, Ownable {
    
    using Strings for uint256;
    
    // Optional mapping for token URIs
    mapping (uint256 => string) private certs;

    // Base URI
    string private _baseURIextended;


    constructor()
        ERC721("CertManagement", "CM")
    {}
    
    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        certs[tokenId] = _tokenURI;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = certs[tokenId];
        string memory base = _baseURI();
        
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
    
    function mint(
        address _to,
        string memory tokenURI_
    ) internal {
        uint256 _tokenId = totalSupply();
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, tokenURI_);
    }
    
    
    function burn(uint256 _tokenId) internal {
        _burn(_tokenId);
    }
}


contract CertManagement is CertERC721 {
    using Counters for Counters.Counter;
    
    enum ROLES {
        OWNER,
        CENSOR
    }

    enum CERT_STATUSES {
        DEFAULT,
        PENDING,
        REPORTED
    }

    enum CERT_PENDING_STATUSES {
        DEFAULT,
        APPROVED,
        REJECTED
    }
    
    struct Censor {
        address addr;
        string name;
        string email;
    }

    struct SpecializedTraining {
        uint256 id;
        string name;
        string vnName;
    }

    struct Cert {
        address to;
        string url;
    }
    
    string public REFACTOR_NAME = "Huynh Cong Phap";

    mapping(address => ROLES[]) roles;

    mapping(uint256 => Censor) public censors;
    uint256 public totalCensors;
    
    SpecializedTraining[] public specializedTrainings;

    Cert[] certsPending;
    mapping(uint256 => mapping(address => CERT_PENDING_STATUSES)) certsPendingStatus;
    mapping(uint256 => uint256) totalApproveOfCert;
    mapping(uint256 => CERT_STATUSES) certStatus;

    string[] certForms;
    mapping(uint256 => uint256) public totalCertForm;
    mapping(uint256 => uint256) public certFormMinted;

    event Mint(address indexed to, string url);
    
    constructor() {
        roles[msg.sender].push(ROLES.OWNER);
    }

    function setRefactorName(string memory _name) external {
        REFACTOR_NAME = _name;
    }
    
    function _hasRole(address _consor, ROLES _role) private view returns(bool) {
        ROLES[] memory _roles = roles[_consor];
        for(uint i=0; i<_roles.length; i++) {
            if(_roles[i] == _role) return true;
        }
        return false;
    }
    
    function addCensor(address _addr, string memory _name, string memory _email) external {
        require(!_hasRole(_addr, ROLES.CENSOR), "CENSOR: UNIQUE_CENSOR_ADDRESSS");
        roles[_addr].push(ROLES.CENSOR);
        censors[totalCensors] = Censor({
            addr: _addr,
            name: _name,
            email: _email
        });
        totalCensors++;
    }

    function editCensor(uint256 _idx, address _addr, string memory _name, string memory _email) external {
        require(censors[_idx].addr == _addr || !_hasRole(_addr, ROLES.CENSOR), "CENSOR: UNIQUE_CENSOR_ADDRESSS");
        censors[_idx] = Censor({
            addr: _addr,
            name: _name,
            email: _email
        });
    } 

    function deleteCensor(uint256 _idx) external {
        delete roles[censors[_idx].addr];
        if(_idx == totalCensors-1) {
            delete censors[_idx];
        } else {
            censors[_idx] = censors[totalCensors-1];
        }
        totalCensors--;
    }

    function getOwnerRoles(address sender) external view returns(ROLES[] memory) {
        return roles[sender];
    }
     
    function addSpecializedTraining(string memory _name, string memory _vnName) external {
        specializedTrainings.push(SpecializedTraining({
            id: specializedTrainings.length,
            name: _name,
            vnName: _vnName
        }));
    }

    function deleteSpecializedTraining(uint256 _idx) external {
        specializedTrainings[_idx] = specializedTrainings[specializedTrainings.length-1];
        specializedTrainings.pop();
    }
    
    function getSpecializedTrainings() external view returns(SpecializedTraining[] memory) {
        return specializedTrainings;
    }

    function addCertForm(string memory _url, uint256 _total) external {
        uint256 length = certForms.length;
        totalCertForm[length] = _total;
        certForms.push(_url);
    }

    function editCertForm(uint256 _idx, string memory _url, uint256 _total) external {
        totalCertForm[_idx] = _total;
        certForms[_idx] = _url;
    }

    function deleteCertForm(uint256 _idx) external {
        delete totalCertForm[_idx];
        certForms[_idx] = certForms[certForms.length-1];
        certForms.pop();
    }

    function getCertForms () external view returns(string[] memory) {
        return certForms;
    }

    function addCert(address _to, uint256 certFormIndex, string memory _url) external {
        uint256 length = certsPending.length;
        certStatus[length] = CERT_STATUSES.PENDING;
        certFormMinted[certFormIndex]++;
        certsPending.push(Cert({
            to: _to,
            url: _url
        }));
        
    }

    function getCertsPending() external view returns(Cert[] memory) {
        return certsPending;
    }

    function approveCert(uint256 certIndex) external {
        require(certIndex < certsPending.length, "CERT: INVALID_RANGE");
        require(_hasRole(msg.sender, ROLES.CENSOR), "CENSOR: UNAUTHOZIRED");
        require(certStatus[certIndex] == CERT_STATUSES.PENDING, "CENSOR: ONLY_APPROVE_FOR_PENDING_CERT");
        require(certsPendingStatus[certIndex][msg.sender] == CERT_PENDING_STATUSES.DEFAULT, "CERT: REVIEWED");
        totalApproveOfCert[certIndex]++;
        certsPendingStatus[certIndex][msg.sender] = CERT_PENDING_STATUSES.APPROVED;
        if(totalApproveOfCert[certIndex] > totalCensors/2) {
            delete certsPendingStatus[certIndex][msg.sender];
            delete certStatus[certIndex];
            delete totalApproveOfCert[certIndex];
            Cert memory _cert = certsPending[certIndex];
            certsPending[certIndex] = certsPending[certsPending.length - 1];
            certsPending.pop();
            mint(_cert.to, _cert.url);
            emit Mint(_cert.to, _cert.url);
        }
    }
}