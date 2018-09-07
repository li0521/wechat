var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    date: '',
    endDate: '',
    foodData: '',
    sanjiao: '/images/sanjiao.png',
  },
  bindPickerChange_sj: function(e) {
    this.setData({ //给变量赋值
      hisDate: e.detail.value, //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
    })
    this.setData({
      ['foodData.calSum']: 0,
      ['foodData.carSum']: 0,
      ['foodData.proSum']: 0,
      ['foodData.fatSum']: 0,
    })
    this.getHistory()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      date: util.formatTime(new Date),
      endDate: util.formatTime(new Date),
      hisDate: util.formatTime(new Date),
    })
    this.getFoodData()
  },
  onShow: function() {
    this.getFoodData()
  },
  onHide: function() {
    this.setData({
      hisDate: util.formatTime(new Date),
    })
  },
  getFoodData: function() {
    var that = this
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetDietData',
      data: {
        openId: wx.getStorageSync("openId"),
        date: that.data.date,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          foodData: res.data.data,
        })
      }
    })
  },
  goTofirst: function(e) {
    var date = e.currentTarget.dataset.id
    wx.setStorageSync('dateType', date)
    wx.navigateTo({
      url: '/pages/foodtype/foodtype',
    })
  },
  tap: function(e) {
    var food = e.currentTarget.dataset.food
    wx.setStorageSync('delFood', food)
  },
  getHistory: function() {
    var that = this
    var date = that.data.hisDate
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetDietData',
      data: {
        openId: wx.getStorageSync('openId'),
        date: date,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          ['foodData.calSum']: res.data.data.calSum,
          ['foodData.carSum']: res.data.data.carSum,
          ['foodData.proSum']: res.data.data.proSum,
          ['foodData.fatSum']: res.data.data.fatSum,
        })
      }
    })
  },
})