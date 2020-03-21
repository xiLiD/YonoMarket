// pages/seckill/seckill.js

const util = require('../../utils/publics/util.js')
import login from '../../utils/publics/login.js'
const app = getApp()

let countdown = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown: {},
    isShow: false,
    firstShow:false,
    showPage : false
  },
  buy(e) {
    let index = e.currentTarget.dataset.index;
    let goodid = this.data.killGoods[index].goods.id;
    wx.navigateTo({
      url: `/pages/seckillDetails/seckillDetails?goodid=${goodid}`,
    })
  },
  getDataTime(second) {
    if (second > 0) {
      clearInterval(countdown)
      countdown = setInterval(() => {
        if (second > 0) {
          var time = util.minutesAndSeconds(second--);
        } else {
          clearInterval(countdown)
        }
        this.setData({
          countdown: time.tiems,
          isShow: true
        })

      }, 1000)
    }
  },

  initData() {
    var _this = this
    let bfb = []
    let storeNum = []
    wx.request({
      url: app.globalData.requestHost + app.globalData.Kill_Goods,
      data: {

      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res)
        if(res.data.data.length > 0){
          let goodsList = res.data.data
          goodsList.forEach((item, index) => {
            bfb[index] = parseInt(item.goods.sales / item.goods.storeNum)
            storeNum[index] = item.goods.storeNum
          })
          _this.setData({
            killGoods: res.data.data,
            bfb,
            storeNum,
          })
          let second = res.data.data[0].residue;
          _this.getDataTime(second);
          _this.setData({ showPage: true })
        }else{
          _this.setData({ showPage: true })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      this.initData();
      this.setData({
        firstShow: true
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(this.data.firstShow){
      this.initData()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(countdown)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})