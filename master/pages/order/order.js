const app = getApp();
import login from '../../utils/api/login.js'
import tool from '../../utils/publics/tool.js'
import ajax from '../../utils/api/my-requests.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: '', //默认选中全部
    num: [],
    key: false,
    record: {
      all: {
        list: [],
        page: 1,
        type: ''
      },
      progress: {
        list: [],
        page: 1,
        type: ''
      },
      finish: {
        list: [],
        page: 1,
        type: ''
      },
      lose: {
        list: [],
        page: 1,
        type: ''
      },
      cancle: {
        list: [],
        page: 1,
        type: ''
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      var _this = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var dj = options.id ? options.id : '';
      console.log(options.id)
      _this.setData({ dj: dj });
      Promise.all([_this.getData(''), _this.getData(2), _this.getData(3), _this.getData(4), _this.getData(5)]).then((res)=>{
        _this.setData({ key: true });
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
    if(this.data.key){
      let dj = this.data.dj ? parseInt(this.data.dj) : this.data.dj;
      console.log(dj)
      this.getData(dj);
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
    let _this = this;
    let page = '',
      type = '',
      list = '',
      newPage = '',
      typeVal = '';
      let dj = _this.data.dj ? parseInt(_this.data.dj) : _this.data.dj;
    switch (dj) {
      case '':
        page = _this.data.record.all.page;
        typeVal = _this.data.record.all.type;
        type = 'record.all.type';
        list = 'record.all.list';
        newPage = 'record.all.page';
        console.log(typeVal)
        break;
      case 2:
        page = _this.data.record.progress.page;
        typeVal = _this.data.record.progress.type;
        type = 'record.progress.type';
        list = 'record.progress.list';
        newPage = 'record.progress.page';
        console.log(typeVal)
        break;
      case 3:
        page = _this.data.record.finish.page;
        typeVal = _this.data.record.finish.type;
        type = 'record.finish.type';
        list = 'record.finish.list';
        newPage = 'record.finish.page';
        console.log(typeVal)
        break;
      case 4:
        page = _this.data.record.lose.page;
        typeVal = _this.data.record.lose.type;
        type = 'record.lose.type';
        list = 'record.lose.list';
        newPage = 'record.lose.page';
        console.log(typeVal)
        break;
      case 5:
        page = _this.data.record.cancle.page;
        typeVal = _this.data.record.cancle.type;
        type = 'record.cancle.type';
        list = 'record.cancle.list';
        newPage = 'record.cancle.page';
        break;
    }
    console.log(typeVal)
    if (typeVal == 1) {
      _this.setData({
        [newPage]: page + 1
      })
      _this.getData(_this.data.dj)
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
          let msg = code == '0000' ? '收货成功!' : res.data.msg ;
          tool.alert(msg)
          if(code == '0000'){
            setTimeout(() => {
              tool.jump_red('/pages/order/order?id=' + 5)
            }, 500)
          }
        })
      }
    })
  },
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**点击顶部tab栏切换 */
  goTotab: function(e) {
    console.log(e, '什么')
    var that = this; 
    that.setData({
      dj: e.currentTarget.dataset.id
    })
  },
  /**点击查看物流 按钮 */
  goTockwl: function(e) {
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
      if(typeVal){
        typeVal = parseInt(typeVal)
      }
    typeVal == 1 ? '' : typeVal;
    // all => 全部 progress => 待付款 finish = > 待发货 lose => 待收货 cancle => 已完成
    let typeName = typeVal == '' ? 'all' : (typeVal == 2 ? 'progress' :(typeVal == 3 ? 'finish' : (typeVal == 4 ? 'lose' : 'cancle')));
    page = _this.data.record[typeName].page;
    newList = _this.data.record[typeName].list;
    type = 'record.' + typeName + '.type';
    list = 'record.' + typeName + '.list';

    // switch (typeVal) {
    //   case '':
    //     page = _this.data.record.all.page;
    //     newList = _this.data.record.all.list;
    //     type = 'record.all.type';
    //     list = 'record.all.list';
    //     break;
    //   case 2:
    //     page = _this.data.record.progress.page;
    //     newList = _this.data.record.progress.list;
    //     type = 'record.progress.type';
    //     list = 'record.progress.list';
    //     break;
    //   case 3:
    //     page = _this.data.record.finish.page;
    //     newList = _this.data.record.finish.list;
    //     type = 'record.finish.type';
    //     list = 'record.finish.list';
    //     break;
    //   case 4:
    //     page = _this.data.record.lose.page;
    //     newList = _this.data.record.lose.list;
    //     type = 'record.lose.type';
    //     list = 'record.lose.list';
    //     break;
    //   case 5:
    //     page = _this.data.record.cancle.page;
    //     newList = _this.data.record.cancle.list;
    //     type = 'record.cancle.type';
    //     list = 'record.cancle.list';
    //     break;
    // }
    //获取数据
    ajax.orderList({
      token: wx.getStorageSync('token'),
      page: page,
      limit: 10,
      status: typeVal
    }).then((res) => {
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        let shopList = res.data.data ? res.data.data : [];
        if (shopList) {
          //提醒发货
          let remind = wx.getStorageSync('remind');
          shopList.forEach((remindItem) => {
            if (remind.length > 0) {
              let result = remind.some((item) => {
                return (remindItem.order_id == item);
              })
              remindItem.hasRemind = result;
            } else {
              remindItem.hasRemind = false;
            }
          })
          //数据整理
          let newshopList = newList;
          shopList.forEach((item) => { newshopList.push(item) })
          listVal = page == 1 ? (shopList.length == 0 ? 0 : (shopList.length == 10 ? 1 : 2)) : (listVal = shopList.length == 10 ? 1 : 2);
          let result = page == 1 ? shopList : newshopList;
          _this.setData({ [list]: result });
        }
        _this.setData({ [type]: listVal })
      }
    })
  },
  /**请求 订单 列表 接口 */
  getOrderList: function(status) {
    var that = this;
    ajax.orderList({
      token: wx.getStorageSync('token'),
      status: (status == undefined ? '' : status)
    }).then((res)=>{
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
  /** 待付款---点击取消 订单 按钮 */
  goToquxiao: function(e) {
    console.log(e, '订单号')
    var that = this;
    tool.loading();
    tool.showModal('提示','确定取消订单吗？').then((res)=>{
      if(res){
        ajax.cancelOrder({
          token: wx.getStorageSync('token'),
          tradeNo: e.currentTarget.dataset.id, //订单号
        }).then((res)=>{
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
  goToDelete: function(e) {
    console.log(e, '订单号')
    var that = this;
    tool.showModal('提示','确定删除订单吗?').then((res)=>{
      if(res){
        ajax.cancleOrder({
          token: wx.getStorageSync('token'),
          tradeNo: e.currentTarget.dataset.id, //订单号
        }).then((res)=>{
          setTimeout(() => {
            tool.loading_h();
            tool.alert('删除成功!');
            that.getOrderList(that.data.dj);
          }, 500)
        })
      }
    })
  },
  unique(arr) {
    if (!Array.isArray(arr)) {
      console.log('type error!')
      return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
      if (array.indexOf(arr[i]) === -1) {
        array.push(arr[i])
      }
    }
    return array;
  },
  /**点击 我要催单 按钮 */
  goTocuidan: function(e) {
    let _this = this;
    let num = this.data.num
    let remind = e.currentTarget.dataset.remind;
    if (remind) {
      return;
    }
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.num;
    tool.alert('已成功提醒商家发货');
    let list = wx.getStorageSync('remind') ? wx.getStorageSync('remind') : [];
    list.push(id);
    wx.setStorageSync('remind', _this.unique(list))
    let remindList = wx.getStorageSync('remind');
    let _record = _this.data.record,
      _all = _record.all,
      _finish = _record.finish;
    _all.list.forEach((item) => {
      let result = remindList.some((remindItem) => {
        console.log(item.id == remindItem)
        return (item.id == remindItem);
      })
      item.hasRemind = result;
    })
    _finish.list.forEach((item) => {
      let result = remindList.some((remindItem) => {
        console.log(item.id == remindItem)
        return (item.id == remindItem);
      })
      item.hasRemind = result;
    })
    _record.all = _all;
    _record.finish = _finish;
    _this.setData({ record: _record });
  },
  /**请求支付接口 */
  goToBuy: function(e) {
    var that = this;
    console.log(e, '页面穿过来的参数')
    let msg = e.currentTarget.dataset.msg
    let tradeNo = e.currentTarget.dataset.trade
    let addressid = e.currentTarget.dataset.addressid
    let tradeid = e.currentTarget.dataset.id;
    let couponCode = e.currentTarget.dataset.couponcode;
    let data = {
      token: wx.getStorageSync('token'),
      addressId: addressid, //地址id
      tradeNo: tradeNo, //订单号
      remark: msg, //用户留言
    }
    if (couponCode){
      data.couponCode = couponCode
    }
    ajax.wxPay(data).then((res)=>{
      if(res.data.code == '0000'){
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: function (res) {
            console.log(res, '支付成功了哦')
            tool.jump_red('/pages/orderDetails/orderDetails?tradeId=' + tradeid + '&class=' + 3)
          },
          fail: function (res) {
            console.log(res, '支付失败');
            tool.alert('取消支付');
            tool.jump_nav('/pages/order/order?id=' + 2);
          }
        })
      }
    })
  }
})