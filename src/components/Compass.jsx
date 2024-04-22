const Compass = ({ degree }) => {
    return (
        <div className="w-auto h-full">
            <div className={`bg-compass bg-no-repeat bg-center bg-contain w-full h-full`}>
                <div
                    style={{ transform: `rotate(${degree}deg)` }}
                    className={`bg-compass-arrow bg-no-repeat bg-center bg-contain w-full h-full`}
                ></div>
            </div>
        </div>
    );
};

Compass.defaultProps = {
    degree: '0',
};

export default Compass;
