// pages/mine/member/detail/index.js
const app = getApp();
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
import $membercard from '../../../../request/membercard.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memberCardImg: appImageUrl + "the_membership_card.png",
        jumpIcon: "/static/images/mine/enter_icon.png",
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        $membercard.get({
            openid: app.globalData.openid
        }).then(res => {
            if (res.data.result == 1) {
                this.setData({
                    info: res.data.data
                })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            }
        })
    },
    //在线买单
    bindBuy() {
        wx.navigateTo({
            url: '/pages/mine/onlineBuy/index',
        })
    },
    // 账单记录
    lookBill() {
        wx.navigateTo({
            url: '/pages/mine/bill/index',
        })
    },
    bindVip() {
        wx.navigateTo({
            url: '/pages/mine/member/vip/index',
        })
    }
})