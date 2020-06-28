/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-24 19:24:17
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 19:26:18
 */

const crypto = require("crypto");
// const md5 = crypto.createHash("md5");

/**验签sign参数加密
 * @param $data
 * @param $appSecret
 * @return string
 */
const makeSign = ($data, $appSecret) => {
  let $str = "";
  let $index = 0;
  let $sortPor = [];

  for (let key in $data) {
    $sortPor.push(`${key}=${$data[key]}`);
  }
  // 排序
  $sortPor.sort();

  // 转url
  for (let key in $sortPor) {
    $str = `${$str}${$index === 0 ? "" : "&"}${$sortPor[key]}`;
    $index++;
  }

  // md5加密
  const $ret = crypto
    .createHash("md5")
    .update(`${$str}&key=${$appSecret}`)
    .digest("hex");

  return $ret;
};

module.exports = makeSign;
