/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-17 12:20:37
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-07-01 15:42:16
 */
class Base {
  constructor() {
    "use strict";
    this.__init();
  }
  /**
   * __init
   */
  __init() {
    this.__initTools();
    this.__initDefaults();
    this.__initMethods();
  }
  /**
   * 初始化工具方法
   */
  __initTools() {
    this.tools = {
      isArray(value) {
        return Array.isArray(value);
      },
      isObject(value) {
        return value !== null && typeof value === "object";
      },
      isNumber(value) {
        return typeof value === "number";
      },
      isDate(value) {
        return Object.prototype.toString.call(value) === "[object Date]";
      },
      isUndefined(value) {
        return typeof value === "undefined";
      },
      toJson(obj, pretty) {
        if (this.isUndefined(obj)) return undefined;
        if (!this.isNumber(pretty)) {
          pretty = pretty ? 2 : null;
        }
        return JSON.stringify(obj, null, pretty);
      },
      serializeValue(value) {
        if (this.isObject(value))
          return this.isDate(value) ? value.toISOString() : this.toJson(value);
        return value;
      },
      encodeUriQuery(value, pctEncodeSpaces) {
        return encodeURIComponent(value)
          .replace(/%40/gi, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%3B/gi, ";")
          .replace(/%20/g, pctEncodeSpaces ? "%20" : "+");
      },
      paramSerializer(obj) {
        if (!obj) return "";
        let parts = [];
        for (let key in obj) {
          const value = obj[key];
          if (value === null || this.isUndefined(value)) return;
          if (this.isArray(value)) {
            value.forEach((v) => {
              parts.push(
                this.encodeUriQuery(key) +
                  "=" +
                  this.encodeUriQuery(this.serializeValue(v))
              );
            });
          } else {
            parts.push(
              this.encodeUriQuery(key) +
                "=" +
                this.encodeUriQuery(this.serializeValue(value))
            );
          }
        }
        return parts.join("&");
      },
      buildUrl(url, obj) {
        const serializedParams = this.paramSerializer(obj);
        if (serializedParams.length > 0) {
          url += (url.indexOf("?") == -1 ? "?" : "&") + serializedParams;
        }
        return url;
      },

      /**
       * 格式化时间
       * @param  {Datetime} source 时间对象
       * @param  {String} format 格式
       * @return {String}        格式化过后的时间
       * @example  formatDate (new Date(), 'yyyy-MM-dd hh:mm:ss')
       */
      formatDate(source, format) {
        const o = {
          "M+": source.getMonth() + 1, // 月份
          "d+": source.getDate(), // 日
          "h+": source.getHours(), // 小时
          "m+": source.getMinutes(), // 分
          "s+": source.getSeconds(), // 秒
          "q+": Math.floor((source.getMonth() + 3) / 3), // 季度
          "f+": source.getMilliseconds(), // 毫秒
        };
        if (/(y+)/.test(format)) {
          format = format.replace(
            RegExp.$1,
            (source.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        for (let k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
              RegExp.$1,
              RegExp.$1.length === 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return format;
      },
      /**
       * 多久之前
       * @param  {String|Number} start_time 时间戳
       * @return {String}        hh:mm:ss
       */
      calculateDiffTime(start_time) {
        let end_time = Math.round(new Date().getTime() / 1000).toString();
        var startTime = 0,
          endTime = 0;
        if (start_time < end_time) {
          startTime = start_time;
          endTime = end_time;
        } else {
          startTime = end_time;
          endTime = start_time;
        }
        var timeDiff = endTime - startTime;
        var hour = Math.floor(timeDiff / 3600);
        hour < 10 && (hour = "0" + hour);
        timeDiff = timeDiff % 3600;
        var minute = Math.floor(timeDiff / 60);
        minute < 10 && (minute = "0" + minute);
        timeDiff = timeDiff % 60;
        var second = timeDiff;
        second < 10 && (second = "0" + second);
        return hour + ":" + minute + ":" + second;
      },
      /**
       * 多少分钟
       * @param  {String|Number} start_time 时间戳
       * @return {String}        minute
       */
      // 计算两时间戳之间相隔时间
      calculateDiffTimeMinute(start_time) {
        let end_time = Math.round(new Date().getTime() / 1000).toString();
        var startTime = 0,
          endTime = 0;
        if (start_time < end_time) {
          startTime = start_time;
          endTime = end_time;
        } else {
          startTime = end_time;
          endTime = start_time;
        }
        var timeDiff = endTime - startTime;
        var minute = Math.floor(timeDiff / 60);
        return minute;
      },
      /**
       * 对象按照key排序
       * @param  {Object}
       * @return {Object}
       */
      ksort(o) {
        let sorted = {},
          keys = Object.keys(o);
        keys.sort();
        keys.forEach((key) => {
          sorted[key] = o[key];
        });
        return sorted;
      },
      sort_ASCII(obj) {
        var arr = new Array();
        var num = 0;
        var add = "";
        for (var i in obj) {
          arr[num] = i;
          num++;
        }
        var sortArr = arr.sort();
        var sortObj = {};
        for (var i in sortArr) {
          sortObj[sortArr[i]] = obj[sortArr[i]];
          add +=
            i != sortArr.length - 1
              ? `${sortArr[i]}=${obj[sortArr[i]]}&`
              : `${sortArr[i]}=${obj[sortArr[i]]}`; //字符串拼接
        }
        return {
          sortObj: sortObj,
          add: `${add}`,
        };
      },
      /**
       * 生成随机长度字符
       * @param  {Number} randomLength 长度
       * @return {String}
       */
      GenNonDuplicateID(randomLength) {
        let idStr = Date.now().toString(36);
        idStr += Math.random()
          .toString(36)
          .substr(3, randomLength);
        return idStr;
      },
      /**
       * 转 UTF8
       * @param  {String} s
       * @return {String} s
       */
      encodeUTF8(s) {
        var i,
          r = [],
          c,
          x;
        for (i = 0; i < s.length; i++)
          if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
          else if (c < 0x800)
            r.push(0xc0 + ((c >> 6) & 0x1f), 0x80 + (c & 0x3f));
          else {
            if ((x = c ^ 0xd800) >> 10 == 0)
              //对四字节UTF-16转换为Unicode
              (c = (x << 10) + (s.charCodeAt(++i) ^ 0xdc00) + 0x10000),
                r.push(0xf0 + ((c >> 18) & 0x7), 0x80 + ((c >> 12) & 0x3f));
            else r.push(0xe0 + ((c >> 12) & 0xf));
            r.push(0x80 + ((c >> 6) & 0x3f), 0x80 + (c & 0x3f));
          }
        return r;
      },
      /**
       * 字符串加密成 hex 字符串
       * @param  {String} s
       * @return {String} s
       */
      sha1(s) {
        var data = new Uint8Array(this.encodeUTF8(s));
        var i, j, t;
        var l = (((data.length + 8) >>> 6) << 4) + 16,
          s = new Uint8Array(l << 2);
        s.set(new Uint8Array(data.buffer)), (s = new Uint32Array(s.buffer));
        for (t = new DataView(s.buffer), i = 0; i < l; i++)
          s[i] = t.getUint32(i << 2);
        s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
        s[l - 1] = data.length << 3;
        var w = [],
          f = [
            function() {
              return (m[1] & m[2]) | (~m[1] & m[3]);
            },
            function() {
              return m[1] ^ m[2] ^ m[3];
            },
            function() {
              return (m[1] & m[2]) | (m[1] & m[3]) | (m[2] & m[3]);
            },
            function() {
              return m[1] ^ m[2] ^ m[3];
            },
          ],
          rol = function(n, c) {
            return (n << c) | (n >>> (32 - c));
          },
          k = [1518500249, 1859775393, -1894007588, -899497514],
          m = [1732584193, -271733879, null, null, -1009589776];
        (m[2] = ~m[0]), (m[3] = ~m[1]);
        for (i = 0; i < s.length; i += 16) {
          var o = m.slice(0);
          for (j = 0; j < 80; j++)
            (w[j] =
              j < 16
                ? s[i + j]
                : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)),
              (t =
                (rol(m[0], 5) +
                  f[(j / 20) | 0]() +
                  m[4] +
                  w[j] +
                  k[(j / 20) | 0]) |
                0),
              (m[1] = rol(m[1], 30)),
              m.pop(),
              m.unshift(t);
          for (j = 0; j < 5; j++) m[j] = (m[j] + o[j]) | 0;
        }
        t = new DataView(new Uint32Array(m).buffer);
        for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);
        var hex = Array.prototype.map
          .call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
            return (e < 16 ? "0" : "") + e.toString(16);
          })
          .join("");
        return hex;
      },
      /**
       * 生成签名
       * @param  {Object} data 接口参数
       * @return {String}
       */
      CreateSign(data, nonce, timestamp, privateKey) {
        let newData = { ...data };
        newData["private_key"] = privateKey;
        newData["nonce"] = nonce;
        newData["timestamp"] = timestamp;

        let s = this.sort_ASCII(newData);
        s = this.sha1(s.add);
        // let s = this.ksort(newData)
        // s = this.paramSerializer(data)
        // s = this.sha1(s)
        return s;
      },
      /**
       * 比较版本号大小
       * @param  {String|Number} 版本号
       * @return {Number}
       */

      compareVersion(v1, v2) {
        //compareVersion('1.11.0', '1.9.9') // 1
        v1 = v1.split(".");
        v2 = v2.split(".");
        const len = Math.max(v1.length, v2.length);

        while (v1.length < len) {
          v1.push("0");
        }
        while (v2.length < len) {
          v2.push("0");
        }

        for (let i = 0; i < len; i++) {
          const num1 = parseInt(v1[i]);
          const num2 = parseInt(v2[i]);

          if (num1 > num2) {
            return 1;
          } else if (num1 < num2) {
            return -1;
          }
        }

        return 0;
      },
    };
  }

