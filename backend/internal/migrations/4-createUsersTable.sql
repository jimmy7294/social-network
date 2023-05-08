-- +migrate Up
CREATE TABLE IF NOT EXISTS `users`
(
	`id`	INTEGER NOT NULL,
	`password`	INTEGER NOT NULL,
	`email`	TEXT,
	`firstname`	TEXT,
	`lastname`	TEXT,
	`DOB`	INTEGER,
	`avatar`	BLOB,
	`nickname`	TEXT,
	`aboutMe`	TEXT,
	`session_token`	INTEGER,
	PRIMARY KEY(`id`)
);

-- +migrate Down
DROP TABLE `users`;