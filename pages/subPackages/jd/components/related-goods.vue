<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-15 10:13:31
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 11:21:29
-->
<template>
	<view class="goods-list">
		<view class="goods-item flex align-center justify-start bg-white padding-left-20 margin-bottom-20 shadow-blur radius-10" v-for="(item, index) of goodslist" :key="index" >
			<view class="cover">
        <lazy-image
          :src="item.goods_img ? item.goods_img : 'https://img-blog.csdnimg.cn/20200116204315833.png'"
          :showMenuByLongpress="false"
        ></lazy-image>
      </view>
      <view class="desc padding-top-20 padding-bottom-20 padding-left-20 padding-right-20">
					<view class="title text-clamp">
						<view class="l-tag mini bg-red radius-10 margin-right-10" v-if="item.jd_type == 1 || item.jd_type == 2 || item.jd_type == 3">{{ item.jd_type == 1 ? 'POP' :item.jd_type == 2 ? '自营' : item.jd_type == 3 ? '拼购':'' }}</view>
						{{ item.short_name||item.goods_name || detail.jd_title}}
					</view>
          <view class="goods-price line-through text-24 text-gray">原价 {{ item.goods_price }}</view>
					<view class="flex align-center justify-between ">
						<view class="price text-red text-24">
              <text>券后价</text>
              <text class="text-36 padding-left-10">¥ {{ item.coupon_price||item.lowest_price }}</text>
            </view>
						<view class="l-capsule round mini margin-right-10">
							<view class="l-tag line-orange mini ">券</view>
							<view class="l-tag bg-orange mini">{{ item.discount_price }}元</view>
						</view>
					</view>
          <view class="flex align-center justify-end padding-top-10 btn-group">
            <button class="kiwi-btn round bg-orange text-24" @click="sharePrivilegeLink(index,item)">复制优惠链接</button>
            <button class="kiwi-btn round bg-red margin-left-20 text-24" @click="getPrivilegeLink(index,item)">立即领券购买</button>
          </view>
				</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import lazyImage from '@/components/lazy-image.vue';
import { TransformService } from "@/services/jd/api.service";
export default {
	name: 'related-goods',
	props: {
		goodslist: {
			type: Array
		}
	},
	data() {
		return {
      oldIndex:'',//缓存的点击列表下标
      privilegeLink:'',//缓存的优惠券链接,
      setClipboardDataStr:''//分享给好友的链接与文案
    };
	},
	components: {
		lazyImage,
	},
	methods: {
    /**
     * 分享给好友 获取优惠券链接
     * @Author: wkiwi
     * @function: sharePrivilegeLink
     */
    sharePrivilegeLink(index,item) {
      if(this.privilegeLink&&this.setClipboardDataStr&&index == this.oldIndex){
        this.$base.methods.setClipboardData(this.setClipboardDataStr);
        return 
      }
      this.oldIndex = index
      //获取优惠链接
      uni.showLoading({
        title: "获取优惠券链接",
      });
      TransformService.goodsLink({
        gid: item.goods_id,
        coupon_url: item.discount_link,
        gid: item.goods_link || undefined,
      })
        .then((res) => {
          uni.hideLoading();
          if (!res.link) {
            this.$base.defaults.toast("优惠券已失效");
            return false;
          }
        this.privilegeLink = res.link;
        this.setClipboardDataStr = `${item.goods_name}\n原价：${item.goods_price}元\n券额：${item.discount_price}元\n券后价：${item.coupon_price}元\n${item.goods_content}\n领券购买链接： ${this.privilegeLink}`;
        this.$base.methods.setClipboardData(this.setClipboardDataStr);
        })
        .catch((err) => {
          uni.hideLoading();
          this.$base.defaults.toast("优惠券已失效");
        });
    },
		/**
     * 点击立即购买 获取链接跳转京东小程序
     * @Author: wkiwi
     * @function: getPrivilegeLink
     */
    getPrivilegeLink(index,item) {
      if(this.privilegeLink&&index == this.oldIndex){
        this.jumpJdMiniProgram(this.privilegeLink);
        return 
      }
      this.oldIndex = index
      //获取优惠链接
      uni.showLoading({
        title: "获取优惠券链接",
      });
      TransformService.goodsLink({
        gid: item.goods_id,
        coupon_url: item.discount_link,
        gid: item.goods_link || undefined,
      })
        .then((res) => {
          uni.hideLoading();
          if (!res.link) {
            this.$base.defaults.toast("优惠券已失效");
            return false;
          }
          this.privilegeLink = res.link;
          this.setClipboardDataStr = `${item.goods_name}\n原价：${item.goods_price}元\n券额：${item.discount_price}元\n券后价：${item.coupon_price}元\n${item.goods_content}\n领券购买链接： ${this.privilegeLink}`;
          // #ifdef H5
          location.href = res.result.data.data.couponClickUrl;
          // #endif
          // #ifdef MP
          this.jumpJdMiniProgram(res.link);
          // #endif
        })
        .catch((err) => {
          uni.hideLoading();
          this.$base.defaults.toast("优惠券已失效");
        });
    },
    /**
     * 跳转京东小程序
     * @Author: wkiwi
     * @function: jumpJdMiniProgram
     * @param {String} link 优惠券链接
     */
    jumpJdMiniProgram(link) {
      let e = encodeURIComponent(link); //必须转码
      uni.navigateToMiniProgram({
        appId: "wx91d27dbf599dff74",
        path: `/pages/union/proxy/proxy?spreadUrl=${e}&appid=wx2afea6afe2d23263`, //XXXXXX为自己小程序的apppid，应该是官方小程序统计跳转来源的，选填
        success(res) {},
      });
    },
	}
};
</script>

<style scoped lang="scss">
.goods-item {
	width: 100%;
	.cover {
    flex: 0 0 200upx;
		width: 200upx;
    height: 200upx;
		position: relative;
	}
}
.desc {
  flex: 1;
	.title {
		line-height: 40upx;
		-webkit-line-clamp: 2;
		vertical-align: middle;
		.l-tag{
			vertical-align: top;
			margin-top:4upx;
		}
	}
}
.l-tag + .l-tag{
	margin-left: 0;
}
.line-through{
	text-decoration:line-through;  
}	
.btn-group{
  .kiwi-btn{
    height: 64upx;
    line-height: 64upx;
  }
}
</style>
