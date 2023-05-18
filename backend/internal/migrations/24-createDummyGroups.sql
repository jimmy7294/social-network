-- +migrate Up
INSERT INTO groups(group_creator, group_name, creation_date)
VALUES 
(1, 'The Bullies', '2023-04-19'),
(3, 'The Bullied', '2023-04-20'),
(5, 'The Mediator', '2022-12-22');

-- +migrate Down
DELETE FROM groups
WHERE (group_name = 'The Bullies')
OR (group_name = 'The Bullied')
OR (group_name = 'The Mediator');