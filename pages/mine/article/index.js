// pages/mine/about/index.js
let WxParse = require('../../../libs/wxParse/wxParse.js');
import $aboutus from "../../../request/aboutus.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '关于我们',
    isIpx: getApp().globalData.isIpx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let self = this;
    wx.showLoading({
      title: '加载中',
    });
    $aboutus.list().then(res => {
      wx.hideLoading();
      console.log("res",res);
      WxParse.wxParse('article', 'html', res.data.data, self, 5);
    });

  },
})