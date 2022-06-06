import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'conlang',
  password: 'password',
  port: 5432,
});

const VISIBILITY = {
  PUBLIC: 1,
  UNLISTED: 2,
  PRIVATE: 3,
};

const getLanguage = (request, response) => {
  const languageId = parseInt(request.params.id, 10);
  pool.query('SELECT * FROM languages WHERE language_id = $1', [languageId], (error, results) => {
    if (error) {
      throw error;
    } else if (results.rowCount === 0) {
      response.status(404).send();
    } else if (results.rows[0].visibility === VISIBILITY.PRIVATE
      && request.userId !== results.rows[0].user_id) {
      response.status(403).send('you are not authorized to view this language');
    } else {
      response.status(200).send(results.rows);
    }
  });
};

const getLanguagesByUser = (request, response) => {
  const { userId } = request;
  pool.query('SELECT * FROM languages WHERE user_id = $1 ORDER BY language_id ASC', [userId], (error, results) => {
    if (error) {
      response.status(500).send();
    } else {
      response.status(200).send(results.rows);
    }
  });
};

const createLanguage = (request, response) => {
  const {
    languageName, summary, visibility, pos,
    grammaticalGender, etymology, pronunciation,
  } = request.body;
  const user = request.userId;

  pool.query(
    'INSERT INTO languages (language_name, summary, visibility, pos, grammatical_gender, etymology, pronunciation, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [languageName, summary, visibility, pos, grammaticalGender, etymology, pronunciation, user],

    (error) => {
      if (error) {
        console.log(error);
        response.status(500).send();
      } else {
        response.status(201).send();
      }
    },
  );
};

const updateLanguage = (request, response) => {
  const languageId = parseInt(request.params.id, 10);
  const {
    languageName, summary, visibility, pos,
    grammaticalGender, etymology, pronunciation,
  } = request.body;

  pool.query(
    'UPDATE languages SET language_name = $1, summary = $2, visibility = $3, pos = $4, grammatical_gender = $5, etymology = $6, pronunciation = $7 WHERE language_id = $8',
    [languageName, summary, visibility, pos,
      grammaticalGender, etymology, pronunciation, languageId],
    (error, results) => {
      if (error) {
        console.log(error);
        throw error;
      }
      if (results.rowCount > 0) {
        response.status(200).send(results.rows);
      } else {
        response.status(404).send(`language with id ${languageId} not found`);
      }
    },
  );
};

const deleteLanguage = (request, response) => {
  const languageId = parseInt(request.params.id, 10);

  pool.query('DELETE FROM languages WHERE language_id = ($1)', [languageId], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rowCount > 0) {
      response.status(200).send(`language with id ${languageId} deleted`);
    } else {
      response.status(404).send(`no word with id ${languageId} was found`);
    }
  });
};

// only returns the optional language fields that are marked as true in the language settings
const getWords = (request, response) => {
  const languageId = parseInt(request.params.id, 10);
  pool.query(`
    SELECT word, word_definition,
      CASE WHEN l.pos THEN w.pos ELSE NULL END as pos,
      CASE WHEN l.grammatical_gender THEN w.grammatical_gender ELSE NULL END as grammatical_gender,
      CASE WHEN l.etymology THEN w.etymology ELSE NULL END as etymology,
      CASE WHEN l.pronunciation THEN w.pronunciation ELSE NULL END as pronunciation
    FROM words w
    JOIN languages l ON l.language_id = w.language_id
    WHERE w.language_id = $1;
      `, [languageId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(results.rows);
  });
};

const createWord = (request, response) => {
  const { word, definition, languageId } = request.body;

  pool.query('INSERT INTO words (word, word_definition, language_id) VALUES ($1, $2, $3)', [word, definition, languageId], (error) => {
    if (error) {
      throw error;
    }
    response.status(201).send('word added');
  });
};

const updateWord = (request, response) => {
  const wordId = parseInt(request.params.id, 10);
  const { word, definition } = request.body;

  pool.query(
    'UPDATE words SET word = $1, word_definition = $2 WHERE word_id = $3',
    [word, definition, wordId],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount > 0) {
        response.status(200).send(`word ${wordId} updated`);
      } else {
        response.status(404).send(`word with id ${wordId} not found`);
      }
    },
  );
};

const deleteWord = (request, response) => {
  const wordId = parseInt(request.params.id, 10);

  pool.query('DELETE FROM words WHERE word_id = ($1)', [wordId], (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rowCount > 0) {
      response.status(200).send(`word ${wordId} deleted`);
    } else {
      response.status(404).send(`no word with id ${wordId} was found`);
    }
  });
};

// returns existing user id or create a new user
const getOrCreateUser = async (discordId) => {
  const results = await pool.query('SELECT * FROM users WHERE discord_id = ($1)', [discordId]);
  if (results.rowCount === 0) {
    const insertResults = await pool.query('INSERT INTO users (discord_id) VALUES ($1) RETURNING *', [discordId]);
    return insertResults.rows[0];
  }
  return results.rows[0];
};

export default {
  getLanguage,
  getLanguagesByUser,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getWords,
  createWord,
  updateWord,
  deleteWord,
  getOrCreateUser,
};
