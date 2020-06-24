/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:09:01
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-15 19:03:50
 */
import { UserService } from "../../services/api.service";
import AuthService from "../../services/auth.service";

// action types
const TYPES = {
  SET_ERROR: "SET_ERROR", // 错误
  SET_AUTH: "SET_AUTH", // 用户认证信息
  CLEAR_AUTH: "CLEAR_AUTH", // 清除认证信息
  SET_TOKEN: "SET_TOKEN", //token
  UPDATE_AUTH: "UPDATE_AUTH", //更新用户信息
};

// initial state
const state = {
  isAuthenticated: false, //是否通过登陆认证
  user: {}, //用户信息
  errors: null,
  token: "",
};

// getters
const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

// actions
const actions = {
  // 用户登录
  login({ commit }, user = {}) {
    return new Promise((resolve, reject) => {
      UserService.login(user)
        .then((data) => {
          if (data.data.code == 200) {
            commit(TYPES.SET_TOKEN, data.data.data.token);
            commit(TYPES.SET_AUTH, data.data.data.userInfo);
            resolve(data);
          } else {
            commit(TYPES.SET_ERROR, `${data.data.message}`);
            reject("${data.data.message}");
          }
        })
        .catch((res) => {
          commit(TYPES.SET_ERROR, `${res.data.message}`);
          reject(res);
        });
    });
  },
  // 注销
  logout({ commit }) {
    commit(TYPES.CLEAR_AUTH);
  },
  // 注册
  async signup({ commit }, user = {}) {
    await UserService.signup(user)
      .then((res) => {
        commit(TYPES.SET_AUTH, res.data);
      })
      .catch((error) => {
        commit(TYPES.SET_ERROR, error.message);
      });
  },

  // 验证Token是否有效
  async check_auth({ commit }) {
    if (Object.keys(AuthService.get()).length == 0) {
      commit(TYPES.CLEAR_AUTH);
    } else {
      try {
        const user = await AuthService.get();
        if (user.token) {
          commit(TYPES.SET_AUTH, user);
        }
      } catch (e) {
        commit(TYPES.SET_ERROR, "Token认证失效~");
      }
    }
  },
  //更新用户信息
  updata_auth({ commit }, user = {}) {
    commit(TYPES.UPDATE_AUTH, user);
  },
};

// mutations
const mutations = {
  [TYPES.SET_TOKEN](state, token) {
    state.token = token;
    AuthService.setToken(token);
  },
  [TYPES.SET_ERROR](state, error) {
    state.errors = error;
  },
  [TYPES.SET_AUTH](state, user) {
    state.isAuthenticated = true;
    state.user = user;
    state.errors = {};
    AuthService.set(state.user);
  },
  [TYPES.UPDATE_AUTH](state, user) {
    state.user = user;
    state.errors = {};
    AuthService.set(state.user);
  },
  [TYPES.CLEAR_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    state.errors = {};
    AuthService.logout();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
