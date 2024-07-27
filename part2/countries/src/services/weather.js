import axios from 'axios';
const api_key = import.meta.env.VITE_SOME_KEY;
const weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=';

const getWeather = (city) => {
  const request = axios.get(
    `${weatherURL}${city}&appid=${api_key}&units=metric`
  );
  return request.then((response) => response.data);
};

const getWeatherIcon = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export default {
  getWeather,
  getWeatherIcon,
};
