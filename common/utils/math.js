/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:11:05
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-12 10:39:21
 */
class Math {
  constructor() {
    "use strict";
    this.__init();
  }
  /**
   * __init
   */
  __init() {
    this.__initTools();
    // this.__initDefaults()
    // this.__initMethods()
  }
  /**
   * 初始化工具方法
   */
  __initTools() {
    /**
     * 判断两个数字是否相等，支持区分 -0 和 0
     *
     * @param {number} a 第一个比较数字
     * @param {number} b 第二个比较数字
     * @returns {boolean} 是否相同
     */
    function is(a, b) {
      if (a !== b) {
        return false;
      }

      return 1 / a === 1 / b;
    }

    /**
     * 符号函数，大于 0 返回 1，小于 0 返回 -1，0 返回 0
     *
     * @param {number} a 第一个比较数字
     * @param {number} b 第二个比较数字
     * @returns {boolean} 是否相同
     */
    function sign(num) {
      if (num === 0) {
        return 0;
      }

      return num > 0 ? 1 : -1;
    }

    /**
     * 判断一个数是否为正数，0 为正，-0 为负
     * @param {number} num 目标数值
     * @returns {boolean} 是否为正
     */
    function isPositive(num) {
      return num > 0 || is(num, 0);
    }

    /**
     * 真·四舍五入
     *
     * @param {number} num 目标数值
     * @param {number} decimals 精确小数位个数
     * @returns {number}  结果
     */
    function round(num, decimals = 0) {
      return Number(Math.round(num + "e" + decimals) + "e-" + decimals);
    }

    /**
     * 处理浮点数精度问题
     *
     * @param {number} a （被）加数
     * @param {number} b 加数
     * @param {number} [decimals=0] 精确小数位个数
     * @returns {number}  结果
     */
    function add(a, b, decimals = 0) {
      return round((a + b) * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    /**
     * 以 10 为底数取对数
     *
     * @param {number} num 整数
     * @returns {number} 对数
     */
    function log10(num) {
      return Math.log10 ? Math.log10(num) : Math.log(num) * Math.LOG10E;
    }

    /**
     * 将数字（整数）转为汉字，从零到一亿亿，
     *
     * @param {number} num 整数
     * @returns {string} 中文数字
     */
    function convertToChinaNum(num) {
      var arr1 = new Array(
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
      );
      var arr2 = new Array(
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿"
      ); //可继续追加更高位转换值
      if (!num || isNaN(num)) {
        return "零";
      }
      var english = num.toString().split("");
      var result = "";
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i; //倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
      } //将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十"); //合并中间多个零为一个零
      result = result.replace(/零+/g, "零"); //将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/零亿/g, "亿").replace(/零万/g, "万"); //将【亿万】换成【亿】
      result = result.replace(/亿万/g, "亿"); //移除末尾的零
      result = result.replace(/零+$/, ""); //将【零一十】换成【零十】 //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十 //将【一十】换成【十】
      result = result.replace(/^一十/g, "十");
      return result;
    }
  }
}
export { Math };
