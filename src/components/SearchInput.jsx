import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { SpinnerGap } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

import api from '../api/openweathermap';
import { showError } from '../utils/toast';

export default () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [requestLoading, setRequestLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    const fetchGeoLocations = (q) => {
        if (q === null || q === '') {
            setLocations([]);
            return;
        }

        setRequestLoading(true);

        try {
            api.get(`/geo/1.0/direct?limit=5&q=${q}`).then((response) => setLocations(response.data));
        } catch (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    showError(
                        'API sunucusuna iletilen istek rededildi. Yöneticisi iseniz lütfen API anahtarını kontrol edin, değilseniz lütfen yönetici ile iletişime geçin.'
                    );
                }
            } else {
                showError('Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
            }
        }

        setRequestLoading(false);
    };

    const handleSearchChange = (e) => {
        const q = e.target.value.trim();

        setQuery(q);
        fetchGeoLocations(q);
    };

    const handleClickedLocation = (selectedLocation) => {
        if (selectedLocation != null) {
            const { lat, lon } = selectedLocation;

            setRequestLoading(true);

            try {
                api.get(`/data/2.5/weather?lat=${lat}&lon=${lon}`).then((response) =>
                    navigate(`/weather/${response.data.id}`, { state: { cityData: response.data } })
                );
            } catch (error) {
                if (error.response) {
                    if (error.response.status == 401) {
                        showError(
                            'API sunucusuna iletilen istek rededildi. Yöneticisi iseniz lütfen API anahtarını kontrol edin, değilseniz lütfen yönetici ile iletişime geçin.'
                        );
                    }
                } else {
                    showError('Bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
                }
            }
        }
    };

    return (
        <>
            <Combobox onChange={handleClickedLocation} nullable value={query}>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg">
                        <Combobox.Button as="div">
                            <Combobox.Input
                                className="bg-gray-600 p-4 w-full outline-none text-white"
                                onChange={handleSearchChange}
                                placeholder="Search location"
                                displayValue={query}
                            />
                        </Combobox.Button>

                        {requestLoading ? (
                            <Combobox.Button as="div" className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <SpinnerGap className="text-blue-light animate-spin" size={28} />
                            </Combobox.Button>
                        ) : null}
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        //afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options
                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg"
                            key="cb-locations"
                        >
                            {!requestLoading && locations.length <= 0 ? (
                                <div className="relative cursor-default select-none p-4 text-white bg-gray-400">
                                    Nothing found. Try entering the full name of the city.
                                </div>
                            ) : (
                                locations.map((location, index) => (
                                    <>
                                        <Combobox.Option
                                            key={(location.lat + location.lon).toFixed(5).replace('.', '')}
                                            className={`relative cursor-pointer select-none p-4 text-white text-left bg-gray-400 ${
                                                index + 1 < locations.length ? 'border-b border-gray-600' : ''
                                            }`}
                                            value={location}
                                        >
                                            <span className="block">
                                                <span>{location.name}</span>
                                                {location.country !== null && location.country !== '' ? (
                                                    <>
                                                        <span> - </span>
                                                        <span>{location.country}</span>
                                                    </>
                                                ) : null}
                                            </span>
                                        </Combobox.Option>
                                    </>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </>
    );
};