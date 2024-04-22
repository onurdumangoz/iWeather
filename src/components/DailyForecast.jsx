import { useState } from 'react';
import _ from 'lodash';
import { Clock } from '@phosphor-icons/react';
import Chart from 'react-apexcharts';

import { getCardDate, getDayName, getShortMonth, isDay } from '../utils/formatDate';
import WeatherIcon from './WeatherIcon';
import { useEffect } from 'react';

const DailyForecast = ({ mini, forecastData, cityData }) => {
    const [selectedDay, setSelectedDay] = useState(0);

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
                formatter: (val, opts) => {
                    if (opts.seriesIndex == 0) {
                        return val;
                    } else if (opts.seriesIndex == 1) {
                        return `${val}%`;
                    }
                },
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
            legend: {
                labels: {
                    colors: '#ffffff',
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
                    style: {
                        colors: '#ffffff',
                    },
                },
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: [{ show: false }, { show: false, min: 0, max: 100 }],
        },
        series: [
            { name: 'Temperature', type: 'area', data: [] },
            { name: 'Precipitation', type: 'column', data: [] },
        ],
    });

    const updateChartData = () => {
        let tempSeries = [];
        let rainSeries = [];
        let categories = [];

        const forecastDataObjKeys = Object.keys(forecastData);
        const forecastDataObjValues = Object.values(forecastData);

        forecastDataObjKeys.map((key) => {
            forecastData[key].map((dayItem) => {
                const dt = new Date(parseInt(dayItem.dt + '000'));
                categories.push(`${dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()}:00`);

                tempSeries.push(dayItem.main.temp);
                rainSeries.push(parseInt(dayItem.pop * 100));
            });
        });

        let max =
            (forecastDataObjValues[0].length < 5
                ? forecastDataObjValues[0].length + forecastDataObjValues[1].length
                : forecastDataObjValues[0].length) + 1;

        setChartData((prev) => ({
            ...prev,
            options: { xaxis: { categories, min: 1, max } },
            series: [
                { name: 'Temperature', type: 'area', data: tempSeries, color: '#ffcc00' },
                { name: 'Precipitation', type: 'column', data: rainSeries, color: '#1a73e8' },
            ],
        }));
    };

    const handleWeatherCartClick = (dayKey, selectedDayIndex) => {
        const forecastDataObjKeys = Object.keys(forecastData);
        const forecastDataObjValues = Object.values(forecastData);

        const firstForecastDay = parseInt(forecastDataObjKeys[0]);
        const diffClickedDay = parseInt(dayKey) - firstForecastDay;
        setSelectedDay(selectedDayIndex);

        const dayIndex = forecastDataObjKeys.indexOf(dayKey);
        let diffMinBeforeToday = 0;
        if (dayIndex > 0) {
            for (let i = 0; i < dayIndex; i++) {
                const d = forecastData[forecastDataObjKeys[i]];
                diffMinBeforeToday += d.length;
            }
        }

        const isLastDay = forecastDataObjKeys[forecastDataObjKeys.length - 1] === dayKey;

        let min = diffClickedDay <= 0 ? 1 : diffMinBeforeToday + 1;

        let max =
            diffClickedDay <= 0
                ? (forecastDataObjValues[0].length < 5
                      ? forecastDataObjValues[0].length + forecastDataObjValues[1].length
                      : forecastDataObjValues[0].length) + 1
                : diffMinBeforeToday +
                  8 +
                  (isLastDay ? forecastDataObjValues[forecastDataObjKeys.length - 1].length - 8 : 1);

        const mergedForecastData = forecastDataObjValues.reduce((result, array) => result.concat(array));
        //console.log(mergedForecastData);
        let categories = [];

        mergedForecastData.map((item) => {
            const dt = new Date(parseInt(item.dt + '000'));
            categories.push(`${dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()}:00`);
        });

        setChartData((prev) => ({
            ...prev,
            options: { xaxis: { categories, min, max } },
        }));
    };

    useEffect(() => {
        updateChartData();
    }, []);

    return (
        <div className="flex flex-col w-full">
            <div>
                <div className={`flex gap-2 flex-col bg-gray-500/50 rounded-lg ${mini ? '' : 'h-[300px] p-3'}`}>
                    {!mini ? (
                        <div className="border-b w-full pb-2">
                            <div className="flex">
                                <Clock size={24} />
                                <span className="ml-2">DAILY FORECAST</span>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}

                    <div className={`flex ${mini ? '' : 'gap-3 p-3 overflow-x-auto'}`}>
                        {Object.keys(forecastData).map((key, index) => {
                            const dayObj = forecastData[key];

                            const groupedWeatherData = _.groupBy(dayObj, (x) => x.weather[0].id);
                            const weatherObj = _.maxBy(Object.values(groupedWeatherData), (x) => x.length)[0];
                            const dayIcon = weatherObj.weather[0].id;

                            //const dayDt = new Date(parseInt(dayObj[0].dt + '000'));

                            //const avgTemp = Math.round(_.sumBy(dayObj, (x) => x.main.temp) / dayObj.length);
                            const maxTemp = Math.round(_.maxBy(dayObj, (x) => x.main.temp_max).main.temp_max);
                            const minTemp = Math.round(_.minBy(dayObj, (x) => x.main.temp_min).main.temp_min);

                            return (
                                <div
                                    className={`flex flex-col items-center rounded-lg cursor-pointer select-none weather-daily-cart ${
                                        selectedDay == index && !mini ? 'active' : ''
                                    } ${mini ? 'py-3' : 'p-3'}`}
                                    onClick={() => {
                                        mini ? '' : handleWeatherCartClick(key, index);
                                    }}
                                >
                                    <span className={mini ? 'heading-sm' : 'heading-md'}>
                                        {getDayName(dayObj[0].dt)}
                                    </span>
                                    <span className="font-thin">{getShortMonth(dayObj[0].dt)}</span>
                                    <span className="flex items-center">
                                        <span className={mini ? 'heading-md' : 'heading-lg'}>{maxTemp}°</span>
                                        <span className={`${mini ? 'heading-sm' : 'heading-md'} !font-normal ml-2`}>
                                            {minTemp}°
                                        </span>
                                    </span>
                                    <WeatherIcon
                                        iconId={dayIcon}
                                        sunrise={cityData.sys.sunrise}
                                        sunset={cityData.sys.sunset}
                                        current={weatherObj.dt}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {!mini ? (
                <Chart options={chartData.options} series={chartData.series} type="area" height={250} width="100%" />
            ) : (
                ''
            )}
        </div>
    );
};

DailyForecast.defaultProps = {
    mini: false,
};

export default DailyForecast;
