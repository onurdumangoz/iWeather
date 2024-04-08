import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Weather from './Weather';

const AllRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather/:cityIDs" element={<Weather />} />
        </Routes>
    );
};

export default AllRouting;
