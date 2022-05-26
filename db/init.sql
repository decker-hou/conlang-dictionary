CREATE TABLE users (
    user_id SERIAL NOT NULL PRIMARY KEY,
    discord_id BIGINT
);

CREATE TABLE languages (
    language_id SERIAL NOT NULL PRIMARY KEY,
    language_name VARCHAR(255) NOT NULL,
    summary VARCHAR(255),
    details TEXT,
    pos TEXT,
    visibility INT,
    user_id INT REFERENCES users(user_id),
);

CREATE TABLE words (
    word_id SERIAL NOT NULL PRIMARY KEY,
    word VARCHAR(255) NOT NULL,
    pos VARCHAR(255),
    pronunciation VARCHAR(255),
    word_definition TEXT,
    etymology TEXT,
    language_id INT REFERENCES languages(language_id),
    time_added TIMESTAMP
);