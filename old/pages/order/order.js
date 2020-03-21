const app = getApp();
import login from '../../utils/publics/login.js'
import tool from '../../utils/publics/tool.js'
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
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      console.log(options, '带过来的参数');
      var dj = options.id;
      // console.log(dj)
      var _this = this;
      _this.setData({
        dj: dj
      })


      if (options) {
        let page = '',
          type = '',
          typeVaL = ''
        switch (options.type) {
          case '':
            page = _this.data.record.all.page;
            type = 'record.all.type';
            list = 'record.all.list';
            typeVal = '';
            break;
          case 2:
            page = _this.data.record.progress.page;
            type = 'record.progress.type';
            list = 'record.progress.list';
            typeVal = 2;
            break;
          case 3:
            page = _this.data.record.finish.page;
            type = 'record.finish.type';
            list = 'record.finish.list';
            typeVal = 3;
            break;
          case 4:
            page = _this.data.record.lose.page;
            type = 'record.lose.type';
            typeVal = 4
            list = 'record.lose.list';
            break;
          case 5:
            page = _this.data.record.cancle.page;
            type = 'record.cancle.type';
            typeVal = 5
            list = 'record.cancle.list';
            break;
        }
      } else {
        page = _this.data.record.all.page;
        type = _this.data.record.all.type;
      }
      _this.getData('');
      _this.getData(2);
      _this.getData(3);
      _this.getData(4);
      _this.getData(5);

      this.setData({
        key: true
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
    wx.showModal({
      content: '您确定收货?',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.requestHost + app.globalData.Comfirm_Order, //查询订单列表 接口
            data: {
              token: wx.getStorageSync('token'),
              addressId: addressid,
              tradeNo: tradeid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function(res) {
              if (res.data.success == true) {
                wx.showToast({
                  title: '确定收货成功！',
                  icon: 'none'
                })
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/order/order?id=' + 5
                  })
                }, 500)
              } else {
                wx.showToast({
                  title: res.data.msg + '!',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })

  },
  /**付款前修改地址 */
  goToxgdizhi(e) {
    wx.navigateTo({
      url: '/pages/updateAddress/updateAddress?tradeId=' + e.currentTarget.dataset.id + '&addressid=' + e.currentTarget.dataset.addressid + '&status=' + 1
    })
  },
  /**点击顶部tab栏切换 */
  goTotab: function(e) {
    console.log(e, '什么')
    var that = this;
    that.setData({
      dj: e.currentTarget.dataset.id
    })
    // wx.showLoading({
    //   title: '加载中',
    //   icon : 'none'
    // })
    // that.getOrderList(that.data.dj);  
    // setTimeout(()=>{
    //   wx.hideLoading();  
    // },500)
  },
  /**点击查看物流 按钮 */
  goTockwl: function(e) {
    let orderid = e.currentTarget.dataset.orderid;
    let tradeId = e.currentTarget.dataset.tradeid;

    wx.navigateTo({
      url: '/pages/information/information?tradeId=' + tradeId + '&orderid=' + orderid
    })
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

    switch (typeVal) {
      case '':
        page = _this.data.record.all.page;
        newList = _this.data.record.all.list;
        type = 'record.all.type';
        list = 'record.all.list';
        break;
      case 2:
        page = _this.data.record.progress.page;
        newList = _this.data.record.progress.list;
        type = 'record.progress.type';
        list = 'record.progress.list';
        break;
      case 3:
        page = _this.data.record.finish.page;
        newList = _this.data.record.finish.list;
        type = 'record.finish.type';
        list = 'record.finish.list';
        break;
      case 4:
        page = _this.data.record.lose.page;
        newList = _this.data.record.lose.list;
        type = 'record.lose.type';
        list = 'record.lose.list';
        break;
      case 5:
        page = _this.data.record.cancle.page;
        newList = _this.data.record.cancle.list;
        type = 'record.cancle.type';
        list = 'record.cancle.list';
        break;
    }
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_FindList,
      data: {
        token: wx.getStorageSync('token'),
        page: page,
        limit: 10,
        status: typeVal
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {

        if (res.data.code == '0000') {
          let result = [];
          let listVal = 0;
          if (res.data.data) {
            let shopList = res.data.data ? res.data.data : []
            if (res.data.data) {
              let remind = wx.getStorageSync('remind');
                res.data.data.forEach((remindItem) => {
                  if(remind.length > 0){
                    let result = remind.some((item) => {
                      return (remindItem.id == item);
                    })
                    remindItem.hasRemind = result;
                  }else {
                    remindItem.hasRemind = false;
                  }
                })
            }
            console.log(page)
            if (page == 1) {
              if (res.data.data.length == 0) {
                listVal = 0
              } else if (res.data.data.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              
              _this.setData({
                [list]: shopList
              });
            } else {
              if (res.data.data.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              let newshopList = newList;
              console.log(res.data.data)
              if (res.data.data.length > 0) {
                res.data.data.forEach((item) => {
                  newshopList.push(item)
                })

                _this.setData({
                  [list]: newshopList
                });
              }
            }
          }
          console.log(listVal)
          _this.setData({
            [type]: listVal
          })
        }
      },
    })
  },
  /**请求 订单 列表 接口 */
  getOrderList: function(status) {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Order_FindList, //查询订单列表 接口
      data: {
        token: wx.getStorageSync('token'),
        status: (status == undefined ? '' : status)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        // 设置催单限制
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

      }
    })
  },
  /**点击 订单 跳转至订单详情 */
  goToddxq: function(e) {
    console.log(e, '订单id')
    console.log(e.currentTarget.dataset.class)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?tradeId=' + e.currentTarget.dataset.orderid + '&class=' + e.currentTarget.dataset.class + '&time=' + e.currentTarget.dataset.time
    })

  },
  /** 待付款---点击取消 订单 按钮 */
  goToquxiao: function(e) {
    console.log(e, '订单号')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定取消订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
            icon: 'none'
          })
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
              setTimeout(() => {
                wx.hideLoading();
                wx.showToast({
                  title: '取消订单成功',
                  icon: 'none'
                })
                console.log(that.data.dj)
                that.getData(that.data.dj);
              }, 500)
            }
          })
        }
      }
    })
  },
  /**全部---点击取消 订单 按钮 */
  goToDelete: function(e) {
    console.log(e, '订单号')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
            icon: 'none'
          })
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

              setTimeout(() => {
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功！',
                  icon: 'none'
                })
                that.getOrderList(that.data.dj);
              }, 500)
            }
          })
        }
      }
    })
  },
  /**全部---点击取消 订单 按钮 */
  goToquxiao2: function(e) {
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
              that.getOrderList();
            }
          })
        }
      }
    })
  },
  /**点击跳转至 退款页面 */
  goTotuikuan: function(e) {
    console.log(e, '带的参数ds')
    wx.navigateTo({
      url: '/pages/my/tuikuan/tuikuan?goodsimg=' + e.currentTarget.dataset.goodsimg + '&goodsmoney=' + e.currentTarget.dataset.goodsmoney + '&goodsname=' + e.currentTarget.dataset.goodsname + '&guigecolor=' + e.currentTarget.dataset.guigecolor + '&guigesize=' + e.currentTarget.dataset.guigesize + '&num=' + e.currentTarget.dataset.num + '&totalPrice=' + e.currentTarget.dataset.totalprice + '&dingdan=' + e.currentTarget.dataset.dingdan + '&zidingdan=' + e.currentTarget.dataset.zidingdan
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
    wx.showToast({
      title: '已成功提醒商家发货',
      icon: 'none'
    })
    let list = wx.getStorageSync('remind') ? wx.getStorageSync('remind') : [];
    list.push(id);
    wx.setStorageSync('remind', _this.unique(list))
    // if (this.data.num[index] == 1) {
    //   num[index] = 0
    //   this.setData({
    //     num,
    //   })
    // }
    let remindList = wx.getStorageSync('remind');
    console.log(remindList)
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
    console.log(_all)
    _finish.list.forEach((item) => {
      let result = remindList.some((remindItem) => {
        console.log(item.id == remindItem)
        return (item.id == remindItem);
      })
      item.hasRemind = result;
    })
    console.log(_all)
    console.log(_finish)
    _record.all = _all;
    _record.finish = _finish;
    console.log(_record)
    _this.setData({
      record: _record
    })
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
    wx.request({
      url: app.globalData.requestHost + app.globalData.Pay,
      // data: {
      //   token: wx.getStorageSync('token'),
      //   addressId: addressid, //地址id
      //   tradeNo: tradeNo, //订单号
      //   remark: msg, //用户留言
      //   couponCode: couponId
      // },
      data : data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '弹起支付');
        if(res.data.code == '0000'){
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function (res) {
              console.log(res, '支付成功了哦')
              wx.redirectTo({
                url: '/pages/orderDetails/orderDetails?tradeId=' + tradeid + '&class=' + 3
              })
            },
            fail: function (res) {
              console.log(res, '支付失败')
              wx.showToast({
                title: '取消支付',
                icon: 'none',
                success: function (res) {
                  wx.redirectTo({
                    url: '/pages/order/order?id=' + 2
                  })
                }
              })
            }
          })
        }else {
          tool.alert(res.data.msg)
        }
      }
    })
  }

})