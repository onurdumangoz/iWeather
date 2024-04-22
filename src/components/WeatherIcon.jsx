import dayjs from 'dayjs';
import { ReactSVG } from 'react-svg';

import { getWeatherConditionNames } from '../utils/helpers';

const WeatherIcon = ({ iconId, sunrise, sunset, current, className }) => {
    const WeatherConditionNames = getWeatherConditionNames(iconId, sunrise, sunset, current);

    const svgPath = `/src/assets/icons/${WeatherConditionNames[0]}${WeatherConditionNames[1]}.svg`;

    const classes = className?.split(' ');

    let hasWidthClass = false;
    let hasHeightClass = false;
    if (classes != undefined) {
        hasWidthClass = classes.some((str) => str.startsWith('w-'));
        hasHeightClass = classes.some((str) => str.startsWith('h-'));
    }

    return iconId > 0 ? (
        <ReactSVG
            src={svgPath}
            beforeInjection={(svg) => {
                svg.setAttribute(
                    'style',
                    `${hasWidthClass ? '' : 'width: 100px;'} ${hasHeightClass ? '' : 'height: 100px;'}`
                );
            }}
            className={className}
        />
    ) : (
        ''
    );
};

WeatherIcon.defaultPros = {
    iconId: 0,
    current: dayjs(),
};

export default WeatherIcon;
