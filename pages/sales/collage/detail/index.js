// pages/sales/collage/detail/index.js
let timer = '';
let currentTimer='';
const WxParse = require('../../../../libs/wxParse/wxParse.js');
import $item from '../../../../request/item.js';
import $itemgroupon from "../../../../request/itemgroupon.js";
import $ordergroupon from "../../../../request/ordergroupon.js";
const utils=require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: getApp().globalData.isIpx,
        titleType: '',
        itemid: '',
        itemgroid: '',
        item: {},
        shareIcon: "/static/images/share_icon.png",
        moreIcon: "/static/images/mine/jinru.png",
        moreBol: false,
        colloageInfo: {
            totalcount: '',
            data: []
        },
        animationData: {},
        hideModalStatus: true,
        userDefaultImg: "/static/images/index/in_figure.png"
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let self = this;
        if(ops.info){
            let info = JSON.parse(ops.info);
            self.setData({
                itemid: info.itemid,
                orderid: info.orderid,
                payBol: info.payBol
            });
        }else{
            self.setData({
                itemid: ops.itemid,
            });
        }
    },
    getData() {
        let self = this;
        let ordergrouponData = {
            itemid: self.data.itemid,
            pageindex: 0,
            pagesize: 10
        }
        return $ordergroupon.list(ordergrouponData).then(res => {
            let colloagelist = res.data.data || [];
            if (colloagelist) {
                for (let attr of colloagelist) {
                    attr.remainTime = Date.parse(attr.endtime.replace(/-/g, '/')) - Date.now();
                }
            }
            self.setData({
                colloageInfo: {
                    totalcount: res.data.totalcount,
                    data: colloagelist
                }
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady(e) {
        let self = this;
        let itemData = {
            itemid: self.data.itemid
        }
        $itemgroupon.get(itemData).then(res=>{
            wx.setNavigationBarTitle({
                title: res.data.data.itemgroupon.maxnum + "人拼团"
            })
            self.setData({
                titleType: res.data.data.itemgroupon.maxnum,
                item: res.data.data
            });
            WxParse.wxParse('article', 'html', res.data.data.itemgroupon.remark || '', self, 5);  
        });     
    },
    //查看更多
    lookMore() {
        this.setData({
            moreBol: !this.data.moreBol
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let self = this;
        wx.showShareMenu({
            withShareTicket: true,
        });
        self.paySuccess();
        self.getData().then(() => {
            let list = self.data.colloageInfo.data;
            if (list) {
                timer = setInterval(() => {
                    for (let attr of list) {
                        attr.remainTime = attr.remainTime - 1000;
                    }
                    self.setData({
                        'colloageInfo.data': list
                    });
                }, 1000)
            }
        });
    },
    //支付成功调用,通过orderid查询拼团信息邀请好友弹框
    paySuccess() {
        let self = this;
        if (self.data.payBol) {
            self.showModal();
            return Promise.resolve(1).then(() => {
                $ordergroupon.get({
                    orderid: self.data.orderid
                }).then(res => {
                    let currentTeam = res.data.data;
                    let time = (Date.parse(currentTeam.endtime) - Date.now()) / 1000;
                    let currentTime = utils.setCurrentTime(time);
                    currentTeam.remarkNum = currentTeam.maxnum-currentTeam.memberGroupons.length; 
                    currentTeam.memberGroupons.length = currentTeam.maxnum;
                    self.setData({
                        currentTeam: currentTeam,
                        currentTime: currentTime
                    })
                });
            }).then(() => {
                clearInterval(currentTimer);
                currentTimer = setInterval(() => {
                    let currentTime = utils.setCurrentTime(self.data.currentTime.time - 1);
                    self.setData({
                        currentTime: currentTime
                    });
                }, 1000)
            });
        }
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearInterval(timer);
        clearInterval(currentTimer);
        console.log('timer', timer);
        console.log('currentTimer', currentTimer);
    },
    onUnload(){
        clearInterval(timer);
        clearInterval(currentTimer);
        console.log('onUnload-------timer', timer);
        console.log('onUnload---------currentTimer', currentTimer);
    },
    // 拼团提交
    collageSubmit(e) {
        let markeid = e.currentTarget.dataset.id||'';
        let self = this;
        let param = {
            openid: getApp().globalData.openid,
            ordergrouponid: markeid,
            itemid: self.data.itemid	
        }
        self.checkCollage(param).then(res=>{
            if(res){
                let itemInfo = self.data.item;
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
                self.paySuccess();
            }
        });
       
    },
    //检查是否可以拼团
    checkCollage(param){
        let self=this;
        return $ordergroupon.check(param).then(res=>{
            if(res.data.result==1){
                if (res.data.data.orderid){
                    self.setData({
                        payBol:true,
                        orderid: res.data.data.orderid
                    });
                }else{
                    return true;
                }          
            }else{
                wx.showToast({
                    title: res.data.msg,
                    icon:'none',
                    duration:2000
                })
            }
            return false;
        })
    },
    //显示对话框
    showModal() {
        let animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation;
        animation.translateY(-300).step()
        this.setData({
            animationData: animation.export(),
            hideModalStatus: false,
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal() {
        // 隐藏遮罩层
        let animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(-300).step()
        this.setData({
            animationData: animation.export()
        })
        setTimeout(function () {
            this.setData({
                hideModalStatus: true
            })
        }.bind(this), 200)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        let self = this;
        console.log(res);
        if (res.target.dataset.type==1){
            return {
                title: self.data.item.item.title,
                imageUrl: self.data.item.item.picurl,
                path: '/pages/index/index'
            }
        }else{
            if (res.from === 'button') {
                // 来自页面内转发按钮
                console.log(res.target);
                let data = {
                    type: self.data.titleType,
                    orderid: self.data.orderid,
                    itemid: self.data.itemid,
                    markeid: self.data.currentTeam.id
                };
                console.log(JSON.stringify(data));
                return {
                    title: self.data.item.item.title,
                    imageUrl: self.data.item.item.picurl,
                    path: '/pages/sales/collage/friend/index?info=' + JSON.stringify(data)
                }
            } else {
                wx.hideShareMenu();
            }
        }
        
    }
})