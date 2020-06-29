<template>
	<view class="goods-list flex flex-wrap justify-between ">
		<view class="goods-item " v-for="(item, index) of goodslist" :key="index" @click="detail(item)">
			<view class="item-wrpper bg-white margin-bottom-20 overflow-hidden">
				<view class="cover">
					<view class="img-wrapper">
						<lazy-image
							:src="item.mainPic ? item.mainPic : 'https://img-blog.csdnimg.cn/20200615195704660.png'"
							:showMenuByLongpress="false"
							placeholder="https://img-blog.csdnimg.cn/20200615195704660.png"
						></lazy-image>
					</view>
				</view>
				<view class="desc padding-10">
					<view class="title text-clamp">{{ item.dtitle }}</view>
					<view class="flex align-center justify-between">
						<view class="goods-price">原价 {{ item.originalPrice }}</view>
						<view class="goods-sales">已售 {{ item.monthSales }}</view>
					</view>
					<view class="row-coupon flex align-center justify-between">
						<view class="quanhou">券后 {{ item.actualPrice }}元</view>
						<view class="coupon-price flex align-center justify-end">
							<view>{{ item.couponPrice }}</view>
							<view>元券</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import lazyImage from './lazy-image.vue';
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
		lazyImage
	},
	methods: {
		detail(data) {
			let detail = JSON.stringify(data)
			detail = encodeURIComponent(detail)
			uni.navigateTo({
				url:`/pages/detail/detail?detail=${detail}`
			})
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
	.item-wrpper{
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
		}
	}
}
.desc{
	.title{
		 -webkit-line-clamp: 2;
	}
}
</style>
