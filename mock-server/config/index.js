/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 11:55:47
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:25:15
 */

const fs = require("fs");
const path = require("path");

const publicKey = fs.readFileSync(
  path.join(__dirname, "./", "cert", "public_key.pem")
);

const privateKey = fs.readFileSync(
  path.join(__dirname, "./", "cert", "private_key.pem")
);

module.exports = {
  publicKey,
  privateKey,
};
