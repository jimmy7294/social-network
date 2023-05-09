-- +migrate Up
CREATE TABLE IF NOT EXISTS `groupMembers`
(
    `id` INTEGER,
    `groupId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    PRIMARY KEY(`id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `groupMembers`;