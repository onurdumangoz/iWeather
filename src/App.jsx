import { Toaster } from 'react-hot-toast';

import './App.css';

import AllRouting from './components/AllRouting';

function App() {
    return (
        <div className="lg:mx-10 h-full">
            <Toaster />
            <AllRouting />
        </div>
    );
}

export default App;
