<template>
  <view class="page">
    <view class="search-wrapper flex align-center justify-between padding-30 relative">
      <input
        class="search text-28 padding-left-30 padding-right-30 text-black"
        v-model="word"
        type="text"
      />
      <button class="round bg-gradual-orange margin-left-30 text-28" @click="searchBtn">搜索</button>
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
            console.log(newValue);
            this.searchSuggestion(newValue); //获取搜索提示
          },
          fail: () => {
            console.log("截流拦截搜索");
          }
        });
      } else {
        this.searchSuggestionArr = "";
      }
    }
  },
  onLoad() {
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
      let _this = this;
      uniCloud
        .callFunction({
          name: "search_suggestion",
          data: {
            keyWords: keyWords
          }
        })
        .then(res => {
          _this.searchSuggestionArr = res.result.data.data.slice(0, 11);
        });
    },
    gethotWords() {
      //获取热门搜索关键词
      let _this = this;
      uniCloud
        .callFunction({
          name: "search_top100"
        })
        .then(res => {
          _this.hotWords = res.result.data.data.hotWords.slice(0, 21);
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
        url: `/pages/subPackages/search/search_list?keyWord=${keyWord}`
      });
    },
    clickKeyWord(keyWord) {
      this.addSearchHistory(keyWord);
      keyWord = encodeURIComponent(keyWord);
      uni.navigateTo({
        url: `/pages/subPackages/search/search_list?keyWord=${keyWord}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.search-wrapper {
  .search {
    height: 70upx;
    line-height: 70upx;
    flex: 1;
    border-radius: 50upx;
    background: rgba(0, 0, 0, 0.15);
  }
  .search-btn {
    flex: 0 0 100upx;
    width: 100upx;
    height: 60upx;
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
