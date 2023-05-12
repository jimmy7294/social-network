-- +migrate Up
CREATE TABLE IF NOT EXISTS `users`
(
	`id`	INTEGER,
	`passwrd`	INTEGER NOT NULL,
	`email`	TEXT NOT NULL,
	`firstname`	TEXT NOT NULL,
	`lastname`	TEXT NOT NULL,
	`DOB`	TIMESTAMP NOT NULL,
	`avatar`	BLOB,
	`nickname`	TEXT,
	`aboutMe`	TEXT,
	`session_token`	INTEGER,
	`privacy` TEXT NOT NULL,
	PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `users`;