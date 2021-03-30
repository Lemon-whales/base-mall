/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-23 19:23:53
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-28 16:06:02
 */

"use strict";
exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log("event : " + event);
  //返回数据给客户端
  return event;
};
