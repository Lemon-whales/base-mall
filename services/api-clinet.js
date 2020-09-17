/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:38
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-09-17 12:27:04
 */
import HttpClient from "../common/http-client";
import AuthService from "./auth.service";
import { Base } from "../common/utils/base.js";
import Md5 from "../common/utils/md5.js";
import AppConfig from "../config/app.config.js";
import ApiConfig from "../config/api.config.js";
import store from "../store/index.js";

class ApiClient {
  /**
   * Create a new instance of ApiClient.
   */
  constructor() {
    
    this.http = new HttpClient();
    
    this.http.interceptors.request.push((options) => {
      let nextOptions = options;
      // console.log('拦截HTTP请求处理结果: ', nextOptions);
      if (AuthService.auth) {
        nextOptions.header.Authorization = `Bearer ${AuthService.auth}`;
      }

      // nextOptions.header['X-USER-APP-VERSION'] = `${AuthService.auth.version}`;
      return {
        options: nextOptions,
      };
    });

    this.http.interceptors.response.push((response) => {
      // console.log('拦截HTTP响应处理结果: ', response);
      response
        .then((res) => {
          return res;
        })
        .catch((error)  => {
          let err = error;
          if (err) {
            switch (err.statusCode) {
              case 200:
                err.message = err.data.message;
                break;
              case 400:
                err.message = "请求错误(400)";
                break;
              case 401:
                // 401: 未登录或Token过期 对用户进行提示
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                // uni.navigateTo({
                //   url: 'login'
                // });
                err.message = "未授权，请重新登录(401)";
                break;
              case 403:
                err.message = "拒绝访问(403)";
                break;
              case 404:
                err.message = "请求错误(404)";
                break;
              case 500:
                err.message = "服务器错误(500)";
                break;
              case 501:
                err.message = "服务器未实现服务(501)";
                break;
              case 502:
                err.message = "网络错误(502)";
                break;
              case 503:
                err.message = "服务不可用(503)";
                break;
              case 504:
                err.message = "网络超时(504)";
                break;
              case 505:
                err.message = "HTTP版本不受支持(505)";
                break;
              default:
                err.message = `错误类型[${err.statusCode ? err.statusCode : "未知"}]`;
            }
          } else {
            err.message = "连接到服务器失败";
          }
          uni.showToast({
            title: err.message,
            duration: 2000,
            icon: "none",
          });
          return err;
        });
      return response;
    });
  }

  request(options) {
    if(!store.getters['app/getIsConnected']){
      uni.showToast({
        title: '请检查网络',
        duration: 2000,
        icon: "none",
      });
      return new Promise((resolve, reject) => {
        reject('请检查网络')
      })
    }
    let nonce = new Base().tools.GenNonDuplicateID(4);
    let timestamp = Date.parse(new Date()) / 1000; // 取时间戳
    let privateKey = AppConfig.PRIVATE_KEY;
    const header = {
      timestamp: timestamp,
      "Content-Type": "application/json",
      token: AuthService.getToken() ? AuthService.getToken() : "",
      sign: new Base().tools.CreateSign(
        options.data,
        nonce,
        timestamp,
        privateKey
      ),
      nonce: nonce,
    };
    options.header = header;
    return this.http.sendRequest(options);
  }

  /**
   * get方法，对应get请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数] 对于 GET 方法，会将数据自动转换为 query strin
   */
  get(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "GET";
    return this.request(options);
  }

