// pages/mine/index.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      windowHeight: '',
      addrIcon: "/static/images/mine/stores_navigation.png",
      jumpIcon: "/static/images/mine/enter_icon.png",
      onlineBuyIcon: "/static/images/mine/online_payment.png",
      memberIcon:"/static/images/mine/member_icon.png",
      cardIcon:"/static/images/mine/card_icon.png",
      reserveIcon: "/static/images/mine/reserve_icon.png",
      collageIcon: "/static/images/mine/collage_icon.png",
      bargainIcon: "/static/images/mine/bargain_icon.png",
      rushIcon: "/static/images/mine/rush_icon.png",
      awardIcon: "/static/images/mine/award_icon.png",
      aboutIcon: "/static/images/mine/about_icon.png",
      aboutusIcon: "/static/images/mine/wd_icon_default_08@2x.png",
      wxIcon:'/static/images/mine/wx_icon.png',
      technicalIcon:'/static/images/mine/technical_icon.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let self = this;
  },
  onShow(){
      let self = this;
      self.setData({
              windowHeight: app.globalData.windowHeight,
              userInfo: app.globalData.userInfo,
      });
  },
 /**在线付款 */
  bindOnlineBuy(){
    wx.navigateTo({
        url: '/pages/mine/onlineBuy/index',
    })
  },
 /**会员卡 */
  bindMember(){
    wx.navigateTo({
        url: '/pages/mine/member/detail/index',
    })
  },
 /**优惠卷 */
  bindCard(){
      wx.navigateTo({
          url: '/pages/mine/card/list/index',
      })
  },
 /**我的订单 */
  bindOrder(e){
      wx.navigateTo({
          url: '/pages/order/list/index',
      })
  },
/**门店导航 */
  makeLocation() {
    wx.openLocation({
      latitude:31.328682,
      longitude:120.731834,
      name: "养胸堂乳房健康管理中心菩羽旗舰店",
      address: "苏州工业园区九华路翡翠国际底商铺19幢12号109室。"
      })
  },
 /**联系我们 */
  bindAbout(){
    wx.navigateTo({
        url: '/pages/mine/about/index',
    })
  },
  /**关于我们 */
  bindAboutus() {
    wx.navigateTo({
      url: '/pages/mine/article/index',
    })
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
  /** 技术支持*/
  technicalSupport(){
      wx.navigateTo({
          url: '/pages/mine/technology/index',
      })
  }
})