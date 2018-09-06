// pages/item/detail/index.js
import $item from '../../../request/item.js';
import $company from '../../../request/company.js';
import $itemevaluate from '../../../request/itemevaluate.js';
const WxParse = require('../../../libs/wxParse/wxParse.js');
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isIpx: app.globalData.isIpx,
        shareIcon: "/static/images/share_icon.png",
        phoneIcon: "/static/images/phone_icon.png",
        addrIcon: "/static/images/address_icon.png",
        scoreMoreIcon: "/static/images/back_red.png",
        itemid: '',
        itemInfo: {},
        itemPicture: [],
        company: {},
        scoreInfo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
      
        let self = this;
        wx.showShareMenu({
            withShareTicket: true
        });
        if (ops.info) {
            app.globalData.shareBol = true;
            self.setData({
                itemid: ops.info,
                itemShareBol: true
            });
        } else {
            app.globalData.shareBol = false;
            self.setData({
                itemid: ops.itemid,
                itemShareBol: false
            });
        }
        self.getData();
    },
    getData() {
        let self = this;
        let detailData = {
            itemid: self.data.itemid
        };
        let itemevaluateData = {
            itemid: self.data.itemid,
            pageindex: 0,
            pagesize: 2
        }
        wx.showLoading({
            title: '加载中',
        })
        Promise.all([$item.detail(detailData), $company.contact(), $itemevaluate.list(itemevaluateData),
        $item.countorder(detailData)]).then(res => {
            wx.hideLoading();
            self.setData({
                itemInfo: res[0].data.data.item,
                itemPicture: res[0].data.data.itempicture,
                company: res[1].data.data,
                scoreInfo: {
                    totalcount: res[2].data.totalcount,
                    scoreList: res[2].data.data,
                },
                totalNum: res[3].data.data
            })
            console.log(self.data.itemInfo.description);
            WxParse.wxParse('article', 'html', self.data.itemInfo.description, self, 5);
        })
    },
    //查看评价
    lookScore(e) {
        let id = this.data.itemid;
        wx.navigateTo({
            url: '/pages/mine/score/list/index?itemid=' + id,
        })
    },
    callPhone(e) {
        wx.makePhoneCall({
            phoneNumber: this.data.company.mobile,
        })
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
    //立即购买
    bindBuy(e) {
        // console.log('e',e.detail);
        // if (e.detail.iv){
        //     app.getUserPhone(e.detail);
        // }
        let self = this;
        let itemInfo = self.data.itemInfo;
        let item = {
            picurl: itemInfo.picurl,
            price: itemInfo.price,
            num: itemInfo.num,
            title: itemInfo.title,
            itemid: itemInfo.id,
            itemmodel: itemInfo.itemmodel
        }
        wx.navigateTo({
            url: '/pages/order/submit/index?item=' + JSON.stringify(item),
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(res) {
        let self = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            return {
                title: self.data.itemInfo.title,
                imageUrl: self.data.itemInfo.picurl,
                path: '/pages/item/detail/index?info=' + self.data.itemid,
            }
        } else {
            wx.hideShareMenu();
        }
    }
})