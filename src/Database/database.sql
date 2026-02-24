-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Server-Version: 10.11.14-MariaDB-0ubuntu0.24.04.1-log
-- PHP-Version: 7.4.33-nmm8
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

SET
  AUTOCOMMIT = 0;

START TRANSACTION;

SET
  FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `sign_in`;

DROP TABLE IF EXISTS `events`;

DROP TABLE IF EXISTS `users`;

SET
  FOREIGN_KEY_CHECKS = 1;

SET
  time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!40101 SET NAMES utf8mb4 */
;

--
-- Datenbank: `d0453b06`
--
-- --------------------------------------------------------
CREATE TABLE events (
  EID INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start DATETIME NOT NULL,
end DATETIME NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE users (
  UID INT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_level INT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  num_failed_logins INT DEFAULT 0,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE sign_in (
  EID INT NOT NULL,
  UID INT NOT NULL,
  notes TEXT,
  sign_in_time DATETIME,
  sign_out_time DATETIME
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

ALTER TABLE
  `events`
ADD
  PRIMARY KEY (`EID`);

ALTER TABLE
  `users`
ADD
  PRIMARY KEY (`UID`),
ADD
  UNIQUE KEY `email` (`email`);

ALTER TABLE
  `sign_in`
ADD
  PRIMARY KEY (`EID`, `UID`);

ALTER TABLE
  `events`
MODIFY
  `EID` INT NOT NULL AUTO_INCREMENT;

ALTER TABLE
  `users`
MODIFY
  `UID` INT NOT NULL AUTO_INCREMENT;

ALTER TABLE
  `sign_in`
ADD
  CONSTRAINT `sign_in_ibfk_1` FOREIGN KEY (`EID`) REFERENCES `events` (`EID`) ON DELETE CASCADE,
ADD
  CONSTRAINT `sign_in_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE;

INSERT INTO
  `users` (
    first_name,
    last_name,
    email,
    password,
    role_level,
    verified,
    active,
    num_failed_logins
  )
VALUES
  (
    'Max',
    'Mustermann',
    'max.mustermann@example.com',
    '$2y$10$examplehash1',
    1,
    TRUE,
    TRUE,
    0
  ),
  (
    'Anna',
    'Schmidt',
    'anna.schmidt@example.com',
    '$2y$10$examplehash2',
    1,
    TRUE,
    TRUE,
    0
  ),
  (
    'Lukas',
    'Weber',
    'lukas.weber@example.com',
    '$2y$10$examplehash3',
    1,
    TRUE,
    TRUE,
    0
  ),
  (
    'Sophie',
    'Meyer',
    'sophie.meyer@example.com',
    '$2y$10$examplehash4',
    1,
    TRUE,
    TRUE,
    0
  ),
  (
    'Tom',
    'Becker',
    'tom.becker@example.com',
    '$2y$10$examplehash5',
    1,
    TRUE,
    TRUE,
    0
  );

INSERT INTO
  `events` (name, start,end
)
VALUES
  (
    'Internettechnologien und webbasierte Datenbanken',
    '2026-02-03 08:30:00',
    '2026-02-03 11:45:00'
  ),
  (
    'Business Intelligence',
    '2026-02-05 08:30:00',
    '2026-02-05 11:45:00'
  ),
  (
    'Internettechnologien und webbasierte Datenbanken',
    '2026-02-06 08:30:00',
    '2026-02-06 11:45:00'
  ),
  (
    'Data Science Teil 2',
    '2026-02-04 08:30:00',
    '2026-02-04 11:45:00'
  ),
  (
    'Chinesisch',
    '2026-02-02 08:30:00',
    '2026-02-02 11:45:00'
  );

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;