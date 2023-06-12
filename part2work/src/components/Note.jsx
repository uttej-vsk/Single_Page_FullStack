const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? "make not important"
    : "make important";
  return (
    <li className='note'>
      {note.content}
      <div>
        <button onClick={toggleImportance}>{label}</button>
      </div>
    </li>
  );
};

export default Note;
