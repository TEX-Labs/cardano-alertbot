import Database from 'better-sqlite3';
const db = new Database('data.db');
db.exec(`CREATE TABLE IF NOT EXISTS subs(chat_id TEXT, kind TEXT, value TEXT);`);
export const addSub = db.prepare('INSERT INTO subs (chat_id, kind, value) VALUES (?, ?, ?)');
export const delAll = db.prepare('DELETE FROM subs WHERE chat_id = ?');
export const listSubs = db.prepare('SELECT kind, value FROM subs WHERE chat_id = ?');
