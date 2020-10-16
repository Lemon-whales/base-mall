/*
 * @Author: wkiwi
 * @Email: w_kiwi@163.com
 * @Date: 2019-10-15 14:10:38
 * @LastEditors: wkiwi
 * @LastEditTime: 2020-10-15 10:13:14
 */
import ApiClinet from "./api-clinet.js";
import ApiConfig from "@/config/jd/api.config";
import appConfig from '@/config/jd/app.config';
const ApiService = {
  get(url, data, options) {
    return ApiClinet.get(url, data, options);
  },
  post(url, data, options) {
    return ApiClinet.post(url, data, options);
  },
  put(url, data, options) {
    return ApiClinet.put(url, data, options);
  },
  delete(url, data, options) {
    return ApiClinet.delete(url, data, options);
  },
};

export default ApiService;

const HeaderTypr = {
  header: {
    Accept: "*/*",
    "Content-Type": "multipart/form-data; charset=utf-8"
  },
};

//活动服务
export const ActivityService = {
  getBanner(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.BANNER, params); //benner
  },
  getPrice(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.PRICE9, params); //9块9
  },
  subsidyGoods(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.SUBSIDY_GOODS, params); //奖励商品
  },
  todayTop(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.TODAY_TOP, params); //各大榜单
  },
  siftGoodsList(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.SIFT_GOODS_LIST, params); //精选好货
  },
  brandGoodsList(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.BRAND_GOODS_LIST, params); //品牌库  
  },
  selfOperated(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.SELF_OPERATED, params); //京东自营
  },
  pinBuy(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.PIN_BUY, params); //京东拼购
  },
  collageGoodsList(params) {
    return ApiClinet.post(ApiConfig.APP_ACTIVITY_API.COLLAGE_GOODS_LIST, params); //京东配送商品
  },  
  activity(params){   //(9块9/奖励商品/精选好货/京东自营/京东拼购/京东配送商品)       除去   各大榜单、品牌库  
    return this[params.activityScence](params) 
  }
};
//基础服务
export const BaseService = {
  getGoodsList(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.GOODS_LIST, params); //商品列表
  },
  getGoodsInfo(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.GOODS_INFO, params); //商品基本信息
  },
  getGoodsDetail(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.GOODS_DETAIL, params); //商品详情
  },
  getCoupomInfo(params) {
    return ApiClinet.post(ApiConfig.APP_BASE_API.COUPOM_INFO, params); //优惠券信息
  },
  
};

//搜索服务
export const SearchService = {
  hotSearch(params) {
    return ApiClinet.post(ApiConfig.APP_SEARCH_API.HOT_SEARCH, params); //热搜榜单
  },
  goodsQuery(params) {
    return ApiClinet.post(ApiConfig.APP_SEARCH_API.GOODS_QUERY, params); //商品搜索
  },
  assocWord(params) {
    return ApiClinet.post(ApiConfig.APP_SEARCH_API.ASSOC_WORD, params); //联想词语
  },
};


export const TransformService = {
  goodsLink(params) {
    params.unionid = appConfig.LM_ID
    params.positionid = appConfig.TGW_ID
    return ApiClinet.post(ApiConfig.APP_TRANSFORM_API.GOODS_LINK, params); //高效转链
  },
  universal(params) {
    return ApiClinet.post(ApiConfig.APP_TRANSFORM_API.UNIVERSAL, params); //智能转链
  },
  relatedGoods(params) {
    return ApiClinet.post(ApiConfig.APP_TRANSFORM_API.RELATED_DOODS, params); //相似商品推荐
  },
};





