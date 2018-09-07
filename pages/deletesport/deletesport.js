// pages/deletesport/deletesport.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:null,
    sType:null,
    name:null,
  },
  delBind: function(){
    var that = this
    wx.showModal({
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          wx.request({
            url: app.globalData.hostUrl + '/Wechat/DelSport',
            data: {
              openId: wx.getStorageSync('openId'),
              value: that.data.value,
              sType: that.data.sType
            },
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
              if (res.data.code == 1) {
                wx.hideLoading()
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    })
  },
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      value:wx.getStorageSync("value"),
      sType:wx.getStorageSync("type"),
      name:wx.getStorageSync('name'),
    })
  },
})