import axios from 'axios';
import _ from 'lodash';
import { Clock, Cloud, Drop, ThermometerHot, SpinnerGap, Eye } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';

import { getDayName, getShortMonth } from '../utils/formatDate';

const Weather = () => {
    const location = useLocation();
    const { cityIDs } = useParams();
    const cityData = location.state?.cityData;
    const [forecastData, setForecastData] = useState({});
    var chart = {};

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: 'forecast-chart',
                fontFamily: "'Nunito', sans-serif",
                selection: {
                    enabled: false,
                },
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    colors: ['#ffffff'],
                },
                background: {
                    enabled: false,
                },
            },
            grid: {
                show: false,
                padding: {
                    left: 16,
                    right: 16,
                },
            },
            stroke: {
                curve: 'smooth',
            },
            fill: {
                type: 'gradient',
            },
            tooltip: {
                enabled: false,
            },
            xaxis: {
                type: 'category',
                //categories: [], // 1712523600000, 1712534400000, 1712545200000, 1712556000000, 1712566800000, 1712577600000, 1712588400000, 1712599200000,
                //tickAmount: 9,
                tickPlacement: 'on',
                labels: {
                    show: true,
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                show: false,
            },
        },
        series: [
            /*{
                name: 'series-1',
                data: [10, 20, 30, 40, 50, 60, 70, 80],
            },*/
        ],
    });

    const getForecastData = async () => {
        const data = await (
            await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?appid=15836d36b32958ff62c0f30e4d1aafba&id=${cityData.id}&units=metric`
            )
        ).data;

        /*const dd = _(data.list)
            .groupBy((x) => new Date(x.dt + '000').getDate())
            .mapValues((x) => _.map(x))
            .value();*/

        const groupedData = _.groupBy(data.list, (x) => new Date(parseInt(x.dt + '000')).getDate());
        //console.log(groupedData);

        setForecastData(groupedData);
    };

    const updateChartData = () => {
        let seriesData = [];
        let categories = [];

        Object.keys(forecastData).map((key) => {
            forecastData[key].map((dayItem) => {
                const dt = new Date(parseInt(dayItem.dt + '000'));
                categories.push(`${dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()}:00`);

                seriesData.push(dayItem.main.temp);
            });
        });

        setChartData((prev) => ({
            ...prev,
            options: { xaxis: { categories, min: 1, max: 9 } },
            series: [{ name: 'temps', data: seriesData }],
        }));
    };

    useEffect(() => {
        getForecastData();

        chart = ApexCharts.getChartByID('forecast-chart');
        //chart.updateSeries([{ name: 'temps', data: [10, 20, 30] }]);
        //setChartData((prev) => ({ ...prev, series: [{ name: 'temps', data: [10, 20, 30] }] }));
    }, []);

    useEffect(() => {
        updateChartData();
    }, [forecastData]);

    const handleWeatherCartClick = (dayKey) => {
        const firstForecastDay = parseInt(Object.keys(forecastData)[0]);
        const diffClickedDay = parseInt(dayKey) - firstForecastDay;

        const dayIndex = Object.keys(forecastData).indexOf(dayKey);
        let diffMinBeforeToday = 0;
        if (dayIndex > 0) {
            for (let i = 0; i < dayIndex; i++) {
                const d = forecastData[Object.keys(forecastData)[i]];
                diffMinBeforeToday += d.length;
            }
        }

        const isLastDay = Object.keys(forecastData)[Object.keys(forecastData).length - 1] === dayKey;

        let min = diffClickedDay <= 0 ? 1 : diffMinBeforeToday + 1;
        let max =
            diffClickedDay <= 0
                ? forecastData[Object.keys(forecastData)[0]].length + 1
                : diffMinBeforeToday + 8 + (isLastDay ? 0 : 1);

        //console.log(Object.keys(forecastData).filter((x) => parseInt(x) < parseInt(dayKey)));
        //const dayObj = forecastData[dayKey];
        //const temps = dayObj.map((x) => x.main.temp);

        setChartData((prev) => ({
            ...prev,
            options: { xaxis: { min, max } },
        }));
    };

    return (
        <>
            <div className="flex p-8 h-screen gap-5">
                <div className="flex basis-5/12 flex-col justify-evenly">
                    <div className="flex flex-col items-center">
                        <span className="heading-xl">
                            {Math.round(cityData.main.temp)}
                            <span className="font-thin">°C</span>
                        </span>
                        <span className="text-3xl">{cityData.weather[0].main}</span>
                    </div>
                    <div>
                        <div className="flex gap-4">
                            <div className="basis-1/2">
                                <div className="flex flex-col justify-between h-32 bg-gray-500/50 rounded-lg p-3">
                                    <div>
                                        <div className="flex">
                                            <ThermometerHot size={24} />
                                            <span className="ml-2">FEELS LIKE</span>
                                        </div>
                                        <div>
                                            <span className="heading-lg">
                                                {Math.round(cityData.main.feels_like)}
                                                <span className="font-thin">°C</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <span>Humidity is making it feel warmer</span>
                                    </div>
                                </div>
                            </div>

                            <div className="basis-1/2">
                                <div className="flex flex-col justify-between h-32 bg-gray-500/50 rounded-lg p-3">
                                    <div>
                                        <div className="flex">
                                            <Drop size={24} />
                                            <span className="ml-2">PRECIPITATION</span>
                                        </div>
                                        <div>
                                            <span className="heading-lg">2.3"</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span>2" expected in next 24h</span>
                                    </div>
                                </div>
                            </div>

                            <div className="basis-1/2">
                                <div className="flex flex-col justify-between h-32 bg-gray-500/50 rounded-lg p-3">
                                    <div>
                                        <div className="flex">
                                            <Eye size={24} />
                                            <span className="ml-2">VISIBILITY</span>
                                        </div>
                                        <div>
                                            <span className="heading-lg">{cityData.visibility / 1000}km</span>
                                        </div>
                                    </div>

                                    <div>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="basis-7/12">
                    <div className="flex gap-4 flex-col bg-gray-500/50 rounded-lg p-3">
                        <div className="border-b w-full pb-4">
                            <div className="flex">
                                <Clock size={24} />
                                <span className="ml-2">DAILY FORECAST</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {Object.keys(forecastData).map((key) => {
                                const dayDt = new Date(parseInt(forecastData[key][0].dt + '000'));
                                const avgTemp = Math.round(
                                    _.sumBy(forecastData[key], (x) => x.main.temp_max) / forecastData[key].length
                                );

                                //console.log(forecastData[key].reduce((x) => x.main.temp));
                                return (
                                    <div
                                        className="flex flex-col items-center py-3 px-5 rounded-lg cursor-pointer select-none weather-daily-cart active"
                                        onClick={() => {
                                            handleWeatherCartClick(key);
                                        }}
                                    >
                                        <span className="heading-md">{getDayName(dayDt)}</span>
                                        <span className="font-thin">{getShortMonth(dayDt)}</span>
                                        <span className="heading-lg">{avgTemp}°</span>
                                        <Cloud size={24} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <Chart options={chartData.options} series={chartData.series} type="area" height={250} />
                        <div id="forecast-chart"></div>
                        <div>{JSON.stringify(forecastData)}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Weather;
