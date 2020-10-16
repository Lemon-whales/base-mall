<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-13 10:43:15
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 11:20:55
-->
<template>
  <view class="page">
    <navigation-bar
      theme="black"
      :navigationBackground="
        scrollTop > customBarHeight / 2 ? '#fff' : 'transparent'
      "
      :navigationTitleColor="
        scrollTop > customBarHeight / 2 ? '#333' : 'transparent'
      "
      :navigationTitle="
        detail.jd_title || detail.goods_name || detail.short_name
      "
    ></navigation-bar>
    <block v-if="detail">
      <swiper
        class="goods-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="1000"
      >
        <swiper-item
          class="swiper-item"
          v-for="(item, index) of detail.img_list"
          :key="index"
          ><image
            class="swiper-img"
            :src="item.url || item"
            mode="scaleToFill"
          ></image
        ></swiper-item>
      </swiper>
      <view class="goods-detail padding-20 bg-white">
        <view class="flex align-start justify-start">
          <view
            class="l-tag mini bg-red radius-10 margin-right-10"
            v-if="item.jd_type == 1 || item.jd_type == 2 || item.jd_type == 3"
            >{{
              item.jd_type == 1
                ? "POP"
                : item.jd_type == 2
                ? "自营"
                : item.jd_type == 3
                ? "拼购"
                : ""
            }}</view
          >
          <view class="title text-32">{{
            detail.jd_title || detail.goods_name || detail.short_name
          }}</view>
        </view>

        <view class="price text-red text-24">
          <text>券后价</text>
          <text class="text-44 padding-left-10"
            >¥ {{ detail.coupon_price || detail.lowest_price }}</text
          >
        </view>
        <view class="flex align-center justify-between padding-top-10">
          <view class="price text-gray text-24">
            <text>原价</text>
            <text
              class="text-l line-through padding-left-10 padding-right-10"
              >{{ detail.goods_price }}</text
            >
          </view>
          <view class="price text-gray text-24">
            <text>已售</text>
            <text class="text-l padding-left-10 padding-right-10">{{
              detail.inOrderCount30Days
            }}</text>
          </view>
        </view>
        <!-- <view class="l-tag mini line-yellow " v-if="detail.freeshipRemoteDistrict == 1">包邮</view>
        <view class="l-tag mini line-orange " v-if="detail.activityType == 2 || detail.activityType == 3">
          {{ detail.activityType == 2 ? '抢' : detail.activityType == 3 ? '聚' : '' }}
        </view> -->
        <view class="desc text-gray text-24 padding-top-20">{{
          detail.goods_content || detail.link_content
        }}</view>
      </view>
      <!-- <view class="flex align-start justify-start text-28 padding-20 bg-white margin-bottom-20" @click="showProperties">
        <view class="parameter  text-gray margin-right-30">参数</view>
        <view class="parameter-value text-black text-cut">{{ propsCut }}</view>
      </view> -->
      <view
        class="bg-white padding-bottom-30 margin-bottom-20 flex align-center justify-center"
      >
        <view
          @click="getPrivilegeLink"
          class="coupon-info text-white padding-30 radius-15 bg-orange round shadow-blur flex align-center justify-between"
        >
          <view class="flex align-center justify-start">
            <view class="flex align-end justify-start">
              <view class="text-24">¥</view>
              <view class="text-44">
                {{ detail.discount_price }}
              </view>
            </view>

            <view class="text-22 padding-left-30">
              <view class="hint padding-bottom-10">优惠券使用期限</view>
              <view class="time">
                {{ detail.discount_start_str }}~{{ detail.discount_end_str }}
              </view>
            </view>
          </view>
          <view class="get-coupon text-36">立即领券</view>
        </view>
      </view>
      <view class="bg-white margin-top-10 margin-bottom-10">
        <ad
          unit-id="adunit-2ecef8cf11afed83"
          ad-type="video"
          ad-theme="white"
        ></ad>
      </view>
      <view class="imgs-detail">
        <view
          class="img"
          v-for="(item, index) of detail.jd_imageList"
          :key="index"
          @click="previewImgs(index)"
        >
          <lazy-image
            :src="
              item.url
                ? item.url
                : 'https://img-blog.csdnimg.cn/20200615195704660.png'
            "
            :showMenuByLongpress="false"
            mode="widthFix"
          ></lazy-image>
        </view>
      </view>
      <view class="related-goods padding-20" v-if="relatedGoodsList.length>0">
        <view class="related-goods-title text-36 padding-bottom-20 text-bold padding-top-20">为您推荐相关商品</view>
        <related-goods :goodslist="relatedGoodsList"></related-goods>
      </view>
      <view class="footer-margin"></view>
      <view class="footer bg-white border-top flex align-center justify-end">
        <view class="btn-group flex align-center justify-end padding-20">
          <button
            class="kiwi-btn text-26 bg-orange round shadow-blur"
            @click="sharePrivilegeLink"
          >
            复制优惠链接
          </button>
          <button
            class="kiwi-btn text-26 bg-red round shadow-blur margin-left-20"
            @click="getPrivilegeLink"
          >
            立即领券
          </button>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
