import { useState } from "../../part1.6-1.11/node_modules/@types/react";


const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )

}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>
        {text}:
      </td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ feedback, total }) => {
  const { good, neutral, bad } = feedback
  const average = total ? ((good - bad) / total).toFixed(2) : 0
  const positivePercent = total ? ((good / total) * 100).toFixed(2) : 0;
  if (total === 0) {
    return (
      <>
        <h1>Statistics</h1>
        <p>No Feedback provided</p>
      </>
    )
  }

  return (
    <>
      <h1>
        Statistics
      </h1>
      <table>
        <tbody>

          <StatisticsLine text='Good' value={good} />
          <StatisticsLine text='Neutral' value={neutral} />
          <StatisticsLine text='Bad' value={bad} />
          <StatisticsLine text='total' value={total} />
          <StatisticsLine text='Average' value={average} />
          <StatisticsLine text='positive Percent' value={`${positivePercent}%`} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0
  })
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    setFeedback({
      ...feedback,
      good: feedback.good + 1
    })
    setTotal(total + 1)
  }

  const handleNeutralClick = () => {
    setFeedback({
      ...feedback,
      neutral: feedback.neutral + 1
    })
    setTotal(total + 1)

  }

  const handleBadClick = () => {
    setFeedback({
      ...feedback,
      bad: feedback.bad + 1
    })
    setTotal(total + 1)

  }

  return (
    <div>
      <h1>
        Give Feedback
      </h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <Statistics feedback={feedback} total={total} />
    </div>
  )
}


export default App;