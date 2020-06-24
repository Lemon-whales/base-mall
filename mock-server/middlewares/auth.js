/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 11:55:47
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:21:39
 */

const jwt = require("jsonwebtoken");
const { publicKey } = require("../config");

const authMiddleware = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    // res.sendStatus(401);
    res.status(401).send({
      code: 401,
      msg: "Unauthorized",
    });
    return;
  }

  try {
    jwt.verify(token, publicKey);
    next();
  } catch (error) {
    res.status(401).send({
      code: 401,
      msg: "Unauthorized",
    });
    return false;
  }
};

module.exports = {
  authMiddleware,
};
