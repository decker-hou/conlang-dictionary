// private page where user can view and manage the languages they've created
// as well as make/edit new languages

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './UserPage.css';
import useApiFetch from '../../utils/apiFetch';
import EditLanguage from '../../components/EditLanguage/EditLanguage';

function UserPage() {
  const [update, setUpdate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(-1);
  const [deleting, setDeleting] = useState(-1);

  const { data, loading } = useApiFetch('/language', update);

  function openNewLanguage() {
    setCreating(true);
    setEditing(-1);
  }

  function cancelNewLanguage() {
    setCreating(false);
    setEditing(-1);
  }

  function openEditLanguage(i) {
    setEditing(i);
    setCreating(false);
    setDeleting(-1);
  }

  async function deleteLanguage(languageId) {
    await fetch(`http://localhost:8000/language/${languageId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    setUpdate(!update);
  }

  return (
    <div className="userPage">
      <h1>my languages</h1>

      <ul className="wordList">
        {!loading && data.map((language, index) => (
          <li key={language.language_id}>
            <Link to={`/dictionary/${language.language_id}`}>{language.language_name}</Link>

            <p>{language.summary}</p>

            {!creating && editing === -1
            && <button type="button" onClick={() => { openEditLanguage(index); }}>Edit</button>}
            {!creating && editing === -1
            && <button type="button" onClick={() => { setDeleting(index); }}>Delete</button>}

            {deleting === index
              && (
              <span>
                Are you sure? This cannot be undone.
                <button type="button" onClick={() => { deleteLanguage(language.language_id); }}>DELETE</button>
              </span>
              )}
            {editing === index
              && (
              <EditLanguage
                languageName={language.language_name}
                summary={language.summary}
                pos={language.pos}
                grammaticalGender={language.grammatical_gender}
                etymology={language.etymology}
                pronunciation={language.pronunciation}
                languageId={language.language_id}
                newLanguage={false}
                onSubmit={() => { cancelNewLanguage(); setUpdate(!update); }}
                onCancel={cancelNewLanguage}
              />
              )}
          </li>
        ))}
      </ul>

      {!creating && editing === -1
      && <div><button type="button" onClick={openNewLanguage}>New Language</button></div>}

      {creating
        && (
        <EditLanguage
          onSubmit={() => { cancelNewLanguage(); setUpdate(!update); }}
          onCancel={cancelNewLanguage}
          newLanguage
        />
        )}
    </div>

  );
}

export default UserPage;
