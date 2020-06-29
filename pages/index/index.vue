<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-23 19:12:40
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:28:28
-->
<template>
	<view class="page">
		<view class="padding-20"><goods-list :goodslist="goodslist"></goods-list></view>
		<load-more v-if="goodslist.length > 0" :status="listLoading ? 'loading' : listPage == 0 ? 'nomore' : 'loadmore'"></load-more>
	</view>
</template>

<script>
import { UserService } from '@/services/api.service.js';
import goodsList from '@/components/goods-list.vue';
import loadMore from '@/mixins/loadMore.js';
export default {
	mixins: [loadMore],
	data() {
		return {
			title: 'Hello',
			goodslist: [], //商品列表
			pageId: 1 //pageId
		};
	},
	components: {
		goodsList
	},
	onLoad() {
		this.goodsList();
	},
	methods: {
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
					name: 'goods_list',
					data: {
						pageId: 1,
						pageSize: 50, //每页条数，默认为100，最大值200，若小于10，则按10条处理，每页条数仅支持输入10,50,100,200
						sort: 0 //排序方式，默认为0，0-综合排序，1-商品上架时间从高到低，2-销量从高到低，3-领券量从高到低，4-佣金比例从高到低，5-价格（券后价）从高到低，6-价格（券后价）从低到高
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
};
</script>

<style scoped lang="scss">
	.page{
		// background: #F2F2F2;
	}
</style>
