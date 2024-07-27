import { useState, useEffect } from 'react';
import personServices from './services/persons';
import Notification from './components/Notification';
import './index.css';

const Filter = ({ value, onChange }) =>
  InputField({ text: 'filter shown with', value, onChange });

const InputField = ({ text, value, onChange }) => (
  <div>
    <label>{text}</label>
    <input value={value} onChange={onChange} />
  </div>
);

const PersonForm = ({
  onSubmit,
  nameValue,
  nameOnChange,
  numberValue,
  numberOnChange,
}) => (
  <form onSubmit={onSubmit}>
    <InputField text='name:' value={nameValue} onChange={nameOnChange} />
    <InputField text='number:' value={numberValue} onChange={numberOnChange} />
    <button type='submit'>add</button>
  </form>
);

const Person = ({ person, handleDelete }) => (
  <li>
    {person.name} {person.number}
    <button onClick={() => handleDelete(person)}>delete</button>
  </li>
);

const Persons = ({ persons, setPersons, setMessage, filter }) => {
  const personsFiltered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = (person) => {
    window.confirm(`Delete ${person.name} ?`) &&
      personServices
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
          setMessage({
            text: `${person.name} deleted`,
            color: 'green',
          });
        })
        .catch(() => {
          setMessage({
            text: `Information of ${person.name} has already been removed from server`,
            color: 'red',
          });
        });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <ul className='persons'>
      {personsFiltered.map((person) => (
        <Person key={person.id} person={person} handleDelete={handleDelete} />
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState(null);

  console.log('render');

  useEffect(() => {
    personServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const nameExists = persons.some((person) => person.name === newName);

    if (!nameExists) {
      const personObject = {
        name: newName,
        number: newNumber,
      };

      personServices.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setMessage({ text: `Added ${newName}`, color: 'green' });
      });
    } else {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmUpdate) {
        const person = persons.find((person) => person.name === newName);
        const changedPerson = { ...person, number: newNumber };

        personServices
          .update(person.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setMessage({ text: `Updated ${newName}`, color: 'green' });
          })
          .catch(() => {
            setMessage({
              text: `Information of ${newName} has already been removed from server`,
              color: 'red',
            });
          });
      } else {
        alert(`${newName} is already added to phonebook`);
        return;
      }
    }

    setTimeout(() => {
      setMessage(null);
    }, 5000);
    setNewName('');
    setNewNumber('');
  };

  const handleInputChange = (setValue) => (event) =>
    setValue(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter value={filter} onChange={handleInputChange(setFilter)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={handleInputChange(setNewName)}
        numberValue={newNumber}
        numberOnChange={handleInputChange(setNewNumber)}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        setPersons={setPersons}
        setMessage={setMessage}
        filter={filter}
      />
    </div>
  );
};

export default App;
