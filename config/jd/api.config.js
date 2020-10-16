/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:51
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-13 20:28:55
 */
import AppConfig from "./app.config";

const { BASE_URL } = AppConfig;

export default {
  BASE_URL,
  //基础API
  APP_BASE_API: {
    GOODS_LIST: `${BASE_URL}/get_goods_list`, //商品列表
    GOODS_INFO: `${BASE_URL}/get_goods_info`, //商品基础信息
    GOODS_DETAIL: `${BASE_URL}/get_ware_style`, //商品详情页
    COUPOM_INFO: `${BASE_URL}/get_coupom_info`, //优惠券信息
    GOODS_UPDATE: `${BASE_URL}/get_goods_update`, //商品更新
  },
  //搜索API
  APP_SEARCH_API: {
    GOODS_QUERY: `${BASE_URL}/jd_goods_query`, //联盟搜索
    ASSOC_WORD: `${BASE_URL}/assoc_word`, //联想词
    HOT_SEARCH: `${BASE_URL}/hot_search`, //热门搜索
  },
  //链接转换API
  APP_TRANSFORM_API:{
    GOODS_LINK: `${BASE_URL}/get_goods_link`, //高效转链
    UNIVERSAL: `${BASE_URL}/universal`, //智能转链
    RELATED_DOODS: `${BASE_URL}/related_goods`, //相似商品推荐
    SUPER_CATEGORY: `${BASE_URL}/get_super_category`, //超级分类
  },
  //各种活动API
  APP_ACTIVITY_API: {
    BANNER: `${BASE_URL}/get_banner`, //首焦banner
    PRICE9: `${BASE_URL}/get_price_9_9`, //“9块9”专场
    SUBSIDY_GOODS: `${BASE_URL}/subsidy_goods`, //奖励商品
    TODAY_TOP: `${BASE_URL}/today_top`, //各大榜单
    SIFT_GOODS_LIST: `${BASE_URL}/get_goods_list_sift`, //精选好货
    BRAND_GOODS_LIST: `${BASE_URL}/get_brand_list`, //品牌库
    SELF_OPERATED: `${BASE_URL}/jd_self_operated`, //京东自营
    SEKILL: `${BASE_URL}/sekill`, //京东秒杀
    PIN_BUY: `${BASE_URL}/jd_pin_buy`, //京东拼购 
    COLLAGE_GOODS_LIST: `${BASE_URL}/get_goods_list_collage`, //京东配送商品
  },
};

