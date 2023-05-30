-- +migrate Up
CREATE TABLE IF NOT EXISTS `stockImages`
(
    `uid` INTEGER,
    `image_path` TEXT,
    PRIMARY KEY(`uid` AUTOINCREMENT)
);
-- +migrate Up
INSERT INTO stockImages(image_path)
VALUES
("images/feelsgoodman.png"),
("images/lettgefirepurgeusall.png"),
("images/pepehands.png"),
("images/philosoraptor.png"),
("images/elmo.gif"),
("images/theydobebirds.jpg");

-- +migrate Down
DROP TABLE `stockImages`;