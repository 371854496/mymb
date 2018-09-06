// pages/sales/experience/detail/index.js
const app = getApp();
import $item from "../../../../request/item.js";
import $company from '../../../../request/company.js';
import $order from '../../../../request/order.js';
let WxParse = require('../../../../libs/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isIpx: app.globalData.isIpx,
      shareIcon: "/static/images/share_icon.png",
      phoneIcon: "/static/images/phone_icon.png",
      addrIcon: "/static/images/address_icon.png",
      scoreMoreIcon: "/static/images/back_red.png",
      processImg:"/static/images/index/active_process.png",
      itemInfo:{},
      remainNum:0,
      experienceShareBol:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
      let self = this;
      wx.showShareMenu({
          withShareTicket: true
      })
      if (ops.info){
          app.globalData.shareBol = true;
          self.setData({
              itemid: ops.info,
              experienceShareBol: true
          });
      }else{
          app.globalData.shareBol = false;
          self.setData({
              itemid: ops.itemid,
              experienceShareBol:false
          });
      }
      self.getData();
  },
  getData() {
      let self = this;
      Promise.all([$item.detail({
          itemid: self.data.itemid
      }), $company.contact(),$item.countorder({
          itemid: self.data.itemid
      })]).then(res => {
          self.setData({
              itemInfo: res[0].data.data.item,
              company: res[1].data.data,
              remainNum: 30 - res[2].data.data
          })
          WxParse.wxParse('article', 'html', res[0].data.data.item.description, self, 5);
      });
  },
  callPhone(e) {
      wx.makePhoneCall({
          phoneNumber: this.data.company.mobile,
      })
  },
  bindBuy() {
      let self = this;
      let data={
          openid: app.globalData.openid,
          itemid: self.data.itemid
      }
      $order.checkordermodel(data).then(res=>{
        if(res.data.result==1){
            let itemInfo = self.data.itemInfo;
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
        }else{
            wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration:2000
            })
        }   
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
      let self=this;
      if (res.from === 'button') {
          // 来自页面内转发按钮
          return {
              title: self.data.itemInfo.title,
              imageUrl: self.data.itemInfo.picurl,
              path: '/pages/sales/experience/detail/index?info=' + self.data.itemid,
          }
      } else {
          wx.hideShareMenu();
      }
  }
})