
const app = getApp();
import login from '../../utils/api/login.js';
import ajax from '../../utils/api/my-requests.js';
import tool from '../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: 1, //默认选中全部
    num: [],
    key: false,
    record: {
      all: {
        list: [],
        page: 1,
        type: ''
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var _this = this;
      var dj = options.id ? options.id : '';
      _this.setData({ dj: dj });
      tool.loading();
      Promise.all([_this.getData('')]).then((res)=>{      
          tool.loading_h();
          _this.setData({ key: true });
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
    let _this = this;
    if (_this.data.key) {
      _this.getData('');
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
    let _this = this;
    let page = '',
      type = '',
      list = '',
      newPage = '',
      typeVal = '';
    page = _this.data.record.all.page;
    typeVal = _this.data.record.all.type;
    type = 'record.all.type';
    list = 'record.all.list';
    newPage = 'record.all.page';
    if (typeVal == 1) {
      _this.setData({ [newPage]: page + 1 })
      _this.getData( page )
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  comfirmOrder(e) {
    var that = this;
    let addressid = e.currentTarget.dataset.addressid;
    let tradeid = e.currentTarget.dataset.tradeid;
    console.log(addressid, tradeid)
    tool.showModal('提示','您确定收货?').then((res)=>{
        if(res){
          ajax.comfirmOrder({
            token: wx.getStorageSync('token'),
            addressId: addressid,
            tradeNo: tradeid
          }).then((res)=>{
            let code = res.data.code;
            let msg = code == '0000' ? '确定收货成功！' : res.data.msg;
            tool.alert(msg);
            setTimeout(() => {
              tool.jump_red('/pages/order/order?id=' + 5)
            }, 500)
          })
        }
    })
  },
  /**点击顶部tab栏切换 */
  goTotab: function (e) {
    console.log(e, '什么')
    var that = this;
    that.setData({
      dj: e.currentTarget.dataset.id
    })
  },
  /**点击查看物流 按钮 */
  goTockwl: function (e) {
    let orderid = e.currentTarget.dataset.orderid;
    let tradeId = e.currentTarget.dataset.tradeid;
    tool.jump_nav('/pages/information/information?tradeId=' + tradeId + '&orderid=' + orderid)
  },
  getData(typeVal) {
    var _this = this;
    let page = '',
      type = '',
      list = '',
      newList = '';
    newList = _this.data.record.all.list;
    type = 'record.all.type';
    list = 'record.all.list';
    ajax.findRefund({
      token: wx.getStorageSync('token')
    }).then((res)=>{
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        let dataLen = res.data.data.length;
        if (res.data.data) {
          let shopList = res.data.data ? res.data.data : [];
          listVal = dataLen == 0 ? 0 : (dataLen == 10 ? 1 : 2);
          _this.setData({
            [list]: shopList
          });
        }
        _this.setData({
          [type]: listVal
        })
      }
    })
  },
  // 跳转页面
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /** 待付款---点击取消 订单 按钮 */
  goToquxiao: function (e) {
    console.log(e, '订单号')
    var that = this;
    tool.loading();
    tool.showModal('提示', '确定取消订单吗？').then((res) => {
      if (res) {
        ajax.cancelOrder({
          token: wx.getStorageSync('token'),
          tradeNo: e.currentTarget.dataset.id, //订单号
        }).then((res) => {
          setTimeout(() => {
            tool.loading_h();
            tool.alert('取消订单成功!');
            that.getData(that.data.dj);
          }, 500)
        })
      }
    })
  },
  /**全部---点击取消 订单 按钮 */
  getOrderList: function (status) {
    var that = this;
    ajax.orderList({
      token: wx.getStorageSync('token'),
      status: (status == undefined ? '' : status)
    }).then((res) => {
      for (var i = 0; i < res.data.data.length; i++) {
        let num = that.data.num
        that.data.num[i] = 1
        that.setData({
          num,
        })
      }
      console.log(res, '订单列表数据')
      that.setData({
        orderList: res.data.data
      })
    })
  },
})