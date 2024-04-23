import _ from 'lodash';
import { Drop, ThermometerHot, CloudRain, Wind, SunDim } from '@phosphor-icons/react';
import { useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { nanoid } from 'nanoid';

import { getWeatherDataAPIById, getForecastDataAPI } from '../api/openweathermap';
import { getCardDate } from '../utils/formatDate';
import Compass from './Compass';
import WeatherIcon from './WeatherIcon';
import { getWeatherConditionNames, wait } from '../utils/helpers';
import { showError } from '../utils/toast';
import DailyForecast from './DailyForecast';
import SearchInput from './SearchInput';

const Weather = () => {
    const navigate = useNavigate();
    //const location = useLocation();
    const { cityIDs } = useParams();
    //const cityData = location.state?.cityData;
    const [cityData, setCityData] = useState([]);
    const [forecastData, setForecastData] = useState([]);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [forecastIsMini, setForecastIsMini] = useState(false);

    //const [dayBackground, setDayBackground] = useState('');

    /*
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
    */

    useEffect(() => {
        const getCityData = async () => {
            try {
                const cityIDsArr = cityIDs.split(',');

                let cDatas = [];
                let fDatas = [];
                await Promise.all(
                    cityIDsArr.slice(0, 3).map(async (id) => {
                        const cData = await getWeatherDataAPIById(id);
                        cDatas.push(cData);

                        const fData = await getForecastDataAPI(id);
                        const groupedFData = _.groupBy(fData.list, (x) => new Date(x.dt * 1000).getDate());

                        fDatas.push(groupedFData);
                    })
                );

                setCityData(cDatas);
                setForecastData(fDatas);
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
            const urlSuffix = cityData.map((x) => x.id).join(',');

            if (cityIDs != urlSuffix) {
                navigate(`/weather/${urlSuffix}`, { replace: true });
            }
        }
    }, [cityData]);

    useEffect(() => {
        if (forecastData.length > 1) {
            setForecastIsMini(true);
        } else {
            setForecastIsMini(false);
        }
    }, [forecastData]);

    const openAddModal = () => {
        setAddModalIsOpen(true);
    };

    const closeAddModal = () => {
        setAddModalIsOpen(false);
    };

    const removeCity = (index) => {
        setCityData((prev) => prev.filter((_, i) => i != index));
        setForecastData((prev) => prev.filter((_, i) => i != index));
    };

    return (
        <>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                <button
                    className="absolute bottom-5 right-9 hover:right-10 transition-all duration-300 bg-red-400/90 w-28 h-8 heading-md rounded-lg -mr-3"
                    onClick={() => navigate('/')}
                >
                    Home
                </button>
                <button
                    className="absolute bottom-0 hover:bottom-1 transition-all duration-300 left-1/2 -translate-x-1/2 w-20 h-20 z-10 rounded-full bg-red-400 heading-lg drop-shadow border-2"
                    onClick={openAddModal}
                >
                    +
                </button>
                <a
                    href="https://github.com/onurdumangoz/iWeather"
                    target="_blank"
                    className="absolute bottom-5 left-9 hover:left-10 transition-all duration-300 bg-red-400/90 w-28 h-8 heading-md rounded-lg -ml-3"
                >
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">GitHub</span>
                </a>
            </div>

            <Transition appear show={addModalIsOpen} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={closeAddModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="h-[380px] w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            className="w-10 h-10 border rounded-full hover:bg-black/50 transition-all duration-300 heading-md text-black"
                                            onClick={closeAddModal}
                                        >
                                            X
                                        </button>
                                    </div>

                                    {cityData.length >= 3 ? (
                                        <p className="absolute text-nowrap left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black heading-md">
                                            You can add up to 3 places.
                                        </p>
                                    ) : (
                                        <>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                You can add more places
                                            </Dialog.Title>

                                            <SearchInput
                                                typeAdd={true}
                                                setForecastData={setForecastData}
                                                setCityData={setCityData}
                                                closeModal={closeAddModal}
                                            />
                                        </>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            <div className={`${forecastData.length == 1 ? '' : 'flex'}`}>
                {cityData.length > 0
                    ? cityData.map((cD, index) => {
                          const fD = forecastData[index];

                          const weatherConditionNames = getWeatherConditionNames(
                              cD.weather[0].id,
                              cD.sys.sunrise,
                              cD.sys.sunset
                          );

                          const forecastIsMini = forecastData.length > 1;

                          return (
                              <div className="flex p-8 h-screen gap-5 flex-1" key={nanoid()}>
                                  {/* grid grid-cols-10 */}
                                  <div className="">
                                      <div className="flex flex-col relative">
                                          <div
                                              style={{
                                                  width: `${forecastIsMini ? '500' : '400'}px`,
                                              }}
                                              className={`h-[300px]`}
                                          >
                                              <div
                                                  className="w-full h-[300px] rounded-lg absolute left-0 top-0 bg-no-repeat bg-cover p-4"
                                                  style={{
                                                      backgroundImage: `url('/images/bg/${weatherConditionNames[0]}${weatherConditionNames[1]}.png')`,
                                                  }}
                                              >
                                                  {cityData.length > 1 ? (
                                                      <div className="absolute top-4 right-4">
                                                          <button
                                                              className="w-10 h-10 border rounded-full hover:bg-black/50 transition-all duration-300 heading-md"
                                                              onClick={() => removeCity(index)}
                                                          >
                                                              X
                                                          </button>
                                                      </div>
                                                  ) : (
                                                      ''
                                                  )}
                                                  <div className="flex flex-col h-full justify-between">
                                                      <span className="heading-md !font-normal mb-8">
                                                          <p>
                                                              {cD.name}, {cD.sys.country}
                                                          </p>
                                                          <p className="heading-xs !font-thin">{getCardDate(cD.dt)}</p>
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

                                          <div
                                              className="mt-5"
                                              style={{
                                                  width: `${forecastIsMini ? '500' : '400'}px`,
                                              }}
                                          >
                                              {forecastIsMini ? (
                                                  <DailyForecast mini={true} forecastData={fD} cityData={cD} />
                                              ) : (
                                                  ''
                                              )}
                                          </div>
                                      </div>
                                  </div>
                                  {!forecastIsMini ? (
                                      <div className="flex-1">
                                          <DailyForecast forecastData={fD} cityData={cD} />
                                      </div>
                                  ) : (
                                      ''
                                  )}
                              </div>
                          );
                      })
                    : ''}
            </div>
        </>
    );
};

export default Weather;
