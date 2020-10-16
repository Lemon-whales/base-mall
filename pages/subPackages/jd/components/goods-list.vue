<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-14 18:51:14
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 10:13:38
-->
<template>
	<view class="goods-list flex flex-wrap justify-between ">
		<view class="goods-item " v-for="(item, index) of goodslist" :key="index" @click="detail(item)">
			<view class="item-wrpper bg-white margin-bottom-20 overflow-hidden">
				<view class="cover">
					<view class="img-wrapper">
						<lazy-image
							:src="item.goods_img ? item.goods_img : 'https://img-blog.csdnimg.cn/20200116204315833.png'"
							:showMenuByLongpress="false"
						></lazy-image>
					</view>
				</view>
				<view class="desc padding-top-30 padding-bottom-30 padding-left-20 padding-right-20">
					<view class="title text-clamp">
						<view class="l-tag mini bg-red radius-10 margin-right-10" v-if="item.jd_type == 1 || item.jd_type == 2 || item.jd_type == 3">{{ item.jd_type == 1 ? 'POP' :item.jd_type == 2 ? '自营' : item.jd_type == 3 ? '拼购':'' }}</view>
						{{ item.short_name||item.goods_name || detail.jd_title}}
					</view>
					<view class="price text-red text-24">
						<text>券后价</text>
						<text class="text-36 padding-left-10">¥ {{ item.coupon_price||item.lowest_price }}</text>
					</view>
					<view class="flex align-center justify-between text-gray text-24">
						<view class="goods-price line-through">原价 {{ item.goods_price }}</view>
						<view class="goods-sales">已售 {{ item.inOrderCount30Days }}</view>
					</view>
					<view class="flex align-center justify-start padding-top-10">
						<view class="l-capsule round mini margin-right-10">
							<view class="l-tag line-orange mini ">券</view>
							<view class="l-tag bg-orange mini">{{ item.discount_price }}元</view>
						</view>
						<view class="l-tag mini line-yellow " v-if="item.freeshipRemoteDistrict == 1">包邮</view>
						<view class="l-tag mini line-orange " v-if="item.activityType == 2 || item.activityType == 3">
							{{ item.activityType == 2 ? '抢' : item.activityType == 3 ? '聚' : '' }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from "vuex";
import lazyImage from '@/components/lazy-image.vue';
export default {
	name: 'goods-list',
	props: {
		goodslist: {
			type: Array
		}
	},
	data() {
		return {};
	},
	components: {
		lazyImage,
	},
	computed: {
		...mapState("app", {
			windowHeight: (state) => state.windowHeight,
		}),
	},
	methods: {
		detail(data) {
			let detail = JSON.stringify(data);
			detail = encodeURIComponent(detail);
			uni.navigateTo({
				url: `/pages/subPackages/jd/detail?detail=${detail}`
			});
		}
	}
};
</script>

<style scoped lang="scss">
.goods-item {
	width: 50%;
	&:nth-of-type(odd) {
		padding-right: 10upx;
	}
	&:nth-of-type(even) {
		padding-left: 10upx;
	}
	.item-wrpper {
		border-radius: 10upx;
	}
	.cover {
		width: 100%;
		padding-top: 100%;
		height: 0;
		position: relative;
		.img-wrapper {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			.img{
				width: 100%;
				height: 100%;
			}
		}
	}
}
.desc {
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
</style>
