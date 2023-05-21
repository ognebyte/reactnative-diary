import * as SQLite from 'expo-sqlite';

const tableNotes = 'notes';
const tableSubjects = 'subjects';
const tableAssignments = 'assignments';
const tableSchedule = 'schedule';
const tableDays = 'days';
const db = SQLite.openDatabase('diary.db');

const Sqlite = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${tableNotes}
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${tableSubjects}
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        createdBy TEXT
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${tableAssignments}
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
      `CREATE TABLE IF NOT EXISTS ${tableSchedule}
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        saturday INTEGER
      )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${tableDays}
      (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        schedule_id INTEGER,
        subject_id INTEGER,
        place INTEGER,
        weekNumber INTEGER,
        timeStart TEXT,
        timeEnd TEXT,
        courseType TEXT,
        instructor TEXT,
        location TEXT,
        note TEXT
      )`
    );
  });
};

export default Sqlite;
