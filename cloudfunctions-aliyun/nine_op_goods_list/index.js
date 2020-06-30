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
    pageSize: event.pageSize || 10, //每页条数：默认为20，最大值100
    nineCid: event.nineCid || -1, //9.9精选的类目id，分类id请求详情：-1-精选，1 -居家百货，2 -美食，3 -服饰，4 -配饰，5 -美妆，6 -内衣，7 -母婴，8 -箱包，9 -数码配件，10 -文娱车品
    appKey: appConfig.appKey,
    version: appConfig.version,
  };

  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/nine/op-goods-list";
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
