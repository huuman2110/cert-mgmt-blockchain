import { useIntl } from "react-intl";

export const useTranslate = () => {
  const { formatMessage } = useIntl();

  const t = (id) => formatMessage({ id });

  return {
    t,
  };
};
