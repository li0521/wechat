const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    date: "",
    endDate: '',
    sanjiao: "/images/sanjiao.png",
    kaluli: "1760",
    juxing: "/images/juxing.png",
    juxing1: "/images/juxing1.png",
    jiahao: "/images/+.png",
    rundata: '-',
    hasRundata: false,
    todayData: null,
    hisData: [],
    jogNum: 0,
    walkNum: 0,
    stairNum: 0,
    weWalkNum: 0,
    num:0,
  },
  toFixed: function (num, d) {
    num *= Math.pow(10, d);
    num = Math.round(num);
    return num / (Math.pow(10, d));
  },
  getHistory: function() {
    var that = this
    that.setData({
      jogNum: 0,
      walkNum: 0,
      stairNum: 0,
      weWalkNum: 0,
    })
    var openId = wx.getStorageSync("openId")
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetHistory',
      data: {
        openId: openId,
        date: that.data.date,
      },
      success: function(res) {
        that.setData({
          hisData: res.data.Data
        })
        for (var i = 0; i < that.data.hisData.length; i++) {
          if (that.data.hisData[i].sp_type == 'jog') {
            that.setData({
              jogNum: that.data.hisData[i].sp_num * 0.15,
            })
          } else if (that.data.hisData[i].sp_type == 'walk') {
            that.setData({
              walkNum: that.data.hisData[i].sp_num * 0.09,
            })
          } else if (that.data.hisData[i].sp_type == 'stair') {
            that.setData({
              stairNum: that.data.hisData[i].sp_num * 0.1,
            })
          } else if (that.data.hisData[i].sp_type == 'Wewalk') {
            that.setData({
              weWalkNum: that.data.hisData[i].sp_num * 0.04,
            })
          }
        }
        that.setData({
          num: (that.data.jogNum + that.data.walkNum + that.data.stairNum + that.data.weWalkNum).toFixed(2)
        })
      }
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  getRundata: function() {
    var that = this;
    //获取授权
    wx.getWeRunData({
      //微信运动授权成功
      success: res => {
        that.setData({
          isCheckedjibu: true,
          hasRundata: true,
        })
        wx.request({
          url: getApp().globalData.hostUrl + '/Wechat/GetWeRunData',
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
            openId: wx.getStorageSync('openId'),
          },
          success: function(res) {
            that.setData({
              rundata: res.data.step,
              km: (res.data.step * 0.0005).toFixed(2),
              caluli: (res.data.step * 0.04).toFixed(2),
              num: (that.data.jogNum + that.data.walkNum + that.data.stairNum + (res.data.step * 0.04)).toFixed(2),
            })
            wx.request({
              url: app.globalData.hostUrl + "/Wechat/SetCal",
              data: {
                openId: wx.getStorageSync('openId'),
                cal: that.data.num,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {

              },
            })
          }
        })
      },
      //授权失败
      fail: res => {
        that.setData({
          isCheckedjibu: false,
          hasRundata: false,
        })
      }
    })
  },
  getTodaydata: function() {
    var that = this
    var openId = wx.getStorageSync('openId')
    wx.request({
      url: getApp().globalData.hostUrl + '/Wechat/GetTodayData',
      data: {
        openId: openId,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          todayData: res.data.todayData
        })
        for (var i = 0; i < that.data.todayData.length; i++) {
          if (that.data.todayData[i].sp_type == 'jog') {
            that.setData({
              ['todayData[' + i + '].name']: '慢跑',
              ['todayData[' + i + '].cal']: that.toFixed(that.data.todayData[i].sp_num * 0.15,2),
              jogNum: that.toFixed(that.data.todayData[i].sp_num * 0.15,2),
            })
          } else if (that.data.todayData[i].sp_type == 'walk') {
            that.setData({
              ['todayData[' + i + '].name']: '慢走',
              ['todayData[' + i + '].cal']: that.toFixed(that.data.todayData[i].sp_num * 0.09,2),
              walkNum: that.toFixed(that.data.todayData[i].sp_num * 0.09,2),
            })
          } else if (that.data.todayData[i].sp_type == 'stair') {
            that.setData({
              ['todayData[' + i + '].name']: '上下楼',
              ['todayData[' + i + '].cal']: that.toFixed(that.data.todayData[i].sp_num * 0.1,2),
              stairNum: that.toFixed(that.data.todayData[i].sp_num * 0.1,2),
            })
          } else if (that.data.todayData[i].sp_type == 'Wewalk') {
            that.setData({
              weWalkNum: that.toFixed(that.data.todayData[i].sp_num * 0.04,2),
            })
          }
        }
        that.setData({
          num: (that.data.jogNum + that.data.walkNum + that.data.stairNum + that.data.weWalkNum).toFixed(2),
        })
        wx.request({
          url: app.globalData.hostUrl + "/Wechat/SetCal",
          data: {
            openId: openId,
            cal: that.data.num,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {

          },
        })
      }
    })
  },
  bindchangejibu: function(e) {
    var that = this;
    if (this.data.isCheckedjibu) {
      wx.showModal({
        content: '是否前往设置关闭微信运动授权？',
        confirmText: "确认",
        cancelText: "取消",
        success: function(res) {
          console.log(res);
          //点击“确认”时打开设置页面
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.werun']) {
                  that.setData({
                    isCheckedjibu: true,
                    hasRundata: true,
                  })
                } else {
                  that.setData({
                    isCheckedjibu: false,
                    hasRundata: false,
                  })
                }
              }
            })
          } else {
            that.setData({
              isCheckedjibu: true,
              hasRundata: true,
            })
          }
        }
      });
    } else {
      wx.showModal({
        content: '是否前往设置打开微信运动授权？',
        confirmText: "确认",
        cancelText: "取消",
        success: function(res) {
          console.log(res);
          //点击“确认”时打开设置页面
          if (res.confirm) {
            wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.werun']) {
                  that.setData({
                    isCheckedjibu: true,
                    hasRundata: true,
                  })
                  that.getRundata();
                } else {
                  that.setData({
                    isCheckedjibu: false,
                    hasRundata: false,
                  })
                }
              }
            })
          } else {
            that.setData({
              isCheckedjibu: false,
              hasRundata: false,
            })
          }
        }
      });
    }
  },
  delete: function(e) {
    var id = e.currentTarget.dataset.id
    var value = e.currentTarget.dataset.value
    var name = e.currentTarget.dataset.name
    wx.setStorageSync('type', id)
    wx.setStorageSync('value', value)
    wx.setStorageSync('name', name)
  },
  onLoad: function() {
    this.getRundata();
    this.getTodaydata();
    this.setData({
      date: util.formatTime(new Date),
      endDate: util.formatTime(new Date),
    })
  },
  onShow: function() {
    this.getRundata();
    this.getTodaydata();
  },
  onHide: function () {
  },
})