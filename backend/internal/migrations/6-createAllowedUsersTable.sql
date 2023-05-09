-- +migrate Up
CREATE TABLE IF NOT EXISTS `allowedUsers`
(
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL
);

-- +migrate Down
DROP TABLE `allowedUsers`;