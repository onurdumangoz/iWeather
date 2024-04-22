import axios from 'axios';
import _ from 'lodash';
import { Clock, Cloud, Drop, ThermometerHot, SpinnerGap, Eye, CloudRain, Wind, SunDim } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';

import api from '../api/openweathermap';
import { getCardDate, getDayName, getShortMonth, isDay } from '../utils/formatDate';
import Compass from './Compass';
import WeatherIcon from './WeatherIcon';
import { getFirstDigit, getWeatherConditionNames, wait } from '../utils/helpers';
import { showError } from '../utils/toast';
import DailyForecast from './DailyForecast';

const Weather = () => {
    const location = useLocation();
    const { cityIDs } = useParams();
    //const cityData = location.state?.cityData;
    const [cityData, setCityData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    //const [first, setfirst] = useState(second)

    //const [dayBackground, setDayBackground] = useState('');

    const getForecastData = (cityId = 0) => {
        try {
            api.get(`/data/2.5/forecast?id=${cityId > 0 ? cityId : cityData[0].id}`).then((response) => {
                const groupedData = _.groupBy(response.data.list, (x) => new Date(x.dt * 1000).getDate());
                setForecastData((prev) => [...prev, groupedData]);
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    showErroror(
                        'API sunucusuna iletilen istek rededildi. Yöneticisi iseniz lütfen API anahtarını kontrol edin, değilseniz lütfen yönetici ile iletişime geçin.'
                    );
                }
            } else {
                showError('Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.3');
            }
        }
    };

    useEffect(() => {
        const getCityData = async () => {
            try {
                const cityIDsArr = cityIDs.split(',');

                let cDatas = [];
                let fDatas = [];
                await Promise.all(
                    cityIDsArr.map(async (id) => {
                        const cData = await (await api.get(`/data/2.5/weather?id=${id}`)).data;
                        cDatas.push(cData);

                        const fData = await (await api.get(`/data/2.5/forecast?id=${id}`)).data;
                        const groupedFData = _.groupBy(fData.list, (x) => new Date(x.dt * 1000).getDate());

                        fDatas.push(groupedFData);
                    })
                );

                setCityData(cDatas);
                setForecastData(fDatas);

                for (let i = 0; i < cityIDsArr.length; i++) {
                    /*api.get(`/data/2.5/weather?id=${cityIDsArr[i]}`).then((response) => {
                        setCityData(response.data);
                        getForecastData(response.data.id);
                    });*/
                    /*const data = await (await api.get(`/data/2.5/weather?id=${cityIDsArr[i]}`)).data;
                    //console.log();

                    if (cityData.filter((x) => x.id == data.id).length <= 0) {
                        setCityData((prev) => [...prev, data]);
                    }

                    getForecastData(data.id);*/
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status == 401) {
                        showError(
                            'API sunucusuna iletilen istek rededildi. Yöneticisi iseniz lütfen API anahtarını kontrol edin, değilseniz lütfen yönetici ile iletişime geçin.'
                        );
                    }
                } else {
                    showError('Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.2');
                }
            }
        };

        if (cityData.length <= 0) {
            getCityData();
        } else {
            //getForecastData();
        }

        //chart = ApexCharts.getChartByID('forecast-chart');
        //chart.updateSeries([{ name: 'temps', data: [10, 20, 30] }]);
        //setChartData((prev) => ({ ...prev, series: [{ name: 'temps', data: [10, 20, 30] }] }));
    }, []);

    useEffect(() => {
        if (cityData.length > 0) {
            /*const weatherConditionNames = getWeatherConditionNames(
                cityData.weather[0].id,
                cityData.sys.sunrise,
                cityData.sys.sunset
            );
            setDayBackground(`${weatherConditionNames[0]}${weatherConditionNames[1]}.png`);*/
        }
    }, [cityData]);

    useEffect(() => {
        if (Object.keys(forecastData).length > 0) {
            //updateChartData();
        }
    }, [forecastData]);

    const openAddModal = () => {};

    return (
        <>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <button className="w-20 h-20 rounded-full bg-red-400 heading-lg" onClick={openAddModal}>
                    +
                </button>
            </div>
            <div className={`${forecastData.length == 1 ? '' : 'flex'}`}>
                {cityData.length && cityIDs.split(',').length == forecastData.length
                    ? cityData.map((cD, index) => {
                          const fD = forecastData[index];

                          const weatherConditionNames = getWeatherConditionNames(
                              cD.weather[0].id,
                              cD.sys.sunrise,
                              cD.sys.sunset
                          );

                          return (
                              <>
                                  <div className="flex p-8 h-screen gap-5 flex-1">
                                      {/* grid grid-cols-10 */}
                                      <div className="">
                                          <div className="flex flex-col relative">
                                              <div
                                                  className={`w-[${
                                                      Object.keys(fD).length == 5 ? '500' : '600'
                                                  }px] h-[300px]`}
                                              >
                                                  <div
                                                      className="w-full h-[300px] rounded-lg absolute left-0 top-0 bg-no-repeat bg-cover p-4"
                                                      style={{
                                                          backgroundImage: `url('/src/assets/bg/${weatherConditionNames[0]}${weatherConditionNames[1]}.png')`,
                                                      }}
                                                  >
                                                      <div className="flex flex-col h-full justify-between">
                                                          <span className="heading-md !font-normal mb-8">
                                                              <p>
                                                                  {cD.name}, {cD.sys.country}
                                                              </p>
                                                              <p className="heading-xs !font-thin">
                                                                  {getCardDate(cD.dt)}
                                                              </p>
                                                          </span>
                                                          <span className="flex flex-col">
                                                              <span className="heading-xl mb-4">
                                                                  {Math.round(cD.main.temp)}
                                                                  <span>°c</span>
                                                              </span>
                                                              <span className="heading-md">{`${Math.round(
                                                                  cD.main.temp_max
                                                              )}°c / ${Math.round(cD.main.temp_min)}°c`}</span>
                                                              <span>{cD.weather[0].main}</span>
                                                          </span>
                                                      </div>
                                                      <WeatherIcon
                                                          iconId={cD.weather[0].id}
                                                          sunrise={cD.sys.sunrise}
                                                          sunset={cD.sys.sunset}
                                                          className="absolute w-[200px] h-[200px] bg-no-repeat bg-center bg-contain -right-10 -bottom-10"
                                                      />
                                                  </div>
                                              </div>

                                              <div className="flex flex-col bg-gray-500/50 rounded-lg p-4 mt-5">
                                                  <div className="flex justify-between border-b mb-3 pb-3">
                                                      <span className="flex gap-3">
                                                          <span>
                                                              <ThermometerHot size={24} />
                                                          </span>
                                                          <span>Thermal sensation</span>
                                                      </span>
                                                      <span>{Math.round(cD.main.feels_like)}°c</span>
                                                  </div>

                                                  <div className="flex justify-between border-b mb-3 pb-3">
                                                      <span className="flex gap-3">
                                                          <span>
                                                              <CloudRain size={24} />
                                                          </span>
                                                          <span>Probability of rain</span>
                                                      </span>
                                                      <span>0%</span>
                                                  </div>

                                                  <div className="flex justify-between border-b mb-3 pb-3 relative overflow-hidden">
                                                      <span className="flex gap-3">
                                                          <span>
                                                              <Wind size={24} />
                                                          </span>
                                                          <span>Wind speed</span>
                                                      </span>
                                                      <span>{cD.wind.speed} km/h</span>
                                                      <div className="w-[60px] h-[60px] absolute right-16 -top-4 opacity-50">
                                                          <Compass degree={cD.wind.deg} />
                                                      </div>
                                                  </div>

                                                  <div className="flex justify-between border-b mb-3 pb-3">
                                                      <span className="flex gap-3">
                                                          <span>
                                                              <Drop size={24} />
                                                          </span>
                                                          <span>Air humidity</span>
                                                      </span>
                                                      <span>{cD.main.humidity}%</span>
                                                  </div>

                                                  <div className="flex justify-between">
                                                      <span className="flex gap-3">
                                                          <span>
                                                              <SunDim size={24} />
                                                          </span>
                                                          <span>UV Index</span>
                                                      </span>
                                                      <span>-</span>
                                                  </div>
                                              </div>

                                              <div className="mt-5">
                                                  {forecastData.length > 1 ? (
                                                      <DailyForecast mini={true} forecastData={fD} cityData={cD} />
                                                  ) : (
                                                      ''
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                      {forecastData.length == 1 ? (
                                          <div className="flex-1">
                                              <DailyForecast forecastData={fD} cityData={cD} />
                                          </div>
                                      ) : (
                                          ''
                                      )}
                                  </div>
                              </>
                          );
                      })
                    : ''}
            </div>
        </>
    );
};

export default Weather;
