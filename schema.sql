create schema if not exists exercise_db collate utf8mb4_general_ci;

use exercise_db;

grant select, update, delete, insert on `exercise_db`.* to 'exercise'@'%';
