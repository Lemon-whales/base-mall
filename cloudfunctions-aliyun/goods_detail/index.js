/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 19:16:45
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-28 16:05:53
 */

"use strict";
const makeSign = require("make_sign");
const appConfig = require("app_config");
exports.main = async (event, context) => {
  let params = {
    // id:event.id||'',//大淘客商品id，请求时id或goodsId必填其中一个，若均填写，将优先查找当前单品id
    goodsId: event.goodsId || "", //淘宝商品id，id或goodsId必填其中一个，若均填写，将优先查找当前单品id
    appKey: appConfig.appKey,
    version: appConfig.version,
  };
  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/get-goods-details";
  console.log({
    ...params,
    sign: sign,
  });
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
