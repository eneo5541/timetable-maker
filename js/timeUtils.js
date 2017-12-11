export const BASE_TIME = new Date('12/01/1989').getTime();
export const HALF_HOUR = 1800000;
export const ONE_DAY = 84600000;

export const formatAMPM = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutes} ${date.getHours() >= 12 ? 'pm' : 'am'}`;
}

export const generateHalfHourIntervals = (startTime, finishTime=(BASE_TIME + ONE_DAY)) => {
  const intervals = [];
  let timer = startTime;
  while(timer < finishTime) {
    intervals.push({ 
      value: timer,
      label: formatAMPM(timer),
    });
    timer += HALF_HOUR;
  }

  return intervals;
}
