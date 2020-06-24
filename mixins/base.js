/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-06-02 21:55:16
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-06-15 23:25:03
 */

//基础mixin
import { mapState, mapActions } from "vuex";

module.exports = {
  computed: {
    ...mapState("auth", {
      userinfo: (state) => state.user,
    }),
  },
  onShareAppMessage() {
    let title, path, imageUrl, openUserName;
    return this.$base.methods.shareContent(title, path, imageUrl, openUserName);
  },
};
