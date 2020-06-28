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
		this.goodsList()
		this.goodsDetail()
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
		goodsList(){//获取商品列表
			uniCloud
			  .callFunction({
			    name: "goods_list",
					data:{
						pageId:1,
						pageSize:10,//每页条数，默认为100，最大值200，若小于10，则按10条处理，每页条数仅支持输入10,50,100,200
						sort:0,//排序方式，默认为0，0-综合排序，1-商品上架时间从高到低，2-销量从高到低，3-领券量从高到低，4-佣金比例从高到低，5-价格（券后价）从高到低，6-价格（券后价）从低到高
					}
			  })
			  .then(res => {
			    console.log(res.result.data.data);
			  });
		},
		goodsDetail(){//获取商品列表
			uniCloud
			  .callFunction({
			    name: "goods_detail",
					data:{
						// id:'619188415148',//大淘客商品id，请求时id或goodsId必填其中一个，若均填写，将优先查找当前单品id
						goodsId:'619417580864',//淘宝商品sssid，id或goodsId必填其中一个，若均填写，将优先查找当前单品id
					}
			  })
			  .then(res => {
			    console.log(res.result.data.data);
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
