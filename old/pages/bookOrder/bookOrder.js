const app = getApp();
import login from '../../utils/publics/login.js'
import tool from '../../utils/publics/tool.js'
import map from '../../utils/map/map.js'
import auth from '../../utils/publics/authorization.js'
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
    endedTime: '2019-01-01 12:38',
    goodList: {
      name: '',
      image: '',
      color: '',
      money: '',
      num: '',

    },
    doorDialog: {
      show: false,
      index: '',
      itemList: ['请选择', '嘉兴门店', '长沙门店', '武汉门店', '上海门店'],
    },
    message :'',
    showModalOption: {
      isShow: false,
      type: 0,
      title: "获取位置信息",
      test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    isShowLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    login.login().then(res => {
      var _this = this;
      // //默认请求数据
      let index = `doorDialog.index`
      console.log(options)
      console.log('cartList,' + JSON.parse(options.cartJSONStr))
      // console.log(options.cartList)
      if (options) {
        _this.setData({
          name: options.name,
          phone: options.phone,
          details: options.details,
          address: options.address,
          endedTime: options.time,
          shopId: options.shopId,
          [index]: options.addressIndex,
          cartList: JSON.parse(options.cartJSONStr)
        })

      }
      // _this.getGoodsInfo();
      // console.log(options)
      _this.getPosition();
      // console.log(that.data.colorSizeId, '颜色尺寸关联的Id')
      // let dayTime = _this.getToday();
      // let dayHour = "18:00";
      // let endedTime1 = dayTime + " " + dayHour;

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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  //点击自定义Modal弹框上的按钮
  operation(e) {
    if (e.detail.confirm) {
      auth.openSetting(res => {//用户自行从设置勾选授权后
        if (res.authSetting["scope.userLocation"]) {
          this.getPosition()
        }
      })
      this.showHideModal()
    } else {
      tool.loading("")
      this.showHideModal()
      setTimeout(() => {
        tool.loading_h()
        this.showHideModal()
      }, 600)
    }
  },
  //打开、关闭自定义Modal弹框
  showHideModal() {
    let _showModalOption = this.data.showModalOption
    _showModalOption.isShow = !_showModalOption.isShow
    this.setData({ showModalOption: _showModalOption })
  },
  bindDoorChange: function (e) {
    const val = e.detail.value
    let newIndex = 'doorDialog.index'
    this.setData({
      [newIndex]: val
    })
  },
  getPosition() {
    // tool.loading("自动定位中")
    map.getPosition2().then(res => {
      console.log("定位详细信息", res)
      let _address_component = res.result.address_component
      console.log("经度---->", res.result.location.lng)
      console.log("纬度---->", res.result.location.lat)
      console.log("省---->", _address_component.province)
      console.log("市---->", _address_component.city)
      console.log("区---->", _address_component.district)
      this.setData({
        longitude: res.result.location.lng,
        latitude: res.result.location.lat
      })
      this.getAddress()
      this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })

      // tool.loading_h()
      // this.setData({ showBook: true })

    }).catch(err => {
      console.log("定位失败", err)
      tool.alert("定位失败")
      tool.loading_h()
      this.showHideModal()
    })
  },
  /** 获取地址 */
  getAddress() {
    let _this = this;
    let doorList = 'doorDialog.itemList'
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Shop,
      data: {
        longitude: _this.data.longitude,
        latitude: _this.data.latitude
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {

        let shopList = res.data.data ? res.data.data : []
        _this.setData({ shopList: shopList })
        let result = []
        _this.data.shopList.forEach((item) => {
          result.push(item.shopName)
        })
        _this.setData({ [doorList]: result })
      }
    })
  },
  onPickerChange3: function(e) {
    console.log(e.detail);
    this.setData({
      endedTime: e.detail.dateString
    })
  },
  toDouble: function(num) {
    if (num >= 10) { //大于10
      return num;
    } else { //0-9
      return '0' + num
    }
  },
  getGoodsInfo() {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_Detail,
      data: {
        id: that.data.goodid,
        token: wx.getStorageSync('token')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res, '商品详情数据')
        // var article = res.data.data.remark; //富文本解析
        // WxParse.wxParse('article', 'html', article, that, 5);

        that.setData({
          goodList: res.data.data, //商品详情数据
          imgUrls: res.data.data.imgPaths, //轮播图数组
          shoucang: res.data.data.status, //判断是否收藏过
          defaultcolor: res.data.data.colo, //颜色数据
          defaultchima: res.data.data.size, //尺寸数据

          chimaList: res.data.data.colo, //尺码数据
          colorSize: res.data.data.size, //选择好颜色和尺码生成的id
          shoucang: res.data.data.isCollect,
          storeNum: res.data.data.storeNum,
          showImg: res.data.data.mainImgPath,
          showName: res.data.data.name
        })
        let color = `goodList.color`
        let size = `goodList.size`
        res.data.data.colo.forEach((item) => {
          console.log(item.id)
          if (item.id == that.data.crsId) {
            that.setData({
              [color]: item.color,
              [size]: item.name
            })
          }
        })
        // //动态修改标题头部
        // wx.setNavigationBarTitle({
        //   title: res.data.data.name,
        // })
      }
    })
  },
  findAddress() {
    let _this = this;

  },
  getToday: function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day)
  },
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
    let _this = this;
    _this.setData({message : e.detail.value})

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
        wx.request({
          url: app.globalData.requestHost + app.globalData.Create_Order,
          data: {
            token: wx.getStorageSync('token'),
            cartJSONStr: that.data.cartJSONStr, //购物车id
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function(res) {
            console.log(res, '提交订单成功-返回订单号')
            console.log(res.data.data.tradeNo, '11111', res.data.data.id)
            that.setData({
              tradeNo: res.data.data.tradeNo, //订单号
              tradeId: res.data.data.id //订单id
            })
            that.goToBuy(); //然后请求支付接口
          }
        })
      } else {
        //直接立即购买请求的提交订单

        wx.request({
          url: app.globalData.requestHost + app.globalData.Buy_NowOrder,
          data: {
            token: wx.getStorageSync('token'),
            goodsId: that.data.goodsList[0].id, //商品id
            quantity: that.data.goodsList[0].quantity, //数量
            csrId: that.data.colorSizeId, //颜色尺寸
            msg: that.data.msg, //用户留言备注
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function(res) {
            console.log(res, '提交订单成功-返回订单号')
            that.setData({
              tradeNo: res.data.data.tradeNo, //订单号
              tradeId: res.data.data.id //订单id
            })
            that.goToBuy(); //然后请求支付接口
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
      }
    })
  },
  tobookDetails() {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    let data = {
      token: wx.getStorageSync('token'),
      shopId: _this.data.shopId,
      goodsId: _this.data.goodid,
      csrId: _this.data.crsId,
      shopName: _this.data.address,
      memberName: _this.data.name,
      memberPhone: _this.data.phone,
      goodsName: _this.data.goodList.name,
      goodsPrice: _this.data.goodList.discountPrice,
      message: _this.data.message
    }
    let goodsId = [];
    let csrId = [];
    let cartJSONStr = []
    _this.data.cartList.forEach((item)=>{
      let obj = {};
      obj.goodsId = item.goodsId;
      obj.csrId = item.csrId;
      cartJSONStr.push(obj)
    })
    

    
    console.log(cartJSONStr)
    wx.request({
      url: app.globalData.requestHost + app.globalData.Make_Shop,
      data: {
        token: wx.getStorageSync('token'),
        shopId: _this.data.shopId,
        shopName: _this.data.address,
        memberName: _this.data.name,
        memberPhone: _this.data.phone,
        message: _this.data.message,
        cartJSONStr: JSON.stringify(cartJSONStr)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        if (res.data.code == '0000') {
          wx.hideLoading();
          setTimeout(() => {
            wx.showToast({
              title: '预约成功',
              icon: 'none'
            })
            setTimeout(() => {
              wx.redirectTo({

                url: '/pages/my/record/record?type=' + ''
              })
            }, 500)
          }, 1000)

        } else {
          wx.hideLoading();
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }, 1000)
        }
      },
      fail: function() {
        wx.hideLoading();
        setTimeout(() => {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }, 1000)
      }
    })







  }
})