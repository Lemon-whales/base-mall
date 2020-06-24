<template>
  <view
    class="lazy-image-comp image-container-class"
    :style="imgErr ? 'background-image:url(' + errorImage + ')' : placeholder ? 'background-image:url(' + placeholder + ')' : 'background-color:#eee'"
  >
    <image
      :class="showed && !imgErr ? 'show' : ''"
      :style="styles"
      class="final-image image-class"
      :src="showed ? src : placeholder"
      :mode="mode"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="imgLoad"
      @error="imgError"
    />
  </view>
</template>

<script>
export default {
  props: {
    distance: {
      //安全距离，距离多少开始预加载
      type: Number,
      default: 0
    },
    src: {
      //实际图片链接
      type: String,
      default: ""
    },
    placeholder: {
      //占位图图片链接
      type: String,
      default: "https://img-blog.csdnimg.cn/20200116204315833.png"
    },
    mode: {
      //图片显示模型
      type: String,
      default: "aspectFill"
    },
    webp: {
      type: Boolean,
      default: false
    },
    showMenuByLongpress: {
      //是否长按显示菜单
      type: Boolean,
      default: true
    },
    styles: {
      //自定义样式
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  name: "lazy-image",
  data() {
    return {
      showed: false,
      errorImage: "https://img-blog.csdnimg.cn/20200116204315833.png", //加载失败的占位图
      imgErr: false //图片是否加载失败
    };
  },
  watch: {
    src: function(val, oldval) {
      if (oldval && this.showed && val != oldval) {
        //重新建立懒加载监听 解决分类列表tab切换新数据失去懒加载效果
        this.showed = false;
        this.createIntersectionObserver();
      }
    }
  },
  mounted: function() {
    this.createIntersectionObserver();
  },
  methods: {
    createIntersectionObserver() {
      this.$nextTick(() => {
        this._observer = uni.createIntersectionObserver(this);
        this._observer
          .relativeToViewport({
            top: this.distance,
            bottom: this.distance
          })
          .observe(".lazy-image-comp", res => {
            if (res.intersectionRatio > 0 && !this.showed) {
              this.showed = true;
            }
            this._observer.disconnect(); //停止监听
          });
      });
    },
    imgError: function(e) {
      //图片下载失败
      this.imgErr = true;
    },
    imgLoad: function(e) {
      //图片下载成功
      // console.log('下载成功')
    }
  },
  destroyed: function() {
    if (this._observer) {
      this._observer.disconnect(); //停止监听
    }
  }
};
</script>

<style scoped lang="scss">
.lazy-image-comp {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #eeeeee;
  background-origin: content; /*从content区域开始显示背景*/
  background-position: 50% 50%; /*图片上下左右居中*/
  background-repeat: no-repeat; /*图像不重复显示*/
  background-size: contain; /*保持图像本身的宽高比例，将图片缩放到宽度或高度正好适应定义背景的区域*/
  .image-class {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .final-image {
    opacity: 0;
    transition: opacity 0.5s;
    &.show {
      opacity: 1;
    }
  }
}
</style>
