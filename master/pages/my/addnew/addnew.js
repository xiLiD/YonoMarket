const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      console.log(options, '传过来的参数');
      this.setData({
        colorSizeId: options.colorSizeId
      })
      if (options.status == 1) {
        this.setData({
          shanchu: true
        })
      } else {
        let province = options.dizhi.split(',')[0],
          city = options.dizhi.split(',')[1],
          area = options.dizhi.split(',')[2];
        let region = new Array(province, city, area);
        this.setData({
          djone: 2,
          name: options.name, //姓名
          index: options.sex, //性别
          phone: options.phone, //手机号
          addressid: options.addressid, //每个地址对应的id
          addressdetails: options.details,
          region: region,
          switch1Checked: options.zhuangtai == 1 ? true : false
        })
      }
      if (options.rels) {
        this.setData({
          rels: options.rels,
          cartJSONStr: options.cartJSONStr
        })
      }
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
      tool.alert('请输入您的姓名');
      return;
    } 
    if (e.detail.value.phone == '') {
      tool.alert('请输入您的手机号码');
      return;
    } 
    if (e.detail.value.phone.length != 11 || !myreg.test(e.detail.value.phone)) {
      tool.alert('您的手机号码输入有误');
      return;
    } 
    if (e.detail.value.diqu.length >= 4) {
      tool.alert('请选择地区');
      return;
    } 
     
      let data = {
        token: wx.getStorageSync('token'),
        name: e.detail.value.name, //姓名
        // sex: (e.detail.value.xingbie == 0 ? 0 : (e.detail.value.xingbie == 1 ? 1 : 2)), //性别
        phone: e.detail.value.phone, //电话
        address: e.detail.value.diqu, //地区
        addressDetail: e.detail.value.addressdetails,
        isDefault: this.data.switch1Checked ? 1 : 0, //默认选中
      }
      if (that.data.rels){
        data.isDefault = 1
      }
      this.data.addressid ? data.id = this.data.addressid : '';
      console.log(this.data.addressid)
      ajax.addAddress(data).then((res)=>{
        let tos = that.data.addressid ? '修改成功' : '添加成功';
        if (res.data.code == '0000') {
          tool.alert(tos);
          that.data.Time = setInterval(() => {
            that.setData({
              time: --that.data.time
            })
            if (that.data.time <= 0) {
              clearInterval(that.data.Time)
              if (that.data.rels) {
                tool.jump_red('/pages/qrdd/qrdd?rels=' + that.data.rels + '&cartJSONStr=' + that.data.cartJSONStr + '&colorSizeId=' + that.data.colorSizeId)
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }

            }
          }, 1000)
        }
      })
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
    ajax.delAddress({
      token: wx.getStorageSync('token'),
      id: that.data.addressid //地址id
    }).then((res)=>{
      tool.alert('删除成功！');
      that.data.Time = setInterval(() => {
        that.setData({
          time: --that.data.time
        })
        if (that.data.time <= 0) {
          clearInterval(that.data.Time)
          wx.navigateBack({
            delta: 1
          })
        }
      }, 1000)
    })
  }
})