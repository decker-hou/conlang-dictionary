CREATE TABLE users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    discord_id BIGINT
);

CREATE TABLE languages (
    language_id SERIAL NOT NULL PRIMARY KEY,
    language_name VARCHAR(255) NOT NULL,
    summary VARCHAR(255),
    pos BOOLEAN,
    grammatical_gender BOOLEAN,
    pronunciation BOOLEAN,
    etymology BOOLEAN,
    visibility INT,
    user_id INT REFERENCES users(user_id)
);

CREATE TABLE words (
    word_id SERIAL NOT NULL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    word_definition TEXT,
    pos VARCHAR(255),
    grammatical_gender VARCHAR(255),
    pronunciation VARCHAR(255),
    etymology TEXT,
    language_id INT REFERENCES languages(language_id),
    time_added TIMESTAMP
);