// pages/mine/bill/index.js
import $order from "../../../request/order.js";
const utils=require("../../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        isIpx: app.globalData.isIpx,
        billDate:'',
        billDateEnd:'',
        jumpIcon: "/static/images/mine/enter_bottom.png",
        billInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let self=this;
      let date=utils.getTime();
      self.setData({
          billDateEnd: date.year + '-' +date.month,
          billDate: date.year + '-' + date.month
      });
      self.getData();
  },
  getData(){
      let self=this;
      let data = {
          openid: app.globalData.openid,
          starttime: Date.parse(this.data.billDate) / 1000
      }
      $order.listvirtual(data).then(res => {
          self.setData({
              billInfo: res.data.data
          })    
      });
  },
  bindPickerChange(e){
        let date=e.detail.value;
        let self=this;
        self.setData({
            billDate: date
        });
        self.getData();
  }
})