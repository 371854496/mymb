// pages/order/detail/index.js
import $appointment from "../../../request/appointment.js";
const utils=require("../../../utils/util.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isIpx: app.globalData.isIpx,
      headerIcon:"/static/images/order_detail.png",
      info:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(ops) {
      let self = this;
      self.setData({
          orderid:ops.id
      });
      self.getData();
  },
  getData(){
      let self=this;
      let orderData={
          orderid: self.data.orderid,
          openid: app.globalData.openid
      }
      $appointment.get(orderData).then(res => {
            // console.log(res);
            self.setData({
                info:res.data.data
            })
      })
  }
})