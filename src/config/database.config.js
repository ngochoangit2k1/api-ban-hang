import winston from 'winston';
import dotenv from "dotenv"

dotenv.config();

const container = new winston.Container();
const dbLog = container.get('database');

const pool = {
  max: 20,
  min: 0,
  acquire: 60000,
  idle: 10000
};

const dialectOptions = {
  decimalNumbers: true 
};

const dbLogging = (str, time) => {
  dbLog.info(str, time);
  dbLog.info(`Timed: ${time} ms`);
}

export default {
  local: {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: 0,
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  },
  development: {
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    operatorsAliases: 0,
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  },
  test: {
    user: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mssql',
    operatorsAliases: 0,
    pool: pool
  },
  staging: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  },
  production: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'db_new',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
    pool: pool,
    port: process.env.DB_PORT || '3306',
    benchmark: true,
    logging: dbLogging,
    dialectOptions
  
  },
  
};


// console.log(process.env.DB_PASSWORD)