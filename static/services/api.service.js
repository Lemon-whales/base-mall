/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:38
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 12:23:36
 */
import ApiClinet from "./api-clinet";
import ApiConfig from "../config/api.config";
import AppConfig from "../config/app.config";
import AuthService from "./auth.service";

const ApiService = {
  get(url, data, options) {
    return ApiClinet.get(url, data, options);
  },
  post(url, data, options) {
    return ApiClinet.post(url, data, options);
  },
  put(url, data, options) {
    return ApiClinet.put(url, data, options);
  },
  delete(url, data, options) {
    return ApiClinet.delete(url, data, options);
  },
};

export default ApiService;

// 用户管理服务
export const UserService = {
  // 用户登录
  login(params) {
    if (
      AppConfig.PROVIDER == "weixin" ||
      AppConfig.PROVIDER == "qq" ||
      AppConfig.PROVIDER == "toutiao"
    ) {
      //微信或QQ登陆
      return new Promise((resolve, reject) => {
        uni.login({
          provider: AppConfig.PROVIDER,
          success: function(res) {
            uni.request({
              url: ApiConfig.APP_BASE_API.LOGIN_URL,
              method: "POST",
              data: {
                code: res.code,
              },
              success: function(res) {
                if (res.statusCode == 200) {
                  resolve(res);
                } else {
                  reject(res);
                }
              },
            });
          },
        });
      });
    } else {
      //其他登陆方式
      return ApiClinet.post(ApiConfig.APP_BASE_API.LOGIN_URL, params);
    }
  },
	//token鉴权
	tokenValidate(params) {
	  return ApiClinet.post(ApiConfig.APP_BASE_API.TOKEN_VALIDATE, params);
	},

  //获取用户信息
  userInfo(params) {
    return ApiClinet.get(ApiConfig.APP_BASE_API.USER_INFO, params);
  },

  //保存用户手机号
  saveUserPhone(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.SAVE_USER_PHONE, params);
  },

  //保存用户设备信息
  saveUserDevice(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.SAVE_USER_DEVICE, params);
  },
};

//首页服务
export const HomeService = {
  //获取首页数据
  getIndex(params) {
    return ApiClinet.post(ApiConfig.APP_HOME_API.INDEX, params);
  },
};

//其他服务模块
export const AppOtherService = {
  upyunUploadFile(params) {
    return ApiClinet.upyunUploadFile(params.service, params.tempFilePaths); //又拍云上传图片
  },
};
