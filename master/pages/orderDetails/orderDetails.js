const app = getApp();
const util = require('../../utils/util.js');
import ajax from '../../utils/api/my-requests.js';
import tool from '../../utils/publics/tool.js';
let countdown = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classval: '', //默认是空
    orderList: {}, //订单详情数据
    isShow:false,
    countdown: {
      times : ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      var that = this;
      that.setData({
        classval: options.class,
        tradeId: options.tradeId //订单id
      })  
      tool.loading();
      Promise.all([ that.getfindDetail(that.data.tradeId) , that.getWuli(that.data.tradeId) ]).then((res)=>{
        tool.loading_h();
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      isShow:true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(this.isShow){
      this.getfindDetail(this.data.tradeId)
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

  // },
  // 获取订单物流
  getWuli: function (tradeNo) {
    var that = this;
    ajax.wuliuSearch({
      token: wx.getStorageSync('token'),
      tradeNo: tradeNo
    }).then((res)=>{
      // console.log(res, '一级分类数据')
      let wuliList = {}
      console.log(JSON.parse(res.data.data))
      if (res.data.data) {
        wuliList.contents = JSON.parse(res.data.data).contents.reverse();
        wuliList.expNo = JSON.parse(res.data.data).expNo
        let count = 0;
        wuliList.contents.forEach((item) => {
          let day = item.time.split(' ')[0]
          let time_details = item.time.split(' ')[1]
          item.day = day;
          item.time_details = time_details;
          count++;
        })
        wuliList.count = count
        let wuliInfo = wuliList.contents.length > 0 ? wuliList.contents[0] : {};
        that.setData({
          wuliList: wuliList,
          wuliInfo: wuliInfo
        })
      }
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
  linkNav(e) {
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击复制 */
  textPaste(e) {
    tool.alert('复制成功');
    wx.setClipboardData({
      data: e.currentTarget.dataset.trade,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**查询订单详情 接口 */
  getfindDetail: function(tradeId) {
    var that = this;
    console.log(tradeId,'是什么参数')
    ajax.orderDetails({
      token: wx.getStorageSync('token'),
      id: tradeId, //订单号
    }).then((res)=>{
      console.log(res, '订单详情数据')
      if (that.data.classval == 2 || 4) {
        if (res.data.data.unpaid) {
          that.getDataTime(res.data.data.unpaid)
        }
      }
      that.setData({
        orderList: res.data.data
      })
    })
  },
  linkRed(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_red(url);
  },
  // 跳转到指定的地址
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击 联系客服按钮 拨打电话 */
  goTotel: function () {
    wx.showModal({
      title: '联系客服',
      content: '022-23970088',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '022-23970088' //仅为示例，并非真实的电话号码
          })
        }
      }
    })

  },
  /**点击 联系商家按钮 */
  goTophon: function () {
    wx.showModal({
      title: '联系商家',
      content: '022-23970088',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '022-23970088' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  }
})