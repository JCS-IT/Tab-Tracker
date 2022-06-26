function getDate() {
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let time = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

const date = getDate()

export { date }