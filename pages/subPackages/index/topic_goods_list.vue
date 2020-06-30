<template>
	<view>
		<view class="padding-20"><goods-list :goodslist="goodslist"></goods-list></view>
		<load-more v-if="goodslist.length > 0" :status="listLoading ? 'loading' : listPage == 0 ? 'nomore' : 'loadmore'"></load-more>
	</view>
</template>

<script>
	import goodsList from '@/components/goods-list.vue';
	import loadMore from '@/mixins/loadMore.js';
	export default {
		mixins: [loadMore],
		data() {
			return {
				pageId:1,//下一页标志
				topicData:'',//主题信息
				goodslist:[],//商品列表
			};
		},
		components: {
			goodsList
		},
		onLoad(options) {
			if(options.data){
				let data = decodeURIComponent(options.data)
				data = JSON.parse(data)
				this.topicData = data
				uni.setNavigationBarTitle({
					title:data.topicName
				})
				this.goodsList();
			}
		},
		methods:{
			refreshList() {
				//刷新数据
				this.goodsList();
			},
			getNextList() {
				//拉取下一页数据
				this.goodsList();
			},
			goodsList() {
				//获取商品列表
				let _this = this;
				_this.listLoading = true;
				uniCloud
					.callFunction({
						name: 'topic_goods_list',
						data: {
							pageId: _this.pageId,
							pageSize: 20, //每页条数：默认为20，最大值100
							topicId: _this.topicData.topicId, //专辑id，通过精选专辑API获取的活动id
						}
					})
					.then(res => {
						_this.listLoading = false;
						uni.stopPullDownRefresh();
						if (_this.listPage == 1) {
							_this.goodslist = res.result.data.data.list;
						} else {
							_this.goodslist = [..._this.goodslist, ...res.result.data.data.list];
						}
						_this.pageId = _this.pageId;
						if (res.result.data.data.list.length > 0) {
							_this.listPage += 1;
						} else {
							_this.listPage = 0;
						}
						console.log(res.result.data.data);
					})
					.catch(err => {
						_this.listLoading = false;
						uni.stopPullDownRefresh();
					});
			},
		}
	}
</script>

<style lang="scss">

</style>
