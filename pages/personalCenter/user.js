// pages/personal center/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    personalBk:'/images/personalbk.png',
    touxiang:'/images/touxiang.png',
    sex: '',
    height: '',
    weight: '',
    birth: '',
    cal: '',
    bmi:'',
  },
  
  bindGetUserInfo: function (e) {
    //获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    if(e.detail.userInfo){
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    var code = null;
    //登录
    wx.login({
      success: function (res) {
        if (res.code) {
          code = res.code;//登录凭证
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 后台解密用户数据返回openID
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //发起网络请求
              wx.request({
                url: app.globalData.hostUrl + '/Wechat/Login',
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  wx.setStorageSync('openId', res.data.openId)
                },
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function (options) {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    } 
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetUserData',
      data:{
        openId: wx.getStorageSync("openId"),
      },
      success:function(res){
        that.setData({
          sex:res.data.sex,
          height:res.data.height,
          weight:res.data.weight,
          birth:res.data.birth,
          cal:res.data.cal.toFixed(2),
          bmi:res.data.bmi.toFixed(2),
        })
      }
    })
  },
  alter: function(){
    wx.navigateTo({
      url: '/pages/personalCenter/alter',
    })
  },
})