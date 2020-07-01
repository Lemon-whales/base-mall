<template>
  <view class="page">
    <view class="padding-20">
      <goods-list :goodslist="goodslist"></goods-list>
    </view>
    <load-more
      v-if="goodslist.length > 0"
      :status="listLoading ? 'loading' : listPage == 0 ? 'nomore' : 'loadmore'"
    ></load-more>
  </view>
</template>

<script>
import goodsList from "@/components/goods-list.vue";
import loadMore from "@/mixins/loadMore.js";
export default {
  mixins: [loadMore],
  data() {
    return {
      goodslist: [], //商品列表
      pageId: 1, //下一页标志
      keyWord: "", //当前要搜索的关键词
      sortType: "total_sales_des" //排序类型
    };
  },
  components: {
    goodsList
  },
  onLoad(options) {
    if (options.keyWord) {
      let keyWord = decodeURIComponent(options.keyWord);
      this.keyWord = keyWord;
      uni.setNavigationBarTitle({
        title: keyWord
      });
      uni.showLoading({
        title: "加载中"
      });
      this.goodsList();
    } else {
      uni.navigateBack({
        delta: 1
      });
    }
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
          name: "list_super_goods",
          data: {
            pageId: _this.pageId,
            keyWords: _this.keyWord,
            pageSize: 50,
            type: 0, //搜索类型：0-综合结果，1-大淘客商品，2-联盟商品
            sort: _this.sortType || "total_sales_des"
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
    }
  }
};
</script>

<style lang="scss">
</style>
