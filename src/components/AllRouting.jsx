import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Weather from './Weather';
import { nanoid } from 'nanoid';

const AllRouting = () => {
    return (
        <Routes>
            <Route path="/" element={<Home key={nanoid()} />} />
            <Route path="/weather/:cityIDs" element={<Weather key={nanoid()} />} />
        </Routes>
    );
};

export default AllRouting;
