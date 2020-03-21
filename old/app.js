//app.js
import auth from './utils/publics/authorization.js'
App({
  onLaunch: function(options) {
    // 展示本地存储能力
    let _this = this;
    var logs = wx.getStorageSync('logs') || [];
    //腾讯统计
    auth.statistics('500701970')
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })    

    let accountInfo = wx.getAccountInfoSync();
    
    console.log(accountInfo)  

    
  },

  wxLogin: function() {
    // 登录
    var that = this;
    console.log('登录了吗123')
    console.log(that.globalData)
    wx.login({
      success: function(res) {
        console.log(res, '获取code')
        // that.globalData.code = res.code;
        wx.request({
          url: that.globalData.requestHost + that.globalData.LOGIN_URL, //请求登录接口 拿code换取 token
          data: {
            code: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success(res) {
            console.log(res, '用户id');
            if (res.data.success == true) {
              // 存token
              wx.setStorage({
                key: "token",
                data: res.data.data.token,
              });
              
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        that.globalData.userInfo = res.userInfo
                        wx.setStorageSync('userInfo', res.userInfo)
                        that.wxGetUserInfo();
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (that.userInfoReadyCallback) {
                          that.userInfoReadyCallback(res)
                        }
                      }
                    })
                  }
                }
              })
              // wx.switchTab({
              //   url: '../index/index',
              // })
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
            }
          },
        })
      }

    })
  },
  wxGetUserInfo: function () { 
    /**获取用户信息授权 */
    var that = this;
    console.log(that.globalData)
    wx.request({
      url: that.globalData.requestHost + that.globalData.Get_Userinfo, //获取用户信息 换取 token
      data: {
        token: wx.getStorageSync('token'),       
        json: JSON.stringify(wx.getStorageSync('userInfo'))
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function(res) {
        console.log(res,'重复返回token')
        // 存会员状态
        if (res.data.data==null){
          wx.setStorage({
            key: "vip",
            data: '',
          });
        }else{
          wx.setStorage({
            key: "vip",
            data: res.data.data,
          });



          
        }
      }
    })
  },
  globalData: {
    requestHost: "https://dev.flyh5.cn/yoplait/",
    LOGIN_URL: "wx/wxLogin", //用户登录接口
    Get_Userinfo:'wx/getUserInfo',//获取用户信息
    GetPhoneNumber: 'wx/getPhoneNumber', // 获取手机号
    Find_Detail: "api/goods/findDetail", //商品详情页 接口
    Add_Ress:'api/address/addAddress',//新增收货地址 接口
    Find_List:'api/address/findList',//收货地址列表 接口
    Delete_Address: 'api/address/deleteAddress',//删除收货地址接口（逻辑删）
    Cart_List:'api/cart/findList',//查询购物车列表 接口
    One_List:'api/goods/selectFirstCategory',//一级分类 接口
    Two_list:'api/goods/selectSecondCategory',//二级分类 接口
    Lub_Img:'api/carousel/findList',  //首页banner 接口
    Class_List: 'api/goods/findCategoryList',//根据分类查询商品列表 接口
    Add_Cllect:'api/goods/addCollect',//收藏商品 接口
    Find_Color: 'api/goods/findColorSize',//商品详情尺寸 接口
    Buy_Now:'api/order/buyNow',//立即购买 接口
    Add_Cart:'api/cart/addCart',//添加购物车 接口
    Pay:'api/pay/wxPay',//支付 接口
    Delete_Cart: 'api/cart/deleteCart',//删除购物车（逻辑删）
    Set_Tle:'api/order/settle',//结算 回显 接口
    Buy_NowOrder:'api/order/buyNowOrder',//立即购买-提交订单
    Create_Order: 'api/order/createOrder',//在结算页面提交订单
    Order_FindDetel: 'api/order/findDetail',//查询订单详情
    Order_FindList:'api/order/findList', //查询订单列表
    Cancel_Order:'api/order/cancelOrder',//取消订单
    Add_Card:'api/user/addCard',//领取会员卡接口
    Member_Card:'api/user/memberCard',//查看会员卡
    Wx_Refund:'api/pay/wxRefund',//用户申请 退款 接口
    Add_Collect: 'api/goods/addCollect', // 收藏
    Find_Collect: 'api/goods/findCollect', // 收藏列表
    Goods_findList : 'api/goods/findList', // 特惠专区
    Goods_TuiKuan : 'api/order/refundAddress', //退款查询
    Send_TheGoods: 'api/order/sendTheGoods', // 填写退款物流
    Find_NDetail: 'api/goods/ceshi', // 查询规格
    Kill_Goods: 'api/seckill/findList',//查看秒杀商品
    Join_Kill: 'api/seckill/secondKill', // 参与秒杀
    Order_Address: 'api/order/orderAddress', //修改订单地址
    Comfirm_Order: 'api/order/confirmReceipt', //确认收货
    Wuli_Search: 'api/exp/findExp',  // 查看物流
    Division: 'api/division/divisionList', //首页专区列表
    Find_ComeList: 'api/division/findComeList', //专区商品列表
    Culture_List : 'api/brandCulture/brandCultureList', //视频文化
    Culture_Details : 'api/brandCulture/getOneBrandCulture', //详情
    Team_List: 'api/team/teamList', //团队列表
    Team_Good: 'api/team/findComeList',  //团队商品
    Find_Shop: 'api/shop/shopList',  // 查询店铺
    Member_List: 'api/memberMakeShop/findMemberList', // 查询用户预约列表
    Cancle_Shop: 'api/memberMakeShop/cancelMakeShop', //取消预约订单
    Make_Shop: 'api/memberMakeShop/makeShopOrder', //预约订单
    Detail_Shop: 'api/memberMakeShop/getOneMakeShop', //预约详情
    Share_Goods: 'api/distribution/record', //奖励分销
    Brand_Banner: 'api/brandCulture/findBannerList', //品牌Banner
    Find_Coupons: 'api/coupon/findList',  //优惠券列表
    Coupon_Detail: 'api/coupon/findCouponDetail',  //优惠券详情
    Coupon_Conversion: 'api/user/conversion',  //用户积分兑换优惠券接口
    Rewards_List: 'api/coupon/findCouponList',  //用户积分兑换优惠券接口
    FindRefundList: 'api/order/findRefundList',   // 用户退款订单列表
    Find_Rule: 'api/rule/findList' // 寻找规则
  },  
  /**倒计时 模块*/
  timeToStr(time) {
    var m = 0,
      s = 0,
      _m = '00',
      _s = '00';
    time = Math.floor(time % 3600);
    m = Math.floor(time / 60);
    s = Math.floor(time % 60);
    _s = s < 10 ? '0' + s : s + '';
    _m = m < 10 ? '0' + m : m + '';
    return _m + ":" + _s;
  },
  //检测手机类型是否是苹果X手机
  // checkIsIPhoneX: function() {
  //   const self = this
  //   wx.getSystemInfo({
  //     success: function(res) {
  //       console.log(res,'获取手机参数')
  //       // 根据 model 进行判断
  //       if (res.model.search('iPhone X') != -1) {
  //         self.globalData.isIPX = true
  //       }
  //       // 或者根据 screenHeight 进行判断
  //       // if (res.screenHeight == 812) {
  //       //   self.globalData.isIPX = true
  //       // }
  //     }
  //   })
  // },
})