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
    pageId: event.pageId || 1,
    pageSize: event.pageSize || 20, //每页条数：默认为20，最大值100
    topicId: event.topicId, //专辑id，通过精选专辑API获取的活动id
    appKey: appConfig.appKey,
    version: appConfig.version,
  };

  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/topic/goods-list";
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


