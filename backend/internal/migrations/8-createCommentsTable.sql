-- +migrate Up
CREATE TABLE IF NOT EXISTS `comments`
(
    `id` INTEGER,
    `postId` INTEGER NOT NULL,
    `content` TEXT,
    `image` BLOB,
    `date` TIMESTAMP NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `comments`;