const app = getApp();
import login from '../../utils/api/login.js';
import tool from '../../utils/publics/tool.js';
import ajax from '../../utils/api/my-requests.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide: false, //默认选择配送方式 弹框隐藏
    dizhi: '', //地址默认是空
    msg: '', //用户留言
    idarr: [],
    goodsList: [],
    rels: '',
    cartJSONStr: '',
    addressList: [],
    recordList: [],
    status: '',
    record: {
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
      }
    },
    couponId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      var that = this;
      //默认请求数据
      this.getdizhiList(options.blank);
      this.setData({ options: options });
      //修改返回
      if (options.blank) {
        if(wx.getStorageSync('add')){
          that.setData({ dizhi: wx.getStorageSync('add') });
          wx.removeStorageSync('add')
        }
      }
      let rels = options.rels ? options.rels : '';
      let cartJSONStr = options.cartJSONStr ? options.cartJSONStr : [];
      let goodsList = options.colorSizeId ? JSON.parse(options.rels) : JSON.parse(options.rels).goodsList;
      let totalPrice = options.colorSizeId ? JSON.parse(options.rels)[0].totalPrice : JSON.parse(options.rels).totalAmount;
      let moneyAll = options.colorSizeId ? JSON.parse(options.rels)[0].totalPrice : JSON.parse(options.rels).totalAmount;
      let colorSizeId = options.colorSizeId ? options.colorSizeId : '' ;
      that.setData({
        goodsList: goodsList, //单品确认订单列表数据
        totalPrice: totalPrice,
        moneyAll: moneyAll,
        colorSizeId: colorSizeId, //颜色尺寸关联的Id
        cartJSONStr: cartJSONStr,  // 购物车
        rels: rels
      })
      that.getData(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  showCoupon(e) {
    let num = e.currentTarget.dataset.num;
    let show = num == 1 ? true : false;
    this.setData({
      showCoupon: show
    })
  },
  changeCoupon(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    let dataList = _this.data.record.progress.list
    if(_this.data.totalPrice < dataList[index].coupon.fullPrice){
      return;
    }
    // let type = e.currentTarget.dataset.typeid;
    // let discount = e.currentTarget.dataset.discount;
    let couponId = dataList[index].id;
    let couponCode = dataList[index].couponCode;
    let type = dataList[index].coupon.couponTypeId;
    let discount = dataList[index].coupon.discount;
    let price = dataList[index].coupon.discountAmount;
    let subtractPrice = dataList[index].coupon.subtractPrice;
    console.log(type)
    this.setData({
      couponId: couponId,
      couponcode: couponCode,
      couponIndex: index
    })
    this.setData({
      showCoupon: false,
      typeId: type
    });

    if(type == 3){
      let num = (new Number(this.data.totalPrice * discount * 0.1)).toFixed(2);
      num = num >= 0.01 ? num : 0.01;
      this.setData({
        moneyAll: num
      })
    } else if (type == 1) {
      let num = (new Number(this.data.totalPrice - price).toFixed(2));
      num = num >= 0.01 ? num : 0.01;
      this.setData({
        moneyAll: num
      })
    }else {
      let num = (new Number(this.data.totalPrice - subtractPrice).toFixed(2));
      num = num >= 0.01 ? num : 0.01;
      this.setData({
        moneyAll: num
      })
    }

  },
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url);
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击按钮 跳转至选择地址页面 */
  goTodizhi: function(e) {
    console.log('this.data.addressList', this.data.addressList)
    let cartJSONStr = this.data.cartJSONStr;
    let addressLen = this.data.addressList.length;
    let url = cartJSONStr ? (addressLen ? '/pages/my/address/address?cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels + '&checkAddess=' + 1 + '&colorSizeId=' + this.data.colorSizeId : '/pages/my/addnew/addnew?cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels + '&status=' + 1 + '&colorSizeId=' + this.data.colorSizeId) : (addressLen ? '/pages/my/address/address?rels=' + this.data.rels + '&checkAddess=' + 1 + '&colorSizeId=' + this.data.colorSizeId : '/pages/my/addnew/addnew?rels=' + this.data.rels + '&status=' + 1 + '&colorSizeId=' + this.data.colorSizeId);
    tool.jump_nav(url);
  },
  /**点击配送方式 弹框提示 */
  goTotk: function() {
    this.setData({
      isHide: true
    })
  },
  /**点击 完成按钮 关闭配送方式弹框 */
  goTogbtk: function() {
    this.setData({
      isHide: false
    })
  },
  /**获取留言框 内容 */
  bindTextAreaBlur: function(e) {
    console.log(e)
    var that = this;
    that.setData({
      msg: e.detail.value
    })
  },
  /**点击 提交订单  然后 进行支付 */
  goTozhifu: function() {
    var that = this;
    if (that.data.dizhi.id == undefined) {
      tool.alert('请添加地址');
      return;
    }  
    let data = {};
    data.token = wx.getStorageSync('token');
    data.msg = that.data.msg;
    if (that.data.couponcode) {
      data.couponCode = that.data.couponcode
    }
    console.log(that.data.colorSizeId)
    if (!that.data.colorSizeId) {
      data.cartJSONStr = that.data.cartJSONStr;
      ajax.createOrder(data).then((res)=>{
        if (res.data.code == '0000') {
          console.log(res, '提交订单成功-返回订单号')
          console.log(res.data.data.tradeNo, '11111', res.data.data.id)
          that.setData({
            tradeNo: res.data.data.tradeNo, //订单号
            tradeId: res.data.data.id //订单id
          })
          that.goToBuy(); //然后请求支付接口
          return;
        }
        tool.alert(res.data.msg)
      })
      return;
    }
    //直接立即购买请求的提交订单
    data.goodsId = that.data.goodsList[0].id
    data.quantity = that.data.goodsList[0].quantity
    data.csrId = that.data.colorSizeId;
    ajax.buyOrder(data).then((res) => {
      if (res.data.code == '0000') {
        console.log(res, '提交订单成功-返回订单号')
        that.setData({
          tradeNo: res.data.data.tradeNo, //订单号
          tradeId: res.data.data.id //订单id
        })
        that.goToBuy(); //然后请求支付接口  
        return;
      }
      tool.alert(res.data.msg)
    })
  },
  /**请求收货地址列表 接口*/
  getdizhiList: function(e) {
    var that = this;
    ajax.findAddress({
      token: wx.getStorageSync('token')
    }).then((res)=>{
      that.setData({
        addressList: res.data.data
      })
      if (e == undefined) {
        for (var i = 0; i < that.data.addressList.length; i++) {
          if (that.data.addressList[i].isDefault == 1) {
            that.setData({
              dizhi: that.data.addressList[i], //地址
            })
          }
        }
      }
    })
  },
  /**请求支付接口 */
  goToBuy: function() {
    var that = this;
    console.log(that.data.dizhi.id, that.data.tradeNo, that.data.msg);
    ajax.wxPay({
      token: wx.getStorageSync('token'),
      addressId: that.data.dizhi.id, //地址id
      tradeNo: that.data.tradeNo, //订单号
      remark: that.data.msg, //用户留言
      couponCode: that.data.couponcode ? that.data.couponcode : ''
    }).then((res)=>{
      if (res.data.code == '0000') {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: 'MD5',
          paySign: res.data.data.paySign,
          success: function (res) {
            console.log(res, '支付成功了哦')
            tool.jump_red('/pages/orderDetails/orderDetails?tradeId=' + that.data.tradeId + '&class=' + 3)
          },
          fail: function (res) {
            console.log(res, '支付失败')
            tool.alert('取消支付');
            tool.jump_red('/pages/order/order?id=' + 2)
          }
        })
        return;
      }
      tool.alert(res.data.msg)
    })
  },
  // 获取优惠券
  getData(typeVal) {
    var _this = this;
    let page = '',
      type = '',
      list = '',
      newList = '';
    switch (typeVal) {
      case 1:
        page = _this.data.record.progress.page;
        newList = _this.data.record.progress.list;
        type = 'record.progress.type';
        list = 'record.progress.list';
        break;
    }
    ajax.findCoupons({
      token: wx.getStorageSync('token'),
      status: typeVal
    }).then((res)=>{
      if (res.data.code == '0000') {
        let result = [];
        let listVal = 0;
        if (res.data.data) {
          res.data.data.records.forEach((item) => {
            item.coupon.couponEndDate = item.coupon.couponEndDate.split(' ')[0]
          })
          let shopList = res.data.data.records ? res.data.data.records : [];
          let num = 0;
          console.log(shopList);
          shopList.forEach((item) => {
            if (_this.data.moneyAll >= item.coupon.fullPrice) {
              num++;
            }
          })
          shopList.sort((item) => {
            return _this.data.moneyAll - item.coupon.fullPrice
          })
          var arr1 = shopList;
          for (var i = 1; i <= arr1.length - 1; i++) { //外层循环管排序的次数
            for (var j = 0; j <= arr1.length - i - 1; j++) {
              if (arr1[j].coupon.fullPrice >= arr1[j + 1].coupon.fullPrice) {
                var temp = arr1[j];
                arr1[j] = arr1[j + 1];
                arr1[j + 1] = temp;
              }
            }
          }
          _this.setData({ num: num });
          let dataLen = res.data.data.records.length;
          listVal = dataLen == 0 ? 0 : (dataLen == 10 ? 1 : 2);
          let result = page == 1 ? shopList : (()=>{
            let newshopList = newList;
            if (!dataLen) return newshopList;
            res.data.data.records.forEach((item) => {
              newshopList.push(item);
            })
            return newshopList
          })()
          _this.setData({
            [list]: result
          });
        }
        _this.setData({
          [type]: listVal
        })
      }
    })
  }
})