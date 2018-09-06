// pages/mine/authorize/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarExampleUrl: '/static/images/mine/mine_avatar.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    /**授权登陆 */
    userInfoHandler(e) {
        if (e.detail.userInfo) {
            wx.login({
                success(res) {
                    getApp().userLogin(res, e.detail);
                    wx.navigateBack();
                }
            });
        } else {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
        console.log("授权" + (e.detail.userInfo ? "成功" : "失败"));
    }
})