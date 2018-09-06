//app.js
const utils = require('./utils/util.js');
const getSetting = utils.requestPromisify(wx.getSetting);
import $member from "./request/member.js";
App({
  onLaunch: function (options) {
    let self = this;
    if (wx.getExtConfigSync().qiniu) {
      this.globalData.imageUrl = wx.getExtConfigSync().qiniu.imageUrl;
    } else {
      this.globalData.imageUrl = "http://pic.meisaas.com";
    }
    // 展示本地存储能力
    console.log("[onLaunch] 场景值:", options);
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("版本信息", res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      console.log("更新失败");
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success(res) {
              wx.getUserInfo({
                success: info => {
                  // 可以将 res 发送给后台解码出 unionId
                  self.userLogin(res, info);
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (self.userInfoReadyCallback) {
                    self.userInfoReadyCallback(info)
                  }
                }
              })
            },
          })
        } else {
          console.log('未授权');
        }
      }
    });
  },
  onShow() {
    this.globalData.windowHeight = wx.getSystemInfoSync().windowHeight;
    this.globalData.isIpx = wx.getSystemInfoSync().model.indexOf('iPhone X') != -1 ? true : false;
  },
  //获取openid,在平台注册。
  userLogin(resCode, info) {
    let self = this;
    this.globalData.userInfo = info.userInfo;
    $member.login({
      jscode: resCode.code
    }).then(data => {
      wx.setStorageSync('openid', data.data.openid);
      let userData = {
        openid: data.data.openid,
        encryptedData: info.encryptedData,
        iv: info.iv
      };
      $member.userinfo(userData).then(res => {
        if (res.data == 1) {
          wx.setStorageSync('registerBol', true);
          console.log("新用户注册成功");
        } else {
          wx.setStorageSync('registerBol', false);
          console.log('用户登陆注册', res);
        }
        return true;
      });
    })
  },
  getUserPhone(param) {
    let self = this;
    wx.checkSession({
      success() {
        let data = {
          openid: self.globalData.openid,
          encryptedData: param.encryptedData,
          iv: param.iv
        }
        $member.phonenumber(data).then(res => {
          console.log('phone', res);
          wx.setStorageSync('phone', res.data.purePhoneNumber);
        })
      },
      fail() {
        wx.login({
          success(resCode) {
            $member.login({
              jscode: resCode.code
            }).then(() => {
              self.getUserPhone();
            })
          }
        })
      }
    });
  },
  globalData: {
    userInfo: null,
    imageUrl: "",
    openid: wx.getStorageSync('openid'),
    cateid: '',
    userInfoBol: true,//是否主动已经弹过授权框。true——>否 false——>弹过
    windowHeight: '',
    bindBol: true,
    isIpx: false,
    shareBol: false,//是否从分享链接过来
  }
})