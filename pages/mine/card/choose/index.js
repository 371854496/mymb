// pages/mine/card/choose/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cardList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
        this.setData({
            cardList: JSON.parse(ops.cardList)
        })
  },
  chooseCard(e){
        let cardInfo = e.detail;
        let pages = getCurrentPages();
        let prePage = pages[pages.length - 2];
        prePage.setData({
            cardInfo: cardInfo
        });
        wx.navigateBack();
  }
})