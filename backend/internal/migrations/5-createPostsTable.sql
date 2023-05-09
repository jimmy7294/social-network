-- +migrate Up
CREATE TABLE IF NOT EXISTS `posts`
(
    `id` INTEGER,
    `creator` INTEGER NOT NULL,
    `privacy` TEXT NOT NULL,
    `image` BLOB,
    `date` TIMESTAMP NOT NULL,
    `content` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `posts`;