  /**
   * 初始化工具方法
   */
  __initDefaults() {
    this.defaults = {
      /**
       * 获取元素date-index
       *
       * @param {Object} event 标题
       * @param {String} key 取值key
       * @return {*}
       */
      getDataSet(event, key) {
        return event.currentTarget.dataset[key];
      },
      /**
       * 预览图片
       *
       * @param {Array} imgList
       * @param {Number} current
       * @return {*}
       */
      previewImageList(imgList, current) {
        uni.previewImage({
          urls: imgList,
          current: current,
          loop: true,
          indicator: "number",
          longPressActions: {
            itemList: ["发送给朋友", "保存图片", "收藏"],
            success: function(data) {
              //console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
              return data.tapIndex;
            },
            fail: function(err) {
              console.log(err.errMsg);
            },
          },
        });
      },
      /**
       * tip小提示
       *
       * @param {String} title
       * @return {*}
       */
      toast(title) {
        uni.showToast({
          title: title,
          icon: "none",
        });
      },
    };
  }

  /**
   * 初始化事件方法
   */
  __initMethods() {
    this.methods = {
      /**
       * 公共分享卡片
       *
       * @param {String} title 标题
       * @param {String} path 路径
       * @param {String} imageUrl 图片url
       * @param {Boolean} openUserName 是否打开username@你
       * @return {*}
       */
      shareContent(title, path, imageUrl, openUserName, withShareTicket) {
        let newTitle;
        if (openUserName) {
          let username = "";
          try {
            const value = uni.getStorageSync("auth");
            if (value) {
              username = value.u_nick_name + "@你,";
            }
          } catch (e) {
            // error
            console.log(e);
          }
          if (title) {
            newTitle = username + title;
          } else {
            newTitle = username + "来【uni-app】开发一个自己的项目吧！";
          }
        } else {
          if (title) {
            newTitle = title;
          } else {
            newTitle = "来【uni-app】开发一个自己的项目吧！";
          }
        }
        let imgArr = [
          "https://img.cdn.aliyun.dcloud.net.cn/dev/img/ext/plugin-match.png",
          "https://img.cdn.aliyun.dcloud.net.cn/dev/img/ext/plugin-match.png",
        ];
        let num = Math.floor(Math.random() * 2);
        var raw = {
          withShareTicket: withShareTicket || false,
          title: newTitle,
          path: path ? path : "/pages/index/index",
          imageUrl: imageUrl
            ? imageUrl == "screenshot"
              ? ""
              : imageUrl
            : imgArr[num],
        };
        // console.log(raw)
        return raw;
      },
      /**
       * 公共拷贝方法
       *
       * @param {String} str 标题
       * @return {*}
       */
      setClipboardData(str) {
        uni.setClipboardData({
          data: str,
          success: function() {
            uni.showToast({
              title: "拷贝成功",
              icon: "success",
            });
          },
          fail: function() {
            uni.showToast({
              title: "拷贝失败",
              icon: "none",
            });
          },
        });
      },
      /**
       * 订阅消息处理
       * @subId 订阅消息id
       *
       * @return {subIdStatuss  订阅消息返回状态  rejectId拒绝模板id数组  acceptId用户允许模板id数组 banId后台禁用id	}
       */
      subScribe(subId) {
        let rejectId = [],
          acceptId = [],
          banId = [];
        let promise = new Promise(function(resolve, reject) {
          uni.requestSubscribeMessage({
            tmplIds: subId,
            success(res) {
              subId.forEach((item) => {
                //取出模板id状态(可以去除)
                if (res[item] == "reject") {
                  //取出拒绝模板id
                  rejectId.push(item);
                } else if (res[item] == "ban") {
                  //取出拒绝模板id
                  banId.push(item);
                } else {
                  //取出同意的模板id
                  acceptId.push(item);
                }
              });
              resolve({
                acceptId,
                rejectId,
                banId,
              });
            },
            fail(res) {
              reject(res);
            },
            complete(res) {},
          });
        });
        return promise;
      },

      /**
       * 获取高清大图
       * @param {String} imageUrl
       * @return {*}
       */
      avatarHD(imageUrl) {
        imageUrl = imageUrl.split("/"); //把头像的路径切成数组
        //把大小数值为 46 || 64 || 96 || 132 的转换为0
        if (
          imageUrl[imageUrl.length - 1] &&
          (imageUrl[imageUrl.length - 1] == 46 ||
            imageUrl[imageUrl.length - 1] == 64 ||
            imageUrl[imageUrl.length - 1] == 96 ||
            imageUrl[imageUrl.length - 1] == 100 ||
            imageUrl[imageUrl.length - 1] == 132)
        ) {
          imageUrl[imageUrl.length - 1] = 0;
        }
        imageUrl = imageUrl.join("/"); //重新拼接为字符串
        return imageUrl;
      },
    };
  }
}
export { Base };
