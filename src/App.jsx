import { useState } from "react";
import WeatherBackground from "./components/WeatherBackground";

const App = () => {
  const [weather, setWeather] = useState(null);

  //
  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className=' min-h-screen'>
      <WeatherBackground condition={getWeatherCondition()} />

      <div className=' flex items-center justify-center p-6 min-h-screen'>
        <div
          className=' bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white 
          w-full border border-white/30 relative z-10'>
          <h1 className=' text-4xl font-extrabold text-center mb-6'>
            Weather App
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
