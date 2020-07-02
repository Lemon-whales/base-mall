<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-12-25 14:36:25
 * @LastEditors: wkiwi
 * @LastEditTime: 2019-12-26 14:01:15
 -->
 
<template>
  <view :data-scroll="scrollTop" :data-top="top" class="lazy-image-comp image-container-class" :style="imgErr?'background-image:url('+errorImage+')':placeholder?'background-image:url('+placeholder+')':'background-color:#eee'">
    <image  :class="showed&&!imgErr?'show':''" :style="styles" class="final-image image-class" :src="showed?src:placeholder" :mode="mode" :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress" @load="imgLoad" @error="imgError" />
  </view>
</template>

<script>
  export default {
    props: {
      scrollTop:{ //上划高度
        type: Number,
        default: 0
      },
      windowHeight:{//屏幕高度
        type: Number,
        default: 0
      },
      distance:{//安全距离，距离多少开始预加载
        type: Number,
        default: 0
      },
      destroy:{//是否上划一定距离销毁释放已下载的图片
        type: Boolean,
        default: false
      },
      src: {//实际图片链接
        type: String,
        default: ''
      },
      placeholder: {//占位图图片链接
        type: String,
        default: 'https://img-blog.csdnimg.cn/20200615195704660.png'
      },
      mode: {//图片显示模型
        type: String,
        default: 'aspectFill'
      },
      webp: {
        type: Boolean,
        default: false
      },
      showMenuByLongpress: {//是否长按显示菜单
        type: Boolean,
        default: false
      },
      styles: {//自定义样式
        type: String,
        default: ''
      },
    },
    name: 'lazy-img',
    data() {
      return {
        showed: false,
        errorImage: 'https://img-blog.csdnimg.cn/20200116204315833.png', //加载失败的占位图
        imgErr: false, //图片是否加载失败
        top:0,
        bottom:0,
      };
    },
    watch:{
      scrollTop:function(){
        this.switchImg()
      }
    },
    beforeCreate: function() {
    },
    created: function() {
    },
    beforeMount: function() {
    },
    mounted: function() {
      let _this = this
      _this.showed=false
      this.$nextTick(() => {
        this.calculateItemHeight()
      })
    },
    beforeDestroy:function(){
    },
    destroyed:function(){
    },
    methods: {
      calculateItemHeight:function(){
        let _this = this
        const query = uni.createSelectorQuery().in(this);
        query.select('.lazy-image-comp').boundingClientRect(data => {
          _this.top = data.top+_this.scrollTop
          _this.bottom = data.bottom + _this.scrollTop
          if(data.top<_this.windowHeight+_this.distance){//首屏自动加载
            _this.showed = true
          }
        }).exec();
      },
      switchImg:function(){//切换占位图与真实图片
        if(this.scrollTop>this.top-this.distance-this.windowHeight){
          if(!this.destroy){
            if(!this.showed){this.showed = true}
            return false;
          }
          if(this.destroy){//需要销毁
            if(this.scrollTop>this.bottom+this.windowHeight*2){//销毁上划一定距离的图片
              if(this.showed){this.showed = false}
            }else{
              if(!this.showed){this.showed = true}
            }
          }
        }
      },
      imgError: function(e) { //图片下载失败
        this.imgErr = true
      },
      imgLoad: function(e) { //图片下载成功
        // console.log('下载成功')
      },
    }
  }
</script>

<style scoped lang="scss">
  .lazy-image-comp{
    width:100%;
    height:100%;
		overflow: hidden;
    position:relative;
		background-color:#EEEEEE;
		background-origin:content; /*从content区域开始显示背景*/
    background-position:50% 50%; /*图片上下左右居中*/
		background-repeat:no-repeat; /*图像不重复显示*/
		background-size:contain; /*保持图像本身的宽高比例，将图片缩放到宽度或高度正好适应定义背景的区域*/
    .image-class{
      width:100%;
      height:100%;
			max-width: 100%;
			max-height: 100%;
    }
    .final-image{
      opacity:0;
      transition: opacity 0.5s;
      &.show{
        opacity:1;
				background: #fff;
      }
    }
  }

</style>
