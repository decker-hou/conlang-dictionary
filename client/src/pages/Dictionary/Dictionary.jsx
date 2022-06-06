import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './Dictionary.css';
import useApiFetch from '../../utils/apiFetch';
import CreateEntry from '../../components/CreateEntry/CreateEntry';
import DictionaryTable from '../../components/DictionaryTable/DictionaryTable';
// import DictionaryEntry from '../../components/DictionaryEntry/DictionaryEntry';

function readyData(data) {
  return data.map((entry) => ({
    col1: entry.word,
    col2: entry.word_definition,
  }));
}

const columns = [
  {
    Header: 'Entry',
    accessor: 'col1', // accessor is the "key" in the data
  },
  {
    Header: 'Definition',
    accessor: 'col2',
    // eslint-disable-next-line react/no-danger
    Cell: ({ row }) => <span dangerouslySetInnerHTML={{ __html: row.original.col2 }} />,
  },
];

function Dictionary() {
  const navigate = useNavigate();
  const [languageName, setLanguageName] = useState('');
  const params = useParams();
  const [update, setUpdate] = useState(false);
  const { data, loading } = useApiFetch(`/dictionary/${params.id}`, update);

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
    const json = await res.json();
    return json[0].language_name;
  }

  // this is only used for initializing
  useEffect(() => {
    getLanguage().then((name) => {
      if (name) {
        setLanguageName(name);
      }
    });
  }, []);

  return (
    <div className="Dictionary">
      <Link to={`/prompt/${params.id}`}> Word Prompter</Link>
      <h1>{`${languageName} Dictionary`}</h1>

      <CreateEntry
        languageId={params.id}
        callback={() => { setUpdate(!update); }}
      />
      { !loading
      && (
      <DictionaryTable
        columns={columns}
        data={readyData(data)}
      />
      )}
    </div>

  );
}

export default Dictionary;

/*      <table className="wordList">
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
      </table> */
