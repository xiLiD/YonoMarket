// pages/fitting/fitting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide:false,//弹框默认隐藏
    isShow:false,//默认隐藏
    isSee:false,//默认隐藏
    hasList: true, //默认展示列表数据
    //商品列表数据
    list: [{
      id: 1,
      title: '园艺大师抗皱精华露',
      image: '/images/serch/2.png',
      pro_name: "30ml",
      num: 1,
      price: 180,
      selected: true
    },
    {
      id: 2,
      title: '伊芙琳玫瑰护手霜',
      image: '/images/serch/1.png',
      pro_name: "25g",
      num: 1,
      price: 62,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: '/images/serch/2.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    }
    ],
    //金额
    totalPrice: 0, //总价，初始为0
    //全选状态
    selectAllStatus: true, // 全选状态，默认全选

    //颜色数据
    dj:1,//默认显示第一个
    colorList:[
      {
        id: 1,
        text:'深蓝'
      },
      {
        id: 2,
        text: '黑色'
      },
      {
        id: 3,
        text: '卡其'
      },
      {
        id: 4,
        text: '墨黑'
      },
      {
        id: 5,
        text: '紫电'
      },
      {
        id: 6,
        text: '篮战'
      },
    ],
    //尺码数据
    chicun:1,//默认选中1
    chimaList:[
      {
        id: 1,
        text: 'M/35'
      },
      {
        id: 2,
        text: 'M/36'
      },
      {
        id: 3,
        text: 'M/37'
      },
      {
        id: 4,
        text: 'M/38'
      },
      {
        id: 5,
        text: 'M/39'
      },
      {
        id: 6,
        text: 'M/40'
      },
      {
        id: 7,
        text: 'M/41'
      },
      {
        id: 8,
        text: 'M/42'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 1000
    })
    // 价格方法
    this.count_price();

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },

  /**当前商品选中事件 */
  selectList: function (e) {
    var that = this;
    //获取选中的 radio索引
    var index = e.currentTarget.dataset.index;
    //获取到商品列表数据
    var list = that.data.list;
    //默认全选
    that.data.selectAllStatus = true;
    //循环数组数据，判断--选中/未选中[selected]
    list[index].selected = !list[index].selected;
    //如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      list: list,
      selectAllStatus: that.data.selectAllStatus
    })
    // 调用计算金额方法
    that.count_price();
  },

  // 删除
  deletes: function (e) {
    var that = this;
    // 获取索引
    const index = e.currentTarget.dataset.index;
    // 获取商品列表数据
    let list = this.data.list;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          // 删除索引从1
          list.splice(index, 1);
          // 页面渲染数据
          that.setData({
            list: list
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
        } else {
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  /** 购物车全选事件 */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    // 获取商品数据
    let list = this.data.list;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      list: list
    });
    // 计算金额方法
    this.count_price();
  },

  /** 绑定加数量事件 */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 点击递增
    num = num + 1;
    list[index].num = num;
    // 重新渲染 ---显示新的数量
    this.setData({
      list: list
    });
    // 计算金额方法
    this.count_price();
  },

  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    //   // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // const obj = e.currentTarget.dataset.obj;
    // console.log(obj);
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 判断num小于等于1  return; 点击无效
    if (num <= 1) {
      return false;
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].num = num;
    // 渲染页面
    this.setData({
      list: list
    });
    // 调用计算金额方法
    this.count_price();
  },

  // 提交订单
  btn_submit_order: function () {
    var that = this;
    console.log(that.data.totalPrice);

    // 调起支付
    // wx.requestPayment(
    //   {
    //     'timeStamp': '',
    //     'nonceStr': '',
    //     'package': '',
    //     'signType': 'MD5',
    //     'paySign': '',
    //     'success': function (res) { },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
    wx.showModal({
      title: '提示',
      content: '合计金额-' + that.data.totalPrice + "暂未开发",
    })
  },

  /**
   * 计算总价
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].num * list[i].price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      list: list,
      totalPrice: total.toFixed(2)
    });
  },

  /**点击选择规格 按钮 弹出弹窗 */
  goTotk:function(){
    this.setData({
      isHide:true,
      isShow:true
    })
  },
  /**点击选择颜色规格按钮 */
  goTocolor:function(e){
    this.setData({
      dj: e.currentTarget.dataset.id
    })
  },
  /**点击选择 尺码规格 按钮 */
  goTochima:function(e){
    this.setData({
      chicun: e.currentTarget.dataset.id
    })
  }
})