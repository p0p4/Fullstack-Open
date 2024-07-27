import Weather from './Weather';

const Country = ({ country }) => (
  <article>
    <section>
      <h2>{country.name.common}</h2>
      <p>
        capital {country.capital[0]}
        <br />
        area {country.area}
      </p>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} width='150' />
    </section>
    <Weather city={country.capital[0]} />
  </article>
);

const Content = ({ searchQuery, queryCountries, setQueryCountries }) => {
  if (searchQuery === '') return null;

  if (queryCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (queryCountries.length === 1) {
    const country = queryCountries[0];

    return <Country country={country} />;
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {queryCountries.map((country) => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => setQueryCountries([country])}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default Content;
