const app = getApp();
import login from '../../utils/publics/login.js'
const util = require('../../utils/publics/util.js')
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
    login.login().then(res => {
      console.log(options, '传过来的类型');
      var that = this;
      that.setData({
        classval: options.class,
        tradeId: options.tradeId //订单id
      })
      that.getfindDetail(that.data.tradeId);
      that.getWuli(that.data.tradeId)
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
    wx.request({
      url: app.globalData.requestHost + app.globalData.Wuli_Search,
      data: {
        token: wx.getStorageSync('token'),
        tradeNo: tradeNo
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
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
          console.log(wuliList)
          
          let wuliInfo = wuliList.contents.length > 0 ? wuliList.contents[0] : {};
          that.setData({
            wuliList: wuliList,
            wuliInfo: wuliInfo
          })
        }
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
  goTothxq: function (e) {
    wx.navigateTo({
      url: '/pages/details/details?goodid=' + e.currentTarget.dataset.id
    })
  },
  /**点击复制 */
  textPaste(e) {
    wx.showToast({
      title: '复制成功',
      icon : 'none'
    })
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
        if (that.data.classval == 2 || 4) {
          if (res.data.data.unpaid) {
            that.getDataTime(res.data.data.unpaid)
          }
        }
        that.setData({
          orderList: res.data.data
        })
        
      }
    })
  },
  /**点击取消 订单 按钮 */
  goToquxiao: function(e) {
    console.log(e, '订单号')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestHost + app.globalData.Cancel_Order, //取消订单 接口
            data: {
              token: wx.getStorageSync('token'),
              tradeNo: e.currentTarget.dataset.id, //订单号
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              console.log(res, '取消订单成功')
              wx.redirectTo({
                url: '/pages/order/order?id=' + 2
              })
            }
          })
        } else {
          wx.redirectTo({
            url: '/pages/order/order?id=' + 2
          })
        }
      }
    })
  },

  /**点击 支付 按钮 */
  goTozhifu: function() {
    var that = this;
    that.goToBuy(); //然后请求支付接口
  },

  /**请求支付接口 */
  goToBuy: function() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Pay,
      data: {
        token: wx.getStorageSync('token'),
        addressId: that.data.orderList.address.id, //地址id
        tradeNo: that.data.orderList.tradeNo, //订单号
        remark: that.data.orderList.msg, //用户留言
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '弹起支付');
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: function(res) {
            console.log(res, '支付成功了哦')
            wx.switchTab({
              url: '/pages/index/index'
            })
          },
          fail: function(res) {
            console.log(res, '支付失败')
            wx.showToast({
              title: '取消支付',
              icon: 'none',
              success: function(res) {
               
              }
            })
          }
        })
      }
    })
  },
  /**点击 我要催单 按钮 */
  goTocuidan: function (e) {
    wx.showToast({
      title: '以为您催发货',
      icon: 'success'
    })
  },
  /**点击跳转至 退款页面 */
  goTotuikuan: function (e) {
    console.log(e, '带的参数ds')
    wx.redirectTo({
      url: '/pages/my/tuikuan/tuikuan?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalPrice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan + '&tradeId=' + this.data.tradeId
    })
  },
  /**点击跳转至 退款页面 */
  goTotuikuanjindu: function (e) {
    console.log(e, '带的参数ds')
    wx.redirectTo({
      url: '/pages/my/tk_jindu/tk_jindu?&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan + '&status=' + e.currentTarget.dataset.status + '&class' + e.currentTarget.dataset.classval + '&tradeId=' + this.data.tradeId + '&orderid=' + e.currentTarget.dataset.orderid + '&id=' + e.currentTarget.dataset.id
    })
  },
  /**点击查看物流 按钮 */
  goTockwl: function (e) {
    let orderid = e.currentTarget.dataset.orderid;
    let tradeId = e.currentTarget.dataset.tradeid;

    wx.navigateTo({
      url: '/pages/information/information?tradeId=' + tradeId + '&orderid=' + orderid
    })
  },
  goToziWuliu: function () {
    wx.navigateTo({
      url: '/pages/information/information?tradeId=' + e.currentTarget.dataset.tradeid
    })
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