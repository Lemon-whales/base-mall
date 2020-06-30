<!-- 
 <scroll-tabs :tabData="tabs" :defaultIndex="defaultIndex" @tabClick='tabClick' ></scroll-tabs> 
 
 
 -->
<template>
	<view class="tab-box" id="tab-box" v-if="tabList.length > 0">
		<view class="horizontal">
			<scroll-view :scroll-x="true" style="white-space: nowrap; display: flex;" scroll-with-animation :scroll-left="slider.scrollLeft">
				<block v-for="(item, index) in tabList" :key="index" >
				<view class="item" :class="{ active: activeIndex === index }" :id="'tab_'+index" @click="tabClick(index)">{{ item.text || item }}</view>
				</block>
				<view class="underline" :style="'transform:translateX(' + slider.left + 'px);width:' + slider.width + 'px'"></view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'scroll-tabs',
		props: {
			tabData: {
				type: Array,
				default: () => []
			},
			defaultIndex: {
				type: Number,
				default: 0
			},
			underLinePadding: {
				type: Number,
				default: 10
			},
		},
		data() {
			return {
				tabList: [],
				tabListSlider: [],
				box: {
					left: 0,
					right: 0,
					top: 0,
					width: 0,
					height: 0,
					bottom: 0,
				},
				slider: {
					left: 0,
					width: 0,
					scrollLeft: 0
				},
				activeIndex: 0
			};
		},
		watch: {
			tabData(value) {
				this.tabList = value;
				setTimeout(() => {
					this.updateTabWidth();
				}, 0);
			},
		},
		mounted() {
			this.tabList = this.tabData;
			this.activeIndex = this.defaultIndex;

			setTimeout(() => {

				const query = uni.createSelectorQuery().in(this);
				query.select('.tab-box').boundingClientRect((res) => {
					this.box = res;
					this.updateTabWidth();
				}).exec();

			}, 0);

		},
		methods: {

			tabClick(index) {
				this.activeIndex = index;
				this.tabToIndex(index);
				this.$emit('tabClick', index);
			},

			tabToIndex(index) {
				let _slider = this.tabListSlider[index];

				this.slider = {
					left: _slider.left + this.underLinePadding,
					width: _slider.width - this.underLinePadding * 2,
					scrollLeft: _slider.scrollLeft,
				}
			},

			updateTabWidth(index = 0) {
				let data = this.tabList;

				if (data.length == 0) return false;

				const query = uni.createSelectorQuery().in(this);

				query.select('#tab_' + index).boundingClientRect((res) => {
					let _prev_slider = this.tabListSlider[index - 1];
					this.tabListSlider[index] = {
						left: res.left - this.box.left,
						width: res.width,
						scrollLeft: res.left - this.box.left - (_prev_slider ? _prev_slider.width : 0),
					}

					if (this.activeIndex == index) {
						this.tabToIndex(this.activeIndex);
					}

					index++;
					if (data.length > index) {
						this.updateTabWidth(index);
					}
				}).exec();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab-box {
		width: 100%;
		color: rgba(0, 0, 0, 0.8);
		display: flex;
		height: 90upx;
		background: #fff;
		font-size: 28upx;
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 10;
		overflow: hidden;
		.active {
			color: #e54d42;
		}
		.horizontal {
			width: 100%;
			.item {
				display: inline-block;
				text-align: center;
				padding: 0 30upx;
				height: 86upx;
				line-height: 90upx;
			}
			.underline {
				height: 4upx;
				background-color: #e54d42;
				border-radius: 3px;
				transition: .5s;
			}
		}
	}
</style>
