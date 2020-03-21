const app = getApp();
import login from '../../utils/api/login.js';
import tool from '../../utils/publics/tool.js';
import map from '../../utils/map/map.js';
import auth from '../../utils/publics/authorization.js';
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
  if(i>=10 && i<=25){
    hours.push(i)
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showReason: false,
    region: ['北京市', '北京市', '东城区'],
    showAddressOption: {
      isShow: false,
      type: 0,
      title: "获取位置信息",
      test: "小程序将访问您的手机定位，自动定位到您当前所在城市信息。",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showAuthOption : {
      isShow: false,
      type: 2,
      title: "获取用户授权",
      test: "小程序将获取你的用户信息",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    showMobileOption : {
      isShow: false,
      type: 1,
      title: "获取手机号授权",
      test: "小程序将获取你的手机号",
      cancelText: "取消",
      confirmText: "授权",
      color_confirm: '#A3271F'
    },
    isShowLoading: false,
    page : 1,
    list : {
      type : ''
    },
    endedTime: '2019-01-01 12:38',
    timeIndex : [0,0,0],
    times: [months, days, hours],
    personInfo : {
      name : '',
      phone : ''
    },
    addressDialog: {
      show: false,
      index: 0,
      array: ['美国', '中国', '巴西', '日本'],
      itemList: ['请选择','嘉兴门店五一广场', '长沙门店五一广场', '武汉门店五一广场', '上海门店五一广场'],
      // itemList: [{
      //     name: '嘉兴门店'
      //   }, {
      //     name: '长沙门店'
      //   }, {
      //     name: '武汉门店'
      //   },
      //   {
      //     name: '上海门店'
      //   }
      // ]
    },
    doorDialog: {
      show: false,
      index: 0,
      itemList: ['请选择','嘉兴门店', '长沙门店', '武汉门店', '上海门店'],
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
    showBook: false, //预约弹窗
    hasShow: false,
    hasList: true, //默认展示列表数据
    //金额
    totalPrice: 0, //总价，初始为0
    //全选状态
    selectAllStatus: true, // 全选状态，默认全选
    // statusall: 1, // 全选状态，默认全选
    cartList: [], //购物车列表数据--默认请求接口的列表数据
    newCartList: [], //循环遍历新的列表数据
    goodsNum: '', //购物车里面的商品件数
    isShow: true, //默认显示结算按钮
    type : 1, // 1： 结算 2 ： 预约
    moren: '管理', //管理
    activeIndex : 0,
    selectIndex: 0,
    isHide: false,
    reasonList: ['10—15点', '15—9点'],
  },
  //loading框
  isShowLoading() {
    this.setData({
      isShowLoading: !this.data.isShowLoading
    })
  },
  //所在城市的picker
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      var _this = this;
      // that.getGouwc(1);
      // that.findMonth();
      let dayTime = _this.getToday();
      let dayHour = "18:00";
      let endedTime1 = dayTime + " " + dayHour;
      let day = dayTime.split('-')[1]
      let months = 'timeIndex[0]';
      let days = 'timeIndex[1]'
      let hours = 'timeIndex[2]'
      _this.setData({ [months]: dayTime.split('-')[1] - 1, [days]: dayTime.split('-')[2] - 1, [hours]: dayHour.split(':')[0]-1})
      _this.setData({ endedTime: endedTime1 });
      if(wx.getStorageSync('userInfo')){
        let personInfo = _this.data.personInfo;
        personInfo.name = wx.getStorageSync('userInfo').nickName
        _this.setData({ personInfo: personInfo })
      }
      if (wx.getStorageSync('mobile')){
        let personInfo = _this.data.personInfo;
        personInfo.phone = wx.getStorageSync('mobile')
        _this.setData({ personInfo: personInfo })
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
    var _this = this;
    let _page = _this.data.page;
    tool.loading();
    Promise.all([_this.getGouwc(_page)]).then((res)=>{
      tool.loading_h();
      _this.count_price();   // 价格方法
    })
  },
  changeType(e){
    let _this = this;
    _this.setData({ type : e.currentTarget.dataset.num });
  },
  changeName(e) {
    console.log(e)
    let name = `personInfo.name`
    this.setData({[name] : e.detail.value})
  },
  changePhone(e) {
    console.log(e)
    let phone = `personInfo.phone`
    this.setData({ [phone]: e.detail.value })
  },
  getPosition(isOk) {
    // tool.loading("自动定位中")
    let _this = this;
    map.getPosition2().then(res => {
      confirms(res);
    }).catch(err => {
      console.log(err)
      if (err.message == 'getLocation:fail auth deny') {
        tool.showModal('提示', '获取地理位置失败，可能导致部分功能不可用，您可以手动去设置。', '去设置,#165d4c').then((res) => {
          if (res) {
            wx.openSetting({
              success(res) {
                console.log(res);
                if (res.authSetting['scope.userLocation']) {
                  map.getPosition2().then(res => {
                    confirms(res);
                  }).catch(err => {
                    cancels(err);
                  })
                } else {
                  cancels(err);
                }
              },
              fail(err) {
                cancels(err);
              }
            })
          } else {
            cancels();
          }
        })
      } else {
        cancels();
      }
    });

    function confirms(res) {
      console.log("定位详细信息", res)
      let _address_component = res.result.address_component
      console.log("经度---->", res.result.location.lng)
      console.log("纬度---->", res.result.location.lat)
      console.log("省---->", _address_component.province)
      console.log("市---->", _address_component.city)
      console.log("区---->", _address_component.district)
      wx.setStorageSync('addressInfo', res.result)
      if (res.result.location) {
        _this.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat
        })
        _this.getAddress();
        // this.setData({ region: [_address_component.province, _address_component.city, _address_component.district] })
        tool.loading_h()
        let name = 'personInfo.name'
        let phone = 'personInfo.phone'
        _this.setData({ [name]: '', [phone]: '' });
        _this.setData({ showBook: true })
      }
    }

    function cancels(err) {
      console.log("定位失败", err || '');
      // tool.alert("定位失败");
    } 
  },
  getData(){
    let that = this;
    map.getPosition2().then(res => {
      confirms(res);
    }).catch(err => {
      if (err.message == 'getLocation:fail auth deny') {
        tool.showModal('提示', '获取地理位置失败，可能导致部分功能不可用，您可以手动去设置。', '去设置,#165d4c').then((res) => {
          if (res) {
            wx.openSetting({
              success(res) {
                console.log(res);
                if (res.authSetting['scope.userLocation']) {
                  map.getPosition2().then(res => {
                    confirms(res);
                  }).catch(err => {
                    cancels(err);
                  })
                } else {
                  cancels(err);
                }
              },
              fail(err) {
                cancels(err);
              }
            })
          } else {
            cancels();
          }
        })
      } else {
        cancels();
      }
    });

    function confirms(res) {
      console.log("定位详细信息", res);
      let _address_component = res.result.address_component;
      wx.setStorageSync('province', _address_component.province);
      wx.setStorageSync('city', _address_component.city);
      that.getUserInfo(); //获取昵称头像
      if (res.result.location) {
        let name = 'personInfo.name'
        let phone = 'personInfo.phone'
        that.setData({
          longitude: res.result.location.lng,
          latitude: res.result.location.lat,
          [name]: '',
          [phone]: '',
          showBook: true
        })
        that.afterAuthorization();
      }
    }

    function cancels(err) {
      console.log("定位失败", err || '');
      // tool.alert("定位失败");
    }
  },
  // 判断是否是会员 执行在手机号授权之前
  checkCard() {
    debugger;
    setTimeout(() => {
      ajax.memberCard({
        token: wx.getStorageSync('token')
      }).then((res) => {
        if (res.data.data) {
          let vip = res.data.data ? res.data.data.memberCard : '';
          console.log(vip);
          return vip == '';  // 如果是会员 返回false 如果不是会员返回true;
        }
      })
    }, 500)
  },
  // 授权验证  用户、手机号、地理位置
  checkMember() {
    let _this = this;
    console.log(wx.getStorageSync('userInfo').nickName)
    if (!wx.getStorageSync('userInfo').nickName) {
      _this.showAuthModal();
      return false;
    }
    if (this.checkCard()) {
      tool.alert('您还不是会员，请注册会员！');
      new Promise((res, rej) => {
        tool.loading();
        setTimeout(() => {
          tool.loading_h();
          res();
        }, 1000)
      }).then((res) => {
        tool.jump_nav('/pages/my/vip/vip');
      })
      return false;
    }
    console.log(!wx.getStorageSync('mobile'))
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
    console.log(e)
    tool.loading();
    if (e.detail.confirm) {
      console.log(e)
      setTimeout(() => {
        tool.loading_h();
        _this.showAddressModal()
      }, 500)
      _this.getPosition(1)
    } else {
      setTimeout(() => {
        tool.loading_h();
        _this.showAddressModal()
      }, 500)

    }
  },
  // 获取用户授权
  authOperation(e){
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
    }
  },
  // 获取手机号
  mobileOperation(e) {
    let _this = this;
    tool.loading();
    console.log(e.detail)
    if (e.detail.confirm) {
      // => 获取解码手机号的信息
      ajax.getPhoneNumber({
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then((res) => {
        if (res.data.code == '0000') {
          wx.setStorageSync('mobile', res.data.data)
          setTimeout(() => {
            tool.loading_h();
            _this.showMobileModal();
            setTimeout(() => {
              _this.showAddressModal();
            }, 500)
          }, 500)
        } else {
          setTimeout(() => {
            tool.loading_h();
            _this.showMobileModal();
            setTimeout(() => {
              tool.alert(res.data.msg)
            }, 500)
          }, 500)
        }
      })
    } else {
      setTimeout(() => {
        tool.loading_h();
      }, 500)
      _this.showMobileModal()
    }
  },
  //打开、关闭用户授权弹窗
  showAuthModal() {
    let _showAuthOption = this.data.showAuthOption
    _showAuthOption.isShow = !_showAuthOption.isShow
    this.setData({ showAuthOption: _showAuthOption })
  },
  // 打开、关闭手机授权弹窗
  showMobileModal() {
    let _showMobileOption = this.data.showMobileOption
    _showMobileOption.isShow = !_showMobileOption.isShow
    this.setData({ showMobileOption: _showMobileOption })
  },
  // 打开、关闭地址授权弹窗
  showAddressModal() {
    let _showAddressOption = this.data.showAddressOption
    _showAddressOption.isShow = !_showAddressOption.isShow
    this.setData({ showAddressOption: _showAddressOption })
  },
  bindChange: function(e) {
    const val = e.detail.value
    console.log(e)
    let month = 'timeDialog.newtime.month'
    let day = 'timeDialog.newtime.day'
    let hour = 'timeDialog.newtime.hour'
    console.log(parseInt(e.detail.value[0]) + 1, '月,')
    console.log(parseInt(e.detail.value[1]) + 1, '日,')
    console.log(parseInt(e.detail.value[2]) + 1, '时,')
    this.setData({
      [month]: parseInt(e.detail.value[0]) + 1,
      [day]: parseInt(e.detail.value[1]) + 1,
      [hour]: parseInt(e.detail.value[2]) + 1
    })
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
    console.log(val)
    let newIndex = 'addressDialog.index'
    this.setData({
      [newIndex]: val
    })
  },
  onPickerChange3: function (e) {
    console.log(e.detail);
    this.setData({
      endedTime: e.detail.dateString
    })
  },
  toDouble: function (num) {
    if (num >= 10) {//大于10
      return num;
    } else {//0-9
      return '0' + num
    }
  },
  getToday: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day)
  },
  /**点击登录按钮 */
  getUserInfo: function(e) {
    console.log(e, '用户信息')
    var that = this;
    // wx.setStorageSync('userInfo', e.detail.userInfo);
    app.wxLogin();
    setTimeout(function() {
      that.onShow();
    }, 1500)
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
      
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // },
  /** 获取地址 */
  getAddress(){
    let _this = this;
    let doorList = 'doorDialog.itemList'
    ajax.findShop({
      longitude: _this.data.longitude,
      latitude: _this.data.latitude
    }).then((res)=>{
      let shopList = res.data.data ? res.data.data : []
      _this.setData({ shopList: shopList })
      let result = []
      _this.data.shopList.forEach((item) => {
        result.push(item.shopName)
      })
      _this.setData({ [doorList]: result })  
    })
  },
  /**当前商品选中事件 */
  selectList: function(e) {
    console.log(e, '选中谁了？')
    var that = this;
    //获取选中的 radio索引
    var index = e.currentTarget.dataset.index;
    console.log(index, '下标');
    //获取到商品列表数据
    var list = that.data.newCartList;
    // console.log(list, '商品列表书')

    //默认全选
    that.data.selectAllStatus = true;
    //循环数组数据，判断--选中/未选中[selected]
    list[index].selected = !list[index].selected;
    if (list[index].selected == true) {
      // console.log('点击加一件')
      that.setData({
        goodsNum: that.data.goodsNum + 1
      })
    } else {
      // console.log('点击减一件')
      that.setData({
        goodsNum: that.data.goodsNum - 1
      })
    }
    // console.log(that.data.goodsNum,'几件商品')
    //如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      newCartList: list,
      selectAllStatus: that.data.selectAllStatus
    })
    // 调用计算金额方法
    that.count_price();
  },

  // 删除
  deletes: function() {
    // console.log(e, '要删除的哪一个')
    var that = this;
    // 获取购物车id
    //获取到商品列表数据
    var list = that.data.newCartList;
    // console.log(list, '商品列表书')

    //建立空数组
    let idarr = []
    //购物车里的数据 循环添加空数组
    /*--------全部删除-------- */
    if (that.data.selectAllStatus == true) {
      list.forEach(p => {
        // let cartid = cartid;
        idarr.push({
          'cartId': p.id
        }); //点击默认全部删除
      });
      // console.log(that.data.idarr, '全部2')
    } else {
      for (var i = 0; i < that.data.newCartList.length; i++) {
        if (list[i].selected) {
          idarr.push({
            'cartId': list[i].id
          });
        }
      }
      // console.log(idarr, '单选')
    }
    tool.showModal('提示', '确认删除吗').then((res)=>{
      if(res){
        ajax.deleteCart({
          token: wx.getStorageSync('token'),
          id: JSON.stringify(idarr)
        }).then((res)=>{
          that.getGouwc(); //重新请求列表
          // 删除索引从1
          // list.splice(index, 1);
          // 页面渲染数据
          that.setData({
            newCartList: list
          });
          // 如果数据为空
          if (!list.length) {
            that.setData({
              hasList: false
            });
          } else {
            // 调用金额渲染数据
            that.count_price();
          }
        })
      }
    })
  },

  // /** 购物车全选事件 */
  selectAll() {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    console.log(selectAllStatus, '叮咚')
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    console.log(selectAllStatus, '叮咚2')
    // 获取商品数据
    let list = this.data.newCartList;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    console.log()
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      newCartList: list
    });
    // 计算金额方法
    this.count_price();
  },

  /** 绑定加数量事件 */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    let goodsId = e.currentTarget.dataset.goodsid;
    let quantity = e.currentTarget.dataset.quantity;
    let csrId = e.currentTarget.dataset.csrid;
    let id = e.currentTarget.dataset.id;
    // console.log(index, '添加小表')
    // 获取商品数据
    let list = this.data.newCartList;
    // 获取商品数量
    let num = list[index].quantity;
    // console.log(num, '购买数量')
    // 点击递增
    num = num + 1;
    list[index].quantity = num;
    // // 重新渲染 ---显示新的数量
    this.setData({
      newCartList: list
    });
    // // 计算金额方法
    this.count_price();
    this.updateGouwc(goodsId, num, csrId, id);
  },

  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    //   // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    let goodsId = e.currentTarget.dataset.goodsid;
    let quantity = e.currentTarget.dataset.quantity;
    let csrId = e.currentTarget.dataset.csrid;
    let id = e.currentTarget.dataset.id;
    // const obj = e.currentTarget.dataset.obj;
    // console.log(obj);
    // 获取商品数据
    let list = this.data.newCartList;
    // 获取商品数量
    let num = list[index].quantity;
    // 判断num小于等于1  return; 点击无效
    if (num <= 1) {
      return false;
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].quantity = num;
    // 渲染页面
    this.setData({
      newCartList: list
    });
    // 调用计算金额方法
    this.count_price();
    this.updateGouwc(goodsId, num, csrId, id);
  },

  // 提交订单--去结算
  btn_submit_order: function() {
    var that = this;
    console.log(that.data.totalPrice);
    //获取到商品列表数据
    var list = that.data.newCartList;
    console.log(list, '商品列表书')

    //建立空数组
    let idarr = []
    //购物车里的数据 循环添加空数组
    /*--------全部购买-------- */
    if (that.data.selectAllStatus == true) {
      list.forEach(p => {
        // let cartid = cartid;
        idarr.push({
          'cartId': p.id
        });
      });
      console.log(idarr, '全选')
    } else {
      for (var i = 0; i < that.data.newCartList.length; i++) {
        if (list[i].selected) {
          idarr.push({
            'cartId': list[i].id
          });
        }
      }
      console.log(idarr, '单选')
    }
    tool.showModal('提示','确认购买吗').then((res)=>{
      if(res){
        ajax.setTle({
          token: wx.getStorageSync('token'),
          cartJSONStr: JSON.stringify(idarr)
        }).then((res)=>{
          console.log(res, '结算成功 去提交订单页面');
          tool.jump_nav('/pages/qrdd/qrdd?rels=' + JSON.stringify(res.data.data) + '&cartJSONStr=' + JSON.stringify(idarr));
        })
      }
    })
  },

  /**
   * 计算总价
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.newCartList;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      // console.log(list[i].selected,'是否选中')
      if (list[i].selected) {
        // 所有价格加起来 count_money
        // console.log(list[i].goods.orderBy, '数量' + i);
        // console.log(list[i].goods.discountPrice,'价格' + i);
        total += list[i].quantity * list[i].goods.discountPrice;
      }
      // console.log(total, '合计')
    }
    // console.log(total.toFixed(2),'合计2')
    // 最后赋值到data中渲染到页面
    this.setData({
      newCartList: list,
      totalPrice: total.toFixed(2)
    });
  },
  /**获取购物车列表 */
  getGouwc: function(page) {
    var that = this;
    let data = {}
    if(page){
      data = {
        token: wx.getStorageSync('token'),
        page: page,
        limit: 10
      }
    }else {
      data = {
        token: wx.getStorageSync('token'),
        page: '',
        limit: ''
      }
    }
    let list = 'list.type';
    that.setData({ [list]: 1});
    ajax.cartList(data).then((res)=>{
      if(res.data.data){
        let cartList = res.data.data ? res.data.data : []
        let listVal = 0;
        if (that.data.page == 1) {
          if (res.data.data.length == 0) {
            listVal = 0
          } else if (res.data.data.length == 10) {
            listVal = 1
          } else {
            listVal = 2
          }
          that.setData({
            cartList: cartList
          })
          //人为添加是否选中 selected字段 判断依据
          that.data.cartList.forEach(item => {
            item.selected = true
          })
          //新增判断字段 重新赋值 页面渲染
          that.setData({
            newCartList: that.data.cartList,
            goodsNum: that.data.cartList.length
          })
          console.log(that.data.newCartList, '新增字段')
          //如果数据为空
          if (that.data.cartList.length <= 0) {
            that.setData({
              hasList: false
            });
          } else {
            // 调用金额渲染数据
            that.count_price();
          }
        } else {
          if (res.data.data.length == 10) {
            listVal = 1
          } else {
            listVal = 2
          }
          let newcartList = that.data.cartList;
          console.log(res.data.data)
          if (res.data.data.length > 0) {
            res.data.data.forEach((item) => {
              newcartList.push(item)
            })
            that.setData({
              cartList: newcartList
            })
            //人为添加是否选中 selected字段 判断依据
            that.data.cartList.forEach(item => {
              item.selected = true
            })
            //新增判断字段 重新赋值 页面渲染
            that.setData({
              newCartList: newcartList,
              goodsNum: that.data.cartList.length
            })
            console.log(that.data.CartList, '新增字段')
            //如果数据为空
            if (that.data.cartList.length <= 0) {
              that.setData({
                hasList: false
              });
            } else {
              // 调用金额渲染数据
              that.count_price();
            }
          }
        }
        that.setData({
          [list]: listVal
        })
      }
    })
  },
  /**获取购物车列表 */
  updateGouwc: function(goodsId, quantity, csrId, id) {
    var that = this;
    ajax.addCart({
      token: wx.getStorageSync('token'), //用户token
      goodsId: goodsId, //商品ID
      quantity: quantity, //商品数量
      csrId: csrId, //商品的尺寸ID
      id: id
    }).then((res)=>{

    })
  },
  goToshanchu: function() {
    var that = this;
    var isShow = that.data.isShow;
    let moren = isShow ? '完成' : '管理';
    that.setData({ moren : moren , isShow : !isShow });
  },
  hideBook() {
    let _this = this;
    _this.setData({
      showBook: false
    })
  },
  showBook(e) {
    let that = this;
    console.log(e)
    if(!that.checkMember()){
      return ;
    }
    that.getPosition();
  },
  tobookOrder(){
    let _this = this;
    let address = _this.data.doorDialog.itemList[_this.data.doorDialog.index];
    let details = _this.data.shopList[_this.data.doorDialog.index].shopAddress;
    var list = _this.data.cartList;
    let newList = [];
    list.forEach((item)=>{
      if (item.selected){
        newList.push(item)
      }
    })
    console.log(newList)
    _this.setData({ showBook: false});
    let url = '/pages/bookOrder/bookOrder?address=' + address + '&details=' + details + '&name=' + wx.getStorageSync('userInfo').nickName + '&phone=' + wx.getStorageSync('mobile') + '&time=' +
      _this.data.endedTime + '&shopId=' + _this.data.shopList[_this.data.doorDialog.index].id + '&addressIndex=' + _this.data.doorDialog.index + '&cartJSONStr=' + JSON.stringify(newList);
    tool.jump_nav(url)
  },
  doorDialog(e) {
    let _this = this;
    let num = e.currentTarget.dataset.num;
    let show = 'doorDialog.show'
    let value = 'doorDialog.index'
    let val = 0;
    console.log(new Array(val))
    switch (num) {
      case '0':
        //隐藏弹窗
        _this.setData({
          [show]: false
        })
        break;
      case '1':
        //显示弹窗
        _this.setData({
          [show]: true,
          [value]: this.data.doorDialog.index
        })
        break;
      case '2':
        //确定修改弹窗信息
        _this.setData({
          [show]: false,
          [value]: _this.data.doorDialog.newIndex[0]
        })
        break;
    }
  },
  showDoor() {
    let _this = this;
    let up = 'doorDialog.show'
    _this.setData({
      [up]: true
    })
  },
  hideDoor() {
    let _this = this;
    let up = 'doorDialog.show'
    _this.setData({
      [up]: false
    })
  },
  sureDoor() {

  },
  showAddress() {
    let _this = this;
    let up = 'addressDialog.show'
    _this.setData({
      [up]: true
    })
  },
  sureAddress() {
    let _this = this;
    let up = 'addressDialog.item'
    let show = 'addressDialog.show'
    _this.setData({
      [up]: this.data.addressDialog.newitem,
      [show] : false
    })
  },
  hideAddress() {
    let _this = this;
    let up = 'addressDialog.show'
    _this.setData({
      [up]: false
    })
  },
  showTime() {
    let _this = this;
    let up = 'timeDialog.show'
    let value = 'timeDialog.value'
    _this.setData({
      [up]: true,
      [value]: new Array(parseInt(this.data.timeDialog.time.month) - 1, this.data.timeDialog.time.day - 1, this.data.timeDialog.time.hour - 1)
    })
  },
  canceTime() {
    let _this = this;
    let up = 'timeDialog.show'
    _this.setData({
      [up]: false
    })
  },
  sureTime() {
    let _this = this;
    let up = 'timeDialog.show'
    _this.setData({
      [up]: false
    })
    let month = 'timeDialog.time.month'
    let day = 'timeDialog.time.day'
    let hour = 'timeDialog.time.hour'
    let value = 'timeDialog.value'
    let val_month = 'timeDialog.value[0]'
    let val_day = 'timeDialog.value[1]'
    let val_hour = 'timeDialog.value[2]'
    this.setData({
      [month]: this.data.timeDialog.newtime.month,
      [day]: this.data.timeDialog.newtime.day,
      [hour]: this.data.timeDialog.newtime.hour,
      [value]: new Array(parseInt(this.data.timeDialog.newtime.month) - 1, this.data.timeDialog.newtime.day - 1, this.data.timeDialog.newtime.hour - 1)
    })
  },
  findMonth() {
    let _this = this;
    let months = []
    for (let i = 1; i <= 12; i++) {
      months.push[i]
    }
    this.setData({
      months: months
    })
    _this.findDay('2015', '2')
  },
  findDay(year, month) {
    let _this = this;
    let days = [];
    for (let i = 1; i <= 31; i++) {
      days.push[i]
    }
    console.log(days)
    if (month == 4 || month == 6 || month == 9 || month == 11) {
      days.split(30)[0]
    } else {
      if (year % 4 == 0) {
        days.split(28)[0]
      } else {
        days.split(29)[0]
      }
    }
    console.log(days)
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    // wx.showNavigationBarLoading();
    // var that = this;

    // console.log(that.data.types_id);
    // console.log(that.data.sel_name);
    // wx.request({
    //   url: host + '请求后台数据地址',
    //   method: "post",
    //   data: {
    //     // 刷新显示最新数据
    //     page: 1,
    //   },
    //   success: function (res) {

    //     // console.log(res.data.data.datas);
    //     that.setData({
    //       list: res.data.data.datas
    //     })
    //   }
    // })

    // // 隐藏导航栏加载框  
    // wx.hideNavigationBarLoading();
    // // 停止下拉动作  
    // wx.stopPullDownRefresh();

  },

  // 加载更多
  onReachBottom: function () {
    var that = this;
    // 显示加载图标  
    // wx.showLoading({
    //   title: '正在加载中...',
    // })
    // numbers++;
    if(that.data.list.type == 1){
      let page;
      page = that.data.page + 1;
      that.setData({
        page: page
      })
      that.getGouwc(that.data.page);
    }
  },
  /**点击 联系客服按钮 拨打电话 */
  cancelOrder: function (e) {
    let num = e.currentTarget.dataset.num;
    let showReason = num == 1 ;
    this.setData({ showReason : showReason , changeINdex : 0 });
  },
  changeSelect(e) {
    let _this = this;
    let num = e.currentTarget.dataset.num;
    _this.setData({
      selectIndex: num,
      changeIndex: num
    })
  },
})