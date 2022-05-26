import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Dictionary.css';
import CreateEntry from '../../components/CreateEntry/CreateEntry';
import DictionaryEntry from '../../components/DictionaryEntry/DictionaryEntry';

function Dictionary() {
  const navigate = useNavigate();
  const [languageName, setLanguageName] = useState('');
  const [wordList, setWordList] = useState([]);
  const params = useParams();

  async function updateWordList() {
    const language = params.id;
    const res = await fetch(`http://localhost:8000/dictionary/${language}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    const data = await res.json();
    setWordList(data);
  }

  async function getLanguage() {
    const res = await fetch(`http://localhost:8000/language/${params.id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    if (res.status === 404) {
      navigate('/404'); // might change to render on page, can also be used for not authorized view later
      return '';
    }
    const data = await res.json();
    return data[0].language_name;
  }

  // this is only used for initializing
  useEffect(() => {
    getLanguage().then((name) => {
      if (name) {
        setLanguageName(name);
        updateWordList();
      }
    });
  }, []);

  return (
    <div className="Dictionary">
      <Link to={`/prompt/${params.id}`}> Word Prompter</Link>
      <h1>{`${languageName} Dictionary`}</h1>

      <CreateEntry
        languageId={params.id}
        callback={updateWordList}
      />
      <table className="wordList">
        <tbody>
          <tr>
            <th>Word</th>
            <th>Definition</th>
          </tr>
          {wordList.map((word) => (
            <DictionaryEntry
              word={word.word}
              definition={word.word_definition}
              wordId={word.word_id}
              key={word.word_id}
              callback={updateWordList}
            />
          ))}
        </tbody>
      </table>
    </div>

  );
}

export default Dictionary;
