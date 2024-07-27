import React, { useState, useEffect } from 'react';
import weatherServices from '../services/weather';

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherServices
      .getWeather(city)
      .then((weather) => {
        setWeather(weather);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(weather);

  if (weather === null) return null;

  return (
    <section>
      <h3>Weather in {city}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={weatherServices.getWeatherIcon(weather.weather[0].icon)}></img>
      <p>wind {weather.wind.speed} m/s</p>
    </section>
  );
};

export default Weather;
