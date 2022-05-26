import React from 'react';

import './DictionaryEntry.css';

// spreadsheet like display format for a word

function DictionaryEntry(props) {
  const {
    wordId, word, definition, callback,
  } = props;

  // updates state of parent to rerender
  async function deleteWord() {
    await fetch(`http://localhost:8000/dictionary/${wordId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    callback();
  }

  return (
    <tr className="dictionaryEntry">
      <td className="dictionaryCell">
        {' '}
        {word}
        {' '}
      </td>
      <td className="dictionaryCell" dangerouslySetInnerHTML={{ __html: definition }} />
      <td>
        {' '}
        <button type="submit" onClick={deleteWord}>Delete</button>
        {' '}
      </td>
    </tr>
  );
}

export default DictionaryEntry;
