// pages/mine/about/index.js
import $company from "../../../request/company.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneIcon: "/static/images/mine/telephone_booking.png",
        jumpIcon: "/static/images/mine/enter_icon.png",
        sellerInfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        $company.contact().then(res => {
            this.setData({
                sellerInfo: res.data.data
            })
        })
    },
    callPhone() {
        wx.makePhoneCall({
            phoneNumber: this.data.sellerInfo.mobile,
        })
    }
})