  /**
   * post方法，对应post请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数]
   */
  post(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "POST";
    return this.request(options);
  }
  /**
   * put方法，对应put请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数]
   */
  put(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "PUT";
    return this.request(options);
  }
  /**
   * delete方法，对应delete请求
   * @param {String} url [请求的url地址]
   * @param {Object} data [请求时携带的参数]
   */
  delete(url, data, options) {
    if (!options) {
      options = {};
    }
    options.url = url;
    options.data = data;
    options.method = "DELETE";
    return this.request(options);
  }
  /**
   * uploadFile方法，对应uploadFile请求
   * @param {String} url [请求的url地址]
   * @param {String} fileType [上传文件类型 ，image/video/audio]
   * @param {String} name [上传文件名称]
   * @param {String} tempFilePaths [上传文件临时地址]
   * @param {Object} formData [附带参数]
   */
  uploadFile(url, fileType, name, tempFilePaths, formData) {
    const access_key = AppConfig.ACCESS_KEY; // 服务端生成的 access_key
    const secret_key = AppConfig.SECRET_KEY; // 服务端生成的 secret_key
    let timestamp = Date.parse(new Date()) / 1000; // 取时间戳
    let echostr = new Base().tools.getRandStr(32); // 随机字符串自行生成
    const header = {
      "api-signature": Md5.md5(secret_key + echostr + timestamp),
      "api-echostr": echostr,
      "api-timestamp": timestamp,
      "api-access-key": access_key,
      Accept: "application/vnd.lumen." + AppConfig.VERSION + "+json",
      "Content-Type": "application/json",
      token: AuthService.getToken() ? AuthService.getToken() : "",
    };
    let response = new Promise((resolve, reject) => {
      uni.uploadFile({
        url: url,
        header: header,
        filePath: tempFilePaths,
        fileType: fileType,
        name: name,
        formData: formData,
        success: (uploadFileRes) => {
          resolve(uploadFileRes);
        },
        fail: (res) => {
          reject(res);
        },
      });
    });
    return response;
  }
  /**
   * upyunUploadFile方法，对应upyunUploadFile请求[又拍云]
   * @param {Number} service [业务类型]
   * @param {String} fileType [上传文件类型 ，png,jpeg,jpg]
   * @param {String} tempFilePaths [上传文件临时地址]
   */
  upyunUploadFile(service, tempFilePath) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: ApiConfig.APP_BASE_API.IMG_UPLOAD,
        data: {
          service: service, //业务范围 1文章图片
          extend: tempFilePath.slice(tempFilePath.lastIndexOf(".") + 1), //extend图片后缀 仅限png,jpeg,jpg
        },
        method: "POST",
        header: {
          token: AuthService.getToken() ? AuthService.getToken() : "",
        },
        success: (res) => {
          if (res.data.errorCode == 0) {
            let data = res.data.data;
            uni.uploadFile({
              url: AppConfig.UPYUN_URL + data.bucket,
              filePath: tempFilePath,
              name: "file",
              formData: {
                "Content-Type": "",
                Filename: data.filename,
                policy: data.policy,
                signature: data.signature,
              },
              success: (uploadFileRes) => {
                let res = JSON.parse(uploadFileRes.data);
                res["imgurl"] = data.url;
                resolve(res);
              },
              fail: (res) => {
                reject(res);
              },
            });
          } else {
            uni.showToast({
              title: "上传失败",
              icon: "none",
            });
          }
        },
      });
    });
  }
  /**
   * 上传多张图片
   * @param {Object} tempFilePaths [params.imgList为调用相册返回的临时文件列表]
   * @return {*}
   */
  upyunUploadImgs(service, tempFilePaths) {
    return new Promise((resolve, reject) => {
      if ({}.toString.call(tempFilePaths) != "[object Array]") {
        throw new TypeError(`上传图片参数 tempFilePaths 类型错误!`);
      }
      //路径数组为空时  不上传
      if (tempFilePaths.length == 0) {
        resolve([]);
        return;
      }
      uni.showLoading({
        title: "上传图片中...",
        mask: true,
      });
      uni.request({
        url: ApiConfig.APP_BASE_API.IMG_UPLOAD,
        data: {
          service: service, //业务范围 2抽奖封面 3抽奖详细内容 4奖品封面 5快捷扫码二维码 6发起人信息二维码 7抽奖晒单图片 8抽奖评论图片 9小程序码 10举报抽奖截图 12主页相关图片
          extend: "jpg", //extend图片后缀 仅限png,jpeg,jpg
        },
        method: "POST",
        header: {
          token: AuthService.getToken() ? AuthService.getToken() : "",
        },
        success: (res) => {
          if (res.data.errorCode != 0) {
            uni.showToast({
              title: "上传失败",
              icon: "none",
            });
            uni.hideLoading();
            reject("error");
            return false;
          }
          let data = res.data.data;
          let uploads = [];
          let progress = 0;
          tempFilePaths.forEach((item, i) => {
            if (item.includes("http://tmp") || item.includes("wxfile")) {
              //过滤网络图片
              uploads[i] = new Promise((resolve) => {
                uni.uploadFile({
                  url: AppConfig.UPYUN_URL + data.bucket,
                  filePath: item,
                  name: "file",
                  formData: {
                    "Content-Type": "",
                    Filename: data.filename,
                    policy: data.policy,
                    signature: data.signature,
                  },
                  success: (uploadFileRes) => {
                    progress++;
                    let res = JSON.parse(uploadFileRes.data);
                    res["imgurl"] = data.url;
                    uni.showLoading({
                      title: progress + "/" + tempFilePaths.length,
                      mask: true,
                    });
                    resolve(res);
                  },
                  fail: (res) => {
                    reject("err");
                  },
                });
              });
            } else {
              uploads[i] = Promise.resolve(item);
            }
          });
          Promise.all(uploads)
            .then((res) => {
              //图片上传完成
              resolve(res);
              uni.hideLoading();
            })
            .catch((err) => {
              reject(err);
              uni.hideLoading();
              uni.showToast({
                title: "上传失败请重试",
                icon: "none",
              });
            });
        },
        fail: (err) => {},
      });
    });
  }
}
const getApiClient = () => {
  return new ApiClient();
};

export { getApiClient };
export default new ApiClient();

