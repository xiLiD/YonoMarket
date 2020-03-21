const app = getApp();
import login from '../../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTrue: '',
    index: 1, //默认显示第一页
    addressList: [],
    dj: 0,//默认显示第一个地址栏,
    returnOrder: false,
    checkAddess: false,
    dj: false,
    shanchu: false,//新增进入页面，默认隐藏删除按钮
    djone: 1,
    isXuan: '请选择',
    array: ['请选择', '男', '女'],

    region: ['请选择', '广东省', '广州市', '海珠区'],
    switch1Checked: false, //默认开
    switchColor: '#A5937F', //开关按钮颜色
    isHiden: false, //默认弹框隐藏
    time: 1.5,

    name: '', //姓名默认是空
    index: 0, //默认是保密-0，男-1，女-2
    phone: '', //手机号
    addressid: '', //每个地址对应的id,
    addressdetails: '', //地址详情,
    returnOrder: false
  },
  getdata(){

    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Find_List,
      data: {
        token: wx.getStorageSync('token'),
        page: this.data.index,
        limit: 10
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res, '地址列表')
        that.setData({
          addressList: res.data.data
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    login.login().then(res => {
      console.log("【静默登录】", res)
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      console.log('address')
      console.log(options)
      this.setData({
        colorSizeId: options.colorSizeId
      })
      if (options.rels != undefined) {
        this.setData({
          rels: options.rels
        })
      }
      if (options.cartJSONStr != undefined){
        this.setData({
          cartJSONStr: options.cartJSONStr
        })
      }
      if (options.checkAddess != undefined) {
        this.setData({ checkAddess: true });
      }
    })
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
    this.getdata();
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
  /**点击选择默认地址 */
  goToxuanze: function (e) {
    var that = this;
    //获取选中的 radio索引
    var item = this.data.addressList[e.currentTarget.dataset.index];
    let data = {
      token: wx.getStorageSync('token'),
      name: item.name, //姓名
      sex: item.sex, //性别
      phone: item.phone, //电话
      address: item.address, //地区
      addressDetail: item.addressDetail,
      isDefault: 1, //默认选中
    }

    // 根据是否存在id判断是添加还是修改
    data.id = item.id

    wx.request({
      url: app.globalData.requestHost + app.globalData.Add_Ress,
      data: data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code =='0000'){
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000
          });
          that.getdata();
        }
      }
    });

    // 重新渲染数据
    // that.onLoad();
  },
  /**点击新增地址 按钮 */
  goToadd: function () {
    // wx.navigateTo({
    //   url: '/pages/my/addnew/addnew?status=' + 1 + '&cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels
    // })
    if (this.data.rels) {
      if (this.data.cartJSONStr){
        wx.navigateTo({
          url: '/pages/my/addnew/addnew?status=' + 1 + '&cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels + '&colorSizeId=' + this.data.colorSizeId
        })
      }else {
        wx.navigateTo({
          url: '/pages/my/addnew/addnew?status=' + 1 + '&rels=' + this.data.rels + '&colorSizeId=' + this.data.colorSizeId
        })
      }     
    } else {
      wx.navigateTo({
        url: '/pages/my/addnew/addnew?status=' + 1 + '&colorSizeId=' + this.data.colorSizeId
      })
    }
  },
  goorder(e) {
    console.log(e);
    console.log(!this.data.checkAddess)
    if (!this.data.checkAddess) {
      return;
    }

    let add = this.data.addressList[e.currentTarget.dataset.index];
    wx.setStorage({
      key: "add",
      data: add
    });
    wx.redirectTo({
      url: '/pages/qrdd/qrdd?rels=' + this.data.rels + '&cartJSONStr=' + this.data.cartJSONStr + '&blank=' + 1 + '&colorSizeId=' + this.data.colorSizeId
    });
  },
  /**点击编辑按钮 进入编辑页面*/
  goTobianji: function (e) {
    console.log(e, '带的参数')
    if (this.data.cartJSONStr) {
      wx.navigateTo({
        url: '/pages/my/addnew/addnew?index=' + e.currentTarget.dataset.index + '&zhuangtai=' + e.currentTarget.dataset.zhuangtai + '&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&dizhi=' + e.currentTarget.dataset.dizhi + '&sex=' + e.currentTarget.dataset.sex + '&addressid=' + e.currentTarget.dataset.addressid + '&details=' + e.currentTarget.dataset.details + '&cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/addnew/addnew?index=' + e.currentTarget.dataset.index + '&zhuangtai=' + e.currentTarget.dataset.zhuangtai + '&name=' + e.currentTarget.dataset.name + '&phone=' + e.currentTarget.dataset.phone + '&dizhi=' + e.currentTarget.dataset.dizhi + '&sex=' + e.currentTarget.dataset.sex + '&addressid=' + e.currentTarget.dataset.addressid + '&details=' + e.currentTarget.dataset.details
      })
    }

  }

})