import axios from 'axios';

const WEATHER_URL = '/data/2.5/weather';

const api = axios.create({
    method: 'get',
    baseURL: 'https://api.openweathermap.org',
    params: {
        appid: '15836d36b32958ff62c0f30e4d1aafba', // 15836d36b32958ff62c0f30e4d1aafba
        units: 'metric',
    },
});

async function getWeatherDataAPIById(id) {
    return await (
        await api.get(`${WEATHER_URL}?id=${id}`)
    ).data;
}

async function getWeatherDataAPIByLocation(lat, lon) {
    return await (
        await api.get(`${WEATHER_URL}?lat=${lat}&lon=${lon}`)
    ).data;
}

async function getForecastDataAPI(id) {
    return await (
        await api.get(`/data/2.5/forecast?id=${id}`)
    ).data;
}

export default api;
export { getWeatherDataAPIById, getWeatherDataAPIByLocation, getForecastDataAPI };
