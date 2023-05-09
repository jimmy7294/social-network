-- +migrate Up
CREATE TABLE IF NOT EXISTS `groups`
(
    `id` INTEGER,
    `creator` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `groups`;