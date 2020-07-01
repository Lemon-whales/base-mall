<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-23 19:12:40
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:28:28
-->
<template>
  <view class="page">
    <view class="search-wrapper flex align-center justify-center">
      <view class="search padding-left-30 padding-right-30" @click.stop="search">请输入您要搜索的宝贝名称</view>
    </view>
    <view class="banner">
      <swiper
        class="swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="1000"
      >
        <swiper-item
          class="swiper-item"
          v-for="(item, index) of banner"
          :key="index"
          @click="topicGoodsList(item)"
        >
          <image class="swiper-img" :src="item.banner[0]" :alt="item.topicName" />
        </swiper-item>
      </swiper>
    </view>
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
      banner: [] //轮播专题数组
    };
  },
  components: {
    goodsList
  },
  onLoad() {
    this.goodsList();
    this.getBanner();
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
    getBanner() {
      //获取专题banner
      let _this = this;
      uniCloud
        .callFunction({
          name: "topic_catalogue"
        })
        .then(res => {
          _this.banner = res.result.data.data;
        });
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
            sort: 0 //排序方式，默认为0，0-综合排序，1-商品上架时间从高到低，2-销量从高到低，3-领券量从高到低，4-佣金比例从高到低，5-价格（券后价）从高到低，6-价格（券后价）从低到高
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
    },
    search() {
      uni.navigateTo({
        url: "/pages/subPackages/search/index"
      });
    },
    topicGoodsList(data) {
      //进入主题列表页面
      data = JSON.stringify(data);
      data = encodeURIComponent(data);
      uni.navigateTo({
        url: `/pages/subPackages/index/topic_goods_list?data=${data}`
      });
    }
  }
};
</script>

<style scoped lang="scss">
.search-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80upx;
  z-index: 9;
  .search {
    height: 60upx;
    line-height: 60upx;
    width: 90%;
    border-radius: 50upx;
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.5);
  }
}
.banner {
  width: 100%;
  height: 335upx;
  .swiper {
    width: 100%;
    height: 335upx;
  }
  .swiper-item {
    width: 100%;
    height: 335upx;
    .swiper-img {
      width: 100%;
      height: 335upx;
    }
  }
}
.page {
  // background: #F2F2F2;
}
</style>
