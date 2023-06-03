import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('diary.db');

const Sqlite = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS notes
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS subjects
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS assignments
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        title TEXT,
        description TEXT,
        grade INTEGER,
        isComplete INTEGER,
        createdAt DATE,
        deadline DATE
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS schedule
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        week INTEGER,
        place INTEGER,
        courseType TEXT,
        location TEXT,
        instructor TEXT,
        note TEXT
      )`
    );
  });
};

export default Sqlite;
