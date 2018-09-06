// pages/sales/rush/detail/index.js
const app = getApp();
import $item from "../../../../request/item.js";
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
let WxParse = require('../../../../libs/wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: app.globalData.isIpx,
        rushBtnImg: appImageUrl + "immediately_rob.png",
        itemid:'',
        itemInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let self = this;
        self.setData({
            itemid: ops.itemid
        });
        self.getData();
    },
    getData() {
        let self = this;
        wx.showLoading({
          title: '加载中',
        })
        $item.detail({
            itemid: self.data.itemid
        }).then(res => {
          wx.hideLoading();
            self.setData({
                itemInfo: res.data.data.item
            })
            WxParse.wxParse('article', 'html', res.data.data.item.description, self, 5);
        });
    },
    bindBuy() {
        let self = this;
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
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})