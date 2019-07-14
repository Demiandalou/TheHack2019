
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    voteTitle: null,
    style: "starry_night",
    b1checked: false,
    b2checked: false,
    imgok: false,
    imgurl: null,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    b1checked: (options.b1checked == "false" ? false : true)
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
  },
  getpic: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
      wx.showToast({
        title: '正在上传...',
        icon: 'loading',
        mask: true,
        duration: 1000
      })
      // tempFilePath可以作为img标签的src属性显示图片
      const picture = res.tempFilePaths[0];
      
      wx.uploadFile({
        url: 'http://10.15.89.41:32602/image',
        filePath: picture,
        name: 'image',
        formData: {
          'style': _this.data.style
        },
        success: (res) => {
          wx.hideToast();
          _this.setData({
            imgok: true,
            imgurl: JSON.parse(res.data).imgurl
          })
        },
        fail: (res) => {
          wx.hideToast();
          wx.showToast({
            title: JSON.parse(res.data).message,
          })
        }
      })
    }})
  },
  selectb1: function () {
    this.setData({
      style: "starry_night",
      b1checked: (!this.data.b1checked),
      b2checked: false
    })
  },
  selectb2: function () {
    this.setData({
      style: "creepy",
      b2checked: (!this.data.b2checked),
      b1checked: false
    })
  },
  previewImage: function() {
    var _this = this;
    wx.previewImage({
      current: _this.data.imgurl,
      urls: [_this.data.imgurl]
    })
  },
  voteTitle: function (e) {
    this.data.voteTitle = e.detail.value;
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})


// Page({
//   data: {
    
//   },
//   voteTitle: function (e) {
//     this.data.voteTitle = e.detail.value;
//   },
  // click: function () {
  // selectb1(){
  //   this.setData({
  //     b1checked:true
  //   })
  // },
  // selectb2(){
  //   this.setData({
  //     b2checked: true
  //   })
  // }
  // },
// })