/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:09:01
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-24 18:28:48
 */
import ApiService from "../../services/api.service";

// action types
const TYPES = {
  SET_ERROR: "SET_ERROR", // 错误
  SET_THEME: "SET_THEME", // 设置皮肤
  SET_IPHONE11: "SET_IPHONE11", //设置是否苹果11或ihoneX,含有虚拟home 键
  SET_NETWORK: "SET_NETWORK", //设置网络状态
  SET_PHONE_INFO: "SET_PHONE_INFO", //设置手机信息
  SET_ADD_LOTTERY_OPEN: "SET_ADD_LOTTERY_OPEN", //设置添加抽奖页面是否打开过
};

// initial state
const state = {
  theme: null,
  isIphoneX: false, //是否为iphoneX
  networkType: "wifi", //设备网络类型   wifi:wifi 网络;	2g	2g 网络;	3g	3g 网络;4g	4g 网络;unknown	Android 下不常见的网络类型;none	无网络;
  isConnected: true, //设备网络状态 Boolean  true:有网;false:已断网
  upx: 1, //upx单位
  windowWidth: 460, //屏幕可视宽度
  windowHeight: 912, //屏幕可视高度
  screenHeight: 736, //屏幕总高度
};

// getters
const getters = {
  getTheme(state) {
    return state.theme;
  },
  getIsConnected(state) {
    return state.isConnected;
  },
};

// actions
const actions = {
  // 获取当前主题
  async changeTheme({ commit }, theme) {
    await ApiService.get("app/theme")
      .then((res) => {
        commit(TYPES.SET_THEME, res.data.theme);
      })
      .catch((error) => {
        commit(TYPES.SET_ERROR, error.message);
      });
  },
  // 设置设备网络信息
  setNetWork({ commit }, data) {
    commit(TYPES.SET_NETWORK, data);
  },
  //设置手机系统信息
  setPhoneInfo({ commit }, info) {
    commit(TYPES.SET_PHONE_INFO, info);
  },
};

// mutations
const mutations = {
  [TYPES.SET_ERROR](state, error) {
    state.errors = error;
  },
  [TYPES.SET_THEME](state, theme) {
    state.theme = theme;
  },
  [TYPES.SET_IPHONE11](state, type) {
    state.isIphoneX = type;
  },
  [TYPES.SET_NETWORK](state, data) {
    state.networkType = data.networkType;
    state.isConnected = data.isConnected;
  },
  [TYPES.SET_PHONE_INFO](state, info) {
    state.upx = info.upx; //upx单位
    state.windowWidth = info.windowWidth; //屏幕宽度
    state.windowHeight = info.windowHeight; //屏幕高度
    state.screenHeight = info.screenHeight; //屏幕总高度
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
