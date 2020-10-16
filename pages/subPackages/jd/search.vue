<!--
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2020-10-13 17:47:05
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 09:59:45
-->
<template>
  <view class="page">
    <view class="search-wrapper flex align-center justify-between padding-30 relative">
      <input
        class="search text-28 padding-left-30 padding-right-30 text-black"
        v-model="word"
        placeholder="请输入您要搜索的商品名称"
        type="text"
      />
      <button class="round bg-gradual-green margin-left-30 text-28 search-btn" @click="searchBtn">搜索</button>
      <view class="search-suggestion padding-30 fadeIn" v-if="searchSuggestionArr.length>0">
        <view class="wrapper bg-white padding-20 shadow">
          <view
            class="border-bottom item text-cut text-gray text-26"
            v-for="(item,index) of searchSuggestionArr"
            :key="index"
            @click="clickSearchSuggestion(item.kw)"
          >{{item.kw}}</view>
        </view>
      </view>
    </view>
    <block v-if="hotWords.length > 0">
      <view class="title text-30 text-black padding-30">大家都在搜</view>
      <view class="hot-words flex align-start flex-wrap justify-start padding-left-30">
        <view
          v-for="(item, index) of hotWords"
          @click="clickKeyWord(item)"
          :key="index"
          class="text-24 margin-right-30 margin-bottom-20 word bg-gray text-white padding-top-10 padding-bottom-10 padding-left-20 padding-right-20 round"
        >{{ item }}</view>
      </view>
    </block>
    <block v-if="searchHistory.length > 0">
      <view class="flex align-center justify-between padding-30">
        <view class="title text-30 text-black">搜索记录</view>
        <view class="clear text-gray text-30" @click="clear">清除</view>
      </view>
      <view class="hot-words flex align-start flex-wrap justify-start padding-left-30">
        <view
          v-for="(item, index) of searchHistory"
          @click="clickKeyWord(item)"
          :key="index"
          class="text-24 margin-right-30 margin-bottom-20 word bg-gray text-white padding-top-10 padding-bottom-10 padding-left-20 padding-right-20 round"
        >{{ item }}</view>
      </view>
    </block>
  </view>
</template>

<script>
import { SearchService } from "@/services/jd/api.service";
export default {
  data() {
    return {
      hotWords: [], //关键字数组
      word: "", //当前要搜索的关键词
      searchHistory: [], //搜索记录
      searchSuggestionArr: [] //搜索提示数组
    };
  },
  watch: {
    word: function(newValue, oldValue) {
      if (newValue) {
        this.$debounce.canDoFunction({
          time: 500,
          immediate: true,
          key: "searchSuggestion",
          success: () => {
            this.searchSuggestion(newValue); //获取搜索提示
          },
          fail: () => {
            // console.log("截流拦截搜索");
          }
        });
      } else {
        this.searchSuggestionArr = "";
      }
    }
  },
  onLoad() {
    uni.getClipboardData({
      success:res=> {
        if(res.data){
          let str = res.data
          uni.showModal({
              title: '温馨提示',
              content: `您是否要搜索商品【${str}】？`,
              success:res=> {
                if (res.confirm) {
                  this.clickKeyWord(str)
                } 
              }
          });
        }
      }
    });
    this.gethotWords();
    this.getSearchHistory();
  },
  methods: {
    clickSearchSuggestion(keyWords) {
      this.searchSuggestionArr = [];
      this.clickKeyWord(keyWords);
    },
    searchSuggestion(keyWords) {
      //搜索提示
        SearchService.assocWord({
          word:keyWords
        }).then((res) => {
          this.searchSuggestionArr = res
      });
    },
    gethotWords() {
      //获取热门搜索关键词
      SearchService.hotSearch({}).then((res) => {
        this.hotWords = res.hotWords.splice(0,21)
      });
    },
    addSearchHistory(keyWord) {
      //添加搜索词语到本地缓存
      let searchHistory = this.searchHistory;
      if (searchHistory.indexOf(keyWord) == -1) {
        searchHistory.unshift(keyWord);
        if (searchHistory.length > 20) {
          //大于20 删除末尾的词
          searchHistory.pop();
        }
        this.searchHistory = searchHistory;
      } else {
        searchHistory = this.searchHistory;
        searchHistory.splice(searchHistory.indexOf(keyWord), 1); //先删除搜索记录内的元素
        searchHistory.unshift(keyWord);
        this.searchHistory = searchHistory;
      }
      try {
        uni.setStorageSync("searchHistory", searchHistory);
      } catch (e) {
        // error
      }
    },
    getSearchHistory() {
      //获取本地搜索记录缓存
      try {
        const value = uni.getStorageSync("searchHistory");
        if (value) {
          this.searchHistory = value;
        }
      } catch (e) {
        // error
      }
    },
    clear() {
      // 清空搜索记录缓存
      this.searchHistory = [];
      try {
        uni.removeStorageSync("searchHistory");
      } catch (e) {
        // error
      }
    },
    searchBtn() {
      //点击搜索按钮
      if (!this.word.trim()) {
        return false;
      }
      this.addSearchHistory(this.word);
      let keyWord = encodeURIComponent(this.word);
      uni.navigateTo({
        url: `./search_goods?keyWord=${keyWord}`
      });
    },
    clickKeyWord(keyWord) {
      this.addSearchHistory(keyWord);
      keyWord = encodeURIComponent(keyWord);
      uni.navigateTo({
        url: `./search_goods?keyWord=${keyWord}`
      });
    }
  },
  onShareAppMessage(e) {
    let title, path, imageUrl, openUserName;
    openUserName = false;
    title = "免费，超大额的京东内部优惠券，不领白不领！";
    imageUrl = "https://img-blog.csdnimg.cn/20201014210905440.png";
    path = `/pages/subPackages/jd/index`;
    return this.$base.methods.shareContent(title, path, imageUrl, openUserName);
  },
};
</script>

<style lang="scss" scoped>
.search-wrapper {
  .search {
    height: 70upx;
    line-height: 70upx;
    flex: 1;
    border-radius: 50upx;
    background: rgba(0, 0, 0, 0.1);
  }
  .search-btn {
    flex: 0 0 150upx;
    width: 150upx;
    height: 60upx;
    line-height: 60upx;
  }
}
.search-suggestion {
  position: absolute;
  left: 0;
  top: 100upx;
  width: 100%;
  .wrapper {
    .item {
      height: 70upx;
      line-height: 70upx;
      width: 100%;
      &:last-child {
        &::before {
          border: none;
        }
      }
    }
  }
}
</style>
