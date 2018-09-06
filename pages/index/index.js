//index.js
//获取应用实例
const app = getApp();
import $article from '../../request/article.js';
import $item from '../../request/item.js';
import $itemgroupon from '../../request/itemgroupon.js';
import $coupon from '../../request/coupon.js';
import $category from "../../request/category.js";
import $membercoupon from "../../request/membercoupon.js";
import $swiper from "../../request/swiper.js";
import $indexcategory from "../../request/indexcategory.js";
import $itemrecommend from "../../request/itemrecommend.js";
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
Page({
  data: {
    swiperList: [],
    registerShowModal: wx.getStorageSync('registerBol'),
    windowHeight: app.globalData.windowHeight,
    tabActiveIndex: 1,
    sellerInfo: {
      works: [
        {
          image: appImageUrl + "works1.png",
        }, {
          image: appImageUrl + "works2.png",
        }, {
          image: appImageUrl + "works3.png",
        }, {
          image: appImageUrl + "works4.png",
        }
      ],
      store: [
        {
          image: appImageUrl + "store1.jpg"
        },
        {
          image: appImageUrl + "store2.jpg"
        }
      ],
      prize: [
        {
          image: appImageUrl + "prize1.png"
        }, {
          image: appImageUrl + "prize2.png"
        }, {
          image: appImageUrl + "prize3.png"
        }, {
          image: appImageUrl + "prize4.jpg"
        }, {
          image: appImageUrl + "prize5.jpg"
        }, {
          image: appImageUrl + "prize6.jpg"
        }
      ],
      praise: [
        {
          image: appImageUrl + "praise1.jpg"
        }, {
          image: appImageUrl + "praise2.jpg"
        }, {
          image: appImageUrl + "praise3.jpg"
        }, {
          image: appImageUrl + "praise4.jpg"
        }, {
          image: appImageUrl + "praise5.jpg"
        }, {
          image: appImageUrl + "praise6.jpg"
        }, {
          image: appImageUrl + "praise7.jpg"
        }, {
          image: appImageUrl + "praise8.jpg"
        }, {
          image: appImageUrl + "praise9.jpg"
        }
      ],
    },
    hotIcon: "/static/images/index/hot_iocn.png",
    hotInfo: [],
    rushImg: appImageUrl + "the_women101.png",
    collageBgImg: appImageUrl + "spell_ group_hui.png",
    barginBindIcon: "/static/images/index/to_bargain_iocn.png",
    barginBgImg: appImageUrl + "bargain_price_bg.png",
    experienceBgImg: appImageUrl + "free_experience_image.png",
    welfareBgImg: appImageUrl + "wednesday_welfare.png",
    welfareItemIcon: "/static/images/index/wednesday_welfare_image2.png",
    welfarePriceIcon: "/static/images/index/wednesday_welfare_image3.png",
    vipInfo: {},
    collageItems: [],
    barginItems: [],
    rushId: '',
    experienceId: '',
    welfareItems: {},
    recommendInfo: {}
  },
  onLoad() {
    let self = this;
    self.getData();
  },
  onShow() {
    let self = this;
    if (wx.getStorageSync('registerBol')) {
      self.setData({
        registerShowModal: true
      })
      self.getCard();
    }
  },
  // 新注册用户弹出卡卷列表
  getCard() {
    let self = this;
    let data = {
      openid: app.globalData.openid
    }
    console.log('data', data);
    $membercoupon.add(data).then(res => {
      wx.setStorageSync('registerBol', false);
      self.setData({
        cardList: res.data.data,
        registerShowModal: true
      });
    });
  },
  getData() {
    let self = this;
    let articleData = {
      articletype: 0,
      pageindex: 0,
      pagesize: 10
    };
    let itemgrouponData = {
      itemmodel: 2,
      pageindex: 0,
      pagesize: 2
    }
    let listmarkeData = {
      itemtype: 2,
      itemmodel: 5,
      pageindex: 0,
      pagesize: 1
    }
    Promise.all([$article.list(articleData), $itemgroupon.list(itemgrouponData), $itemgroupon.list({
      ...itemgrouponData,
      itemmodel: 3
    }), $item.listmarke(listmarkeData), $item.listmarke({
      ...listmarkeData,
      itemmodel: 4
    }), $coupon.list(), $category.recommend(), $swiper.list(), $indexcategory.recommend(), $itemrecommend.recommend()]).then(res => {
      self.setData({
        itemRecommends: res[9].data.data,
        categoryRecommends: res[8].data.data,
        swiperList: res[7].data.data,
        hotInfo: res[0].data.data,
        collageItems: res[1].data.data,
        barginItems: res[2].data.data,
        rushId: res[3].data.data.length ? res[3].data.data[0].id : '',
        experienceId: res[4].data.data.length ? res[4].data.data[0].id : '',
        welfareItems: res[5].data.data.length ? res[5].data.data[0] : {},
        recommendInfo: res[6].data.data.length ? res[6].data.data[0] : {},
        vipInfo: {
          img: appImageUrl + "vip_exclusive.png",
          text: 'VIP专享'
        }
      })
    });
  },

  bindTab(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    self.setData({
      tabActiveIndex: index
    });
  },

  lookImg(e) {
    let self = this;
    let img = e.currentTarget.dataset.img;
    let info = e.currentTarget.dataset.info;
    let urls = [];
    for (let attr of info) {
      urls.push(attr.image);
    }
    wx.previewImage({
      current: img,
      urls: urls
    });
  },
  hideModal() {
    this.setData({
      registerShowModal: false
    })
  },
  // 抢购
  bindRush() {
    wx.navigateTo({
      url: '/pages/sales/rush/detail/index?itemid=' + this.data.rushId
    })
  },
  bindBuy() {

    let self = this;
    let itemInfo = self.data.itemInfo;
    console.log("itemInfo", itemInfo)
    let item = {
      picurl: itemInfo.picurl,
      price: itemInfo.price,
      num: itemInfo.num,
      title: itemInfo.title,
      itemid: itemInfo.id,
      itemmodel: itemInfo.itemmodel
    }
    wx.navigateTo({
      url: '/pages/order/submit/index?item=' + JSON.stringify(item),
    })
  },
  //去拼团
  bindCollage(e) {
    let itemid = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '/pages/sales/collage/detail/index?itemid=' + itemid
    })
  },
  //砍价
  bindBargin(e) {
    let itemid = e.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: '/pages/sales/bargain/detail/index?itemid=' + itemid
    })
  },
  //商品详情跳转
  itemtap(e) {
    console.log("itemeee", e)
    let itemid = e.currentTarget.dataset.item.id;
    console.log("itemid", itemid)
    console.log("this.data.item", this.data.item)
    wx.navigateTo({
      url: '../item/detail/index?itemid=' + itemid
    })
  },
  // 免费体验
  bindExperience() {
    wx.navigateTo({
      url: '/pages/sales/experience/detail/index?itemid=' + this.data.experienceId
    })
  },
  // 周三福利
  bindWelfare(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/sales/welfare/detail/index?id=' + id,
    })
  },
  //vip专享
  lookVip() {
    wx.navigateTo({
      url: '/pages/mine/member/vip/index',
    })
  },
  //轮播图片点击
  swiperBtn(e) {
    console.log("e11", e)
    let linkurl = e.detail.linkurl;
    if (linkurl) {
      let linkurlObj = JSON.parse(linkurl);
      utils.setLinkUrl(linkurlObj);
    }
  },
  //分类项目跳转
  clickTap(e) {
    let id = e.currentTarget.dataset.id
    app.globalData.cateid = id;

    wx.switchTab({
      url: '/pages/project/index'
    });
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {
    var article_id = wx.getStorageSync('current_article_id');
    var path = '/pages/article/article?article_id=' + article_id + '';
    return {
      title: article_title,
      path: path
    }
  },
  //夏日特惠
  lookDiscount(e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/sales/discount/detail/index?id=' + id + '&title=' + title
    })
  }
})
