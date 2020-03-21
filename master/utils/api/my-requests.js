import $ from './request.js';
import tool from '../publics/tool.js';
const _appData = getApp().globalData;
const REQUESTURL = _appData.REQUESTURL;


const myRequest = (data, url, type = 'post', isUrl = false) => {
  !isUrl && (url = `${REQUESTURL}${url}`)
  return new Promise((resolve, reject) => {
    $[`${type}P`](url, data).then(res => {
      if (res.statusCode == 200) {
        if (res.data.code == '0000') {
          resolve(res);
        } else {
          reject(res);
        }
      } else {
        reject(res);
      }
    }).catch(err => {
      reject(err);
    })
  })
}


//获取openid
const getOpenid = (data, url = '/wx/wxLogin') => {
  return myRequest(data, url)
};
//上传头像昵称
const uploadUserInfo = (data, url = '/wx/getUserInfo') => {
  return myRequest(data, url)
};
//手机号解密
const getPhoneNumber = (data, url = '/wx/getPhoneNumber') => {
  return myRequest(data, url)
};

//商品详情页 接口
const findDetail = (data, url = '/api/goods/findDetail') => {
  return myRequest(data, url)
};

//新增收货地址 接口
const addAddress = (data, url = '/api/address/addAddress') => {
  return myRequest(data, url)
};

//收货地址列表查询接口
const findAddress = (data, url = '/api/address/findList') => {
  return myRequest(data, url)
};

//删除收货地址接口（逻辑删）
const deleteAddress = (data, url = '/api/address/deleteAddress') => {
  return myRequest(data, url)
};

//查询购物车列表 接口
const cartList = (data, url = '/api/cart/findList') => {
  return myRequest(data, url)
};

//一级分类 接口
const oneList = (data, url = '/api/goods/selectFirstCategory') => {
  return myRequest(data, url)
};

//二级分类 接口
const twoList = (data, url = '/api/goods/selectSecondCategory') => {
  return myRequest(data, url)
};

//首页Banner 接口
const findBanner = (data, url = '/api/carousel/findList') => {
  return myRequest(data, url)
};

//根据分类查询商品列表 接口
const classList = (data, url = '/api/goods/findCategoryList') => {
  return myRequest(data, url)
};

//收藏商品 接口
const addCollect = (data, url = '/api/goods/addCollect') => {
  return myRequest(data, url)
};

//商品详情尺寸 接口
const findColorSize = (data, url = '/api/goods/findColorSize') => {
  return myRequest(data, url)
};

//立即购买 接口
const buyNow = (data, url = '/api/order/buyNow') => {
  return myRequest(data, url)
};

//添加购物车 接口
const addCart = (data, url = '/api/cart/addCart') => {
  return myRequest(data, url)
};

//支付 接口
const wxPay = (data, url = '/api/pay/wxPay') => {
  return myRequest(data, url)
};

//删除购物车（逻辑删）
const deleteCart = (data, url = '/api/cart/deleteCart') => {
  return myRequest(data, url)
};

//结算 回显 接口
const setTle = (data, url = '/api/order/settle') => {
  return myRequest(data, url)
};

//立即购买提交订单 接口
const buyOrder = (data, url = '/api/order/buyNowOrder') => {
  return myRequest(data, url)
};

//立即购买提交订单 接口
const createOrder = (data, url = '/api/order/createOrder') => {
  return myRequest(data, url)
};

//查询订单列表
const orderList = (data, url = '/api/order/findList') => {
  return myRequest(data, url)
};

//查询订单列表
const orderDetails = (data, url = '/api/order/findDetail') => {
  return myRequest(data, url)
};

//取消订单
const cancleOrder = (data, url = '/api/order/cancelOrder') => {
  return myRequest(data, url)
};

//领取会员卡接口
const addCard = (data, url = '/api/user/addCard') => {
  return myRequest(data, url)
};

//用户申请 退款 接口
const wxRefund = (data, url = '/api/pay/wxRefund') => {
  return myRequest(data, url)
};

//收藏列表
const findCollect = (data, url = '/api/goods/findCollect') => {
  return myRequest(data, url)
};

//特惠专区
const goodFindList = (data, url = '/api/goods/findList') => {
  return myRequest(data, url)
};

//退款查询
const goodsTuiKuan  = (data, url = '/api/order/refundAddress') => {
  return myRequest(data, url)
};

//填写物流
const sendGoods = (data, url = '/api/order/sendTheGoods') => {
  return myRequest(data, url)
};

