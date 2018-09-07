// pages/selectsport/selectsport.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['20分钟', '25分钟', '30分钟', '35分钟','40分钟','45分钟','50分钟','55分钟','60分钟'],
    value: [20,25,30,35,40,45,50,55,60],
  },
  bindPickerChange: function (e) {
    var that = this;
    var value = that.data.value[e.detail.value]
    var sportType = e.currentTarget.dataset.id
    var openId = wx.getStorageSync('openId')
    wx.showLoading({
      mask: true
      })
    wx.request({
      url: getApp().globalData.hostUrl + '/Wechat/AddSportData',
      data:{
        openId: openId,
        sportType: sportType,
        value: value,
      },
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.code == 1){
          //添加成功
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
        }
        else{
          wx.hideLoading()
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 2000
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
    wx.request({
      url: getApp().globalData.hostUrl + '/Wechat/GetSportType',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          sport: res.data.sport
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})