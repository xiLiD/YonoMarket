const app = getApp();
import WxParse from '../../components/wxParse/wxParse.js';
import tool from '../../utils/publics/tool.js';
import map from '../../utils/map/map.js';
import ajax from '../../utils/api/my-requests.js';
const date = new Date()
const months = []
const days = []
const hours = []
for (let i = 1; i <= 12; i++) {
  months.push(i)
}
for (let i = 1; i <= 31; i++) {
  days.push(i)
}
for (let i = 1; i <= 24; i++) {
  if (i >= 10 && i <= 25) {
    hours.push(i)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [], //轮播图
    indicatorDots: true, //小点
    activeColor: "coral", //当前选中的指示点颜色
    indicatorColor: 'rgba(255, 255, 255, 0.5)', //指示点颜色
    // activeColor: '#FFFFFF', //选中指示点颜色
    swiperCurrent: 0,
    autoplay: true, //自动轮播
    interval: 3000,
    duration: 1500,
    goodid: '', //商品id
    //商品详情数据
    goodList: {},
    isHide: false, //默认遮罩层隐藏
    isShow: false, //默认规格/尺寸弹框隐藏
    num: 1, //购买数量 默认1件
    shoucang: '', //判断是否收藏过
    //颜色数据
    yanse: '', //颜色
    size: '', //尺寸
    colorList: [],
    //尺码数据
    chicun: 1, //默认选中1
    chimaList: [], //尺码数据
    colorSize: '', //选择好颜色和尺码生成的id
    defaultcolor: [],
    defaultchima: [],
    store: '',
    sizeList: [],
    colorNewrList: [],
    sizeNewList: [],
    showModal: {
      isShow: false,
      title: "授权登录",
      test: "为了更好的体验，请先授权登录",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#2EB3A4'
    },
    imgheights: [],
    showAddressOption: {
      isShow: false,
      type: 0,
      title: "获取位置信息",
      test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showAuthOption: {
      isShow: false,
      type: 2,
      title: "获取用户授权",
      test: "小程序将获取你的用户信息",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showMobileOption: {
      isShow: false,
      type: 1,
      title: "获取手机号授权",
      test: "小程序将获取你的手机号",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showBook: false,
    personInfo: {
      name: '',
      phone: ''
    },
    endedTime: '2019-01-01 12:38',
    timeIndex: [0, 0, 0],
    times: [months, days, hours],
    doorDialog: {
      show: false,
      index: 0,
      itemList: ['请选择', '嘉兴门店', '长沙门店', '武汉门店', '上海门店'],
    },
    timeDialog: {
      show: false,
      months: months,
      hours: hours,
      days: days,
      time: {
        month: 11,
        day: 12,
        hour: 12
      },
      newtime: {
        month: 11,
        day: 12,
        hour: 12
      }
    },
    goodsIndex : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      let openId = options.openId ? options.openId : '';
      let goodsId = options.goodid ? options.goodid : '';
      if (openId && goodsId) {
        _this.setData({
          openId: wx.getStorageSync('openId'),
          firstOpenId: openId,
          firstGoodsId: goodsId
        })
        _this.shareGoods();
      }
      // that.getNGoods(options.goodid);
      _this.setData({
        goodid: options.goodid
      })
      _this.getGoods(options.goodid);
      // 预约
      let dayTime = _this.getToday();
      let dayHour = "18:00";
      let endedTime1 = dayTime + " " + dayHour;
      let day = dayTime.split('-')[1]
      let months = 'timeIndex[0]';
      let days = 'timeIndex[1]'
      let hours = 'timeIndex[2]'
      _this.setData({
        [months]: dayTime.split('-')[1] - 1,
        [days]: dayTime.split('-')[2] - 1,
        [hours]: dayHour.split(':')[0] - 1
      })
      _this.setData({
        endedTime: endedTime1
      })
      if (wx.getStorageSync('userInfo')) {
        let personInfo = _this.data.personInfo;
        personInfo.name = wx.getStorageSync('userInfo').nickName
        _this.setData({
          personInfo: personInfo
        })
      }
      if (wx.getStorageSync('mobile')) {
        let personInfo = _this.data.personInfo;
        personInfo.phone = wx.getStorageSync('mobile')
        _this.setData({
          personInfo: personInfo
        })
      }
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
    this.setData({
      autoplay: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      autoplay: false
    })
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
  getToday: function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day)
  },
  toDouble: function(num) {
    if (num >= 10) { //大于10
      return num;
    } else { //0-9
      return '0' + num
    }
  },
  tobookOrder() {
    let _this = this;
    // return;
    let address = _this.data.doorDialog.itemList[_this.data.doorDialog.index];
    let details = _this.data.shopList[_this.data.doorDialog.index].shopAddress;
    // if(_this.data.personInfo.name == '') {
    //   wx.showToast({
    //     title: '姓名不能为空！',
    //     icon : 'none'
    //   })
    //   return;
    // }
    // if (_this.data.personInfo.phone == '') {
    //   wx.showToast({
    //     title: '手机号不能为空！',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // var list = 
    // {
    //   quantity : 1,
    //   goods: _this.data.goodList
    // }
    if (!_this.data.yanse) {
      tool.alert('请选择颜色！');
      return;
    }  
    if (!_this.data.size) {
        tool.alert('请选择尺码！');
        return;
    }  
    let list1 = this.data.sizeList.filter((item) => {
      return item.color == _this.data.yanse
    })
    let list2 = list1.filter((item) => {
      return item.name == _this.data.size
    })
    let id = list2[0].id
    _this.setData({
      colorSize: id
    })

    // let newList = [];
    // newList.push(list)
    let goodsId = [];
    let csrId = [];
    let cartJSONStr = [];
    let obj = {};
    obj.goodsId = _this.data.goodid;
    obj.csrId = _this.data.colorSize;
    obj.goods = _this.data.goodList;
    obj.quantity = _this.data.num;
    cartJSONStr.push(obj)
    // list.forEach((item) => {
    //   if (item.selected) {

    //   }
    // })
    _this.setData({ showBook: false });
    let url = '/pages/bookOrder/bookOrder?address=' + address + '&details=' + details + '&name=' + wx.getStorageSync('userInfo').nickName + '&phone=' + wx.getStorageSync('mobile') + '&time=' +
      _this.data.endedTime + '&shopId=' + _this.data.shopList[_this.data.doorDialog.index].id + '&addressIndex=' + _this.data.doorDialog.index + '&cartJSONStr=' + JSON.stringify(cartJSONStr);
    tool.jump_nav(url);
  },
  getPosition(isOk) {
    // tool.loading("自动定位中")
    map.getPosition2().then(res => {
      let _address_component = res.result.address_component
      console.log("经度---->", res.result.location.lng)
      console.log("纬度---->", res.result.location.lat)
      console.log("省---->", _address_component.province)
      console.log("市---->", _address_component.city)
      console.log("区---->", _address_component.district)
      wx.setStorageSync('addressInfo', res.result)
      if (res.result.location) {
        this.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat
        })
        this.getAddress();
        // this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })
        tool.loading_h()
        let name = 'personInfo.name'
        let phone = 'personInfo.phone'
        this.setData({
          [name]: '',
          [phone]: ''
        });
        this.setData({
          showBook: true
        })
      }

    }).catch(err => {
      console.log("定位失败", err)
      tool.alert("定位失败")
      tool.loading_h()
      if (isOk != 1) this.showHideModal()
    })
  },
  hideBook() {
    let _this = this;
    _this.setData({
      showBook: false
    })
  },
  /** 获取地址 */
  getAddress() {
    let _this = this;
    let doorList = 'doorDialog.itemList';
    ajax.findShop({
      longitude: _this.data.longitude,
      latitude: _this.data.latitude
    }).then((res)=>{
      let shopList = res.data.data ? res.data.data : []
      _this.setData({
        shopList: shopList
      })
      let result = []
      _this.data.shopList.forEach((item) => {
        result.push(item.shopName)
      })
      _this.setData({
        [doorList]: result
      })
    })
    // wx.request({
    //   url: app.globalData.requestHost + app.globalData.Find_Shop,
    //   data: {
    //     longitude: _this.data.longitude,
    //     latitude: _this.data.latitude
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: 'POST',
    //   success: function(res) {

    //     let shopList = res.data.data ? res.data.data : []
    //     _this.setData({
    //       shopList: shopList
    //     })
    //     let result = []
    //     _this.data.shopList.forEach((item) => {
    //       result.push(item.shopName)
    //     })
    //     _this.setData({
    //       [doorList]: result
    //     })
    //   }
    // })
  },
  bindDoorChange: function(e) {
    const val = e.detail.value
    let newIndex = 'doorDialog.index'
    this.setData({
      [newIndex]: val
    })
  },
  bindAddressChange: function(e) {
    const val = e.detail.value
    let newIndex = 'addressDialog.index'
    this.setData({
      [newIndex]: val
    })
  },
  onPickerChange3: function(e) {
    this.setData({
      endedTime: e.detail.dateString
    })
  },
  showBook(e) {
    let that = this;
    if (!that.checkMember()) {
      return;
    }
    that.setData({
      yanse: '',
      size: '',
      num: 1
    })
    that.getPosition();
  },
  // 判断是否是会员 执行在手机号授权之前
  checkCard() {
    setTimeout(() => {
      ajax.memberCard({
        token: wx.getStorageSync('token')
      }).then((res) => {
        if (res.data.code) return true;
        if (res.data.data) {
          let vip = res.data.data ? res.data.data.memberCard : '';
          return vip == '';  // 如果是会员 返回false 如果不是会员返回true;
        }
      })
    }, 500)
  },
  // 授权验证  用户、手机号、地理位置
  checkMember() {
    let _this = this;
    if (!wx.getStorageSync('userInfo').nickName) {
      _this.showAuthModal();
      return false;
    }
    if (!this.checkCard()) {
      tool.alert('您尚未注册！,请先注册');
      setTimeout(() => {
        tool.jump_nav('/pages/my/vip/vip');
      }, 500)
      return;
    }  
    if (!wx.getStorageSync('mobile')) {
      _this.showMobileModal();
      return false;
    }
    if (!wx.getStorageSync('addressInfo')) {
      _this.showAddressModal();
      return false;
    }
    return true;
  },
  //获取地址
  addressOperation(e) {
    let _this = this;
    tool.loading();
    if (e.detail.confirm) {
      setTimeout(() => {
        tool.loading_h();
        _this.showAddressModal()
      }, 500)
      _this.getPosition(1)
      // setTimeout(() => {
      //   tool.loading_h();
      // }, 500)
      // _this.showAddressModal()
      // auth.openSetting(res => {//用户自行从设置勾选授权后
      //   if (res.authSetting["scope.userLocation"]) {
      //     _this.getPosition(1)
      //   }
      // })

    } else {
      setTimeout(() => {
        tool.loading_h();
        _this.showAddressModal()
      }, 500)

    }
  },
  // 获取用户授权
  authOperation(e) {
    let _this = this;
    tool.loading();
    if (e.detail.confirm) {
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          console.log(res)
          wx.setStorageSync('userInfo', res.userInfo);
          setTimeout(() => {
            tool.loading_h();
          }, 500)
          _this.showAuthModal();
          setTimeout(() => {
            _this.showMobileModal();
          }, 500)
        }
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
      }, 500)
      _this.showAuthModal()
      // setTimeout(() => {
      //   tool.loading_h()
      //   this.showAuthModal()
      // }, 600)
    }
  },
  // 获取手机号
  mobileOperation(e) {
    let _this = this;
    tool.loading();
    if (e.detail.confirm) {
      // => 获取解码手机号的信息
      ajax.getPhoneNumber({
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then((res)=>{
        let code = res.data.code;
        setTimeout(() => {
          tool.loading_h();
          _this.showMobileModal();
          setTimeout(() => {
            if (code == '0000'){
              wx.setStorageSync('mobile', res.data.data);
              _this.showAddressModal();
              return;
            }
            tool.alert(res.data.msg);
          }, 500)
        }, 500)
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
        _this.showMobileModal()
      }, 500)
    }
  },
  //打开、关闭用户授权弹窗
  showAuthModal() {
    let _showAuthOption = this.data.showAuthOption
    _showAuthOption.isShow = !_showAuthOption.isShow
    this.setData({
      showAuthOption: _showAuthOption
    })
  },
  // 打开、关闭手机授权弹窗
  showMobileModal() {
    let _showMobileOption = this.data.showMobileOption
    _showMobileOption.isShow = !_showMobileOption.isShow
    this.setData({
      showMobileOption: _showMobileOption
    })
  },
  // 打开、关闭地址授权弹窗
  showAddressModal() {
    let _showAddressOption = this.data.showAddressOption
    _showAddressOption.isShow = !_showAddressOption.isShow
    this.setData({
      showAddressOption: _showAddressOption
    })
  },
  shareGoods() {
    var that = this;
    let data = {
      openId: that.data.openId, //当前用户的唯一标识
      firstOpenId: that.data.firstOpenId, //参数链接后面的分销用户的唯一标识
      firstGoodsId: that.data.firstGoodsId //	商品ID
    }
    ajax.shareGoods({
      openId: that.data.openId, //当前用户的唯一标识
      firstOpenId: that.data.firstOpenId, //参数链接后面的分销用户的唯一标识
      firstGoodsId: that.data.firstGoodsId //	商品ID
    }).then((res)=>{
      console.log(res)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    // return {
    //   title: '优诺 方便家人 更方便你',
    //   path: '/pages/details/details?goodsid=' + that.data.goodid + '&openId=' + wx.getStorageSync('openId')
    // }
    let that = this;
    let title = that.data.showName;
    // let title_left = app. 
    let image = that.data.imgUrls[that.data.swiperCurrent];
    return {
      // title: '【TB toolBox】',
      desc: '【TB toolbox】'+ title,
      imageUrl: image,
      path: '/pages/index/index?goodid=' + that.data.goodid + '&openId=' + wx.getStorageSync('openId') // 路径，传递参数到指定页面。   
    }
  },
  /**授权 */
  operation(e) {
    let that = this;
    let _showModal = this.data.showModal
    _showModal.isShow = false
    this.setData({
      showModal: _showModal,
      user_id: wx.getStorageSync('w_user_id'),
      userAvatar: wx.getStorageSync('userAvatar'),
      nickname: wx.getStorageSync('nickname'),
    })
  },
  /**请求商品详情页 数据接口 */
  getGoods: function(goodid) {
    var that = this;
    ajax.findDetail({
      id: goodid,
      token: wx.getStorageSync('token')
    }).then((res)=>{
      // var article = res.data.data.remark; //富文本解析
      // WxParse.wxParse('article', 'html', article, that, 5);
      if (res.data.data.remark) {
        // res.data.data.remark.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
        // res.data.data.remark.replace(/\<p/gi, '<p class="rich-p" ');//正则给p标签增加class
        let article = res.data.data.remark.replace(/&nbsp;/g, '')
        WxParse.wxParse('article', 'html', article, that, 5)
      }
      that.setData({
        goodList: res.data.data, //商品详情数据
        imgUrls: res.data.data.imgPaths, //轮播图数组
        shoucang: res.data.data.status, //判断是否收藏过
        defaultcolor: res.data.data.colo, //颜色数据
        defaultchima: res.data.data.size, //尺寸数据

        chimaList: res.data.data.colo, //尺码数据
        colorSize: res.data.data.size, //选择好颜色和尺码生成的id
        shoucang: res.data.data.isCollect,
        storeNum: res.data.data.colo[0].store,
        showImg: res.data.data.colo[0].colorImg,
        showName: res.data.data.name
      })

      let colorNList = that.unique(res.data.data.colo)
      let sizeNList = that.uniqueCM(res.data.data.colo)
      that.setData({
        sizeList: res.data.data.colo,
        colorNList: colorNList,
        sizeNList: sizeNList
      })
      //动态修改标题头部
      wx.setNavigationBarTitle({
        title: res.data.data.name,
      })
    })
  },
  /**去重 */
  unique(arr1) {
    const res = new Map();
    return arr1.filter((a) => !res.has(a.color) && res.set(a.color, 1))
  },
  /**尺码 */
  uniqueCM(arr1) {
    const res = new Map();
    return arr1.filter((a) => !res.has(a.name) && res.set(a.name, 1))
  },
  /**轮播图 */
  swiperChange: function(e) {
    this.setData({
      swiperCurrent: e.detail.current,
      current: e.detail.current
    })
  },
  imgload: function(e) {
    var imgheight = e.detail.height;
    var imgwidth = e.detail.width;
    var bl = imgheight / imgwidth;
    var sjgd = bl * (wx.getSystemInfoSync().windowWidth);
    var hs = this.data.imgheights;
    hs[e.target.dataset.id] = sjgd;
    this.setData({
      imgheights: hs
    });
  },
  /**点击收藏 商品 按钮 */
  goTosc: function() {
    var that = this;
    let val = '';
    if (that.data.shoucang == 0) {
      val = 1
    } else if (that.data.shoucang == 1) {
      val = 0
    } else {
      val = 1
    }
    ajax.addCollect({
      id: that.data.goodid,
      token: wx.getStorageSync('token'),
      type: 1
    }).then((res)=>{
      that.getGoods(that.data.goodid);
    })
  },
  cancelSc: function() {
    var that = this;
    ajax.addCollect({
      id: that.data.goodid,
      token: wx.getStorageSync('token')
    }).then((res)=>{
      if (res.data.success == true) {
        that.setData({
          shoucang: 1
        })
      }
    })
  },
  /**点击 立即购买 按钮 弹出选择颜色 / 尺寸*/
  goTogoumai: function() {
    var that = this;
    let yanse = this.data.goodList.colo[0].color ? this.data.goodList.colo[0].color : '';
    let size = this.data.goodList.colo[0].name ? this.data.goodList.colo[0].name : '';
    that.setData({
      yanse: yanse,
      size: size,
      num: 1
    })
    that.setData({
      isHide: true,
      isShow: true
    })
  },
  /**点击弹窗 关闭按钮 */
  guanbi: function() {
    var that = this;
    that.setData({
      isHide: false,
      isShow: false
    })
  },
  // 筛选价格数据
  checkPrice(data,info){
    let result = data || [];
    result.forEach((item,index)=>{
      if (item.name == info.name && item.color == info.color){
        return index;
      }
    })
  },
  /**点击选择颜色规格按钮 */
  goTocolor: function(e) {
    var that = this;
    if (e.currentTarget.dataset.status == 2) {
      return;
    }
    if (e.currentTarget.dataset.store == 0) {
      return;
    }
    that.setData({
      yanse: e.currentTarget.dataset.name
    })
    that.setData({
      showImg: e.currentTarget.dataset.img,
      storeNum: e.currentTarget.dataset.store
    })
    let color = e.currentTarget.dataset.name;
    let colorid = e.currentTarget.dataset.colorid;

    let priceInfo = { size: that.data.size, yanse: that.data.yanse };
    this.setData({ goodsIndex: that.checkPrice(that.data.goodList.colo, priceInfo) }); 
  },
  /**点击选择 尺码规格 按钮 */
  goTochima: function(e) {
    var that = this;
    this.setData({ goodsIndex : e.currentTarget.dataset.index});
    if (e.currentTarget.dataset.store == 0) {
      return;
    }
    that.setData({
      showImg: e.currentTarget.dataset.img,
      size: e.currentTarget.dataset.name
    })
    that.setData({
      storeNum: e.currentTarget.dataset.store
    })
    let priceInfo = { size: that.data.size, yanse: that.data.yanse };
    this.setData({ goodsIndex: that.checkPrice(that.data.goodList.colo, priceInfo) }); 
  },
  /** 绑定加数量事件 */
  btn_add(e) {
    var that = this
    that.setData({
      num: that.data.num + 1
    })
  },

  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    // 判断num小于等于1  return; 点击无效
    var that = this;
    if (that.data.num <= 1) {
      return false;
    }
    // else  num大于1  点击减按钮  数量--

    // 点击递减
    that.setData({
      num: that.data.num - 1
    })
  },
  /**点击立即购买 按钮 跳转至 订单页面 */
  goTodingdan: function() {
    var that = this;
    if(that.data.yanse == ''){
      tool.alert('请选择颜色');
      return;
    }
    if(that.data.size == ''){
      tool.alert('请选择尺码');
      return;
    }
    console.log(that.data.storeNum);
    if (!that.data.storeNum){
      tool.alert('暂无库存');
      return;
    }
    let list1 = this.data.sizeList.filter((item) => {
      return item.color == that.data.yanse
    })
    let list2 = list1.filter((item) => {
      return item.name == that.data.size
    })
    let id = list2[0].id
    that.setData({
      colorSize: id
    })
    tool.loading();
    ajax.buyNow({
      token: wx.getStorageSync('token'),
      goodsId: that.data.goodid,
      quantity: that.data.num,
      csrId: id,
      msg: '',
    }).then((res)=>{
      console.log(res)
      setTimeout(() => {
        tool.loading_h();
        if (res.data.code == 9000) {
          wx.setStorageSync('userInfo', '');
          tool.alert('请登录')
          setTimeout(function () {
            tool.jump_swi('/pages/my/my')
          }, 2000);
          return;
        }
        // return;
        if (res.data.code == '0000') {
          that.guanbi();
          // console.log(res.data.data,'?????');
          // return;
          tool.jump_nav('/pages/qrdd/qrdd?rels=' + JSON.stringify(res.data.data) + '&colorSizeId=' + that.data.colorSize)
        }
      }, 500)
    })
  },
  /**点击加入购物车 按钮 */
  goToaddcart: function() {
    var that = this;
    if (that.data.yanse == '') {
      tool.alert('请选择颜色');
      return;
    } 
    if (that.data.size == '') {
      tool.alert('请选择尺码');
      return;
    }
    let list1 = this.data.sizeList.filter((item) => {
      return item.color == that.data.yanse
    })
    let list2 = list1.filter((item) => {
      return item.name == that.data.size
    })
    let id = list2[0].id
    that.setData({
      colorSize: id
    })
    ajax.addCart({
      token: wx.getStorageSync('token'), //用户token
      goodsId: that.data.goodid, //商品ID
      quantity: that.data.num, //商品数量
      csrId: id //商品的尺寸ID
    }).then((res)=>{
        let msg = res.data.success ? '添加成功' : res.data.msg;
        let code = res.data.code;
        if (code == '0000') {
          that.guanbi();
          tool.alert('添加成功')
        } else {
          if (res.data.code == 9000) {
            wx.setStorageSync('userInfo', '');
            tool.alert('请登录')
            setTimeout(function () {
              tool.jump_swi('/pages/my/my')
            }, 2000);
            return;
          }
          tool.alert(res.data.msg)
        }
    })
  }
})