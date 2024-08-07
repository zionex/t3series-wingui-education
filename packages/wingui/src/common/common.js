import { getAppSettings } from "@zionex/wingui-core/utils/common";

export function getISOWeekNumber(targetDate) {
  let target = new Date(targetDate);
  let startOfWeek = getAppSettings('component').datetime.weekStartsOn
  let dayNr = (targetDate.getDay() + 7 - startOfWeek) % 7;

  target.setDate(target.getDate() - dayNr + 3);

  let firstThursday = target.valueOf();

  target.setMonth(0, 1);

  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }

  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

/**
 * ISO week number는 1월1이 경우에 따라 1주차가 아니라 전년도 마지막 주차로 표시되는 문제
 * @param {*} currentDate 
 * @returns 
 */
export function getCustomWeekNumber(currentDate) {
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  let days = Math.floor((currentDate - startDate) /
    (24 * 60 * 60 * 1000));

  let weekNumber = Math.ceil(days / 7);
  if (days < 6 && weekNumber === 52) {
    weekNumber = 1
  } else {
    weekNumber = weekNumber + 1
  }
  return weekNumber;
}

// partial week
export function getPartialWeek(selectedDate) {
  let getWeekNumber = getAppSettings('component').datetime.getWeekNumber;
  let weekStartsOn = getAppSettings('component').datetime.weekStartsOn;
  let week = getWeekNumber(selectedDate);

  const firstWeekDate = getFirstDayOfWeek(selectedDate, weekStartsOn);
  const lastWeekDate = new Date(new Date(firstWeekDate).setDate(firstWeekDate.getDate() + 6));
  const firstWeekDateMonth = firstWeekDate.getMonth();
  const lastWeekDateMonth = lastWeekDate.getMonth();
  const curMonth = selectedDate.getMonth();

  if (week < 10) {
    week = '0' + week;
  }

  if (firstWeekDateMonth != lastWeekDateMonth) { //partial week
    if (firstWeekDateMonth == curMonth) {
      week = week + 'A'
    } else {
      week = week + 'B'
    }
  }
  return week;
}

function getFirstDayOfWeek(dateObject, firstDayOfWeekIndex) {
  const dayOfWeek = dateObject.getDay(),
    firstDayOfWeek = new Date(dateObject),
    diff = dayOfWeek >= firstDayOfWeekIndex ?
      dayOfWeek - firstDayOfWeekIndex :
      6 - dayOfWeek

  firstDayOfWeek.setDate(dateObject.getDate() - diff)
  firstDayOfWeek.setHours(0, 0, 0, 0)

  return firstDayOfWeek
}