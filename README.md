## 介绍

这不仅仅是一个面向于淘客的APP，只是基于淘客数据，真实的数据更加切合项目实战！
		
一个基础性商城，promise封装请求，mockServer本地，VueX模块管理数据，BUS传值，mixin混入，各种实用组件，图片懒加载，mixin混入列表加载分页，滑动scroll-tabs,左右联动分类数据接入
		
淘宝优惠券整体使用uniCloud来完成，后续有时间拓展后台用户管理，购物车云端数据存储，持续更新中....
淘宝优惠券使用大淘客API接口（http://www.dataoke.com/）

京东优惠券，前端Promise封装uni.request,京东优惠券板块属于分包的独立板块
京东优惠券使用京推推API接口（http://www.jingtuitui.com/）


# bus 传值

```
  //使用方式
  Vue.use(Bus)
  this.$bus('eventName', id);

  bus: {
   eventName(id) {
     console.log(id);
   }
  }

```

## 状态管理

```

 this.$store.dispatch("auth/login"); //调用vueX登陆


```

## 项目目录

```
.
├── App.Vue                         # 主应用组件
├── pages.json                      # 页面路由配置
├── manifest.json                   # uni配置页
├── main.js                         # 入口文件
├── package.json                    # 引入第三方npm包
├── common                          # 公共 方法 工具等
│   └── utils                       # 公共 工具
│   └── http-client                 # 公共 请求方法
│   └── ...
├── components                      # 公共 UI 组件
│   └── ...
├── config                          # 公共 设置
│   └── api.config                  # 公共 接口设置
│   └── app.config                  # 公共 url 平台 等设置
│   └── ...
├── pages                           # 页面
│   ├── index                        # 首页示例模板
│   ├── mine                        # 我的示例模板
│   └── ...
├── plugins                         # 第三方工具
│   └── ...
├── services                        # 服务端
│   └── api-clinet                  # 接口请求拦截
│   └── api.service                 # 接口封装
│   └── auth.service                # 登陆本地缓存操作
│   └── ...
├── static                          # 静态资源
│   └── tab                         # tab栏图片
│   └── ...
├── store                           # 状态管理
│   └── modules
│       └── app                     # 应用级别状态
│       └── auth                    # 登陆级别状态
│   └── ...
├── styles                          # 样式管理
│   └── aliicon                     # 字体icon
│   └── animation                   # 动画样式
│   └── base                        # 基础公共样式
│   └── border                      # 1px边框
│   └── ...
├── cloudfunctions-aliyun           # 云服务模块
├── mock-server                     # 模拟数据接口
└── yarn.lock
```

## 规范

### 组件

所有组件放置 components 文件夹下且采用“ - ”连接

### 页面

所有页面放置 pages 文件夹下分包除外且采用“ \_ ”连接

### 素材

所有纯色图标采用阿里 icon

### 切片

文件应该遵循的命名规则：
全部小写字母
单词之间使用下划线（\_）连接
不使用缩写作为名称

名称 前缀
Icon ic*
MenuIcon ic_menu*
TabBarIcon ic*tab*
Button btn*
RadioButton btn_radio*
CheckBox btn*check*
Switch btn*switch*
Toggle btn*toggle*

例如
ic_launcher.png
ic_menu_share.png
ic_menu_back.png
ic_menu_settings.png
ic_tab_home.png
ic_tab_mine.png

### 效果预览
H5预览
![Image text](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-mall/b5b55c90-bcd1-11ea-8ff1-d5dcf8779628.png)

淘宝页面预览

| 页面   | 图片                                                                                                         | 页面     | 图片                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| 首页   | ![首页](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-mall/707dc090-bb87-11ea-a30b-e311646dfaf2.jpeg "首页") | 搜索     | ![搜索](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-mall/708847e0-bb87-11ea-8bd0-2998ac5bbf7e.jpeg "搜索")         |
| 9 块 9 | ![9块9](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-mall/7095b560-bb87-11ea-a30b-e311646dfaf2.jpeg "9块9") | 超级分类 | ![超级分类](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-base-mall/7091bdc0-bb87-11ea-a30b-e311646dfaf2.jpeg "超级分类") |

京东页面预览

| 页面   | 图片                                                                                                         | 页面     | 图片                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| 首页   | ![首页](https://github.com/Lemon-whales/base-mall/blob/master/preview/jd/index.jpeg?raw=true "首页") | 搜索     | ![搜索](https://github.com/Lemon-whales/base-mall/blob/master/preview/jd/search.jpeg?raw=true "搜索")         |
| 详情页 | ![详情页](https://github.com/Lemon-whales/base-mall/blob/master/preview/jd/detail.png?raw=true "详情页") | 活动页 | ![活动页](https://github.com/Lemon-whales/base-mall/blob/master/preview/jd/activity.jpeg?raw=true "活动页") |


# 使用教程

1.使用 HBuilderX 倒入事例项目 2.上传 cloudfunctions-aliyun 下 common 下的公共模块，再选择上传所有云函数 3.manifest 点击获取应用标识。运行到微信小程序，商品详情页调用淘宝接口 H5 存在被禁用问题
