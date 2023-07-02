function Course({ course }) {

  const exerciseTotals = course.map((courseList, index) => {
    const totalExercises = courseList.parts.reduce((acc, part) => (
      acc + part.exercises
    ), 0)
    return { ...courseList, totalExercises }
  })

  console.log(exerciseTotals)



  return (
    <>
      <h1>Web Developmemnt Curriculum</h1>
      {course.map((array, index) => (
        <div key={index}>
          <h2> {array.name} </h2>
          {array.parts.map((part, index) => (
            <div key={index}>
              <p>{part.name} {part.exercises}</p>
            </div>
          ))}
          <p>Total Exercises: {exerciseTotals[index].totalExercises}</p>
        </div>

      ))}


    </>
  )
}

export default Course