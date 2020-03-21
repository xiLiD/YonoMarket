const app = getApp() ;
import tool from '../../utils/publics/tool.js'
import login from '../../utils/publics/login.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAdd : false,
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
    returnOrder: false,
    showId : ''
  },
  getdata() {

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
    // let region = new Array(province, city, area);
    
    this.setData({
      djone: 2,
      name: '', //姓名
      index: 0, //性别
      phone: '', //手机号
      addressid: 0, //每个地址对应的id
      addressdetails: '',
      region: this.data.region[0],
      switch1Checked: options.zhuangtai == 1 ? true : false
    })
    if(options.addressid){
      this.setData({
        showId: options.addressid
      })
    }
    if (options.tradeId){
      this.setData({
        tradeId: options.tradeId
      })
    }
    this.getdataList()

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
        if (res.data.code == '0000') {
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
    if (this.data.cartJSONStr) {
      wx.navigateTo({
        url: '/pages/my/addnew/addnew?status=' + 1 + '&cartJSONStr=' + this.data.cartJSONStr + '&rels=' + this.data.rels
      })
    } else {
      wx.navigateTo({
        url: '/pages/my/addnew/addnew?status=' + 1
      })
    }
  },
  showAdd(){
      this.setData({showAdd:true})
  },
  goorder(e) {
    console.log(e);  
    this.setData({
      showId : e.currentTarget.dataset.id
    })
    setTimeout(()=>{
      this.getdata(e.currentTarget.dataset.address, e.currentTarget.dataset.addressdetails) 
    },500)
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

  },
  /**获取性别 */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      dj: true
    })
  },
  /**获取所在地区 */
  bindPickerChangeone: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      djone: 2
    })
  },
  /**获取设置默认 状态 */
  switch1Change: function (e) {
    this.setData({ switch1Checked: e.detail.value ? 1 : 0 });
  },
  /**获取信息 点击保存 按钮 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.detail.value.name == '') {
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none'
      })
    }
    // else if (e.detail.value.xingbie== 0){
    //   wx.showToast({
    //     title: '请选择您的性别',
    //     icon: 'none'
    //   })
    // } 
    else if (e.detail.value.phone == '') {
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none'
      })
    } else if (e.detail.value.phone.length != 11) {
      wx.showToast({
        title: '您的手机号码输入有误',
        icon: 'none'
      })
    } else if (!myreg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '您的手机号码输入有误',
        icon: 'none'
      })
    } else if (e.detail.value.diqu.length >= 4) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
    } else {
      let data = {
        token: wx.getStorageSync('token'),
        name: e.detail.value.name, //姓名
        sex: (e.detail.value.xingbie == 0 ? 0 : (e.detail.value.xingbie == 1 ? 1 : 2)), //性别
        phone: e.detail.value.phone, //电话
        address: e.detail.value.diqu, //地区
        addressDetail: e.detail.value.addressdetails,
        isDefault: this.data.switch1Checked ? 1 : 0, //默认选中
      }
      this.data.addressid ? data.id = this.data.addressid : '';
      console.log(this.data.addressid)
      tool.loading();
      wx.request({
        url: app.globalData.requestHost + app.globalData.Add_Ress,
        data: data,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          // console.log(res, '新增地址')
          let tos = '添加成功'
          if (res.data.code == '0000') {
            wx.showToast({
              title: tos,
              icon: 'success',
              success: function (res) {
                tool.loading_h();
                that.data.Time = setInterval(() => {
                  that.setData({
                    time: --that.data.time
                  })
                  if (that.data.time <= 0) {
                    clearInterval(that.data.Time)

                    that.getdata(e.detail.value.diqu, e.detail.value.addressdetails)

                  }
                }, 1000)
              }
            })
          }else {
            tool.loading_h();
            tool.alert(res.data.msg)
          }
        }
      })
    }
  },

  /**点击删除按钮 弹出弹框提示 */
  goTotk: function () {
    this.setData({
      isHiden: true
    })
  },
  /**点击弹框里的 取消按钮 */
  quxiao: function () {
    this.setData({
      isHiden: false
    })
  },
  /**点击确认 删除按钮 */
  goTodetel: function () {
    var that = this;
    wx.request({
      url: app.globalData.requestHost + app.globalData.Delete_Address,
      data: {
        token: wx.getStorageSync('token'),
        id: that.data.addressid //地址id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          success: function (res) {
            that.data.Time = setInterval(() => {
              that.setData({
                time: --that.data.time
              })
              if (that.data.time <= 0) {
                clearInterval(that.data.Time)
                
                // wx.navigateTo({
                //   url: '/pages/my/address/address'
                // })
              }
            }, 1000)
          }
        })
      }
    })
  },
  getdataList() {

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
  getdata(address, addressDetail) {
    console.log(address, addressDetail)
    var that = this;
    tool.loading();
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
        if(res.data.success == true){
          
          setTimeout(()=>{
            tool.loading_h();
            that.setData({
              addressList: res.data.data
            })

            let id = '';
            res.data.data.forEach((item) => {
              if (item.address == address) {
                if (item.addressDetail == addressDetail) {
                  id = item.id
                }
              }
            })
            wx.redirectTo({
              url: '/pages/updateAddress/updateAddress?addressid=' + id + '&tradeId=' + that.data.tradeId
            })
          },500)

        }else {
          setTimeout(()=>{
            tool.loading_h();
            tool.alert(res.data.msg)    
          },500)

        }
        
      }
    })
  }
})