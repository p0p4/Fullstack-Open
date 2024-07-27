import axios from 'axios';
const countryURL = 'https://studies.cs.helsinki.fi/restcountries/api';

const getCountries = () => {
  const request = axios.get(`${countryURL}/all`);
  return request.then((response) => response.data);
};

export default {
  getCountries,
};
