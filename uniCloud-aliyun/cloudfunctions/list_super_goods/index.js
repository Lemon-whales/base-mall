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
    type: event.type || 0, //搜索类型：0-综合结果，1-大淘客商品，2-联盟商品
    pageId: event.pageId || 1, //请求的页码，默认参数1
    pageSize: event.pageSize || 20, //每页条数，默认为20，最大值100
    keyWords: event.keyWords, //关键词搜索
    sort: event.sort || "total_sales_des", //排序字段信息 销量（total_sales） 价格（price），排序_des（降序），排序_asc（升序）
    appKey: appConfig.appKey,
    version: appConfig.version,
  };
  console.log(params);
  const sign = await makeSign(params, appConfig.appSecret);
  const apiUrl = "https://openapi.dataoke.com/api/goods/list-super-goods";
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
