// pages/order/list/index.js
import $order from "../../../request/order.js";
import $payment from "../../../request/payment.js";
const utils = require("../../../utils/util.js");
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: app.globalData.isIpx,
        navArr: [{
            key: "",
            value: "全部"
        }, {
            key: "0",
            value: "待付款"
        }, {
            key: "6",
            value: "待成团"
        }, {
            key: "1",
            value: "待消费"
        },
        //  {
        //     key: "3",
        //     value: "待评价"
        // }, 
        {
            key: "4",
            value: "已完成"
        }],
        itemList: [],
        orderForm: {
            openid: '',
            status: '',
            ordertype: 2,
            pageindex: 0,
            pagesize: 10
        },
        pullBol: false,
        nomore: false,
        nomoreText: "已经全部加载完毕",
        loadmoreText: "正在加载更多数据"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {

    },
    onShow() {
        let self = this;
        self.getData();
        app.globalData.bindBol = true;
    },
    getData() {
        let self = this;
        let data = self.data.orderForm;
        data.openid = app.globalData.openid;
        wx.showLoading({
                title: '加载中',
        })
        $order.list(data).then(res => {
            wx.hideLoading();
            self.setData({
                itemList: res.data.data,
            });
        })
    },
    navBtn(e) {
        let self = this;
        let key = e.currentTarget.dataset.key;
        self.setData({
            'orderForm.status': key,
            'orderForm.pageindex': 0
        });
        self.getData();
    },
    //取消订单
    bindCancelOrder(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        self.updateOrder(5, '取消订单', id);
    },
    //更新订单状态
    updateOrder(status, msg, id) {
        let self = this;
        let data = {
            openid: app.globalData.openid,
            orderid: id,
            status: status
        }
        wx.showModal({
            title: '温馨提示',
            content: msg + '吗?',
            success(res) {
                if (res.confirm) {
                    wx.showNavigationBarLoading()
                    $order.update(data).then(res => {
                        wx.hideNavigationBarLoading();
                        if (res.data.result == 1) {
                            wx.showToast({
                                title: msg + '成功',
                                icon: "none",
                                duration: 1000
                            })
                            setTimeout(() => {
                                self.setData({
                                    'orderForm.pageindex': 0
                                });
                                self.getData();
                            }, 1000)
                        } else {
                            wx.showToast({
                                title: res.data.msg || '服务器异常',
                                icon: "none",
                                duration: 1000
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //评价
    scoreOrder(e) {
        let itemObj = e.currentTarget.dataset.item;
        wx.navigateTo({
            url: '/pages/mine/score/edit/index?itemObj=' + JSON.stringify(itemObj),
        })
    },
    //付款
    bindPayItem(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let title = e.currentTarget.dataset.title;
        let data = {
            openid: app.globalData.openid,
            orderid: id,
            body: title
        }
        if (getApp().globalData.bindBol) {
            wx.showNavigationBarLoading();
            getApp().globalData.bindBol = false;
            $payment.send(data).then(res => {
                wx.hideNavigationBarLoading();
                getApp().globalData.bindBol = true;
                if(res.data.result==1){
                    if (res.data.result == 1) {
                        let payData = res.data.data;
                        wx.requestPayment({
                            ...payData,
                            success(payRes) {
                                self.getData();
                            },
                            fail(e) {
                                console.log(e);
                            }
                        })
                    }
                }else{
                    wx.showToast({
                        title: res.data.msg, 
                        icon: "none",
                        duration: 1000
                    });
                }
            });
        }

    },
    //删除订单
    delOrder(e) {
        let self = this;
        let id = e.currentTarget.dataset.id;
        let data = {
            openid: app.globalData.openid,
            orderid: id,
        }
        wx.showModal({
            title: '温馨提示',
            content: '确定删除订单吗?',
            success(res) {
                if (res.confirm) {
                    wx.showNavigationBarLoading()
                    $order.del(data).then(res => {
                        wx.hideNavigationBarLoading();
                        if (res.data.result == 1) {
                            wx.showToast({
                                title: '删除订单成功',
                                icon: "none",
                                duration: 1000
                            })
                            setTimeout(() => {
                                self.setData({
                                    'orderForm.pageindex': 0
                                });
                                self.getData();
                            }, 1000)
                        } else {
                            wx.showToast({
                                title: res.data.msg || '服务器异常',
                                icon: "none",
                                duration: 1000
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    //去成团
    goToCollage(e){
        let data = e.currentTarget.dataset;
        let info={
            payBol: true,
            ...data
        }
        wx.redirectTo({
            url: '/pages/sales/collage/detail/index?info=' + JSON.stringify(info)
        })
    },
    /**订单详情 */
    orderDetailBtn(e) {
        wx.navigateTo({
            url: '/pages/order/detail/index?id=' + e.currentTarget.dataset.id
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({
            'orderForm.pageindex': 0
        });
        this.getData();
        wx.stopPullDownRefresh();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let self = this;
        let pageindex = parseInt(self.data.orderForm.pageindex) + 1;
        let data = {
            ...self.data.orderForm,
            pageindex: pageindex
        }
        wx.showNavigationBarLoading();
        $order.list(data).then(res => {
            wx.hideNavigationBarLoading();
            let itemList = self.data.itemList;
            let newItemList = res.data.data;
            let nomoreBol = false;
            if (newItemList.length == 0) {
                nomoreBol = true;
                pageindex -= 1;
            }
            self.setData({
                pullBol: true,
                'orderForm.pageindex': pageindex,
                nomore: nomoreBol,
            })
            let timer = setTimeout(() => {
                itemList = itemList.concat(newItemList);
                self.setData({
                    pullBol: false,
                    itemList: itemList
                });
            }, 1000);
        })
    }
})