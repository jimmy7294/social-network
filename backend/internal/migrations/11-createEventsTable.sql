-- +migrate Up
CREATE TABLE IF NOT EXISTS `events`
(
    `id` INTEGER,
    `title` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `creationDate` TIMESTAMP NOT NULL,
    `eventDate` TIMESTAMP NOT NULL,
    `options` TEXT NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `events`;