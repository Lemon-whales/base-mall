/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-27 11:01:00
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 11:50:21
 */

// import "@/common/ald/ald-stat"; //阿拉丁
import Vue from "vue";
import App from "./App";
import store from "./store";
import ApiClinet from "./services/api-clinet";
import { VueBus } from "./plugins/vue-bus";
import AppConfig from "./config/app.config";
import { Base } from "./common/utils/base";
import debounce from "./common/utils/debounce.js";
Vue.config.productionTip = false;
// 全局事件中心
Vue.use(VueBus);

// 状态, 全局挂载
Vue.prototype.$store = store;
// Ajax请求, 全局挂载
Vue.prototype.$http = ApiClinet;
Vue.prototype.$imgUrl = AppConfig.IMG_URL;
Vue.prototype.$appVersion = AppConfig.APP_VERSION;
Vue.prototype.$debounce = debounce;

//底部加载更多组件
import loadMore from "./components/load-more.vue";
Vue.component("load-more", loadMore);

Vue.prototype.$base = new Base();
App.mpType = "app";

// 引入基础mixin封装
let baseMixin = require("@/mixins/base.js");
Vue.mixin(baseMixin);

const app = new Vue({
  store,
  ...App,
});
app.$mount();
