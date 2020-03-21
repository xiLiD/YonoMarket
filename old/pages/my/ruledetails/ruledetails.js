// pages/my/ruledetails/ruledetails.js
const app = getApp();
import login from '../../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     rule : '',
     title : '',
     details : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let _this = this;
      wx.setNavigationBarTitle({
        title : options.title
      })
      _this.setData({
        rule: options.rule
      })
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      _this.getData()
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
  // onShareAppMessage: function () {

  // }
  getData(){
    let _this = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Rule,
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == '0000') {
          let details = _this.data.rule == 1 ? res.data.data[0].memberRule : (_this.data.rule == 2 ? (res.data.data[0].integralRule) : (res.data.data[0].distributionRule));
          console.log(res.data.data[0].distributionRule)
          console.log(details)
          details = details.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ').replace(/\<div/gi, '<div style="line-height:1.5;text-align:left');
          details = details.replace(/\<table/gi, '<table style="border-right:1px solid #ddd;border-bottom:1px solid #ddd;border-collapse:collapse;min-width:80px;padding:5px"').replace(/\<td/gi, '<td style="border-left:1px solid #ddd;border-top:1px solid #ddd;min-width:80px;padding:5px"').replace(/\<th/gi, '<th style="border:1px solid #ddd;min-width:80px;padding:5px"'); 
          _this.setData({
            details: details
          })    
        }
      },
    })
  }
})