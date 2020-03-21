// pages/tk_jindu/tk_jindu.js
const app = getApp();
import login from '../../../utils/publics/login.js'
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    options: '',
    refundAddress: '',
    wuli_card: '',
    class: '',
    goods_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      this.setData({
        id: options.zidingdan,
        gid: options.id,
        orderid: options.orderid,
        dId: options.dingdan,
        status: options.status,
        options: options,
        class: options.class
      })
      if (_this.data.status == 8) {
        _this.findDetails();
      }
      _this.getfindDetail(_this.data.orderid);
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
  /**查询订单详情 接口 */
  getfindDetail: function(tradeId) {
    var _this = this;
    console.log(tradeId, '是什么参数')
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_FindDetel, //查询订单详情 接口
      data: {
        token: wx.getStorageSync('token'),
        id: tradeId, //订单号
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '订单详情数据')
        _this.setData({
          orderList: res.data.data
        })
        res.data.data.rels.forEach((item) => {
          if (item.id == _this.data.gid) {
            _this.setData({
              orderInfo: item
            })
          }
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
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  findDetails() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Goods_TuiKuan, //查询订单详情 接口
      data: {
        token: wx.getStorageSync('token'),
        sonTradeNo: that.data.id, //订单号
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data) {
          that.setData({
            refundAddress: res.data.data.refundAddress,
            refundAddressPhone: res.data.data.refundAddressPhone
          })
        }

      }
    })
  },
  changeVal(e) {
    this.setData({
      wuli_card: e.detail.value
    })
  },
  submit() {
    var that = this;
    console.log(that.data.wuli_card);
    if (that.data.wuli_card == '') {
      tool.alert('物流单号不能为空!')
      return;
    }
    tool.loading();
    wx.request({
      url: app.globalData.requestHost + app.globalData.Send_TheGoods, //查询订单详情 接口
      data: {
        token: wx.getStorageSync('token'),
        sonTradeNo: that.data.id, //订单号
        message: that.data.wuli_card
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == '0000') {       
          setTimeout(()=>{
            tool.loading_h();
            setTimeout(()=>{
              tool.alert('提交成功!')
              setTimeout((item) => {
                wx.redirectTo({
                  url: '/pages/sold/sold'
                }, 500)
              })
            },500)
          },500)
        }else {
          setTimeout(() => {
            tool.loading_h();
            setTimeout(()=>{
              tool.alert(res.data.msg)
            },500)
          }, 500)
        }
      }
    })
  },
  /**点击 联系客服按钮 拨打电话 */
  goTotel: function() {
    wx.showModal({
      title: '联系客服',
      content: '13684520060',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13684520060' //仅为示例，并非真实的电话号码
          })
        }
      }
    })

  },
  /**点击 联系商家按钮 */
  goTophon: function() {
    wx.showModal({
      title: '联系商家',
      content: '13684520060',
      success: function(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '13684520060' //仅为示例，并非真实的电话号码
          })
        }
      }
    })
  }
})