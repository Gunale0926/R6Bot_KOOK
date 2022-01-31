CREATE TABLE `cdklist` (
  `act` tinyint(1) NOT NULL DEFAULT '0',
  `cdk` VARCHAR(19) PRIMARY KEY,
  `days` smallint NOT NULL,
  `acttime` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `actid` bigint DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `usrlib` (
  `id` bigint PRIMARY KEY,
  `r6id` tinytext DEFAULT NULL,
  `expdate` datetime NOT NULL DEFAULT '1000-01-01 00:00:00'
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;