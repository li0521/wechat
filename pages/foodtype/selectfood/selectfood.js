var app = getApp()
Page({
  data: {
    showModal: false,
    foodData: null,
    thisFood: null,
    foodNum: 100,
  },
  onShow: function() {
    var foodType = wx.getStorageSync("foodType")
    var that = this
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/GetFoodData',
      data: {
        foodType: foodType
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        that.setData({
          foodData: res.data.data
        })
      },
      fail:function(){
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: '加载失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  /**
   * 弹窗
   */
  showDialogBtn: function(e) {
    var food = e.currentTarget.dataset.id
    var foods = this.data.foodData
    var that = this
    for (var i = 0; i < foods.length; i++) {
      if (food == foods[i].food) {
        that.setData({
          thisFood: foods[i]
        })
      }
    }
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    wx.showLoading({
      mask: true
    })
    var that = this
    var foodNum = that.data.foodNum
    wx.request({
      url: app.globalData.hostUrl + '/Wechat/SetFoodNum',
      data: {
        foodNum: foodNum,
        food: that.data.thisFood.food,
        foodName : that.data.thisFood.foodname,
        dateType: wx.getStorageSync('dateType'),
        openId: wx.getStorageSync('openId'),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
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
  inputChange: function(e) {
    this.setData({
      foodNum: e.detail.value
    })
  },
})