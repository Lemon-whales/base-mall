<template>
	<view class="page">
		<swiper class="goods-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item class="swiper-item" v-for="(item, index) of swiperImgs" :key="index"><image class="swiper-img" :src="item" mode="widthFix"></image></swiper-item>
		</swiper>
		<view class="goods-detail padding-20 bg-white">
			
			<view class="flex align-start justify-start">
				<view class="l-tag mini bg-red">{{ detail.shopType == 1 ? '天猫' : '淘宝' }}</view>
				<view class="title text-32">{{ detail.title }}</view>
			</view>
			
			<view class="price text-red text-24">
				<text>券后价</text>
				<text class="text-44 padding-left-10">¥ {{ detail.actualPrice }}</text>
			</view>
			<view class="flex align-center justify-between padding-top-10">
				<view class="price text-gray text-24">
					<text>原价</text>
					<text class="text-l padding-left-10 padding-right-10">{{ detail.originalPrice }}</text>
				</view>
				<view class="price text-gray text-24">
					<text>已售</text>
					<text class="text-l padding-left-10 padding-right-10">{{ detail.monthSales }}</text>
				</view>
			</view>
			<view class="l-tag mini line-yellow " v-if="detail.freeshipRemoteDistrict == 1">包邮</view>
			<view class="l-tag mini line-orange " v-if="detail.activityType == 2 || detail.activityType == 3">
				{{ detail.activityType == 2 ? '抢' : detail.activityType == 3 ? '聚' : '' }}
			</view>
			<view class="desc text-gray text-24 padding-top-20">{{ detail.desc }}</view>
		</view>
		<view class="flex align-start justify-start text-28 padding-20 bg-white margin-bottom-20" @click="showProperties">
			<view class="parameter  text-gray margin-right-30">参数</view>
			<view class="parameter-value text-black text-cut">{{ propsCut }}</view>
		</view>

		<view class="imgs-detail">
			<view class="img" v-for="(item, index) of detail.detailPicsArr" :key="index">
				<!-- #ifdef MP -->
				<lazy-image
					:src="item ? item : 'https://img-blog.csdnimg.cn/20200615195704660.png'"
					:showMenuByLongpress="false"
					mode="widthFix"
					placeholder="https://img-blog.csdnimg.cn/20200615195704660.png"
				></lazy-image>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<image class="img" :src="item.mainPic ? item.mainPic : 'https://img-blog.csdnimg.cn/20200615195704660.png'" mode="widthFix"></image>
				<!-- #endif -->
			</view>
		</view>
		<parameter v-if="propertiesWindow&&itemProperties.length>0" :itemProperties="itemProperties" @hideProperties="hideProperties"></parameter>
		<view class="footer l-bar bg-white tabbar border shop">
			<button class="action" open-type="contact">
				<view class="cuIcon-service text-green"><view class="l-tag badge"></view></view>
				客服
			</button>
			<view class="action">
				<view class="cuIcon-cart"><view class="l-tag badge">99</view></view>
				购物车
			</view>
			<view class="btn-group">
				<button class="l-btn bg-orange round shadow-blur">加入购物车</button>
				<button class="l-btn bg-red round shadow-blur" @click="getPrivilegeLink">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
import parameter from './components/parameter';
import lazyImage from '@/components/lazy-image.vue';
import { mapState, mapActions } from 'vuex';
export default {
	data() {
		return {
			detail: '', //商品详情
			goodsId: '', //商品ID
			swiperImgs: [], //轮播图
			seller: '', //卖家信息
			itemProperties: [], //商品参数
			propsCut: '', //参数缩略值
			rate: '', //评价加评价关键词
			propertiesWindow: false //是否显示参数弹窗
		};
	},
	components: {
		lazyImage,
		parameter
	},
	onLoad(options) {
		if (options.detail) {
			//列表页带有详情数据直接传值
			let detail = decodeURIComponent(options.detail);
			detail = JSON.parse(detail);
			this.detail = detail;
			this.goodsId = detail.goodsId;
		} else if (options.goodsId) {
			//只有商品ids时拉取完全从详情接口拉取数据
			this.goodsId = options.goodsId;
		}
		this.goodsDetail();
		this.getDetail();
	},
	methods: {
		hideProperties() {
			//关闭商品参数弹窗
			this.propertiesWindow = false;
		},
		showProperties() {
			//显示商品参数弹窗
			this.propertiesWindow = true;
		},
		goodsDetail() {
			//获取商品列表
			let _this = this;
			uniCloud
				.callFunction({
					name: 'goods_detail',
					data: {
						// id:'619188415148',//大淘客商品id，请求时id或goodsId必填其中一个，若均填写，将优先查找当前单品id
						goodsId: _this.goodsId //淘宝商品sssid，id或goodsId必填其中一个，若均填写，将优先查找当前单品id
					}
				})
				.then(res => {
					if (res.result.data.code == 0) {
						let detail = res.result.data.data;
						let detailPicsArr = detail.detailPics.split(',');
						detail.detailPicsArr = detailPicsArr.map(item => {
							if (item.indexOf('http:') == -1 && item.indexOf('https:') == -1) {
								return 'https:' + item;
							} else {
								return item;
							}
						});
						_this.detail = detail;
					}
				});
		},
		getDetail: function() {
			// 获取详情数据
			uni.request({
				url: 'https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/',
				data: {
					data: { itemNumId: this.goodsId }
				},
				header: {
					'content-type': 'application/json;charset=UTF-8' // 默认值
				},
				method: 'GET',
				success: ret => {
					let data = ret.data;
					if (data.ret[0] === 'SUCCESS::调用成功') {
						// this.details = data.data;
						let swiperImgs = data.data.item.images;
						this.swiperImgs = swiperImgs.map(item => {
							if (item.indexOf('http:') == -1 && item.indexOf('https:') == -1) {
								return 'https:' + item;
							} else {
								return item;
							}
						});
						this.seller = data.data.seller;
						this.itemProperties = data.data.props.groupProps[0]['基本信息'];
						this.rate = data.data.rate;
						this.propsCut = data.data.propsCut;
					}
				}
			});
		},
		getPrivilegeLink() {
			//获取优惠链接
			let _this = this;
			uni.showLoading({
				title: '获取优惠信息中...'
			});
			uniCloud
				.callFunction({
					name: 'get_privilege_link',
					data: {
						// id:'619188415148',//大淘客商品id，请求时id或goodsId必填其中一个，若均填写，将优先查找当前单品id
						goodsId: _this.goodsId //淘宝商品sssid，id或goodsId必填其中一个，若均填写，将优先查找当前单品id
					}
				})
				.then(res => {
					uni.hideLoading();
					// #ifdef MP
					_this.$base.methods.setClipboardData(res.result.data.data.tpwd);
					// #endif
					// #ifdef H5
					 location.href=res.result.data.data.couponClickUrl
					// #endif
				});
		}
	}
};
</script>

<style scoped lang="scss">
.goods-swiper {
	width: 100%;
	height: 750upx;
	.swiper-img {
		width: 100%;
		height: 750upx;
	}
}
.parameter-value {
	max-width: 400upx;
}
.imgs-detail {
	width: 100%;
	margin-bottom: calc(100upx + env(safe-area-inset-bottom) / 2);

	.img {
		min-height: 50upx;
		width :100%;
	}
}
.footer {
	position: fixed;
	z-index: 99;
	bottom: 0;
	left: 0;
	width: 100%;
}
</style>
