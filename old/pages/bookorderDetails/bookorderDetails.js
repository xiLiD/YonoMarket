const app = getApp();
import login from '../../utils/publics/login.js'
const util = require('../../utils/publics/util.js')
let countdown = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classval: 2, //默认是空
    orderList: {}, //订单详情数据
    isShow: false,
    countdown: {
      times: '100000'
    },
    showReason : false,
    selectIndex : 0,
    isHide : false,
    reasonList: ['临时有事情！不能及时赶过去', '其他原因'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login().then(res => {
      console.log(options, '传过来的类型');
      var _this = this;
      // that.setData({
      //   classval: options.class,
      //   tradeId: options.tradeId //订单id
      // })
      // that.getfindDetail(that.data.tradeId);
      if(options){
        _this.setData({ id: options.id, classval: options.id, cartList: options.cartList})
      }
      this.getDetails(_this.data.id)
      // that.findTime('2000');
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isShow: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.isShow) {
      this.getDetails(_this.data.id)
    }
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
    clearInterval(countdown);
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
  goTogbtk(){
    let _this = this;
    _this.setData({ isHide: true })
  },
  isHide(e){
    let _this = this;
    let num = e.currentTarget.dataset.num;
    switch(num){
      case '0' : 
        _this.setData({ isHide:false})
        break;
        case '1' : 
        _this.setData({ isHide: true })
         break;
          default : 
            break;
    }
  },
  changeSelect(e){
      let _this = this;
      let num = e.currentTarget.dataset.num;
      _this.setData({
        selectIndex : num,
        changeIndex : num
      })
  },
  getDataTime(second) {
    if (second > 0) {
      clearInterval(countdown)
      countdown = setInterval(() => {
        if (second > 0) {
          // var time = util.minutesAndSeconds(second--);
          var time = this.findTime(second --)
        } else {
          clearInterval(countdown)
        }
        this.setData({
          countdown: time,
          isShow: true
        })

      }, 1000)
    }
  },
  cancelOrder: function (e) {
    let num = e.currentTarget.dataset.num;
    let status = e.currentTarget.dataset.status;
    // if(status != 1) return;
    switch (num){
      case '0' : 
        this.setData({
          showReason: false,
          changeIndex: 0
        });
        break;
      case '1':
        this.setData({
          showReason: true,
          changeIndex : 0
        });
        break;  
      default : break;  
    }
  },
  finishCancle(){
    let _this = this;
    wx.showModal({
      title: '',
      content: '是否确定取消预约?',
      success: function (res) {
        if(res.confirm){
          let data = {
            id: _this.data.id,
            token: wx.getStorageSync('token'),
            refundCause: _this.data.reasonList[_this.data.selectIndex]
          }
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.requestHost + app.globalData.Cancle_Shop,
            data: {
              id: _this.data.id,
              token: wx.getStorageSync('token'),
              refundCause: _this.data.reasonList[_this.data.selectIndex]
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              if (res.data.code == '0000') {
                wx.hideLoading();
                setTimeout(() => {
                  wx.showToast({
                    title: '取消预约成功！',
                    icon: 'none'
                  })
                  setTimeout(() => {
                    wx.redirectTo({
                      url: '/pages/my/record/record'
                    })
                  }, 500)

                }, 500)
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: res.data.data.msg,
                  icon: 'none'
                })
              }
            },
          })
        }
        
      }
    })
  },
  getDetails(){
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Detail_Shop,
      data: {
        id: this.data.id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '地址列表')
        that.setData({
          info: res.data.data
        })
      
        that.getDataTime(res.data.data.residue);
      },
    })
    
  },
  cancelReson(num){
    let _this = this;
    switch(num){
      case '0':
        _this.setData({showReason:false});
        break;
        case '1':
        _this.setData({ showReason: true });
          break;
    }
  },
  /**点击复制 */
  textPaste(e) {
    wx.showToast({
      title: '复制成功',
      icon: 'none'
    })
    wx.setClipboardData({
      data: e.currentTarget.dataset.trade,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
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
  },
  findTime(second){
    let arr = [];
    let h = parseInt(second / 3600);
    console.log(h)
    let f = parseInt((second - h * 3600) / 60);
    console.log(f)
    let s = parseInt((second - h * 3600 - f * 60)); 
    console.log(s);
    h = h >= 10 ? h : '0' + h;
    f = f >= 10 ? f : '0' + f;
    s = s >= 10 ? s : '0' + s;
    let obj = {
      h : h,
      f : f,
      s : s
    }

    return obj;
  },
  tobookDetails(){

  }
})