// pages/mine/onlineBuy/index.js
import $membercoupon from "../../../request/membercoupon.js";
import $order from "../../../request/order.js";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sellerInfo: {},
        jumpIcon: "/static/images/mine/jinru.png",
        price: "",
        cutprice: 0,
        amount: 0,
        cardPrompt: '',
        cardPromptType: 0,
        cardList: '',
        cardInfo: {}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    onShow() {
        let self = this;
        self.getData();
    },
    getData() {
        let self = this;
        let data = {
            openid: app.globalData.openid,
            coupontype: 1,
            totalprice: self.data.price,
        };
        if (self.data.price > 0) {
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
                let price = self.data.price;
                let amount = (price - cutprice).toFixed(2);
                self.setData({
                    cardList: cardList,
                    cardPrompt: cardPrompt,
                    cardPromptType: cardPromptType,
                    amount: amount,
                    price: price
                })
            })
        }

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
    bindBuy(e) {
        let value = e.detail.value;
        let self = this;
        self.setData({
            price: value
        });
        self.getData();
    },
    submitOrder() {
        let self = this;
        if (self.data.price > 0) {
            if (app.globalData.bindBol) {
                app.globalData.bindBol = false;
                let couponid = self.data.cardPromptType == 2 ? self.data.cardInfo.couponid : '';
                let orderData = {
                    openid: app.globalData.openid,
                    couponid: couponid,
                    amount: self.data.amount
                }
                wx.showNavigationBarLoading();
                $order.createvirtual(orderData).then(res => {
                    wx.hideNavigationBarLoading();
                    app.globalData.bindBol = true;
                    if (res.data.result == 1) {
                        let payData = res.data.data;
                        wx.requestPayment({
                            ...payData,
                            success(payRes) {
                                wx.showToast({
                                    title: '付款成功',
                                    icon: "none"
                                })
                            },
                            fail(e) {
                                wx.showToast({
                                    title: '付款失败',
                                    icon: "none"
                                })
                            }
                        })
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
    }
})