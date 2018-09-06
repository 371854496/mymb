// pages/sales/discount/detail/index.js
const app = getApp();
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
import $item from "../../../../request/item.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      discountBgImg: appImageUrl +"summer_welfare.png",
      discountShareBol:false,
      shopList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
      let self = this;
      wx.showShareMenu({
          withShareTicket: true
      });
      if (ops.info) {
          app.globalData.shareBol = true;
          self.setData({
              cateid: ops.info,
              title:ops.title,
              discountShareBol: true
          });
      } else {
          app.globalData.shareBol = false;
          self.setData({
              cateid: ops.id,
              title: ops.title,
              discountShareBol: false
          });
      }
      self.getData();
  },
  getData(){
      let self=this;
      let listData={
          cateid: self.data.cateid,
          keywords: "",
          pageindex: 0,
          pagesize: 20
      }
      $item.list(listData).then(res=>{
          self.setData({
              shopList:res.data.data
          })
      })
  },
  lookItem(e) {
      wx.navigateTo({
          url: '/pages/item/detail/index?id=' + e.detail.id,
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
      let self = this;
      if (res.from === 'button') {
          // 来自页面内转发按钮
          return {
              title: '',
              imageUrl: self.data.discountBgImg,
              path: '/pages/sales/discount/detail/index?info=' + self.data.cateid + '&title=' + self.data.title
          }
      } else {
          wx.hideShareMenu();
      }
  }
})