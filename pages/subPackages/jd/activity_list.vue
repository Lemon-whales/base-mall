<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-14 09:39:34
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-14 21:03:09
-->
<template>
  <view class="page ">
    <scroll-tabs :tabData="scrollTabsData" @tabClick="tabClick"></scroll-tabs>
    <view class="body padding-20">
      <goodsList :goodslist="listData"></goodsList>
      <block v-if="listData.length>0">
      <load-more
        mode="circle"
        :status="listLoading?'loading':listPage==0?'normal':'loadmore'"
        @loadingMore="getNextList"
      ></load-more>
    </block>
    </view>
    <wkiwi-loading v-model="loading" :mask="true" :click="true"></wkiwi-loading>
  </view>
</template>

<script>
import { ActivityService} from "@/services/jd/api.service";
import loadMore from "@/mixins/loadMore.js";
import goodsList from "./components/goods-list.vue";
import scrollTabs from '@/components/scroll-tabs.vue'
export default {
  mixins: [loadMore],
  data() {
    return {
      loading:false,//首次进入加载状态
      listData: [], //商品列表
      goodsNewType:'',//商品类型
      scrollTabsData:['推荐','居家日用', '食品','生鲜','图书','美妆个护','母婴','数码家电','内衣','配饰','女装','男装','鞋品','家装家纺','文娱车品','箱包','户外运动'],
      activityScence:'subsidyGoods',//活动场景值
    };
  },
  components:{
    goodsList,
    scrollTabs
  },
  computed:{
  },
  onPullDownRefresh: function() {
    //下拉刷新
    this.refreshList();
  },
  onLoad(options) {
    if(options.activityScence){
      this.activityScence = options.activityScence
      switch (options.activityScence){//getPrice,subsidyGoods,siftGoodsList,selfOperated,pinBuy,collageGoodsList
        case 'getPrice':
          uni.setNavigationBarTitle({
            title: '9块9'
          });
          break;
        case 'subsidyGoods':
          uni.setNavigationBarTitle({
            title: '爆款商品'
          });
          break;
        case 'siftGoodsList':
          uni.setNavigationBarTitle({
            title: '精选好货'
          });
          break;
        case 'selfOperated':
          uni.setNavigationBarTitle({
            title: '京东自营'
          });
          break;
        case 'pinBuy':
          uni.setNavigationBarTitle({
            title: '京东拼购'
          });
          break;
        case 'collageGoodsList':
          uni.setNavigationBarTitle({
            title: '京东配送'
          });
          break;
        default:
          break;
      }
    }
    this.refreshList();
  },
  methods: {
    tabClick(index){
      if(this.goodsNewType == index){
        return
      }
      this.goodsNewType = index;
      this.listPage = 1
      this.getGoodsList()
    },
    refreshList() {
      //刷新数据
      this.loading = true
      this.listPage = 1
      this.getGoodsList();
    },
    getNextList() {
      //拉取下一页数据
      this.getGoodsList();
    },
    getGoodsList() {
      ActivityService.activity({
        num: 20,
        page:this.listPage,
        goods_new_type:this.goodsNewType,
        activityScence:this.activityScence
      })
        .then((res) => {
          this.loading = false
          this.listLoading = false;
          this.$debounce.releaseKey("onReachBottom");
          uni.stopPullDownRefresh();
          let list
          if(!res.data){
            list = res
          }else{
            list = res.data
          }
          if (this.listPage == 1) {
            this.listData = list;
          } else {
            this.listData = [...this.listData, ...list];
          }
          if(res.total_page){//
            if (res.total_page > this.listPage) {
              this.listPage += 1;
            } else {
              this.listPage = 0;
            }
          }
          if(res.total_Count){
            if(res.total_Count > this.listData.length){
              this.listPage += 1;
            }else{
              this.listPage = 0;
            }
          }
        })
        .catch((err) => {
          this.loading = false
          this.listLoading = false;
          uni.stopPullDownRefresh();
        });
    },
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

<style scoped lang="scss">

</style>