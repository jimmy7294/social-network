-- +migrate Up
CREATE TABLE IF NOT EXISTS `groupPosts`
(
    `id` INTEGER,
    `creator` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `image` BLOB,
    `date` TIMESTAMP NOT NULL,
    `content` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `groupPosts`;