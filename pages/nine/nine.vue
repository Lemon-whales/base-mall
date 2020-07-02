<template>
  <view class="page">
    <view class="scroll-tabs shadow">
      <scroll-tabs :tabData="tabs" :defaultIndex="defaultIndex" @tabClick="tabClick"></scroll-tabs>
    </view>
    <view class="padding-20">
      <goods-list :goodslist="goodslist" :scrollTop="scrollTop"></goods-list>
    </view>
    <load-more
      v-if="goodslist.length > 0"
      :status="listLoading ? 'loading' : listPage == 0 ? 'nomore' : 'loadmore'"
    ></load-more>
  </view>
</template>

<script>
import scrollTabs from "@/components/scroll-tabs.vue";
import goodsList from "@/components/goods-list.vue";
import loadMore from "@/mixins/loadMore.js";
let pageScrollTimeoutId;
export default {
  mixins: [loadMore],
  data() {
    return {
      goodslist: [], //商品列表
      pageId: 1, //下一页标志
      tabs: [
        "精选",
        "居家百货",
        "美食",
        "服饰",
        "配饰",
        "美妆",
        "内衣",
        "母婴",
        "箱包",
        "数码配件",
        "文娱车品"
      ],
      defaultIndex: 0,
      nineCid: -1 ,//9块9分类
			scrollTop:0,//滚动距离顶部距离
    };
  },
  components: {
    goodsList,
    scrollTabs
  },
  onLoad() {
    uni.showLoading({
      title: "加载中"
    });
    this.goodsList();
  },
  methods: {
    tabClick(index) {
      if (this.defaultIndex == index) {
        return;
      }
      this.defaultIndex = index;
      if (index == 0) {
        this.nineCid = -1;
      } else {
        this.nineCid = index;
      }
      this.goodslist = []; //商品列表
      this.pageId = 1; //pageId
      this.listPage = 1;
      uni.showLoading({
        title: "加载中"
      });
      this.goodsList();
    },
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
          name: "nine_op_goods_list",
          data: {
            pageId: _this.pageId,
            pageSize: 50, //9.9精选的类目id，分类id请求详情：-1-精选，1 -居家百货，2 -美食，3 -服饰，4 -配饰，5 -美妆，6 -内衣，7 -母婴，8 -箱包，9 -数码配件，10 -文娱车品
            nineCid: _this.nineCid
          }
        })
        .then(res => {
          _this.listLoading = false;
          uni.hideLoading();
          uni.stopPullDownRefresh();
          if (_this.listPage == 1) {
            _this.goodslist = res.result.data.data.list;
          } else {
            _this.goodslist = [
              ..._this.goodslist,
              ...res.result.data.data.list
            ];
          }
          _this.pageId = _this.pageId;
          if (res.result.data.data.list.length > 0) {
            _this.listPage += 1;
          } else {
            _this.listPage = 0;
          }
        })
        .catch(err => {
          _this.listLoading = false;
          uni.hideLoading();
          uni.stopPullDownRefresh();
        });
    },
		onPageScroll: function(res) { //页面滚动监听
			let _this = this;
			if (!pageScrollTimeoutId) {
				clearTimeout(pageScrollTimeoutId);
			}
			pageScrollTimeoutId = setTimeout(()=> { //防抖
				_this.scrollTop = res.scrollTop
				pageScrollTimeoutId = ''
			}, 50);
		},
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding-top: 90upx;
  position: relative;
  .scroll-tabs {
    position: fixed;
    z-index: 9;
		// #ifdef MP
    top: 0;
		// #endif
		// #ifdef H5
		top: calc(44px + env(safe-area-inset-top));
		// #endif
    left: 0;
    width: 100%;
  }
}
</style>
