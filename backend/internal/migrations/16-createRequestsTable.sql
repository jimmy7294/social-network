-- +migrate Up
CREATE TABLE IF NOT EXISTS `requests`
(
    `id` INTEGER,
    `sender` TEXT NOT NULL,
    `reciever` TEXT NOT NULL,
    `type` TEXT NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `requests`;