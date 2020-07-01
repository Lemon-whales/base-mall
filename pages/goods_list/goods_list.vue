<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-07-01 14:05:33
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-07-01 15:19:22
--> 
<template>
  <view class="pading-20">
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
      subcid: "" //大淘客的二级类目id
    };
  },
  components: {
    goodsList
  },
  onLoad(options) {
    if (options.subcid) {
      //耳机分类id
      this.subcid = options.subcid;
    }
    if (options.name) {
      let name = decodeURIComponent(options.name);
      uni.setNavigationBarTitle({
        title: name
      });
    }
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
          name: "goods_list",
          data: {
            pageId: _this.pageId,
            pageSize: 50, //每页条数，默认为100，最大值200，若小于10，则按10条处理，每页条数仅支持输入10,50,100,200
            sort: 0, //排序方式，默认为0，0-综合排序，1-商品上架时间从高到低，2-销量从高到低，3-领券量从高到低，4-佣金比例从高到低，5-价格（券后价）从高到低，6-价格（券后价）从低到高
            subcid: _this.subcid //大淘客的二级类目id，通过超级分类API获取。仅允许传一个二级id，当一级类目id和二级类目id同时传入时，会自动忽略二级类目id
          }
        })
        .then(res => {
          _this.listLoading = false;
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
          uni.stopPullDownRefresh();
        });
    }
  }
};
</script>

<style lang="scss">
</style>
