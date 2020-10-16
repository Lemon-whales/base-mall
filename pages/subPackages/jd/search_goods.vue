<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-13 17:58:14
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 09:48:24
-->
<template>
  <view class="page">
    <view class="padding-20">
      <goods-list :goodslist="listData" ></goods-list>
    </view>
    <load-more
      v-if="listData.length > 0"
      :status="listLoading ? 'loading' : listPage == 0 ? 'nomore' : 'loadmore'"
    ></load-more>
  </view>
</template>

<script>
import { SearchService } from "@/services/jd/api.service";
import goodsList from "./components/goods-list.vue";
import loadMore from "@/mixins/loadMore.js";
let pageScrollTimeoutId;
export default {
  mixins: [loadMore],
  data() {
    return {
      listData: [], //商品列表
      pageId: 1, //下一页标志
      keyWord: "", //当前要搜索的关键词
			scrollTop:0,//滚动距离顶部距离
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
      this.refreshList();
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
      SearchService.goodsQuery({
        v:'v2',
        num: 20,
        keyword:this.keyWord,
        page:this.listPage
      })
        .then((res) => {
          this.listLoading = false;
          this.$debounce.releaseKey("onReachBottom");
          uni.hideLoading();
          uni.stopPullDownRefresh();
          
          let list = res.goods;
          list.map(item=>{
            item.jd_imageList = JSON.stringify(item.jd_imageList) //兼容V2
            return item;
          //   以下兼容V1
          //   item.jd_title = item.skuName
          //   item.goods_name = item.skuName
          //   item.short_name = item.skuName
          //   item.goods_price = item.priceInfo.price
          //   item.goods_img = item.imageInfo.imageList[0].url
          //   item.discount_price  = item.couponInfo.couponList[0].discount
          //   item.coupon_price = parseInt(item.priceInfo.price - item.couponInfo.couponList[0].discount)
          //   item.jd_imageList = JSON.stringify(item.imageInfo.imageList)
          //   item.img_list = JSON.stringify(item.imageInfo.imageList)
          //   item.discount_link = item.couponInfo.couponList[0].link
          //   item.goods_id = item.skuId
          //   item.discount_start = item.couponInfo.couponList[0].useStartTime
          //   item.discount_end = item.couponInfo.couponList[0].useEndTime
          //   return item
          })
          if (this.listPage == 1) {
            this.listData = list;
          } else {
            this.listData = [...this.listData, ...list];
          }
          if (res.all_num > this.listData.length) {
            this.listPage += 1;
          } else {
            this.listPage = 0;
          }
        })
        .catch((err) => {
          this.listLoading = false;
          uni.hideLoading();
          uni.stopPullDownRefresh();
        });
    }
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
  onShareAppMessage(e) {
    let title, path, imageUrl, openUserName;
    openUserName = false;
    title = "免费，超大额的京东内部优惠券，不领白不领！";
    imageUrl = "screenshot";
    path = `/pages/subPackages/jd/index`;
    return this.$base.methods.shareContent(title, path, imageUrl, openUserName);
  },
};
</script>

<style lang="scss">
</style>
