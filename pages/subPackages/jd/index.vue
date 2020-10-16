<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-13 10:43:15
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-14 21:02:31
-->
<template>
  <view class="page ">
    <view class="header relative overflow-hidden" :style="[{height:eaderHeaight+'px',paddingTop:statusBarHeight+'px',background:bannerBackgroundColor}]">
    <navigation-bar theme="black" :navigationBackground="scrollTop > customBarHeight/2 ? '#fff' : 'transparent'">
      <view class="search-input flex align-center justify-center" 
      @click="searchPage"
       :style="[{height:Custom.height+'px'}]"
        slot="title" >
        <view class="input text-24">请输入商品名称</view>
      </view>
    </navigation-bar>
    <view class="frosted-glass" :style="bannerStyle"> </view>
    <view class="swiper-wrapper card-swiper relative" >
      <swiper
        class="swiper relative"
        :circular="true"
        :indicator-dots="false"
        :autoplay="true"
        :interval="4000"
        :duration="1000"
        @change="swiperChange"
      >
        <swiper-item
          :class="bannerCurrent == index ? 'cur' : ''"
          v-for="(item, index) in banner"
          :key="index"
          @click="handleBanner(index)"
        >
          <view class="swiper-item">
            <img class="img" :src="item.banner_img" />
          </view>
        </swiper-item>
      </swiper>
      <view class="dots-list flex align-center justify-center">
        <view
          class="dots-item opacity-08"
          v-for="(item, index) in banner"
          :key="index"
          :class="bannerCurrent == index ? 'bg-green' : 'bg-gray'"
        ></view>
      </view>
    </view>
    <!-- /.swiper-wrapper -->
    </view>
    <view class="activity-list flex flex-wrap align-start justify-start margin-top-10 margin-bottom-10  bg-white ">
      <view class="activity-item flex flex-column align-center justify-center padding-30 border" v-for="(item,index) of activityLists" :key="index" @click="activityList(item.scence)" >
        <view class="title margin-bottom-20 text-36" :style="[{backgroundImage:item.background}]">{{item.title}}</view>
        <img :src="item.icon" class="icon">
      </view>
    </view>
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
var PageScrollTimeId =''
import { ActivityService, BaseService } from "@/services/jd/api.service";
import loadMore from "@/mixins/loadMore.js";
import navigationBar from '@/components/navigation-bar'
import goodsList from "./components/goods-list.vue";
import scrollTabs from '@/components/scroll-tabs.vue'
export default {
  mixins: [loadMore],
  data() {
    return {
      loading:false,//首次进入加载状态
      scrollTop:0,//滚动顶部距离
      statusBarHeight:this.StatusBar,//状态栏高度
      customBarHeight:this.CustomBar,//自定义状态栏高度
      bannerCurrent: 0, //默认选择的banner下标
      Custom:this.Custom,//胶囊信息
      banner: [], //当前banner
      listData: [], //商品列表
      goodsNewType:'',//商品类型
      scrollTabsData:['推荐','居家日用', '食品','生鲜','图书','美妆个护','母婴','数码家电','内衣','配饰','女装','男装','鞋品','家装家纺','文娱车品','箱包','户外运动'],
      activityLists:[{
        title:'9块9',
        scence:'getPrice',
        icon:'http://m.360buyimg.com/mobilecms/s150x150_jfs/t1/85072/25/5818/20921/5def3796Eeb18104b/fed4740b6b58d144.jpg!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #FF2A2A,#F139D2)'
      },
      {
        title:'爆款商品',
        scence:'subsidyGoods',
        icon:'http://m.360buyimg.com/n1/s150x150_jfs/t29566/227/1464891645/10350/a5b133e2/5ce20cdcNd9cdd972.jpg!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #FE8537,#F02B2B)'
      },
      {
        title:'精选好货',
        scence:'siftGoodsList',
        icon:'http://m.360buyimg.com/mobilecms/s150x150_jfs/t1/88638/33/5675/28468/5def3b04E728e691f/8997a8bf07db66b7.png!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #FF2A00,#FF00AF)'
      },
      {
        title:'京东自营',
        scence:'selfOperated',
        icon:'http://m.360buyimg.com/mobilecms/s150x150_jfs/t1/80435/12/13755/37856/5daeb76bEc10eb013/177eb658079595d1.jpg!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #00C2AB,#3E94FF)'
      },
      {
        title:'京东拼购',
        scence:'pinBuy',
        icon:'http://m.360buyimg.com/mobilecms/s150x150_jfs/t1/71612/30/758/62076/5cefa5a6E2494c8c2/13aac3e0bb1b4e55.png!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #FF765C,#FF23B3)'
      },
      {
        title:'京东配送',
        scence:'collageGoodsList',
        icon:'http://m.360buyimg.com/mobilecms/s150x150_jfs/t1/50174/30/1230/9784/5cef98bfE318f8d24/4720dc4079dd568b.jpg!q70.jpg.dpg',
        background: 'linear-gradient(90deg, #2AD396,#85BB1F)'
      }]
    };
  },
  components:{
    navigationBar,
    goodsList,
    scrollTabs
  },
  computed:{
    bannerBackgroundColor(){
      if(this.banner.length==0){
        return ''
      }
      return this.banner[this.bannerCurrent].background_color
    },
    bannerStyle(){
      if(this.banner.length==0){
        return ''
      }
      return` 
        background-image:url('${this.banner[this.bannerCurrent].banner_img}');
        background-color:${this.banner[this.bannerCurrent].background_color};
        height:${this.eaderHeaight}px`
    },
    eaderHeaight(){
      return this.statusBarHeight+uni.upx2px(425);
    },
  },
  onLoad(options) {
    this.refreshList();
  },
  methods: {
    /**
     * 点击板块进入活动列表
     * @Author: wkiwi
     * @function: activityList
     */
    activityList(activityScence){ //9块9 getPrice,奖励商品 subsidyGoods,精选好货 siftGoodsList,京东自营 selfOperated,京东拼购 pinBuy,京东配送 collageGoodsList
      uni.navigateTo({
        url:`/pages/subPackages/jd/activity_list?activityScence=${activityScence}`
      })
    },
    /**
     * 点击操作banner
     * @Author: wkiwi
     * @function: handleBanner
     * @param {Number} index 下标 
     */
    handleBanner(index){
      let goodsInfo = this.banner[index].goods_info
      let detail = encodeURIComponent(JSON.stringify(goodsInfo));
			uni.navigateTo({
				url: `/pages/subPackages/jd/detail?detail=${detail}`
			});
    },
    /**
     * 点击分类
     * @Author: wkiwi
     * @function: tabClick
     * @param {Number} index 下标 
     */
    tabClick(index){
      if(this.goodsNewType == index){
        return
      }
      if(index==0){
        this.goodsNewType = undefined
      }else{
        this.goodsNewType = index;
      }
      this.listPage = 1
      this.getGoodsList()
    },
    refreshList() {
      //刷新数据
      this.loading = true
      this.getBanner();
      this.getGoodsList();
    },
    getNextList() {
      //拉取下一页数据
      this.getGoodsList();
    },
    getGoodsList() {
      BaseService.getGoodsList({
        num: 20,
        page:this.listPage,
        goods_new_type:this.goodsNewType
      })
        .then((res) => {
          this.loading = false
          this.listLoading = false;
          this.$debounce.releaseKey("onReachBottom");
          uni.stopPullDownRefresh();
          let list = res.data;
          if (this.listPage == 1) {
            this.listData = list;
          } else {
            this.listData = [...this.listData, ...list];
          }
          if (res.total_page > this.listPage) {
            this.listPage += 1;
          } else {
            this.listPage = 0;
          }
        })
        .catch((err) => {
          this.loading = false
          this.listLoading = false;
          uni.stopPullDownRefresh();
        });
    },
    /**
     * 修改当前显示banner下标
     * @Author: wkiwi
     * @function:swiperChange
     * @param {Object}  swiper参数
     */
    swiperChange(e) {
      this.bannerCurrent = e.detail.current;
    },
    /**
     * 获取banner
     * @Author: wkiwi
     * @function: getBanner
     */
    getBanner() {
      ActivityService.getBanner({}).then((res) => {
        this.banner = res;
      });
    },
    searchPage(){
      uni.navigateTo({
        url:'./search'
      })
    }
  },
  onPageScroll(res) {
    // 防抖处理    //截流可能造成数据误差
    if (PageScrollTimeId) {
      clearTimeout(PageScrollTimeId);
    }
    PageScrollTimeId = setTimeout(() => {
      this.scrollTop = res.scrollTop;
      PageScrollTimeId = "";
    }, 40);
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
  .header{
    .search-input{
      width:100%;
      margin-left: 10upx;
      margin-right: 210upx;
      padding: 0 20upx;
      .input{
        width: 100%;
        height: 60upx;
        line-height: 60upx;
        padding: 0 30upx;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 60upx;
        color: rgba(255,255,255,0.7);
      }
    }
  }
  .frosted-glass{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background-size: 250% 250%;
    filter: blur(5px);
    z-index:0;
    width: 150%;
    height: 150%;
    opacity: 0.7;
  }
.swiper-wrapper {
  margin-top: 80upx;
  width: 100%;
  display: block;
  overflow: hidden;
  // background: #f1f1f1;
  height: 345upx;
  position: relative;
  
  .swiper {
    z-index:1;
    width: 100%;
    height: 345upx;
    swiper-item {
      height: 305upx;
    }
    .swiper-item {
      width: 100%;
      height: 305upx;
      .img {
        width: 100%;
        display: block;
        height: 305upx;
      }
    }
  }
  .dots-list {
    position: absolute;
    bottom: 10upx;
    left: 0;
    width: 100%;
    .dots-item {
      width: 50upx;
      height: 10upx;
      margin: 0 4upx;
    }
  }
}

.activity-list{
  .activity-item{
    width: 33.3%;
    .title{
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }
    .icon{
      width: 120upx;
      height: 120upx;
    }
  }
}
</style>