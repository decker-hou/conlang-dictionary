// form that can create a new language or edit an existing language

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './EditLanguage.css';

const VISIBILITY = {
  public: 1,
  unlisted: 2,
  private: 3,
};

function EditLanguage(props) {
  const {
    newLanguage, languageId, languageName, summary, pos, etymology, grammaticalGender,
    pronunciation,
    onSubmit, onCancel,
  } = props;

  const [error, setError] = useState(false);
  const [input, setInput] = useState({
    languageName,
    summary,
    pos: !!pos,
    etymology: !!etymology,
    grammaticalGender: !!grammaticalGender,
    pronunciation: !!pronunciation,
    visibility: 'public',
  });

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const checkboxHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.checked,
    });
  };

  // converts visibility from string to numeric value
  const formatPayload = (p) => {
    const payload = { ...p, visibility: VISIBILITY[p.visibility] };
    return JSON.stringify(payload);
  };

  async function submitNewLanguage() {
    await fetch('http://localhost:8000/language', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formatPayload(input),
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
      body: formatPayload(input),
      mode: 'cors',
    });
  }

  async function submit() {
    if (!input.languageName) {
      setError(true);
      return;
    }
    if (newLanguage) {
      submitNewLanguage();
    } else {
      submitEditLanguage();
    }
    onSubmit();
  }

  return (
    <div className="editLanguage">
      <label className="languageLabel" htmlFor="languageName">Name</label>
      <input
        type="text"
        name="languageName"
        onChange={inputHandler}
        value={input.languageName}
      />
      {error && <div className="error">Name cannot be empty</div>}

      <label className="languageLabel" htmlFor="summary">Summary</label>
      <div>255 characters max</div>
      <input
        type="text"
        name="summary"
        onChange={inputHandler}
        value={input.summary}
      />

      <fieldset>
        <legend>Optional Fields</legend>
        <label className="languageLabel">
          <input
            type="checkbox"
            name="pos"
            onChange={checkboxHandler}
            checked={input.pos}
          />
          Position of speech
        </label>
        <label className="languageLabel">
          <input
            type="checkbox"
            name="pronunciation"
            onChange={checkboxHandler}
            checked={input.pronunciation}
          />
          Pronunciation
        </label>
        <label className="languageLabel">
          <input
            type="checkbox"
            name="grammaticalGender"
            onChange={checkboxHandler}
            checked={input.grammaticalGender}
          />
          Grammatical gender
        </label>
        <label className="languageLabel">
          <input
            type="checkbox"
            name="etymology"
            onChange={checkboxHandler}
            checked={input.etymology}
          />
          Etymology
        </label>
      </fieldset>

      <div className="languageLabel">Visibility</div>

      <fieldset id="visibilityButtons">
        <label>
          <input
            name="visibility"
            type="radio"
            value="public"
            checked={input.visibility === 'public'}
            onChange={inputHandler}
          />
          Public
        </label>

        <label>
          <input
            name="visibility"
            type="radio"
            value="unlisted"
            checked={input.visibility === 'unlisted'}
            onChange={inputHandler}
          />
          Unlisted
        </label>

        <label>
          <input
            name="visibility"
            type="radio"
            value="private"
            checked={input.visibility === 'private'}
            onChange={inputHandler}
          />
          Private
        </label>
      </fieldset>

      <button type="submit" onClick={submit}>{newLanguage ? 'Create' : 'Save'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
}

EditLanguage.propTypes = {
  newLanguage: PropTypes.bool.isRequired,
  languageId: PropTypes.number,
  languageName: PropTypes.string,
  summary: PropTypes.string,
  pos: PropTypes.bool,
  etymology: PropTypes.bool,
  grammaticalGender: PropTypes.bool,
  pronunciation: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

EditLanguage.defaultProps = {
  languageName: '',
  languageId: 0,
  summary: '',
  pos: true,
  etymology: true,
  grammaticalGender: true,
  pronunciation: true,
  onSubmit: () => {},
  onCancel: () => {},
};

export default EditLanguage;
