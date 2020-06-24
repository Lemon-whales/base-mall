/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:51
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 12:30:02
 */
export default {
  /**
   * 接口根地址
   */

  IMG_URL: "http://localhost:4000/img", //图片资源接口

  UPYUN_URL: "https://v0.api.upyun.com/", //又拍云上传地址

  // #ifdef MP-WEIXIN
  PROVIDER: "weixin", //平台配置
  BASE_URL: "http://localhost:4000", //API接口
  // #endif

  // #ifdef MP-QQ
  PROVIDER: "qq", //平台配置
  BASE_URL: "http://localhost:4000", //API接口
  // #endif

  // #ifdef MP-TOUTIAO
  PROVIDER: "toutiao", //平台配置
  BASE_URL: "http://localhost:4000", //API接口
  // #endif

  APP_VERSION: "1.0.0", //APP版本

  PRIVATE_KEY: "123456789", //加密key

  PROCESS: "dev", //pro                  //版本类型  dev:开发版     pro:提交版
};
