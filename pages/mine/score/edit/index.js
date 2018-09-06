// pages/mine/score/edit/index.js
const utils = require("../../../../utils/util.js");
import $itemevaluate from "../../../../request/itemevaluate.js";
import $qinniu from "../../../../request/qiniu.js";
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gradeArr: ["非常不满意", "不满意", "一般", "满意", "非常满意"],
        gradeIcon: "../../../../static/images/grade_icon@3x.png",
        gradeIconActive: "../../../../static/images/grade_icon_selected@3x.png",
        takePicIcon: "../../../../static/images/take_pic_icon@3x.png",
        itemList:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(ops) {
        let itemObj = ops ? JSON.parse(ops.itemObj) : {}
        let itemList = itemObj.orderDetails;
        for (let attr of itemList) {
            attr.remark = "";
            attr.evaluateurls = "";
            attr.rate = 0;
            attr.imgList=[];
        }
        this.setData({
            itemList: itemObj.orderDetails,
            orderInfo:{
                orderid: itemObj.orderid,
                avatarurl: app.globalData.userInfo.avatarUrl,
                nickname: app.globalData.userInfo.nickName,
            }
        });
    },
    /**
     * 评分打星
     */
    gradeBtn(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let pindex = e.currentTarget.dataset.pindex;
        let str = `itemList[${pindex}].rate`;
        self.setData({
            [str]: index + 1
        });
    },
    /**
     * text 失去焦点
     */
    textBlur(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let value = e.detail.value;
        let str = `itemList[${index}].remark`;
        self.setData({
            [str]: value
        })
    },
    /**
     * 添加图片
     */
    takePic(e) {
        let self = this;
        let index = e.currentTarget.dataset.index;
        let randomKey=utils.getRandomNum();
        $qinniu.uploadImg(randomKey,res=>{
            let imgList =self.data.itemList[index].imgList;
            let str =`itemList[${index}].imgList`;
            imgList.push(res.data.tempFilePaths);
            self.setData({
                [str]: imgList
            });    
        }, (progress)=>{
            console.log('progress', progress);
        })          
    },
    //图片操作
    bindImg(e){
        let self=this;
        let index = e.currentTarget.dataset.index;
        let pindex = e.currentTarget.dataset.pindex;
        let img= e.currentTarget.dataset.img;
        wx.showActionSheet({
            itemList: ['预览', '删除'],
            success: function (res) {
                if (res.tapIndex==0){
                    wx.previewImage({
                        urls: [img],
                    });
                } else if(res.tapIndex==1){
                    let imgs = self.data.itemList[pindex].imgList;
                    imgs.splice(index,1);
                    let str =`itemList[${pindex}].imgList`;
                    self.setData({
                        [str]: imgs
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    //提交
    scoreSumit(){
        let self=this;
        let itemList = self.data.itemList;
        let rateBol=true;
        for (let attr of itemList){
            if(attr.rate<=0){
                rateBol=false;
            }
            attr.evaluateurls = attr.imgList.join(',');
        }
        if (rateBol){
            wx.showModal({
                title: '温馨提示',
                content: '确认提交吗',
                success(res){
                    if (res.confirm) {
                        let data = {
                            ...self.data.orderInfo,
                            openid: app.globalData.openid,
                            items: JSON.stringify(self.data.itemList)
                        }
                        wx.showNavigationBarLoading();
                        $itemevaluate.add(data).then(res => {
                            wx.hideNavigationBarLoading();
                            if (res.data.result == 1) {
                                wx.showToast({
                                    title: '评价成功',
                                    icon: 'none',
                                    duration: 1000
                                })
                                setTimeout(() => {
                                    wx.navigateBack();
                                }, 1000);
                            } else {
                                wx.showToast({
                                    title: res.data.msg,
                                    icon: 'none',
                                    duration: 1000
                                })
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })
           
        }else{
            wx.showToast({
                title: '亲，您还有商品未评价',
                icon:'none',
                duration:1000
            })
        }    
    }

})