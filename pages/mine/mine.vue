<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-30 10:58:51
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-07-01 15:19:29
--> 
<template>
  <view> 
		<button @click="jd">进入京东优惠券模块</button>
    <button @click="test">进入测试页面</button>
    <view class="text-24 text-gray text-center padding-top-20">进入测试页面请先运行</view>
    <view class="text-24 text-gray text-center padding-top-20">npm start</view>
    <view class="text-24 text-gray text-center padding-top-20">启动模拟数据服务</view>
		
		<button @click="uniId">进入uni-id用户管理</button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    test() {
      uni.navigateTo({
        url: "/pages/test/test"
      });
    },
		uniId(){
			uni.navigateTo({
			  url: "/pages/user_center/user_center"
			});
		},
		jd(){
			uni.navigateTo({
			  url: "/pages/subPackages/jd/index"
			});
		}
  }
};
</script>

<style>
</style>
