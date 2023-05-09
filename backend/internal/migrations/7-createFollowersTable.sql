-- +migrate Up
CREATE TABLE IF NOT EXISTS `followers`
(
    `userId` INTEGER NOT NULL,
    `followerId` INTEGER NOT NULL,
    `followDate` TIMESTAMP NOT NULL,
    PRIMARY KEY(`userId`)
);

-- +migrate Down
DROP TABLE `followers`;