function getDayName(date, locale = 'tr-TR') {
    return date.toLocaleDateString(locale, { weekday: 'short', hour12: false });
}

function getShortMonth(date, locale = 'tr-TR') {
    return date.toLocaleDateString(locale, { day: 'numeric', month: '2-digit', hour12: false });
}

export { getDayName, getShortMonth };
