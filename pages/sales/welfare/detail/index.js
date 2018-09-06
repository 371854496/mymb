// pages/sales/welfare/detail/index.js
const app = getApp();
const appImageUrl = app.globalData.imageUrl + "/wechat/sales/";
import $order from "../../../../request/order.js"
import $coupon from "../../../../request/coupon.js"
import $couponlist from "../../../../request/couponlist.js"
import $couponinsert from "../../../../request/membercouponinsert.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        welfareBgImg: appImageUrl + "on_wednesday_the_welfareimage.png",
        getWelfareImg: appImageUrl + "get_welfare.png",
        getWelfareOutImg: appImageUrl + "get_full_welfare.png",
        shareImg: "/static/images/index/show_off_button.png",
        closeImg: "/static/images/exit.png",
        showModalStatus: 0,//0——>隐藏，1——>抢购成功,2——>不合规则
        couponid: '',
        cardInfo: {},
        errContent:"",
        welfareShareBol:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let self = this;
        wx.showShareMenu({
            withShareTicket: true
        })
        if (ops.info) {
            app.globalData.shareBol = true;
            self.setData({
                couponid: ops.info,
                welfareShareBol: true
            });
        }else{
            app.globalData.shareBol = false;
            self.setData({
                couponid: ops.id,
                welfareShareBol: false
            });
        }
        this.getData();
    },
    onShow(){
        app.globalData.bindBol=true;
    },
    getData() {
        let self = this;
      $coupon.list({ couponid: self.data.couponid }).then(res => {
            self.setData({
              couponlist: res.data.data
            })
        });
    },
    welfareBtn(e) {
        console.log("点击e",e)
        let self=this;
        let couponid= e.currentTarget.dataset.item.id
        let orderData = {
            openid: app.globalData.openid,
            couponid: couponid
        }
        app.globalData.bindBol=false;
        wx.showNavigationBarLoading();
      $couponinsert.insert(orderData).then(res => {
            wx.hideNavigationBarLoading();
            app.globalData.bindBol = true;
            if(res.data.result==1){
                let payData = res.data.data;
                wx.requestPayment({
                    ...payData,
                    success(payRes) {
                        self.setData({
                            showModalStatus: 1
                        });
                    },
                    fail(e) {
                        console.log(e);
                    }
                })
                
            }else{
                if (res.data.code == 130001 || res.data.code == 130001) {
                    self.setData({
                        showModalStatus: 2,
                        errContent: res.data.msg
                    });
                }else{
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                    })
                } 
            }   
        })
        
    },
    hideModal() {
        this.setData({
            showModalStatus: 0
        })
    },
  //点击领取或购买
  buycardtap: function (e) {
    let res = {}
    res.couponid = e.currentTarget.dataset.item.id;
    console.log("couponid", res.couponid)
    res.amount = e.currentTarget.dataset.item.price;
    orderService.membercouponinsert(this, res);
    let orderData = {
      openid: app.globalData.openid,
      amount: 0.01,
      couponid: self.data.couponid
    }
    app.globalData.bindBol = false;
    wx.showNavigationBarLoading();
    $order.createcoupon(orderData).then(res => {
      wx.hideNavigationBarLoading();
      app.globalData.bindBol = true;
      if (res.data.result == 1) {
        let payData = res.data.data;
        wx.requestPayment({
          ...payData,
          success(payRes) {
            self.setData({
              showModalStatus: 1
            });
          },
          fail(e) {
            console.log(e);
          }
        })

      } else {
        if (res.data.code == 130001 || res.data.code == 130001) {
          self.setData({
            showModalStatus: 2,
            errContent: res.data.msg
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        let self = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target);
            return {
                title: self.data.cardInfo.remark,
                imageUrl: self.data.welfareBgImg,
                path: '/pages/sales/welfare/detail/index?info=' + self.data.cardInfo.id
            }
        } else {
            wx.hideShareMenu();
        }
    }
})