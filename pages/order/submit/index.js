// pages/order/submit/index.js
import $membercoupon from "../../../request/membercoupon.js";
import $order from "../../../request/order.js";
const utils = require("../../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    jumpIcon: "/static/images/mine/jinru.png",
    item: {},
    realname: '',
    dateStart: '',
    date: "",
    time: "",
    buynum: 1,
    amount: '',
    cardPrompt: '',
    cardPromptType: 0,
    cardInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    let self = this;
    let dateStart = utils.dateAdd(new Date());
    let item = JSON.parse(ops.item);
    self.setData({
      item: item,
      dateStart: dateStart,
      date: dateStart,
      time: "00:00",
      totalprice: item.price,
      amount: item.price,
      realname: app.globalData.userInfo ? app.globalData.userInfo.nickName : ''
    })

  },
  onShow() {
    if (this.data.item.itemmodel == 1) {
      this.getData();
    }
    app.globalData.bindBol = true;
  },
  getData() {
    let self = this;
    let data = {
      openid: app.globalData.openid,
      coupontype: 1,
      totalprice: self.data.totalprice,
      itemid: self.data.item.itemid,
    };
    wx.showLoading({
      title: '加载中',
    })
    $membercoupon.list(data).then(res => {
      wx.hideLoading();
      let cardPrompt = "暂无可用";
      let cardPromptType = 0;
      let cardList = res.data.data;
      let cutprice = 0;
      if (self.data.cardInfo.cutprice) {
        let couponidBol = false;
        for (let attr of cardList) {
          if (attr.couponid == self.data.cardInfo.couponid) {
            couponidBol = true;
            break;
          }
        }
        if (couponidBol) {
          cardPrompt = "-" + self.data.cardInfo.cutprice + "元";
          cardPromptType = 2;
          cutprice = self.data.cardInfo.cutprice;
        }
      }
      if (cardList.length && cardPromptType != 2) {
        cardPrompt = res.data.data.length + "个可用";
        cardPromptType = 1;
      }
      let totalprice = self.data.totalprice;
      let amount = (totalprice - cutprice).toFixed(2);
      self.setData({
        cardList: cardList,
        cardPrompt: cardPrompt,
        cardPromptType: cardPromptType,
        amount: amount
      })
    })
  },
  // 日期选择
  changeDate(e) {
    let value = e.detail.value;
    let self = this;
    self.setData({
      date: value,
    })
  },
  // 时间选择
  changeTime(e) {
    let self = this;
    let value = e.detail.value;
    self.setData({
      time: value
    })
  },
  // 优惠卷选择
  chooseCard() {
    let cardList = this.data.cardList;
    let cardPromptType = this.data.cardPromptType;
    if (cardPromptType != 0) {
      wx.navigateTo({
        url: '/pages/mine/card/choose/index?cardList=' + JSON.stringify(cardList),
      })
    };
  },
  //商品数量减少
  bindMinusTab(e) {
    let self = this;
    let buynum = self.data.buynum;
    if (buynum > 1) {
      self.changePrice(buynum - 1);
    }
  },
  // 商品数量增加
  bindPlusTab(e) {
    let self = this;
    let buynum = self.data.buynum;
    let totalNum = self.data.item.num;
    if (buynum < totalNum) {
      self.changePrice(buynum + 1);
    }
  },
  backItem() {
    wx.navigateBack();
  },
  //输入商品数量
  bindBuyNumInput(e) {
    let self = this;
    let inputValue = Number(e.detail.value);
    let buynum = self.data.buynum;
    let totalNum = self.data.item.num;
    if (!isNaN(inputValue) && inputValue > 0 && inputValue <= totalNum) {
      buynum = inputValue;
    }
    self.changePrice(buynum);
  },
  // 数目的变化引起总价变化
  changePrice(buynum) {
    let self = this;
    let price = self.data.item.price;
    let cutprice = self.data.cardInfo.cutprice || 0;
    let totalprice = parseFloat(price) * buynum;
    let amount = totalprice - cutprice;
    self.setData({
      buynum: buynum,
      totalprice: totalprice
    });
    self.getData();
  },
  //表单提交
  formSubmit(e) {
    let self = this;
    let formData = e.detail.value;
    console.log(formData);
    if (self.formRef(formData)) {
      if (app.globalData.bindBol) {
        app.globalData.bindBol = false;
        let dateStr = self.data.date + " " + self.data.time;
        let servicetime = Date.parse(new Date(dateStr.replace(/-/g, '/'))) / 1000;
        wx.showNavigationBarLoading();
        let itemmodel = self.data.item.itemmodel;
        console.log('itemmodelTrue', itemmodel);
        new Promise((resolve, reject) => {
          if (itemmodel == 1) {
            let couponid = self.data.cardPromptType == 2 ? self.data.cardInfo.couponid : '';
            let orderData = {
              ...formData,
              openid: app.globalData.openid,
              ordertype: 2,
              itemid: self.data.item.itemid,
              servicetime: servicetime,
              couponid: couponid,
              amount: self.data.amount,
            }
            $order.createserve(orderData).then(data => {
              resolve(data);
            })
          } else {
            let orderData = {
              ...formData,
              openid: app.globalData.openid,
              ordertype: 2,
              itemid: self.data.item.itemid,
              markeid: self.data.item.markeid || '',
              servicetime: servicetime,
              ordermodel: self.data.item.itemmodel,
              amount: self.data.amount,
              num: 1
            }
            $order.createmarke(orderData).then(data => {
              resolve(data);
            })
          }
        }).then(res => {
          wx.hideNavigationBarLoading();
          app.globalData.bindBol = true;
          if (res.data.result == 1) {
            if (itemmodel == 4 && self.data.amount == 0) {
              self.backPage(itemmodel);
            } else {
              let payData = res.data.data;
              wx.requestPayment({
                ...payData,
                success(payRes) {
                  self.backPage(itemmodel, res.data.data.orderid);
                },
                fail(e) {
                  wx.redirectTo({
                    url: '../list/index',
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 1000,
            })
          }
        })
      }
    } else {
      console.log('no');
    }
  },
  // 支付完成跳转
  backPage(itemmodel, orderid = '') {
    if (app.globalData.shareBol) {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else {
      let pages = getCurrentPages();
      let prePage = pages[pages.length - 2];
      if (itemmodel == 2) {
        prePage.setData({
          payBol: true,
          orderid: orderid || ''
        });
      } else {
        prePage.setData({
          payBol: true,
        });
      }
      wx.navigateBack();
    }
  },
  //表单校验
  formRef(formData) {
    let info = "";
    if (formData.realname.length == 0) {
      info = "请输入姓名";
    } else if (formData.mobile.length != 11) {
      info = "手机号不合法";
    }
    if (info) {
      wx.showToast({
        title: info,
        icon: "none",
        duration: 1000
      })
      return false;
    } else {
      return true;
    }
  }
})