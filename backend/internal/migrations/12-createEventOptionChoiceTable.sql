-- +migrate Up
CREATE TABLE IF NOT EXISTS `eventOptionChoices`
(
    `id` INTEGER,
    `eventId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `choice` TEXT NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `eventOptionChoices`;