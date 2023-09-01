// const mysql = require('mysql2/promise');
const pool = require('../utils/db');

module.exports = {
    createIfNotExistUsersTable: async () => {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                age INT DEFAULT 0
            );`
        )
    },
    createIfNotExistTokensTable: async () => {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                token TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            );`
        )
    },
    createIfNotExistTasksTable: async () => {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ownerId INT NOT NULL,
                description TEXT NOT NULL,
                completed BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE
            );`
        )
    }
}