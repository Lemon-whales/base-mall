/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 11:55:47
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:23:51
 */

const user = require("./user");

module.exports = function(app) {
  app.get("/health", (req, res) => {
    res.status(200);
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.json({
      health: "good",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  });

  app.use([user]);
};
