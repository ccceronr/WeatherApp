import { useState } from "react";
import WeatherBackground from "./components/WeatherBackground";
import { useEffect } from "react";
import { convertTemperature } from "./components/Helper";

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [unit, setUnit] = useState("C");
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_API_KEY;
  //https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
  //https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid={API_KEY}&units=metric
  //http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

  useEffect(() => {
    if (city.trim().length >= 3 && !weather) {
      const timer = setTimeout(() => fetchSuggestions(city),500);
      return () => clearTimeout(timer);
    } 
    setSuggestions([]);
  }, [city, weather]);

  //FETCHES 5 LOCATIONS SUGGESTIONS FROM API AND UPDATES

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      response.ok ? setSuggestions(await response.json()) : setSuggestions([]);
    }
    catch {
      setSuggestions([]);
    }
  }

  //THIS WILL FETCH THE WEATHER DATA FROM URL
  const fetchWeatherData = async (url, name='') => {
    setError('');
    setWeather(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error((await response.json()).message || 'City not found')
      const data = await response.json();
      setWeather(data);
      setCity(name || data.name);
      setSuggestions([]);
    }
    catch (err) {
      setError(err.message);
    }
  }

  //THIS FUNCTION PREVENTS FORM SUBMISSION, VALIDATES CITY INPUT, AND FETCH DATA VIA API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return setError('Please enter a valid city or country name.');
    await fetchWeatherData(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`,
    )
  }

  const getWeatherCondition = () =>
    weather && {
      main: weather.weather[0].main,
      isDay:
        Date.now() / 1000 > weather.sys.sunrise &&
        Date.now() / 1000 < weather.sys.sunset,
    };

  return (
    <div className=" min-h-screen">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className=" flex items-center justify-center p-6 min-h-screen">
        <div
          className=" bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-white 
          w-full border border-white/30 relative z-10"
        >
          <h1 className=" text-4xl font-extrabold text-center mb-6">
            Weather App
          </h1>
          {weather ? (
            <form onSubmit={handleSearch} className=" flex flex-col relative">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city or country"
                className="mb-4 p-3 rounded border border-white bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-transparent shadow-md rounded z-10">
                  {suggestions.map((s) => (
                    <button
                      type="button"
                      key={`${s.lat}-${s.lon}`}
                      onClick={() =>
                        fetchWeatherData(
                          `https://api.openweathermap.org/data/2.5/weather?lat=${s.lat}&lon=${s.lon}&appid=${API_KEY}&units=metric`,
                          `${s.name}, ${s.country}${
                            s.state ? `, ${s.state}` : ""
                          }`
                        )
                      }
                      className=" block hover.bg-blue-700 bg-transparent px-4 py-2 text-sm text left w-full transition-colors"
                    >
                      {s.name}, {s.country}
                      {s.state && `, ${s.state}`}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className=" bg-purple-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Get Weather
              </button>
            </form>
          ) : (
            <div className=" mt-6 text-center transition-opacity duration-500">
              <button
                onClick={() => {
                  setWeather(null);
                  setCity("");
                }}
                className=" mb-4 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
              >
                New search
              </button>
              <div className=" flex justify-between items-center">
                <h2 className=" text-3xl font-bold">{weather.name}</h2>
                <button
                  onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                  className=" bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}
              className=' mx-auto my-4 animate-bounce' />
              <p className='text-4xl'>
                {convertTemperature(weather.main.temp, unit)}&deg;{unit}
              </p>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
