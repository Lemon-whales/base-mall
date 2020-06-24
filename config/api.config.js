/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:51
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 12:21:59
 */
import AppConfig from "./app.config";

const { BASE_URL } = AppConfig;

export default {
  BASE_URL,
  // WebSocket
  WEB_SOCKET_URL: "ws://localhost:4000",

  // 第三方接口
  OPEN_API: {},

  //基础API
  APP_BASE_API: {
    LOGIN_URL: `${BASE_URL}/user/login`, //登陆
		TOKEN_VALIDATE: `${BASE_URL}/user/token/validate`, //token验证
		
    USER_INFO: `${BASE_URL}/user/info`, //获取用户信息
    SAVE_USER_PHONE: `${BASE_URL}/user/save_phone`, //保存手机号
    SAVE_USER_DEVICE: `${BASE_URL}/user/save_device`, //保存用户设备信息
		
  },
  //首页模块
  APP_HOME_API: {
    INDEX: `${BASE_URL}/index`, //获取首页数据
  },
};
