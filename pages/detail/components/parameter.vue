<template>
  <view>
    <view class="bg-mask" @click.stop="close"></view>
    <view class="parameter text-28 animate-slide-up">
      <view class="title text-center text-black text-32">产品参数</view>
      <scroll-view scroll-y class="scroll-view">
        <view class="parameter-wrapper">
          <view
            v-for="(it, index) in itemProperties"
            :key="index"
            class="item border-bottom padding-top-10 padding-bottom-10"
          >
            <block v-for="(val, key, i) of it" :key="i">
              <view class="name padding-right-20 text-black">{{ key }} :</view>
              <view class="value text-26 text-gray padding-left-10">{{ val }}</view>
            </block>
          </view>
        </view>
      </scroll-view>
      <view class="close-box bg-white">
        <view class="close text-30" @click.stop="close">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "parameter",
  props: {
    itemProperties: {
      type: Array
    },
    listShow: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("hideProperties", false);
    }
  }
};
</script>

<style scoped lang="scss">
.parameter {
  position: fixed;
  top: 400upx;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  border-top-left-radius: 30upx;
  border-top-right-radius: 30upx;
}
.parameter-wrapper {
  padding: 20upx 30upx 130upx 30upx;
  margin-bottom: constant(safe-area-inset-bottom); /*兼容iphone底部虚拟键*/
  margin-bottom: env(safe-area-inset-bottom);
}
.title {
  line-height: 100upx;
}
.scroll-view {
  height: calc(100% - 100upx);
}
.item {
  line-height: 60upx;
  padding-right: 25upx;
  padding-left: 25upx;
  &:last-child {
    &::before {
      border: none;
    }
  }
}
.name {
  display: inline;
}
.value {
  display: inline;
}
.close-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom); /*兼容iphone底部虚拟键*/
  padding-bottom: env(safe-area-inset-bottom);
}
.close {
  margin: 10upx 30upx;
  border-radius: 50upx;
  height: 80upx;
  background: linear-gradient(to right, #ff8300, #ff5100);
  color: #fff;
  text-align: center;
  line-height: 80upx;
}
</style>
