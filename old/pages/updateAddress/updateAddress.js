// pages/updateAddress/updateAddress.js
const app = getApp()
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj : {},
    addressid : 52,
    oldaddress : '',
    index : 0,
    tradeId : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      console.log(options)
      if (options.status) {
        this.setData({
          tradeId: options.tradeId
        })
        this.getdataByid(options.addressid)
      }
      if (options.tradeId) {
        this.setData({
          tradeId: options.tradeId
        })
      }
      if (options.addressid) {
        this.setData({
          addressid: options.addressid
        })
        this.getdataByid(options.addressid)
      }
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
    // if(this.data.key){
    //   console.log(this.data)
    //   this.getdata();
    // }
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

  // },
  goToAddress(){
    console.log(this.data.addressid)
    wx.navigateTo({
      url: '/pages/addressDetails/addressDetails?addressid=' + this.data.addressid + '&tradeId=' + this.data.tradeId,
    })
  },
  getdataByid(id){
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_List,
      data: {
        token: wx.getStorageSync('token'),
        page: this.data.index,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '地址列表')
        that.setData({
          addressList: res.data.data
        })

        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。

        let prevPage = pages[pages.length - 2];

        //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。

        
        res.data.data.forEach((item) => {
          if (id == item.id) {
            console.log(item)
            that.setData({
              addressObj: item
            })
          }
        })

        // wx.redirectTo({
        //   url: '/pages/updateAddress/updateAddress?addressid=' + id
        // })


      },
    })
  },
  getdata() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_List,
      data: {
        token: wx.getStorageSync('token'),
        page: this.data.index,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '地址列表')
        that.setData({
          addressList: res.data.data
        })
        res.data.data.forEach((item)=>{
          if (item.addressid == item.id){
            this.setData({
              addressObj: item
            })
          }
        })
      },
    })
  },
  cancelUpdate(){
    wx.redirectTo({
      url: '/pages/order/order?id=' + 2
    })
  },
  updateAddress(){
    let that = this;
    if (this.data.addressid == this.data.oldaddress){
      wx.showToast({
        title: '两次的地址不能一致！',
        icon : 'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_Address,
      data: {
        token: wx.getStorageSync('token'),
        addressId: that.data.addressid,
        tradeNo: that.data.tradeId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if(res.data.success == true){
          wx.showToast({
            title: '提交成功！',
            icon: 'none'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/order/order?id=' + 2
            })
          }, 500)
        }
      },
    })
  }
})