//查询规格
const findGuige = (data, url = '/api/goods/ceshi') => {
  return myRequest(data, url)
};

//查看秒杀商品
const killGoods = (data, url = '/api/seckill/findList') => {
  return myRequest(data, url)
};

//参与秒杀
const joinKill = (data, url = '/api/seckill/secondKill') => {
  return myRequest(data, url)
};

//修改订单地址
const orderAddress = (data, url = '/api/order/orderAddress') => {
  return myRequest(data, url)
};

//确认收货
const comfirmOrder = (data, url = '/api/order/confirmReceipt') => {
  return myRequest(data, url)
};

//查询物流
const wuliuSearch = (data, url = '/api/exp/findExp') => {
  return myRequest(data, url)
};

//首页专区列表
const divisionSearch = (data, url = '/api/division/divisionList') => {
  return myRequest(data, url)
};

//专区商品列表
const findComeList = (data, url = '/api/division/findComeList') => {
  return myRequest(data, url)
};

//视频文化
const cultureList = (data, url = '/api/brandCulture/brandCultureList') => {
  return myRequest(data, url)
};

//文化详情
const cultureDetails = (data, url = '/api/brandCulture/getOneBrandCulture') => {
  return myRequest(data, url)
};

//团队列表
const teamList = (data, url = '/api/team/teamList') => {
  return myRequest(data, url)
};

//团队商品
const teamGoods = (data, url = '/api/team/findComeList') => {
  return myRequest(data, url)
};

//查询店铺
const findShop = (data, url = '/api/shop/shopList') => {
  return myRequest(data, url)
};

//查询用户预约列表
const memberList = (data, url = '/api/memberMakeShop/findMemberList') => {
  return myRequest(data, url)
};

//取消预约订单
const cancleShop = (data, url = '/api/memberMakeShop/cancelMakeShop') => {
  return myRequest(data, url)
};

//预约订单
const makeShop = (data, url = '/api/memberMakeShop/makeShopOrder') => {
  return myRequest(data, url)
};

//预约详情
const shopDetails = (data, url = '/api/memberMakeShop/getOneMakeShop') => {
  return myRequest(data, url)
};

//奖励分销
const shareGoods = (data, url = '/api/distribution/record') => {
  return myRequest(data, url)
};

//品牌Banner
const brandBanner = (data, url = '/api/brandCulture/findBannerList') => {
  return myRequest(data, url)
};

//优惠券列表
const findCoupons = (data, url = '/api/coupon/findList') => {
  return myRequest(data, url)
};

//优惠券详情
const couponDetails = (data, url = '/api/coupon/findCouponDetail') => {
  return myRequest(data, url)
};

//用户积分兑换优惠券接口
const couponConversion = (data, url = '/api/user/conversion') => {
  return myRequest(data, url)
};


//用户积分兑换优惠券接口
const rewardList = (data, url = '/api/coupon/findCouponList') => {
  return myRequest(data, url)
};

//用户退款订单列表
const findRefund = (data, url = '/api/order/findRefundList') => {
  return myRequest(data, url)
};

//查询规则
const findRule = (data, url = '/api/rule/findList') => {
  return myRequest(data, url)
};

//查看会员卡
const memberCard = (data, url = '/api/user/memberCard') => {
  return myRequest(data, url)
};

//查看会员卡
const uploadImg = (data, url = '/admin/upload') => {
  return myRequest(data, url)
};

module.exports = {
  myRequest,
  uploadUserInfo,
  getOpenid,
  getPhoneNumber,
  findDetail,
  addAddress,
  findAddress,
  deleteAddress,
  cartList,
  oneList,
  twoList,
  findBanner,
  classList,
  addCollect,
  findColorSize,
  buyNow,
  addCart,
  wxPay,
  deleteCart,
  setTle,
  buyOrder,
  createOrder,
  orderList,
  orderDetails,
  cancleOrder,
  addCard,
  wxRefund,
  findCollect,
  goodFindList,
  goodsTuiKuan,
  findGuige,
  killGoods,
  joinKill,
  orderAddress,
  comfirmOrder,
  wuliuSearch,
  divisionSearch,
  findComeList,
  cultureList,
  cultureDetails,
  teamList,
  teamGoods,
  findShop,
  memberList,
  cancleShop,
  makeShop,
  shopDetails,
  shareGoods,
  brandBanner,
  findCoupons,
  couponDetails,
  couponConversion,
  rewardList,
  findRule,
  findRefund,
  memberCard,
  uploadImg,
  sendGoods
}