<template>
	<view class="page-body" :style="'height:'+height+'px'">
		<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'" :scroll-top="scrollLeftTop" scroll-with-animation>
			<view class="nav-left-item" @click="categoryClickMain(index)" :key="index" :class="index==categoryActive?'active':''"
				v-for="(item,index) in classifyData">
				{{item.cname}}
			</view>
		</scroll-view>
		<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
			<view v-for="(foods,index) in classifyData" :key="index" class="box">
				<view :id="i==0?'first':''" class="nav-right-item" v-for="(item,i) in foods.subcategories" :key="i" @click="cart(item)">
					<image :src="item.scpic"/>
					<view>{{item.subcname}}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: "wkiwi",
				height: 0,
				categoryActive: 0,
				scrollTop: 0,
				scrollLeftTop: 0,
				classifyData:[],
				arr:[0,584,1168,1752,2336,2805,3274,3858,4442,4911,5380,5734,6203,6672,7017],//初始值，后边计算会根据手机适配覆盖
				leftItemHeight: 51,//49行会计算出新值进行覆盖
				navLeftHeight:0,//左边scroll-view 内层nav的总高度
				diff: 0,//左边scroll-view 内层nav的总高度与视口之差
				tabBarHeight:0,//如果此页面为Tab页面，自己改变高度值,,一般tab高度为51
			}
		},
		onLoad() {
			let width = uni.getSystemInfoSync().windowWidth
			this.height = uni.getSystemInfoSync().windowHeight - this.tabBarHeight;
			this.getSuperCategory()
		},
		methods: {
			calculateHeight(){
				//计算各模块高度
				let _this = this;
				let selectorQuery=uni.createSelectorQuery();
				selectorQuery.selectAll('.nav-left-item').boundingClientRect(function(rects) {
					_this.leftItemHeight  =  rects[0].height;
					_this.navLeftHeight = _this.leftItemHeight * _this.classifyData.length;
					_this.diff =  _this.navLeftHeight - _this.height;
				});
				selectorQuery.selectAll('.box').boundingClientRect(function(rects) {
					let arr = [0];
					let top = 0;
					rects.forEach(function(rect){
						top += rect.height;
						arr.push(top)
						})
						console.log(arr)
						_this.arr = arr
					}).exec()
			},
			scroll(e) {
				let _this = this
				if(this.timeoutId){
					clearTimeout(this.timeoutId);
				}
				this.timeoutId = setTimeout(function(){ //节流
					_this.scrollHeight = e.detail.scrollTop +1;
					for (let i = 0; i < _this.arr.length;i++) {
						let height1 = _this.arr[i];
						let height2 = _this.arr[i+1];
						if (!height2 || (_this.scrollHeight >= height1 && _this.scrollHeight < height2)) {
							_this.categoryActive = i;
							(_this.diff>0) && (_this.scrollLeftTop = Math.round((_this.categoryActive * _this.diff)/(_this.classifyData.length-1)));
							return false;
						}
					}
					_this.categoryActive = 0;
					_this.timeoutId = undefined;
				}, 10)
			},
			categoryClickMain(index) {
				this.categoryActive = index;
				this.scrollTop == this.arr[index] ? this.scrollTop = this.scrollTop+1 : this.scrollTop = this.arr[index]//防止两次相等造成点击不触发滚动事件
			},
			getSuperCategory() {
				//获取超级分类
				let _this = this;
				uniCloud
					.callFunction({
						name: 'get_super_category'
					})
					.then(res => {
						_this.classifyData = res.result.data.data;
						_this.$nextTick(()=>{
							_this.calculateHeight()
						})
					});
			},
			cart(data){
				let name = encodeURIComponent(data.subcname)
				let subcid = data.subcid
				uni.navigateTo({
					url:`/pages/goods_list/goods_list?name=${name}&subcid=${subcid}`
				})
			}
		}
	}
</script>

<style>
.page-body {
		display: flex;
		background: #fff;
		overflow: hidden;
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 25%;
		background: #fafafa;
	}

	.nav-left-item {
		height: 100upx;
		border-right: solid 1px #f1f1f1;
		border-bottom: solid 1px #f1f1f1;
		font-size: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.nav-left-item:last-child{
		border-bottom: none;
	}
	.nav-right {
		width: 75%;
	}
	.box {
		display: block;
		overflow: hidden;
		border-bottom: 20upx solid #f3f3f3;
	}
	.box:last-child {
		border: none;
		min-height: 100vh;
	}
	.nav-right-item {
		width: 33%;
		height: 220upx;
		float: left;
		text-align: center;
		padding: 11upx;
		font-size: 28upx;
		background: #fff;
	}

	.nav-right-item image {
		width: 150upx;
		height: 150upx;
	}

	.active {
		color: #FF80AB;
		background: #fff;
		border-right: 0;
	}
	::-webkit-scrollbar {/*取消小程序的默认导航条样式*/
   width: 0;
   height: 0;
   color: transparent;
}
</style>
