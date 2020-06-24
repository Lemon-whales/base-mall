/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 11:55:47
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:25:08
 */

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const dbFile = path.join(__dirname, "db.json");
const adapter = new FileSync(dbFile);
const db = low(adapter);

module.exports = {
  db,
  dbFile,
};
