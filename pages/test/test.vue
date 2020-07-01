<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-29 14:25:45
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-07-01 15:19:46
--> 
<template>
  <view class="page">
    <view>
      <button @click="getUserInfo">获取用户信息</button>
    </view>
  </view>
</template>

<script>
import { UserService } from "@/services/api.service.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
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
    getUserInfo() {
      //获取用户信息
      UserService.userInfo({})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {});
    },
    tokenValidate() {
      //token验证
      UserService.tokenValidate({})
        .then(res => {
          console.log(res.data);
        })
        .catch(err => {});
    }
  }
};
</script>

<style scoped lang="scss">
</style>
