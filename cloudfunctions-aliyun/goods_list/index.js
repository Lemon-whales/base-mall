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
    pageSize: event.pageSize || 10, //每页条数，默认为100，最大值200，若小于10，则按10条处理，每页条数仅支持输入10,50,100,200
    sort: event.sort || 0, //排序方式，默认为0，0-综合排序，1-商品上架时间从高到低，2-销量从高到低，3-领券量从高到低，4-佣金比例从高到低，5-价格（券后价）从高到低，6-价格（券后价）从低到高
    appKey: appConfig.appKey,
    version: appConfig.version,
  };

  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/get-goods-list";
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
