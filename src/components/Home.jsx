import React from 'react';

import SearchInput from './SearchInput';
import LogoWithText from './LogoWithText';

const Home = () => {
    return (
        <div className="grid grid-cols-1 text-center h-full p-10">
            <div className="mt-5 mx-auto">
                <LogoWithText />
            </div>

            <div>
                <p className="text-white heading-md">
                    <span>Welcome to </span>
                    <span className="text-blue-light">TypeWeather</span>
                </p>
                <p className="text-white text-sm mt-2">Choose a location to see the weather forecast</p>

                <div className="mt-5">
                    <SearchInput />
                </div>
            </div>
        </div>
    );
};

export default Home;
