import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './WordPrompt.css';
import * as wordlist from '../../wordlist.json';
import CreateEntry from '../../components/CreateEntry/CreateEntry';

function randomEnglishVocab() {
  const { commonWordlist } = wordlist;
  return commonWordlist[Math.floor(Math.random() * commonWordlist.length)];
}

function WordPrompt() {
  const [word, setWord] = useState('');
  const params = useParams();

  function skipPrompt() {
    setWord(randomEnglishVocab());
  }

  return (
    <div className="WordPrompt">

      <Link to={`/dictionary/${params.id}`}> Dictionary</Link>

      <h1>Word prompter</h1>

      <p>
        Create one or more new words that means
        {' '}
        <b>{word}</b>
      </p>

      <button type="submit" onClick={skipPrompt}>Skip (keep prompt)</button>
      <button type="submit">Skip (discard prompt)</button>

      <CreateEntry
        languageId={params.id}
      />
    </div>
  );
}

export default WordPrompt;
