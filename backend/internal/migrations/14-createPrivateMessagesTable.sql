-- +migrate Up
CREATE TABLE IF NOT EXISTS `privateMessages`
(
    `id` INTEGER,
    `sender` TEXT NOT NULL,
    `reciever` TEXT NOT NULL,
    `content` TEXT NOT NULL,
    `date` TIMESTAMP NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `privateMessages`;