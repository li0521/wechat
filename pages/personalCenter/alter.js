// pages/personalCenter/alter.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birth:'',
    height:'',
    weight:'',
  },
  onLoad:function(){
    var that = this
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetUserData',
      data: {
        openId: wx.getStorageSync("openId"),
      },
      success: function (res) {
        that.setData({
          height: res.data.height,
          weight: res.data.weight,
          birth: res.data.birth,
        })
      }
    })
  },
  bindDateChange:function(e){
    this.setData({
      birth: e.detail.value,
    })
  },
  heightChange:function(e){
    this.setData({
      height: e.detail.value,
    })
  },
  weightChange: function (e) {
    this.setData({
      weight: e.detail.value,
    })
  },
  save: function(){
    var that = this 
    wx.showLoading({
      mask: true
    })
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/UpdateUsrData',
      data: {
        openId: wx.getStorageSync('openId'),
        height: that.data.height,
        weight: that.data.weight,
        date: that.data.birth,
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
        if (res.data.code == 1) {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  }
})