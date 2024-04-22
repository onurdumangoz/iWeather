import dayjs from 'dayjs';

import { isDay } from './formatDate';

const wait = (n) => new Promise((resolve) => setTimeout(resolve, n));

function getFirstDigit(num) {
    const matches = String(num).match(/\d/);
    const digit = Number(matches[0]);

    return digit;
}

function getLastDigit(num) {
    return num % 10;
}

function getWeatherConditionNames(iconId, sunrise, sunset, current = dayjs()) {
    // https://openweathermap.org/weather-conditions

    const ConditionPrefix = isDay(sunrise, sunset, current) ? 'Day' : 'Night';
    let WeatherCondition = 'Clear';

    const firstDigit = getFirstDigit(iconId);
    const lastDigit = getLastDigit(iconId);

    if (iconId == 800) {
        WeatherCondition = 'Clear';
    } else if (firstDigit == 2) {
        WeatherCondition = 'Storm';
    } else if (firstDigit == 3 || firstDigit == 5 || firstDigit == 6) {
        WeatherCondition = 'Rain';
    } else if (firstDigit == 8) {
        switch (lastDigit) {
            case 1:
            case 2:
                WeatherCondition = 'FewClouds';
                break;
            case 3:
            case 4:
                WeatherCondition = 'Cloudy';
                break;
        }
    }

    return [ConditionPrefix, WeatherCondition];
}

export { wait, getFirstDigit, getLastDigit, getWeatherConditionNames };
