
// pages/mine/card/list/index.js
import $membercoupon from "../../../../request/membercoupon.js";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: app.globalData.isIpx,
        navArr: [{
            key: "1",
            value: "未使用"
        }, {
            key: "2",
            value: "已使用"
        }, {
            key: "3",
            value: "已过期"
        }],
        status: 1,
        cardStatus:'未使用',
        activeBgColor:'#f33497'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData();
    },
    getData() {
        let self = this;
        let data = {
            openid: app.globalData.openid,
            coupontype: self.data.status
        };
        wx.showLoading({
            title: '加载中',
        })
        $membercoupon.list(data).then(res => {
            wx.hideLoading();
            self.setData({
                cardList: res.data.data
            });
        })
    },
    navBtn(e) {
        let self = this;
        let key = e.currentTarget.dataset.key;
        let cardStatus = self.data.cardStatus;
        let activeBgColor='';
        for (let attr of self.data.navArr){
            if(attr.key==key){
                cardStatus=attr.value;
                activeBgColor = key == 1 ?'#f33497':"#c0c0c0";
                break;
            }
        }
        self.setData({
            status: key,
            cardStatus: cardStatus,
            activeBgColor: activeBgColor
        });
        self.getData();
    }
})