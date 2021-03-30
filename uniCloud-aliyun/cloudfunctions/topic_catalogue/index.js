/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 19:16:45
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 19:30:29
 */

"use strict";
const makeSign = require("make_sign");
const appConfig = require("app_config");
exports.main = async (event, context) => {
  let params = {
		appKey: appConfig.appKey,
    version: appConfig.version,
  };

  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/topic/catalogue";
  const res = await uniCloud.httpclient.request(apiUrl, {
    method: "GET",
    dataType: "json",
    data: {
      ...params,
      sign: sign,
    },
  });
  //返回数据给客户端
  return res;
};

