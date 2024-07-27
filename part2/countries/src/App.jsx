import React from 'react';
import { useState, useEffect } from 'react';
import countryServices from './services/countries';
import Content from './components/Content';

const InputField = ({ text, value, onChange }) => (
  <>
    <label>{text}</label>
    <input value={value} onChange={onChange} />
  </>
);

const Filter = ({ value, onChange }) => (
  <form>{InputField({ text: 'find countries', value, onChange })}</form>
);

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [queryCountries, setQueryCountries] = useState([]);

  useEffect(() => {
    countryServices
      .getCountries()
      .then((countries) => {
        setCountries(countries);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleQueryChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setQueryCountries(
      countries.filter((country) =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <>
      <Filter value={searchQuery} onChange={handleQueryChange} />
      <Content
        searchQuery={searchQuery}
        queryCountries={queryCountries}
        setQueryCountries={setQueryCountries}
      />
    </>
  );
};

export default App;
