// pages/mine/score/list/index.js
import $itemevaluate from '../../../../request/itemevaluate.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isIpx: getApp().globalData.isIpx,
      pagesize: 10,
      pageindex:0,
      scoreList: [],
      pullBol: false,
      nomore: false,
      nomoreText: "已经全部加载完毕",
      loadmoreText: "正在加载更多数据"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
    let self=this;
    self.setData({
        itemid:ops.itemid
    });
    self.getData();
  },
  getData(){
      let self=this;
      let evaluateData = {
          itemid: self.data.itemid,
          pageindex: 0,
          pagesize: self.data.pagesize
      }
      wx.showLoading({
          title: '加载中',
      });
      $itemevaluate.list(evaluateData).then(res=>{
          wx.hideLoading();
          let scoreList = res.data.data;
          for (let attr of scoreList) {
              attr.imgList = attr.evaluateurls.split(',');
          }
          self.setData({
                scoreList: scoreList
          })
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let self=this;
    self.setData({
        pageindex: 0,
    })
    self.getData();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let self = this;
      let pageindex = parseInt(self.data.pageindex);
      let evaluateData={
          itemid: self.data.itemid,
          pageindex: pageindex+1,
          pagesize: self.data.pagesize
      }
      wx.showNavigationBarLoading();
      $itemevaluate.list(evaluateData).then(res => {
          wx.hideNavigationBarLoading();
          let nomoreBol = false;
          let newScoreList = res.data.data;
          let scoreList = self.data.scoreList;
          if (newScoreList.length){
              for (let attr of newScoreList) {
                  attr.imgList = attr.evaluateurls.split(',');
              }
              pageindex++;
              scoreList = scoreList.concat(newScoreList);
          }else{
              nomoreBol = true;
          }
          self.setData({
              pullBol: true,
              pageindex: pageindex,
              nomore: nomoreBol
          })
          let timer = setTimeout(() => {
              self.setData({
                  pullBol: false,
                  scoreList: scoreList
              });
          }, 1000);
      })
  },
})