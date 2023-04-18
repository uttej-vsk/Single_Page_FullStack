

const Header = (props) => {
  console.log(props)
  return (
    <h1>
      {props.name}
    </h1>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      <ul>
        {props.parts.map((part) => (
          <li key={part.key}>{`${part.name} with ${part.exercises} exercises each`}</li>
        ))}
      </ul>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      {props.exercise}
    </p>
  )

}

const App = () => {
  const course =
  {
    name: 'Half stack application development',
    parts: [
      {
        name: 'fundamentals of React',
        exercises: 10
      },

      {
        name: 'Using Props to pass data',
        exercises: 7
      },

      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total exercise={`Total exercises in the course: ${course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises}`} />
    </>
  )
}
export default App;