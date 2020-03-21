const app = getApp();
import login from '../../utils/publics/login.js'
import tool from '../../utils/publics/tool.js'
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
    login.login().then(res => {
      var that = this;
      //默认请求数据
      this.getdizhiList(options.blank);
      console.log(options)
      this.setData({
        options: options
      })
      //修改返回
      if (options.blank) {
        wx.getStorage({
          key: 'add',
          success(res) {
            that.setData({
              dizhi: res.data
            });
            wx.removeStorage({
              key: 'add',
              success(res) {
                console.log('清除成功')
              }
            });
          }
        });
      }
      console.log(options)
      // console.log(options)
      // console.log(JSON.parse(options.rels), options.colorSizeId, options.cartJSONStr, '带过来的是尺寸/颜色/数量参数');
      if (options.cartJSONStr) {
        that.setData({
          cartJSONStr: options.cartJSONStr
        })
      } else {

      }
      if (options.rels) {
        this.setData({
          rels: options.rels
        });
      }
      console.log(options.colorSizeId)
      if (options.colorSizeId !== undefined) {
        that.setData({
          goodsList: JSON.parse(options.rels), //单品确认订单列表数据
          totalPrice: JSON.parse(options.rels)[0].totalPrice,
          moneyAll: JSON.parse(options.rels)[0].totalPrice,
          colorSizeId: options.colorSizeId, //颜色尺寸关联的Id
          //购物车id
        })
      } else {
        that.setData({
          goodsList: JSON.parse(options.rels).goodsList, //购物车确认订单列表数据
          totalPrice: JSON.parse(options.rels).totalAmount,
          moneyAll: JSON.parse(options.rels).totalAmount, //合计总价
          colorSizeId: options.colorSizeId, //颜色尺寸关联的Id
          // cartJSONStr: options.cartJSONStr, //
        })
      }


      // console.log(that.data.colorSizeId, '颜色尺寸关联的Id')
      console.log(that.data.cartJSONStr, '购物车id')
      that.getData(1);
      let num = 0;

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
  goToyh() {
    // rels=' + JSON.stringify(res.data.data) + '&cartJSONStr=' + JSON.stringify(idarr)

    if (this.data.cartJSONStr) {
      wx.navigateTo({
        url: '/pages/beforeCoupons/beforeCoupons?rels=' + this.data.rels + '&cartJSONStr=' + this.data.cartJSONStr
      })
    } else {
      wx.navigateTo({
        url: '/pages/beforeCoupons/beforeCoupons?rels=' + this.data.rels + '&cartJSONStr=' + this.data.colorSizeId
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击按钮 跳转至选择地址页面 */
  goTodizhi: function(e) {
    console.log('this.data.addressList', this.data.addressList)
    if (this.data.cartJSONStr) {
      if (this.data.addressList.length > 0) {
        wx.redirectTo({
          url: '/pages/my/address/address?cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels + '&checkAddess=' + 1 + '&colorSizeId=' + this.data.colorSizeId
        })
      } else {
        wx.redirectTo({
          url: '/pages/my/addnew/addnew?cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels + '&status=' + 1 + '&colorSizeId=' + this.data.colorSizeId
        })
      }
    } else {
      if (this.data.addressList.length > 0) {
        wx.redirectTo({
          url: '/pages/my/address/address?rels=' + this.data.rels + '&checkAddess=' + 1 + '&colorSizeId=' + this.data.colorSizeId
        })
      } else {
        wx.redirectTo({
          url: '/pages/my/addnew/addnew?rels=' + this.data.rels + '&status=' + 1 + '&colorSizeId=' + this.data.colorSizeId
        })
      }
    }

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
    // if (that.data.cartJSONStr) {
    //   that.setData({
    //     cartId: (e.currentTarget.dataset.cartid).toString(),
    //     msg: e.detail.value
    //   })
    //   //建立空数组
    //   that.data.idarr.push({
    //     'cartId': that.data.cartId,
    //     'msg': that.data.msg,
    //   });
    //   console.log(that.data.idarr, '车子id')
    // } else {
    //   that.setData({
    //     msg: e.detail.value
    //   })
    // }

  },
  /**点击 提交订单  然后 进行支付 */
  goTozhifu: function() {
    var that = this;
    if (that.data.dizhi.id == undefined) {
      wx.showToast({
        title: '请添加地址'
      })
    } else {
      //购物车过来的提交订单

      if (that.data.colorSizeId == undefined) {
        let data = {};
        data.token = wx.getStorageSync('token'),
        data.cartJSONStr = that.data.cartJSONStr
        data.msg = that.data.msg 
        if (that.data.couponcode) {
          data.couponCode = that.data.couponcode
        }
        wx.request({
          url: app.globalData.requestHost + app.globalData.Create_Order,
          // data: {
          //   token: wx.getStorageSync('token'),
          //   cartJSONStr: that.data.cartJSONStr, //购物车id\
          //   couponCode: that.data.couponcode ? that.data.couponcode : '' //券code值
          // },
          data: data,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function(res) {


            if (res.data.code == '0000') {
              console.log(res, '提交订单成功-返回订单号')
              console.log(res.data.data.tradeNo, '11111', res.data.data.id)
              that.setData({
                tradeNo: res.data.data.tradeNo, //订单号
                tradeId: res.data.data.id //订单id
              })
              that.goToBuy(); //然后请求支付接口
            } else {
              tool.alert(res.data.msg)
            }
          }
        })
      } else {
        //直接立即购买请求的提交订单
        let data = {};
        data.token = wx.getStorageSync('token'),
          data.goodsId = that.data.goodsList[0].id
        data.quantity = that.data.goodsList[0].quantity
        data.csrId = that.data.colorSizeId;
        data.msg = that.data.msg;
        if (that.data.couponcode) {
          data.couponCode = that.data.couponcode
        }
        wx.request({
          url: app.globalData.requestHost + app.globalData.Buy_NowOrder,
          // data: {
          //   token: wx.getStorageSync('token'),
          //   goodsId: that.data.goodsList[0].id, //商品id
          //   quantity: that.data.goodsList[0].quantity, //数量
          //   csrId: that.data.colorSizeId, //颜色尺寸
          //   msg: that.data.msg, //用户留言备注
          //   couponCode: that.data.couponcode ? that.data.couponcode : '' //券code值
          // },
          data: data,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function(res) {

            if (res.data.code == '0000') {
              console.log(res, '提交订单成功-返回订单号')
              that.setData({
                tradeNo: res.data.data.tradeNo, //订单号
                tradeId: res.data.data.id //订单id
              })
              that.goToBuy(); //然后请求支付接口  
            } else {
              tool.alert(res.data.msg)
            }
          }
        })
      }

    }
  },
  /**请求收货地址列表 接口*/
  getdizhiList: function(e) {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_List,
      data: {
        token: wx.getStorageSync('token'),
        page: 1,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '地址列表')
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
      },
    })
  },
  /**请求支付接口 */
  goToBuy: function() {
    var that = this;
    console.log(that.data.dizhi.id, that.data.tradeNo, that.data.msg)
    wx.request({
      url: app.globalData.requestHost + app.globalData.Pay,
      data: {
        token: wx.getStorageSync('token'),
        addressId: that.data.dizhi.id, //地址id
        tradeNo: that.data.tradeNo, //订单号
        remark: that.data.msg, //用户留言
        couponCode: that.data.couponcode ? that.data.couponcode : ''
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '弹起支付');
        if (res.data.code == '0000') {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success: function(res) {
              console.log(res, '支付成功了哦')
              wx.redirectTo({
                url: '/pages/orderDetails/orderDetails?tradeId=' + that.data.tradeId + '&class=' + 3
              })
            },
            fail: function(res) {
              console.log(res, '支付失败')
              wx.showToast({
                title: '取消支付',
                icon: 'none',
                success: function(res) {
                  wx.redirectTo({
                    url: '/pages/order/order?id=' + 2
                  })
                }
              })
            }
          })
        } else {
          tool.alert(res.data.msg)
        }

      }
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
    // switch(typeVal){
    //   case '' : 
    //     page = `record.all.page`;  //控制底部提示显示
    //     list = 'record.all.list';  //控制底部提示显示  
    //     type = 'record.all.type';  //控制底部提示显示
    //   case 1 :
    //     page = `record.all.page`;  //控制底部提示显示
    //     list = 'record.all.list';  //控制底部提示显示  
    //     type = 'record.all.type';  //控制底部提示显示
    // }
    // let type = `list.type`
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Coupons,
      data: {
        token: wx.getStorageSync('token'),
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

            res.data.data.records.forEach((item) => {
              item.coupon.couponEndDate = item.coupon.couponEndDate.split(' ')[0]
            })
            let shopList = res.data.data.records ? res.data.data.records : [];
            
            let num = 0;


            console.log(shopList)
            shopList.forEach((item)=> {
              console.log(_this.data.moneyAll, item.coupon.fullPrice)
              console.log(_this.data.moneyAll >= item.coupon.fullPrice)
              if (_this.data.moneyAll >= item.coupon.fullPrice) {
                num++;
              }
            })
            shopList.sort((item) => {
              console.log(item)
              console.log(item.coupon.fullPrice)
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
            console.log(arr1)

            _this.setData({
              num: num
            })
            if (page == 1) {
              if (res.data.data.records.length == 0) {
                listVal = 0
              } else if (res.data.data.records.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              _this.setData({
                [list]: shopList
              });
            } else {
              if (res.data.data.records.length == 10) {
                listVal = 1
              } else {
                listVal = 2
              }
              let newshopList = newList;
              console.log(res.data.data)
              if (res.data.data.records.length > 0) {
                res.data.data.records.forEach((item) => {
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
  }
})