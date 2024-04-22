import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';

import 'dayjs/locale/tr';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(LocalizedFormat);
dayjs.extend(isBetween);

function getDayName(dt, locale = 'tr-TR') {
    return dayjs.unix(dt).locale('tr').format('ddd');
    //return date.toLocaleDateString(locale, { weekday: 'short', hour12: false });
}

function getShortMonth(dt, locale = 'tr-TR') {
    return dayjs.unix(dt).locale('tr').format('DD.MM');
    //return date.toLocaleDateString(locale, { day: 'numeric', month: '2-digit', hour12: false });
}

function isDay(sunrise, sunset, current = dayjs()) {
    if (dayjs(current).year() == 1970) {
        current *= 1000;
    }
    return dayjs(current).isBetween(sunrise, sunset);
}

function getCardDate(dt) {
    return dayjs.unix(dt).format('dddd, MMM D, YYYY');
}

export { getDayName, getShortMonth, isDay, getCardDate };
