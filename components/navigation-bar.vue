<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-13 15:08:03
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-14 17:35:28
-->
<template>
  <view class="navigation-bar " :class="theme" :style="[{background:navigationBackground}]">
    <view
      class="status-bar"
      :style="[{ height: statusBarHeight + 'px' }]"
    ></view>
    <view class="navigation flex justify-start align-end" :style="[{height:CustomBar-statusBarHeight+'px'}]">
      <view
      :style="[{height:Custom.height+'px'}]"  
        class="action flex align-center border-custom justify-center padding-left-10 padding-right-10"
      >
        <text class="iconfont ic_you icon back" @click="back"></text>
        <text class="iconfont ic_home icon" @click="home"></text>
      </view>
      <slot name="title">
        <view class="navigation-title text-30 text-center text-cut"  :style="[{height:Custom.height+'px',lineHeight:Custom.height+'px',color:navigationTitleColor}]">{{
          navigationTitle
        }}</view>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight:this.StatusBar,//状态栏高度
      customBar:this.CustomBar,//自定义navigate高度
      Custom:this.Custom//胶囊信息
    };
  },
  props: {
    theme:{
      type:String,
      default:'white'//主题是白色还是黑色，更具page.json而定black
    },
    navigationTitle: {
      type: String,
      default: "",
    },
    navigationTitleColor: {
      type: String,
      default: "#333",
    },
    navigationBackground:{
      type: String,
      default: "transparent",
    }
  },
  methods:{
    home() {
      uni.switchTab({
          url: '/pages/index/index'
      });
    },
    back(){
      uni.navigateBack({
        delta: 1
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.navigation-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; 
  z-index: 9;
  transition: all 0.3s;
  &.white{
    .navigation{
      color:#fff;
      .action{
        border:1px solid rgba(255,255,255,0.25);
        background: rgba(0, 0, 0, 0.15);
        &::after{
          border: 1px solid rgba(255,255,255,0.7);
        }
      }
    }
  }
  &.black{
    .navigation{
      color:#000;
      .action{
        background: rgba(255, 255, 255, 0.75);
        border: 1px solid rgba(0, 0, 0, 0.05);
        &::after{
          border: 1px solid  rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
  .navigation {
    height: 80upx;
    padding-left: 20upx;
    color: #333;
    padding-bottom: 5upx;
    .action {
      width: 180upx;
      height: 60upx;
      &.single {
        width: 80upx;
        height: 60upx;
      }
      .icon {
        width: 80upx;
        height: 60upx;
        text-align: center;
        line-height: 66upx;
        font-size: 36upx;
      }
			.back{
				transform:rotate(180deg);
			}
    }
    .navigation-title {
      width: 100%;
      margin-left: 10upx;
      margin-right: 210upx;
    }
    .border-custom {
      position: relative;
      border-radius: 1000upx;
      font-size: 48upx;
    }

    .border-custom::after {
      content: " ";
      width: 200%;
      height: 200%;
      position: absolute;
      top: 50;
      left: 50%;
      transform: translate(-50%,-50%);
      border-radius: inherit;
      transform: scale(0.5);
      pointer-events: none;
      box-sizing: border-box;
      width: 1px;
      height:100%;
    }
  }
}
</style>