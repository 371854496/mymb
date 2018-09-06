// components/backHome/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      jumpIcon:{
          type:String,
          value: "/static/images/back_to_the_home_page.png"
      },
      bottom:{
          type:String,
          value:"50rpx"
      } 
  },

  /**
   * 组件的初始数据
   */
  data: {
      isIpx: getApp().globalData.isIpx,
  },

  /**
   * 组件的方法列表
   */
  methods: {
      jumpBtn() {
          wx.switchTab({
              url: '/pages/index/index',
          })
      }
  }
})
