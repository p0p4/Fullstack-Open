import { useState } from 'react';

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good - bad) / (good + neutral + bad);
  const positive = (good / (good + neutral + bad)) * 100 + ' %';

  if (all === 0) return <p>No feedback given</p>;

  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive} />
      </tbody>
    </table>
  );
};

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>;

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Title = ({ text }) => <h1>{text}</h1>;

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addFeedback = (value, setValue) => () => {
    setValue(value + 1);
  };

  return (
    <>
      <Title text='give feedback' />
      <Button handleClick={addFeedback(good, setGood)} text='good' />
      <Button handleClick={addFeedback(neutral, setNeutral)} text='neutral' />
      <Button handleClick={addFeedback(bad, setBad)} text='bad' />
      <Title text='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;
