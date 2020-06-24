<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-23 19:12:40
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:28:28
--> 
<template>
  <view class="content">
    <view>
      <button @click="getUserInfo">获取用户信息</button>
    </view>
  </view>
</template>

<script>
import { UserService } from "@/services/api.service.js";
export default {
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {
    this.init();
    setTimeout(() => {
      this.tokenValidate();
    }, 1000);
  },
  methods: {
    init() {
      // promise方式 uniCloud云函数试用
      uniCloud
        .callFunction({
          name: "index",
          data: { id: "nmjkj", name: "柠檬鲸科技" }
        })
        .then(res => {
          console.log(res.result);
        });
    },
    tokenValidate() {
      //token验证
      UserService.tokenValidate({})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {});
    },
    getUserInfo() {
      //获取用户信息
      UserService.userInfo({})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {});
    }
  }
};
</script>

<style>
</style>
