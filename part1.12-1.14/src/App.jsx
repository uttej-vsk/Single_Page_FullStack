import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [vote, setVote] = useState(0);
  const [saveVote, setSaveVote] = useState([]);

  const getRandomAnecdote = () => {
    return Math.floor(Math.random() * anecdotes.length);
  };

  const randomAnectode = () => {
    const rand = getRandomAnecdote();
    console.log(rand)
    const selectedAnecdote = saveVote.find(vote => vote.id === rand)

    if (selectedAnecdote) {
      setSelected(selectedAnecdote.id);
      setVote(selectedAnecdote.vote);
    } else {
      setSelected(rand);
      setVote(0);
    }
  };

  const voteAnectode = () => {
    const updatedVotes = saveVote.map(vote => {
      if (vote.id === selected) {
        return { ...vote, vote: vote.vote + 1 };
      }
      return vote;
    });

    if (saveVote.find(vote => vote.id === selected)) {
      setSaveVote(updatedVotes);
    } else {
      setSaveVote([...saveVote, { id: selected, vote: 1 }]);
    }

    setVote(vote + 1);
  };

  const getAnecdoteWithHighestVotes = () => {
    if (saveVote.length === 0) {
      return null;
    }

    const anecdoteWithHighestVotes = saveVote.reduce((maxVote, vote) => {
      if (vote.vote > maxVote.vote) {
        return vote
      }
      return maxVote
    })

    const anecdoteIndex = anecdotes.findIndex(
      (_, index) => index === anecdoteWithHighestVotes.id
    )
    return { anecdote: anecdotes[anecdoteIndex], votes: anecdoteWithHighestVotes.vote }
  }

  const anecdoteWithHighestVotes = getAnecdoteWithHighestVotes()

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>Votes: {vote}</p>
      <button onClick={randomAnectode}>Next Anecdote</button>
      <button onClick={voteAnectode}>Vote</button>


      {anecdoteWithHighestVotes && (
        <p>
          {anecdoteWithHighestVotes.anecdote}
          <p>Total Votes:{anecdoteWithHighestVotes.votes}</p>

        </p>
      )}
    </div>
  );
};

export default App;
