export const removeNumericKey = (object) => {
  let obj = { ...object };
  for (let key in obj) {
    if (!Number.isNaN(+key)) {
      delete obj[key];
    }
  }
  return obj;
};

export const timeLeft = (date) => {
  if (!date) return null;
  const seconds = Math.floor((+date * 1000 - Date.now()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};

export const formatDate = (date) => {
  if (!date) return;
  let d = new Date(date * 1000),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};
