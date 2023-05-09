-- +migrate Up
CREATE TABLE IF NOT EXISTS `groupChat`
(
    `id` INTEGER,
    `groupId` INTEGER NOT NULL,
    `sender` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `groupChat`;