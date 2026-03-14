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

DROP TABLE IF EXISTS `t_sign_in`;

DROP TABLE IF EXISTS `t_events`;

DROP TABLE IF EXISTS `t_users`;

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
CREATE TABLE t_events (
  EID INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start DATETIME NOT NULL,
  end DATETIME NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE t_users (
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

CREATE TABLE t_sign_in (
  EID INT NOT NULL,
  UID INT NOT NULL,
  notes TEXT,
  sign_in_time DATETIME,
  sign_out_time DATETIME
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


ALTER TABLE
  `t_events`
ADD
  PRIMARY KEY (`EID`),
ADD
  CONSTRAINT `unique_event` UNIQUE (`name`, `start`, `end`),
MODIFY
  `EID` INT NOT NULL AUTO_INCREMENT;


ALTER TABLE
  `t_users`
ADD
  PRIMARY KEY (`UID`),
ADD
  CONSTRAINT `unique_user_email` UNIQUE (`email`),
MODIFY
  `UID` INT NOT NULL AUTO_INCREMENT;


ALTER TABLE
  `t_sign_in`
ADD
  PRIMARY KEY (`EID`, `UID`),
ADD
  CONSTRAINT `sign_in_ibfk_1` FOREIGN KEY (`EID`) REFERENCES `t_events` (`EID`) ON DELETE CASCADE,
ADD
  CONSTRAINT `sign_in_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `t_users` (`UID`) ON DELETE CASCADE;


INSERT INTO `t_users` (`UID`, `first_name`, `last_name`, `email`, `password`, `role_level`, `verified`, `active`, `num_failed_logins`, `create_at`) VALUES
(1, 'Max', 'Mustermann', 'max.mustermann@example.com', '$2y$10$euWTJ2CYJOhYaHh74vh7iev7lhasJCK2gNg0LjQMvNAh8z74Wdwga', 0, 1, 1, NULL, '2026-02-23 16:43:05'),
(2, 'Anna', 'Schmidt', 'anna.schmidt@example.com', '$2y$10$ah4PIanLby8FihiRlVVakuV9layu4UcljRTAWuIU9EU5fi5Ymb5ke', 1, 1, 1, 0, '2026-02-23 16:43:05'),
(3, 'Lukas', 'Weber', 'lukas.weber@example.com', '$2y$10$ah4PIanLby8FihiRlVVakuV9layu4UcljRTAWuIU9EU5fi5Ymb5ke', 1, 1, 1, 0, '2026-02-23 16:43:05'),
(4, 'Sophie', 'Meyer', 'sophie.meyer@example.com', '$2y$10$ah4PIanLby8FihiRlVVakuV9layu4UcljRTAWuIU9EU5fi5Ymb5ke', 1, 1, 1, 0, '2026-02-23 16:43:05'),
(5, 'Tom', 'Becker', 'tom.becker@example.com', '$2y$10$ah4PIanLby8FihiRlVVakuV9layu4UcljRTAWuIU9EU5fi5Ymb5ke', 1, 1, 1, 0, '2026-02-23 16:43:05'),
(7, 'Elisa', 'Braunhof', 'chrono@example.com', '$2y$10$vc4kS6v1rzJL0IQVxEoMUeEazFuLT8U7pYIJCNEdWTvNPAZNoGzIS', 1, 1, 1, 0, '2026-03-07 22:47:05'),
(10, 'xxx', 'xx', 'tmuster@example.com', '$2y$10$0RX2ON0pdGsJyRlqSLeNCufFTMhmA7PdNBaM5fVoyU9hMe6lwPsXO', 0, 1, 1, NULL, '2026-03-10 21:53:41'),
(11, 'David', 'Gnilka', 'David.Gnilka@gmx.de', '$2y$10$iQ/FbokI.PhCeqIfnszhveIEgj4pJu.9C2/KBSsaqhCjTUA10BUb2', 1, 1, 1, 0, '2026-03-11 10:23:12');

INSERT INTO `t_events` (`EID`, `name`, `start`, `end`) VALUES
(15, 'BA Sommerfest', '2026-02-28 13:45:00', '2026-04-05 13:45:00'),
(17, 'Biologie 101', '2026-03-10 16:10:00', '2026-03-31 16:10:00'),
(18, 'Mathematik', '2026-03-20 16:19:00', '2026-03-17 16:19:00'),
(19, 'Testevent', '2026-03-10 20:30:00', '2026-03-10 22:28:00'),
(21, 'TTTT', '2026-03-10 12:12:00', '2026-03-10 13:12:00'),
(22, 'Sdf', '2026-03-10 21:08:00', '2026-03-10 21:06:00'),
(23, 'xxx', '2026-03-06 21:23:00', '2026-03-10 23:23:00'),
(24, 'Accounting 4', '2026-03-17 22:15:00', '2026-03-24 22:15:00');

INSERT INTO `t_sign_in` (`EID`, `UID`, `notes`, `sign_in_time`, `sign_out_time`) VALUES
(15, 7, 'ok', '2026-03-09 13:45:32', '2026-03-10 00:29:50'),
(18, 7, 'Ich möchte keine Mathe mehr haben', '2026-03-10 16:20:45', '2026-03-10 16:21:10'),
(21, 10, NULL, '2026-03-10 22:05:10', NULL),
(23, 7, 'Keine  Ahnung\n', '2026-03-10 22:16:11', '2026-03-10 22:16:28');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;