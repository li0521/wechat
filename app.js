//app.js
App({
  
  onLaunch: function () {
    var code = null;
    // 登录

    wx.login({
      success: function (res) {
        if (res.code) {
          code = res.code;//登录凭证
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              //发起网络请求
              wx.request({
                url: getApp().globalData.hostUrl + '/Wechat/Login',
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  wx.setStorageSync('openId', res.data.openId)
                  //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (getApp().openIdCallback){
                    getApp().openIdCallback(res.data.openId)
                  }
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
  globalData: {
    userInfo: null,
    //hostUrl: 'http://localhost:8080',
    hostUrl: 'https://cloud821.cn'
  }
})