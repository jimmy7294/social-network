-- +migrate Up
CREATE TABLE IF NOT EXISTS `groupPostComments`
(
    `id` INTEGER,
    `postId` INTEGER NOT NULL,
    `groupId` INTEGER NOT NULL,
    `content` TEXT,
    `image` BLOB,
    `date` TIMESTAMP NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `groupPostComments`;