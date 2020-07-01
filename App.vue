<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-23 19:12:40
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:50:37
--> 
<script>
import { mapState, mapActions } from "vuex";
import Vue from "vue";
export default {
  onLaunch: function() {
    let _this = this;
    _this.$store
      .dispatch("auth/login")
      .then(res => {})
      .catch(err => {}); //调用vueX登陆
		//#ifdef MP
    const updateManager = uni.getUpdateManager(); //开始检查小程序让用户小程序版本保持最新
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function(res) {
          uni.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            showCancel: false,
            success(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          });
        });
        updateManager.onUpdateFailed(function(res) {
          uni.showModal({
            title: "提示",
            content: "检查到有新版本，但下载失败，请检查网络设置",
            showCancel: false
          });
        });
      }
    });
		// #endif
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     **/
    uni.getNetworkType({
      success(res) {
        const networkType = res.networkType;
        let data = "";
        if (networkType === "none") {
          data = { networkType: "none", isConnected: false };
          wx.showToast({
            title: "当前无网络",
            icon: "loading",
            duration: 2000
          });
        } else {
          data = { networkType: networkType, isConnected: true };
        }
        _this.$store.dispatch("app/setNetWork", data); //调用vueX设置网络状态
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     **/
    uni.onNetworkStatusChange(function(res) {
      let data = { networkType: res.networkType, isConnected: res.isConnected };
      _this.$store.dispatch("app/setNetWork", data); //调用vueX设置网络状态
      if (!res.isConnected) {
        wx.showToast({
          title: "网络已断开",
          icon: "loading",
          duration: 2000,
          complete: function() {}
        });
      } else {
        wx.hideToast();
      }
    });
    uni.getSystemInfo({
      success: function(e) {
        let system = e.system;
        _this.$store.dispatch("app/setPhoneInfo", {
          upx: e.windowWidth / 750, //upx单位
          windowWidth: e.windowWidth, //屏幕宽度
          windowHeight: e.windowHeight, //屏幕高度
          screenHeight: e.screenHeight //屏幕总高度
        });
      }
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style>
/*每个页面公共css */
@import "./styles/base.css";
/*全局注入字体css */
@import "./styles/aliicon.css";
/*全局注入border.css */
@import "./styles/border.css";
/*全局注入border.css */
@import "./styles/common.css";
/*全局注入common.css */
@import "./styles/animation.css";
/*全局注入animation.css */
</style>
