const Note = ({ note, toggleImportance }) => {

  const label = note.important
    ? 'make not important' : 'make important'
  return (
    <li>{note.content}
      <div><button onClick={toggleImportance}>{label}</button></div>
    </li>

  )
}

export default Note