var PageScrollTimeId = "";
import { BaseService, TransformService } from "@/services/jd/api.service";
import lazyImage from "@/components/lazy-image.vue";
import { mapState, mapActions } from "vuex";
import navigationBar from "@/components/navigation-bar";
import relatedGoods from './components/related-goods'
export default {
  data() {
    return {
      scrollTop: 0, //滚动顶部距离
      customBarHeight: this.CustomBar, //自定义状态栏高度
      detail: "", //商品详情
      goodsId: "", //商品ID
      swiperImgs: [], //轮播图
      seller: "", //卖家信息
      itemProperties: [], //商品参数
      propsCut: "", //参数缩略值
      rate: "", //评价加评价关键词
      propertiesWindow: false, //是否显示参数弹窗
      privilegeLink: "", //缓存已经转好的优惠券链接
      relatedGoodsList:[],//推荐商品
    };
  },
  components: {
    lazyImage,
    navigationBar,
    relatedGoods
  },
  onLoad(options) {
    if (options.detail) {
      //列表页带有详情数据直接传值
      let detail = decodeURIComponent(options.detail);
      detail = JSON.parse(detail);
      if (detail.jd_imageList) {
        detail.jd_imageList = JSON.parse(detail.jd_imageList);
      }
      if (detail.img_info) {
        detail.img_list = JSON.parse(detail.img_info);
      } else if (detail.img_list) {
        detail.img_list = JSON.parse(detail.img_list);
        if (detail.img_list.length == 0) {
          detail.img_list = [detail.goods_img];
        }
      } else if (detail.goods_img) {
        //兼容搜索
        detail.img_list = [detail.goods_img];
      }
      detail.discount_start_str = this.$base.tools.formatDate(
        new Date(detail.discount_start),
        "yyyy.MM.dd"
      );
      detail.discount_end_str = this.$base.tools.formatDate(
        new Date(detail.discount_end),
        "yyyy.MM.dd"
      );
      this.detail = detail;
      this.goodsId = detail.goods_id;
      this.getRelatedGoods()//获取同类型产品推荐
    } else if (options.goodsId) {
      //只有商品ids时拉取完全从详情接口拉取数据
      this.goodsId = options.goodsId;
    }
  },
  methods: {
    hideProperties() {
      //关闭商品参数弹窗
      this.propertiesWindow = false;
    },
    showProperties() {
      //显示商品参数弹窗
      this.propertiesWindow = true;
    },
    /**
     * 预览图片
     * @Author: wkiwi
     * @function: previewImgs
     */
    previewImgs(index) {
      let imgList = this.detail.jd_imageList.map((item) => {
        return item.url;
      });
      this.$base.defaults.previewImageList(imgList, index);
    },
    /**
     * 同类型商品推荐
     * @Author: wkiwi
     * @function: getRelatedGoods
     */
    getRelatedGoods(){
      TransformService.relatedGoods({
        goods_id:this.goodsId
      }).then(res=>{
        this.relatedGoodsList = res
      }).catch(err=>{
        
      })
    },
    /**
     * 获取商品详情信息  暂未使用 详情信息直接使用列表返回的自带信息
     * @Author: wkiwi
     * @function: goodsDetail
     */
    goodsDetail() {
      BaseService.getGoodsInfo({
        gid: this.goodsId,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
      BaseService.getGoodsDetail({
        gid: this.goodsId,
      })
        .then((res) => {
          this.detailRichText = res;
          console.log(res);
        })
        .catch((err) => {});
    },
    /**
     * 分享给好友 获取优惠券链接
     * @Author: wkiwi
     * @function: sharePrivilegeLink
     */
    sharePrivilegeLink() {
      if (this.privilegeLink) {
        this.$base.methods.setClipboardData(this.setClipboardDataStr);
        return;
      }
      uni.showLoading({
        title: "获取优惠券链接",
      });
      TransformService.goodsLink({
        gid: this.goodsId,
        coupon_url: this.detail.discount_link,
        gid: this.detail.goods_link || undefined,
      })
        .then((res) => {
          uni.hideLoading();
          if (!res.link) {
            this.$base.defaults.toast("优惠券已失效");
            return false;
          }
          this.privilegeLink = res.link;
          this.setClipboardDataStr =  `${this.detail.jd_title || this.detail.goods_name || this.detail.short_name}\n原价：${this.detail.goods_price}元\n券额：${this.detail.discount_price}元\n券后价：${this.detail.coupon_price || this.detail.lowest_price}元\n${this.detail.link_content||this.detail.goods_content}\n领券购买链接： ${res.link}`;
          this.$base.methods.setClipboardData(this.setClipboardDataStr);
        })
        .catch((err) => {
          uni.hideLoading();
          this.$base.defaults.toast("优惠券已失效");
        });
    },
    /**
     * 点击立即购买 获取链接跳转京东小程序
     * @Author: wkiwi
     * @function: getPrivilegeLink
     */
    getPrivilegeLink() {
      //获取优惠链接
      if (this.privilegeLink) {
        this.jumpJdMiniProgram(this.privilegeLink);
        return;
      }
      uni.showLoading({
        title: "获取优惠券链接",
      });
      TransformService.goodsLink({
        gid: this.goodsId,
        coupon_url: this.detail.discount_link,
        gid: this.detail.goods_link || undefined,
      })
        .then((res) => {
          uni.hideLoading();
          if (!res.link) {
            this.$base.defaults.toast("优惠券已失效");
            return false;
          }
          this.privilegeLink = res.link;
          this.setClipboardDataStr =  `${this.detail.jd_title || this.detail.goods_name || this.detail.short_name}\n原价：${this.detail.goods_price}元\n券额：${this.detail.discount_price}元\n券后价：${this.detail.coupon_price || this.detail.lowest_price}元\n${this.detail.link_content||this.detail.goods_content}\n领券购买链接： ${res.link}`;
          // #ifdef H5
          location.href = res.result.data.data.couponClickUrl;
          // #endif
          // #ifdef MP
          this.jumpJdMiniProgram(res.link);
          // #endif
        })
        .catch((err) => {
          uni.hideLoading();
          this.$base.defaults.toast("优惠券已失效");
          
        });
    },
    /**
     * 跳转京东小程序
     * @Author: wkiwi
     * @function: jumpJdMiniProgram
     * @param {String} link 优惠券链接
     */
    jumpJdMiniProgram(link) {
      let e = encodeURIComponent(link); //必须转码
      uni.navigateToMiniProgram({
        appId: "wx91d27dbf599dff74",
        path: `/pages/union/proxy/proxy?spreadUrl=${e}&appid=wx2afea6afe2d23263`, //XXXXXX为自己小程序的apppid，应该是官方小程序统计跳转来源的，选填
        success(res) {},
      });
    },
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
    imageUrl = this.detail.img_list[0] ||"screenshot";
    path = `/pages/subPackages/jd/index`;
    return this.$base.methods.shareContent(title, path, imageUrl, openUserName);
  },
};
</script>

<style scoped lang="scss">
.goods-swiper {
  width: 100%;
  height: 750upx;
  .swiper-img {
    width: 100%;
    height: 750upx;
  }
}
.parameter-value {
  max-width: 400upx;
}
.imgs-detail {
  width: 100%;
  .img {
    min-height: 50upx;
    width: 100%;
  }
}
.footer {
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
  width: 100%;
  .kiwi-btn {
    // width: 180upx;
    height: 64upx;
    line-height: 64upx;
  }
}
.line-through {
  text-decoration: line-through;
}

.coupon-info {
  width: 90%;
  height: 120upx;
  .get-coupon {
    height: 100%;
    line-height: 60upx;
    padding: 0 10upx 0 40upx;
    border-left: 1px dotted rgba(255, 255, 255, 0.6);
  }
}
.footer-margin{
  height: calc(100upx + env(safe-area-inset-bottom) / 2);
}
</style>
