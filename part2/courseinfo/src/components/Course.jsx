const Header = ({ course }) => <h3>{course}</h3>;

const Total = ({ sum }) => <h4>total of {sum} exercises</h4>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Course = ({ course }) => {
  const parts = [...course.parts];
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <section>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
    </section>
  );
};

export default Course;
