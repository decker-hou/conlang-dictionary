// form that can create a new language or edit an existing language

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './EditLanguage.css';

function EditLanguage(props) {
  const {
    newLanguage, languageId, languageName, summary, onSubmit, onCancel,
  } = props;

  const [input, setInput] = useState({
    language_name: languageName,
    summary,
    visibility: 1,
  });

  const inputHandler = (e) => {
    setInput({ // confusing use of name property?
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  async function submitNewLanguage() {
    await fetch('http://localhost:8000/language', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      mode: 'cors',
    });
  }

  async function submitEditLanguage() {
    await fetch(`http://localhost:8000/language/${languageId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      mode: 'cors',
    });
  }

  async function submit() {
    if (newLanguage) {
      submitNewLanguage();
    } else {
      submitEditLanguage();
    }
    onSubmit();
  }

  return (
    <div className="editLanguage">
      <label className="languageLabel" htmlFor="language_name">Name</label>
      <input
        type="text"
        name="language_name"
        onChange={inputHandler}
        value={input.language_name}
      />

      <label className="languageLabel" htmlFor="summary">Summary</label>
      <div>255 characters max</div>
      <input
        type="text"
        name="summary"
        onChange={inputHandler}
        value={input.summary}
      />

      <div className="languageLabel">Visibility</div>

      <fieldset id="visibilityButtons">
        <input name="visibility" type="radio" id="public" />
        <label htmlFor="public">Public</label>

        <input name="visibility" type="radio" id="unlisted" />
        <label htmlFor="unlisted">Unlisted</label>

        <input name="visibility" type="radio" id="private" />
        <label htmlFor="private">Private</label>
      </fieldset>

      <button type="submit" onClick={submit}>{newLanguage ? 'Create' : 'Save'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
}

EditLanguage.propTypes = {
  newLanguage: PropTypes.bool.isRequired,
  languageId: PropTypes.string,
  languageName: PropTypes.string.isRequired,
  summary: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

EditLanguage.defaultProps = {
  languageId: '',
  summary: '',
  onSubmit: () => {},
  onCancel: () => {},
};

export default EditLanguage;
