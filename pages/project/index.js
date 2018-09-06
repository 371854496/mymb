// pages/project/index.js
import $category from "../../request/category.js";
import $item from "../../request/item.js";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      itemForm: {
          cateid: "",
          keywords: "",
          pageindex: 0,
          pagesize: 10,
          itemmodel:1
      },
    shopList: {
      shopList: []
      },
      navTitleArr:[],
     
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
    // wx.setStorageSync('registerBol',true);
    this.getData();
  }, 
  onShow() {
    let self = this;
    let cateid = app.globalData.cateid
    console.log('cateid', cateid)
    if (cateid != '') {
      let info = this.data.shopList;
      console.log('this.data', this.data)
      console.log('info', info)
      info.shopList = [];
      console.log('info.shopList', info.shopList)
      this.setData({
        "itemForm.cateid": cateid,
        "itemForm.pageindex": 0,
        currCateId: cateid,
        pageIndex: 0,
        shopList: info,
      });
      self.getData();

    }
    $item.list(this.data.itemForm).then(res => {
      // console.log(res);
      self.setData({
        info: res.data.data
      })
    })
    // itemService.gettop(this);
    app.globalData.cateid = '';
  },
  //获取数据
  getData(){
      let self = this;
      wx.showLoading({
          title: '加载中',
      });
      Promise.all([$category.list(), $item.list(self.data.itemForm)]).then(res => {
          wx.hideLoading();
          let data = res[1].data.data;
          self.setData({
              navTitleArr: res[0].data.data,
              shopList: data,
          });
      });
  },
  //nav的切换 
  navBtn(e) {
    let cateid = e.detail.activeId;
    let self = this;
  self.setData({
      currCateId: cateid,
      pageindex: 0,
      "itemForm.cateid": cateid ,
      "itemForm.pageindex": 0,
    });
      self.getData();
  },
  lookItem(e){
      wx.navigateTo({
          url: '/pages/item/detail/index?itemid=' + e.detail.id,
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      let self = this;
      self.setData({
          "itemForm.pageindex": 0,
      });
      self.getData();
      wx.stopPullDownRefresh();
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {
    var article_id = wx.getStorageSync('current_article_id');
    var path = '/pages/article/article?article_id=' + article_id + '';
    return {
      title: article_title,
      path: path
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      let self = this;
      let pageindex = parseInt(self.data.itemForm.pageindex) + 1;
      let itemForm = {
          ...self.data.itemForm,
          pageindex: pageindex
      }
      wx.showNavigationBarLoading();
      $item.list(itemForm).then(res => {
          wx.hideNavigationBarLoading();
          let shopList = self.data.shopList;
          let newShopList = res.data.data;
          let nomoreBol = false;
          if (newShopList.length == 0) {
              nomoreBol = true;
              pageindex -= 1;
          }
          self.setData({
              pullBol: true,
              "itemForm.pageindex": pageindex,
              nomore: nomoreBol,
          })
          let timer = setTimeout(() => {
              shopList = shopList.concat(newShopList);
              self.setData({
                  pullBol: false,
                  shopList: shopList
              });
          }, 1000);
      })
  },
})