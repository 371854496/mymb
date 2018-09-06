// pages/sales/collage/friend/index.js;
let currentTimer='';
import $ordergroupon from "../../../../request/ordergroupon.js";
import $itemgroupon from "../../../../request/itemgroupon.js";
import $item from "../../../../request/item.js";
const utils=require("../../../../utils/util.js");
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: app.globalData.isIpx,
        item: {},
        userDefaultImg: "/static/images/index/in_figure.png",
        shopList: [],
        currentTeam:{},//当前拼团订单信息
        currentTime:{},//当前拼团订单剩余时间
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let shareInfo = JSON.parse(ops.info);
        let self=this;
        if (ops.info){
            app.globalData.shareBol = true;
        } 
        self.setData({
            titleType: shareInfo.type,
            orderid: shareInfo.orderid,
            itemid: shareInfo.itemid,
            markeid: shareInfo.markeid
        })
        self.getOrderGroupon().then(() => {
            currentTimer = setInterval(() => {
                let currentTime = utils.setCurrentTime(self.data.currentTime.time - 1);
                self.setData({
                    currentTime: currentTime
                });
            }, 1000)
        });
        self.getData();
    },
    getData(){
        let self = this;
        let itemData = {
            itemid: self.data.itemid
        }
        Promise.all([$itemgroupon.get(itemData), $item.recommend({
            itemnum:10
        })]).then(res => {
            self.setData({
                item: res[0].data.data,
                shopList: res[1].data.data
            })
        })
    },
    //订单信息
    getOrderGroupon() {
        let self = this;
        return Promise.resolve(1).then(() => {
            $ordergroupon.get({
                orderid: self.data.orderid
            }).then(res => {
                console.log('res',res);
                let currentTeam = res.data.data;
                let time = (Date.parse(currentTeam.endtime) - Date.now()) / 1000;
                let currentTime = utils.setCurrentTime(time);
                currentTeam.remarkNum = self.data.titleType - currentTeam.memberGroupons.length; 
                currentTeam.memberGroupons.length = currentTeam.maxnum;
                self.setData({
                    currentTeam: currentTeam,
                    currentTime: currentTime
                })
            });
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        let self=this;
        wx.setNavigationBarTitle({
            title: self.data.titleType+'人拼团',
        })
    },
    lookItem(e) {
        wx.navigateTo({
            url: '/pages/item/detail/index?id=' + e.detail.id,
        })
    },
    //参与活动按钮
    collageSubmit(e) {
        let self = this;
        let type = e.currentTarget.dataset.type;
        let markeid = self.data.markeid;
        let itemInfo = self.data.item;
        let param = {
            openid: getApp().globalData.openid,
            ordergrouponid: markeid
        }
        self.checkCollage(param).then(res => {
            if (res) {
                let item = {
                    picurl: itemInfo.item.picurl,
                    price: itemInfo.itemgroupon.grouponsale,
                    title: itemInfo.item.title,
                    itemid: self.data.itemid,
                    markeid: markeid,
                    itemmodel: itemInfo.item.itemmodel
                }
                wx.navigateTo({
                    url: '/pages/order/submit/index?item=' + JSON.stringify(item),
                })
            }else{
                wx.switchTab({
                    url: '/pages/index/index',
                })
            }
        });
    },
    //检查是否可以拼团
    checkCollage(param) {
        let self = this;
        return $ordergroupon.check(param).then(res => {
            if (res.data.result == 1) {
                if (res.data.data.orderid) {
                    self.setData({
                        payBol: true,
                        orderid: res.data.data.orderid
                    });
                } else {
                    return true;
                }
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
            return false;
        })
    }
})