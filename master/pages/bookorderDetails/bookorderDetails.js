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
      var _this = this;
      if(options){
        _this.setData({ id: options.id, classval: options.id, cartList: options.cartList})
      }
      this.getDetails(_this.data.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ isShow: true });
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
    let isHidden = num == 1;
    _this.setData({ isHide : isHidden });
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
    console.log(num)
    let showReason = num == 1;
    this.setData({ showReason : showReason , changeIndex : 0 });
  },
  finishCancle(){
    let _this = this;
    tool.showModal('提示','是否确定取消预约?').then((res)=>{
      if(res){
        let data = {
          id: _this.data.id,
          token: wx.getStorageSync('token'),
          refundCause: _this.data.reasonList[_this.data.selectIndex]
        }
        tool.loading();
        ajax.cancleShop({
          id: _this.data.id,
          token: wx.getStorageSync('token'),
          refundCause: _this.data.reasonList[_this.data.selectIndex]
        }).then((res)=>{
          let msg = res.data.code == '0000' ? '取消预约成功' : res.data.data.msg;
          setTimeout(()=>{
            tool.loading_h();
            tool.alert(msg)
            if(res.data.code == '0000'){
              setTimeout(() => {
                tool.jump_red('/pages/my/record/record')
              }, 500)
            }
          },500)
        })
      }
    })
  },
  getDetails(){
    var that = this;
    ajax.shopDetails({
      id : that.data.id
    }).then((res)=>{
      console.log(res, '地址列表')
      that.setData({
        info: res.data.data
      })
      that.getDataTime(res.data.data.residue);
    })
  },
  cancelReson(num){
    let _this = this;
    let showReason = num != 1;
    _this.setData({ showReason : showReason });
  },
  /**点击复制 */
  textPaste(e) {
    tool.alert('复制成功')
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
    tool.showModal('联系商家','022-23970088').then((res)=>{
      if(res){
        wx.makePhoneCall({
          phoneNumber: '022-23970088' //仅为示例，并非真实的电话号码
        })
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
  }
})