import React from 'react';

import Thunderstorm from '../assets/Thunderstorm.gif';
import Rain from '../assets/Rain.gif';
import SnowDay from '../assets/Snow.gif';
import ClearDay from '../assets/ClearDay.gif';
import ClearNight from '../assets/ClearNight.gif';
import CloudsDay from '../assets/CloudsDay.gif';
import CloudsNight from '../assets/CloudsNight.gif';
import Haze from '../assets/Haze.gif';
import video from '../assets/video1.mp4'

const WeatherBackground = ({ condition }) => {
    const gifs = {
        Thunderstorm,
        Drizzle: Rain,
        Rain,
        Snow: SnowDay,
        Clear: { day: ClearDay, night: ClearNight },
        Clouds: { day: CloudsDay, night: CloudsNight },
        Mist: Haze,
        Smoke: Haze,
        Haze,
        Fog: Haze,
        default: video
    };

    const getBackground = () => {
        if (!condition) return gifs.default;
        const weatherType = condition.main;
        const assets = gifs[weatherType] || gifs.default;

        if (!assets) return gifs.default;
        