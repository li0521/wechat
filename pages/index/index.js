//index.js
//获取应用实例

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    indexData: null,
    per: null,
    index_image: "/images/index.png",
    touxiang: "/images/touxiang.png",
    dianzan: '/images/dianzan.png',
    dianzan1: '/images/dianzan1.png',
    juxing: '/images/juxing.png'
  },
  //点赞
  zan: function(e) {
    var info_id = e.currentTarget.dataset.id;
    for (var i = 0; i < this.data.indexData.length; i++) {
      if (this.data.indexData[i].id == info_id) {
        var sum = this.data.indexData[i].zansum
        if (this.data.indexData[i].isZan == true) {
          this.setData({
            ['indexData[' + i + '].isZan']: false,
            ['indexData[' + i + '].zansum']: sum - 1
          })
        } else {
          this.setData({
            ['indexData[' + i + '].isZan']: true,
            ['indexData[' + i + '].zansum']: sum + 1
          })
        }
      }
    }
    wx.setStorageSync('indexData', this.data.indexData);
  },

  //事件处理函数
  onLoad: function() {
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
      });
    }

    //读取首页数据
    var openId = wx.getStorageSync('openId');
    if (openId && openId != '') {
      var that = this;
      wx.request({
        url: app.globalData.hostUrl + '/Wechat/GetIndexData',
        data: {
          openId: openId,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.setData({
            indexData: res.data.indexdata,
            per: res.data.per,
          })
          wx.setStorageSync('indexData', res.data.indexdata);
        },
      })
    } else {
      app.openIdCallback = openId => {
        var that = this;
        wx.request({
          url: app.globalData.hostUrl + '/Wechat/GetIndexData',
          data: {
            openId: openId,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              indexData: res.data.indexdata,
              per: res.data.per,
            })
            wx.setStorageSync('indexData', res.data.indexdata);
          },
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
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

    //读取首页数据
    var openId = wx.getStorageSync('openId');
    if (openId && openId != '') {
      var that = this;
      wx.request({
        url: app.globalData.hostUrl + '/Wechat/GetIndexData',
        data: {
          openId: openId,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          that.setData({
            indexData: res.data.indexdata,
            per: res.data.per,
          })
          wx.setStorageSync('indexData', res.data.indexdata);
        },
      })
    } else {
      app.openIdCallback = openId => {
        var that = this;
        wx.request({
          url: app.globalData.hostUrl + '/Wechat/GetIndexData',
          data: {
            openId: openId,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.setData({
              indexData: res.data.indexdata,
              per: res.data.per,
            })
            wx.setStorageSync('indexData', res.data.indexdata);
          },
        })
      }
    }

  },

  onHide: function() {
    // 页面隐藏，更新数据
    var zanlist = [];
    var indexdata = wx.getStorageSync('indexData');
    for (var i = 0; i < indexdata.length; i++) {
      if (indexdata[i].isZan) {
        zanlist.push(indexdata[i].user_id);
      }
    }
    var openId = wx.getStorageSync('openId');
    if (openId && openId != '') {
      wx.request({
        url: app.globalData.hostUrl + '/Wechat/PostIndexData',
        data: {
          openId: openId,
          zanlist: zanlist,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {},
      })
    }
  },
})