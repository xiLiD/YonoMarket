// pages/tk_jindu/tk_jindu.js
const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
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
    //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
    this.setData({
      id: options.zidingdan,
      gid: options.id,
      orderid: options.orderid,
      dId: options.dingdan,
      status: options.status,
      options: options
    })
    if (_this.data.status == 8) {
      _this.findDetails();
    }
    _this.getfindDetail(_this.data.orderid);
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
    console.log(tradeId, '是什么参数');
    ajax.orderDetails({
      token: wx.getStorageSync('token'),
      id: tradeId, //订单号
    }).then((res) => {
      _this.setData({ orderList: res.data.data });
      res.data.data.rels.forEach((item) => {
        if (item.id == _this.data.gid) {
          _this.setData({
            orderInfo: item
          })
        }
      });
    });
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
    ajax.goodsTuiKuan({
      token: wx.getStorageSync('token')
    }).then((res) => {
      if (res.data) {
        that.setData({
          refundAddress: res.data.data.addressName,
          refundAddressPhone: res.data.data.phone
        })
      }
    });
  },
  changeVal(e) {
    this.setData({ wuli_card: e.detail.value })
  },
  submit() {
    var that = this;
    console.log(that.data.wuli_card);
    if (that.data.wuli_card == '') {
      tool.alert('物流单号不能为空!')
      return;
    }
    tool.loading();
    new Promise((resolve,reject)=>{
      setTimeout(()=>{
        ajax.sendGoods({
          token: wx.getStorageSync('token'),
          sonTradeNo: that.data.id, //订单号
          message: that.data.wuli_card
        }).then((res) => {
          let msg = res.data.msg;
          if(res.data.code == '0000'){
            tool.alert('提交成功!')
            setTimeout((item) => {
              tool.jump_red('/pages/sold/sold')
            },500)
            resolve();
            return;
          }
          tool.alert(res.data.msg);
          resolve();
        })
      },500)
    })
  },
  /**点击 联系客服按钮 拨打电话 */
  goTotel: function() {
    tool.showModal('联系客服','13684520060').then((res)=>{
      if(res){
        wx.makePhoneCall({
          phoneNumber: '13684520060' //仅为示例，并非真实的电话号码
        })
      }
    })
  },
  /**点击 联系商家按钮 */
  goTophon: function() {
    tool.showModal('联系客服', '13684520060').then((res) => {
      if (res) {
        wx.makePhoneCall({
          phoneNumber: '13684520060' //仅为示例，并非真实的电话号码
        })
      }
    })
  }
})