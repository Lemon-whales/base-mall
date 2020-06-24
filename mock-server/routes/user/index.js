/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 11:55:47
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:24:58
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { privateKey } = require("../../config");
const { db } = require("../../db");
const { authMiddleware } = require("../../middlewares/auth");

const router = express.Router();

const signToken = (data) => {
  const token = jwt.sign(data, privateKey, {
    expiresIn: "1d", // 有效时间为1天
    algorithm: "RS256", // RSA SHA256
  });
  return token;
};

const getUserByName = (username) => {
  db.read();

  const result = db
    .get("users")
    .find({ username })
    .value();

  return result;
};

const getUserById = (id) => {
  db.read();

  const result = db
    .get("users")
    .find({ id })
    .value();
  return result;
};

// 用户查询
router.get("/user/info", authMiddleware, (req, res) => {
  const token = req.header("token");
  let info = jwt.decode(token);
  res.status(200).send({
    code: 200,
    msg: "获取用户信息成功",
    data: {
      info: {
        avatar_url: info.avatar_url,
        gender: info.gender,
        nick_name: info.nick_name,
        id: info.id,
      },
    },
  });
});

// 用户登录
router.post("/user/login", (req, res, next) => {
  let uId = "111111"; //模拟微信等平台解密出opened 并找到对应uid  此处省略各平台后台逻辑
  const { code } = req.body;
  // const user = getUserByName(username);
  if (!code) {
    res.status(500).send({
      code: 500,
      msg: "falil",
    });
    return;
  }
  const user = getUserById(uId);
  bcrypt.compare(uId, user.open_id).then((result) => {
    if (result) {
      const token = signToken(user);
      res.status(200).send({
        code: 200,
        msg: "success",
        data: {
          userInfo: {
            id: user.id,
            nick_name: user.nick_name,
            avatar_url: user.avatar_url,
            gender: user.gender,
          },
          token,
        },
      });
    } else {
      res.status(401).send({
        code: 401,
        msg: "登录失败",
        data: {},
      });
    }
  });
});

// 验证 JWT
router.post("/user/token/validate", authMiddleware, (req, res) => {
  res.status(200).send({
    code: 200,
    msg: "验证成功",
    data: true,
  });
});

module.exports = router;
