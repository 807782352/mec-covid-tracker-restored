export const timeFormater = (unix_timestamp) => {
  const t = new Date(unix_timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = t.getFullYear();
  const month = months[t.getMonth()];
  const date = t.getDate();
  const hour = t.getHours();
  const min = t.getMinutes();
  const sec = t.getSeconds();
  const formattedTime =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return formattedTime;
};
