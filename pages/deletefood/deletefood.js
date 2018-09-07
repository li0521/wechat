// pages/deletefood/deletefood.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    food:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      food:wx.getStorageSync('delFood')
    })
  },
  delBind: function () {
    var that = this
    wx.showModal({
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            mask: true
          })
          wx.request({
            url: app.globalData.hostUrl + '/Wechat/DelFood',
            data: {
              openId: wx.getStorageSync('openId'),
              food:that.data.food.food,
              dateType:that.data.food.date_type,
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
})