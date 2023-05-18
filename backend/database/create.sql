CREATE TABLE user (
 id INTEGER NOT NULL PRIMARY KEY,
 privacy INTEGER NOT NULL,
 username VARCHAR(30) NOT NULL,
 passwrd VARCHAR(100) NOT NULL,
 email VARCHAR(30) NOT NULL,
 fname VARCHAR(30) NOT NULL,
 lname VARCHAR(30) NOT NULL,
 age INTEGER NOT NULL,
 avatar VARCHAR(100) NOT NULL,
 created_at DATETIME NOT NULL,
 about_me VARCHAR(1000) NOT NULL,
 last_session_id VARCHAR(100) NOT NULL,
 last_session_start DATETIME NOT NULL,
 last_session_end DATETIME NOT NULL,
 last_session_duration INTEGER NOT NULL
);

INSERT INTO user (id, privacy, username, passwrd, email, fname, lname, age, avatar, created_at, about_me, last_session_id, last_session_start, last_session_end, last_session_duration)
VALUES
    (1, 1, 'admin', '123', 'admin@hotmale.com', 'admin', 'admin', 99, 'https://imgpile.com/images/9NDeGC.jpg', DateTime('now', 'localtime'), 'I am the admin', '0', DateTime('now', 'localtime'), strftime('%s', DateTime('now', 'localtime')) + 100000, 100000),
    (2, 1, 'batman', '123', 'batman@gmail.com', 'John', 'Doe', 30, 'https://imgpile.com/images/9NDeGC.jpg', DateTime('now', 'localtime'), 'Are you joking me?', '1', DateTime('now', 'localtime'), strftime('%s', DateTime('now', 'localtime')) + 150000, 150000),
    (3, 1, 'wolverine', '123', 'logan@gmail.com', 'Jane', 'Doe', 28, 'https://imgpile.com/images/9NDeGC.jpg', DateTime('now', 'localtime'), 'Woof Woof Woof', '2', DateTime('now', 'localtime'), strftime('%s', DateTime('now', 'localtime')) + 120000, 120000),
    (4, 0, 'ironman', '123', 'ironman@gmail.com', 'Hidden', 'User', 35, 'https://imgpile.com/images/9NDeGC.jpg', DateTime('now', 'localtime'), 'I prefer to stay hidden', '3', DateTime('now', 'localtime'), strftime('%s', DateTime('now', 'localtime')) + 90000, 90000);

-- create a table for the posts
-- Path: backend/database/create.sql
-- The user must be able to specify the privacy of the post:
-- public (all users in the social network will be able to see the post)
-- private (only followers of the creator of the post will be able to see the post)
-- almost private (only the followers chosen by the creator of the post will be able to see it)

CREATE TABLE post (
 id INTEGER NOT NULL PRIMARY KEY,
 user_id INTEGER NOT NULL,
 privacy INTEGER NOT NULL,
 content VARCHAR(1000) NOT NULL,
 created_at DATETIME NOT NULL,
 FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO post (id, user_id, privacy, content, created_at)
-- some dummy posts
VALUES
    (1, 1, 0, 'Hello World!', DateTime('now', 'localtime')),
    (2, 1, 1, 'This is my first post', DateTime('now', 'localtime')),
    (3, 1, 2, 'I am the admin', DateTime('now', 'localtime')),
    (4, 2, 1, 'I am batman', DateTime('now', 'localtime')),
    (5, 2, 2, 'I am the dark knight', DateTime('now', 'localtime')),
    (6, 2, 0, 'I am the night', DateTime('now', 'localtime')),
    (7, 3, 0, 'I am wolverine', DateTime('now', 'localtime')),
    (8, 3, 2, 'I am the best at what I do', DateTime('now', 'localtime')),
    (9, 3, 1, 'But what I do best is not very nice', DateTime('now', 'localtime')),
    (10, 4, 2, 'I am ironman', DateTime('now', 'localtime')),
    (11, 4, 1, 'I am the genius, billionaire, playboy, philanthropist', DateTime('now', 'localtime')),
    (12, 4, 0, 'I am ironman', DateTime('now', 'localtime'));

