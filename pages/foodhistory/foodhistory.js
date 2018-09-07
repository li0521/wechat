// pages/foodhistory/foodhistory.js
var util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2016-09-01',
    date1: '2016-09-01',
    sanjiao: "/images/sanjiao.png",
    juxing: "/images/juxing.png",
    Data: [],
  },

  // 日期事件
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function (e) {
    this.setData({
      date1: e.detail.value
    })
  },
  // 表单事件
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date1 = util.formatTime(new Date)
    var date = date1.substr(0, 8) + '01'
    var that = this
    this.setData({
      date: date,
      date1: date1,
    })
    that.getHistoryData()
  },
  //查询历史
  getHistoryData: function () {
    var that = this
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetDietHistory',
      data: {
        openId: wx.getStorageSync('openId'),
        date: that.data.date,
        date1: that.data.date1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          Data: res.data.dietList
        })
      }
    })
  },
  getData:function(){
    this.getHistoryData()
  }
})