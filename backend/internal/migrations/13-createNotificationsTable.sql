-- +migrate Up
CREATE TABLE IF NOT EXISTS `notifications`
(
    `notif_id` INTEGER,
    `notif_content` TEXT NOT NULL,
    `creation_date` TIMESTAMP,
    `uuid` INTEGER NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `type` TEXT NOT NULL,
    PRIMARY KEY(`notif_id` AUTOINCREMENT)
);

-- +migrate Down
DROP TABLE `notifications`;