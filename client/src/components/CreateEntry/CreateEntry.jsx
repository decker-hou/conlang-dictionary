import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'trix/dist/trix';
import 'trix/dist/trix.css';
import { TrixEditor } from 'react-trix';

import './CreateEntry.css';

function CreateEntry(props) {
  const { languageId, callback } = props;

  const [input, setInput] = useState({
    word: '',
    definition: '',
    languageId,
  });

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const editorHandler = (html) => {
    setInput({
      ...input,
      definition: html,
    });
  };

  // updates state of parent to rerender
  async function submitWord() {
    await fetch('http://localhost:8000/dictionary', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      mode: 'cors',
    });
    callback();
  }

  return (
    <div className="createEntry">
      <input
        type="text"
        name="word"
        onChange={inputHandler}
        value={input.word}
      />

      <div className="editor">
        <TrixEditor
          className="inner-editor"
          onChange={editorHandler}
        />
      </div>

      <button type="submit" onClick={submitWord}>Add word</button>
    </div>
  );
}

CreateEntry.propTypes = {
  languageId: PropTypes.string.isRequired,
  callback: PropTypes.func,
};

CreateEntry.defaultProps = {
  callback: () => {},
};

export default CreateEntry;
