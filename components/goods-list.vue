<template>
	<view class="goods-list flex flex-wrap justify-between ">
		<view class="goods-item " v-for="(item, index) of goodslist" :key="index" @click="detail(item)">
			<view class="item-wrpper bg-white margin-bottom-20 overflow-hidden">
				<view class="cover">
					<view class="img-wrapper">
						<!-- #ifdef MP -->
						<lazy-image
							:src="item.mainPic ? item.mainPic : 'https://img-blog.csdnimg.cn/20200615195704660.png'"
							:showMenuByLongpress="false"
							placeholder="https://img-blog.csdnimg.cn/20200615195704660.png"
						></lazy-image>
						<!-- #endif -->
						<!-- #ifndef MP -->
						<!-- 针对不支持createIntersectionObserver做兼容性更强的图片懒加载 -->
						<lazy-img :showMenuByLonssgpress="false" :scrollTop="scrollTop" :index="index" :src="item.mainPic"
						 :windowHeight="windowHeight" :distance="windowHeight" mode="widthFix" :destroy="true"></lazy-img>
						<!-- <image class="img" :src="item.mainPic ? item.mainPic : 'https://img-blog.csdnimg.cn/20200615195704660.png'" mode="widthFix"></image> -->
						<!-- #endif -->
					</view>
				</view>
				<view class="desc padding-top-30 padding-bottom-30 padding-left-20 padding-right-20">
					<view class="title text-clamp">
						<view class="l-tag mini bg-red radius-10 margin-right-10">{{ item.shopType == 1 ? '天猫' : '淘宝' }}</view>
						{{ item.dtitle }}
					</view>
					<view class="price text-red text-24">
						<text>券后价</text>
						<text class="text-36 padding-left-10">¥ {{ item.actualPrice }}</text>
					</view>
					<view class="flex align-center justify-between text-gray text-24">
						<view class="goods-price">原价 {{ item.originalPrice }}</view>
						<view class="goods-sales">已售 {{ item.monthSales }}</view>
					</view>
					<view class="flex align-center justify-start padding-top-10">
						<view class="l-capsule round mini margin-right-10">
							<view class="l-tag line-orange mini ">券</view>
							<view class="l-tag bg-orange mini">{{ item.couponPrice }}元</view>
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
import lazyImg from './lazy-img.vue'
import lazyImage from './lazy-image.vue';
export default {
	name: 'goods-list',
	props: {
		goodslist: {
			type: Array
		},
		scrollTop:{ // lazyImg组件使用
			type: Number
		}
	},
	data() {
		return {};
	},
	components: {
		lazyImage,
		lazyImg
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
				url: `/pages/detail/detail?detail=${detail}`
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
</style>
