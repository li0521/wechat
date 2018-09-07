var wxCharts = require('../../utils/wxcharts-min.js');
var app = getApp();
var historyChart = null;
var util = require('../../utils/util.js')
// pages/sporthistory/sporthistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    date1: '',
    sanjiao: "/images/sanjiao.png",
    juxing:"/images/juxing.png",
    Data:null,
    dataDate:[],
    dataCal:[],
  },
  // 日期事件
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  //图表事件
  touchHandler: function (e) {
    historyChart.scrollStart(e);
  },
  moveHandler: function (e) {
    historyChart.scroll(e);
  },
  touchEndHandler: function (e) {
    historyChart.scrollEnd(e);
    historyChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  //查询历史
  getHistoryData: function(){
    var that = this
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetHistoryDatas',
      data: {
        openId: wx.getStorageSync('openId'),
        date: this.data.date,
        date1: this.data.date1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          Data: res.data.Data
        })
        var date = []
        var cal = []
        for (var i = 0; i < that.data.Data.length; i++) {
          date.push(that.data.Data[i].date)
          cal.push(that.data.Data[i].cal)
        }
        that.setData({
          dataDate: date,
          dataCal: cal,
        })
        that.getMothElectro(); //加载图表
      }
    })
  },
  getHistory:function(){
    this.getHistoryData()
  },
  //生成图表
  getMothElectro: function () {
    var that = this
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    historyChart = new wxCharts({
      canvasId: 'sportHistory',
      type: 'line',
      categories: that.data.dataDate,
      animation: false,
      series: [{
        name: '热量',
        data: that.data.dataCal,
        format: function (val, name) {
          return val + '千卡';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '千卡',
        format: function (val) {
          return val;
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      enableScroll: true,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date1 = util.formatTime(new Date)
    var date = date1.substr(0,8) + '01'
    var that = this
    this.setData({
      date: date,
      date1: date1,
    })
    that.getHistoryData()
  },
})