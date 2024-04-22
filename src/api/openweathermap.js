import axios from 'axios';

export default axios.create({
    method: 'get',
    baseURL: 'https://api.openweathermap.org',
    params: {
        appid: '15836d36b32958ff62c0f30e4d1aafba', // 15836d36b32958ff62c0f30e4d1aafba
        units: 'metric',
    },
});
