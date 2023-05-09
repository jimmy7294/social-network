-- +migrate Up
CREATE TABLE IF NOT EXISTS `notifications`
(
    `id` INTEGER,
    `content` TEXT NOT NULL,
    `date` TIMESTAMP,
    `userId` INTEGER NOT NULL,
    `type` INTEGER NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `notifications`;