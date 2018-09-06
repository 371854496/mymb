// pages/sales/bargain/detail/index.js
let timer = "";
const app = getApp();
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
const WxParse = require('../../../../libs/wxParse/wxParse.js');
import $itembargains from "../../../../request/itembargains.js";
import $payment from "../../../../request/payment.js";
const utils = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        jumpIndex: "/static/images/back_to_the_home_page.png",
        isIpx: app.globalData.isIpx,
        bargainTitleImg: appImageUrl + "a_bargain.png",
        item: {},
        activeValue: '',
        friendImg: "/static/images/index/your_friends.png",
        infoImg: "/static/images/index/bargaining_rules.png",
        friends: [],
        itemStatus: 0,//5——>已付款，6——>未付款
        helpStatus:true,//true——>帮砍成功,false——>帮砍未完成。
        bargainDialogBol: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let self = this;
        if(ops.info){
            app.globalData.shareBol = true;
            let info = JSON.parse(ops.info);
            console.log('info', info);
            self.setData({
                itemid: info.itemid,
                friopenid: info.openid,
                id: info.id,
                itemStatus:3,
                helpStatus:false,
                bargainShareBol: app.globalData.shareBol
            })
        }else{
            app.globalData.shareBol = false;
            self.setData({
                itemid: ops.itemid,
                bargainShareBol: app.globalData.shareBol
            });
        }
        
        
    },
    onShow() {
        let self = this;
        getApp().globalData.bindBol=true;
        self.getData().then(() => {
            self.setRemainTime();
        });
    },
    setRemainTime() {
        let self = this;
        let remainTime = self.data.remainTime;
        if (remainTime) {
            timer = setInterval(() => {
                remainTime = remainTime - 1000;
                self.setData({
                    remainTime: remainTime
                });
            }, 1000)
        }
    },
    /**
       * 生命周期函数--监听页面隐藏
       */
    onHide: function () {
        if (timer) {
            clearInterval(timer);
        }
    },
    getData() {
        let self = this;
        let itemData = {
            itemid: self.data.itemid,
            openid: self.data.helpStatus ? app.globalData.openid:self.data.friopenid
        }
        wx.showLoading({
            title: '加载中',
        })
        return $itembargains.get(itemData).then(res => {
            wx.hideLoading();
            let itemStatus = self.data.itemStatus;
             //砍价状态(1、砍价中，2、待支付，3砍到底价，4、支付完成，5、已取消)
             //砍价按钮显示（0.自己砍一刀1.邀请好友，提前付款，2.立即付款，3.帮砍一刀，4.我也要砍一刀，6.前往付款,5.砍到底价，不显示按钮）
            let item = res.data.data;
            let activeValue = item.item.price;
            let remainTime = 0;
            if (self.data.helpStatus){
                if (item.itembargains == null) {
                    itemStatus = 0;
                } else if (item.itembargains.status == 3) {
                    activeValue -= item.itembargains.historysales;
                    itemStatus = 5;
                } else if (item.itembargains.status == 2) {
                    activeValue -= item.itembargains.historysales;
                    itemStatus = 6;
                } else if (item.itembargains.surplussale == 0) {
                    itemStatus = 2;
                    activeValue -= item.itembargains.historysales;
                } else if (item.itembargains.historysales > 0) {
                    itemStatus = 1;
                    activeValue -= item.itembargains.historysales;
                    remainTime = Date.parse(item.itembargains.endtime) - Date.now();
                }
            }else{
                activeValue -= item.itembargains.historysales;
            }
            self.setData({
                item: item,
                itemStatus: itemStatus,
                activeValue: activeValue.toFixed(2),
                
                remainTime: remainTime
            })
            WxParse.wxParse('article', 'html', item.itemgroupon.remark || '', self, 5);
            return res.data.data.itembargains ? item.itembargains : '';
        }).then(itembargains => {
            if (itembargains) {
                $itembargains.list({ itembarid: itembargains.id }).then(res => {
                    self.setData({
                        friends: res.data.data
                    })
                })
            }
        })
    },
    //自己砍一刀   
    bargainBtn() {
        let self = this;
        let price = self.data.item.item.price;
        let grouponsale = self.data.item.itemgroupon.grouponsale;
        let addData = {
            itemid: self.data.itemid,
            openid: app.globalData.openid,
            surplussale: price - grouponsale
        }
        wx.showNavigationBarLoading();
        $itembargains.add(addData).then(res => {
            wx.hideNavigationBarLoading();
            if (res.data.result == 1) {
                self.setData({
                    itemStatus: 1,
                    bargainDialogBol: true,
                    bargainDialogContent: "已成功砍价",
                    bargainDialogPrice: res.data.data,
                    helpStatus:true
                });
            }else{
              console.log("1111111");
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                }) 
                setTimeout(function(){
                  self.setData({
                    itemStatus: 1,
                    helpStatus: true
                  })
                },2000);   
            }
            setTimeout(function(){
              self.getData().then(() => {
                self.setRemainTime();
              });
            },2000)
            
        });
    },
    //提交订单
    buyBtn() {
        let self = this;
        let itemInfo = self.data.item;
        let item = {
            picurl: itemInfo.item.picurl,
            price: self.data.activeValue,
            title: itemInfo.item.title,
            itemid: self.data.itemid,
            markeid: itemInfo.itembargains.id,
            itemmodel: itemInfo.item.itemmodel
        }
        wx.navigateTo({
            url: '/pages/order/submit/index?item=' + JSON.stringify(item),
        })
    },
    //帮砍
    helpBargainBtn() {
        let self = this;
        let editData={
            friopenid: self.data.friopenid,
            id: self.data.id,
            openid: app.globalData.openid
        };
        console.log('editData', editData);
        wx.showNavigationBarLoading();
        $itembargains.edit(editData).then(res=>{
            wx.hideNavigationBarLoading();
            if (res.data.result==1){
                self.setData({
                    itemStatus: 4,
                    bargainDialogBol: true,
                    bargainDialogContent: "已成功帮助小伙伴砍价",
                    bargainDialogPrice: res.data.data
                });
                self.getData();
            }else{
                if (res.data.code==100066){
                    self.setData({
                        itemStatus: 4
                    });
                }
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration: 2000
                })
            }
        });
        
    },
    hidebargainModal() {
        let self = this;
        self.setData({
            bargainDialogBol: false
        })
    },
    againBuy(){
        let self = this;
        let id = self.data.item.itembargains.orderid;
        let title = self.data.item.item.title;
        let data = {
            openid: app.globalData.openid,
            orderid: id,
            body: title
        }
        if (getApp().globalData.bindBol) {
            wx.showNavigationBarLoading();
            getApp().globalData.bindBol = false;
            $payment.send(data).then(res => {
                wx.hideNavigationBarLoading();
                getApp().globalData.bindBol = true;
                if (res.data.result == 1) {
                    if (res.data.result == 1) {
                        let payData = res.data.data;
                        wx.requestPayment({
                            ...payData,
                            success(payRes) {
                                self.getData();
                            },
                            fail(e) {
                                console.log(e);
                            }
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: 1000
                    });
                }
            });
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        let self = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
            let data = {
                itemid: self.data.itemid,
                openid: app.globalData.openid,
                id:self.data.item.itembargains.id,
            };
            return {
                title: self.data.item.item.title,
                imageUrl: self.data.item.item.picurl,
                path: '/pages/sales/bargain/detail/index?info=' + JSON.stringify(data)
            }
        } else {
            wx.hideShareMenu();
        }
    },
    jumpIndexBtn() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    }
})