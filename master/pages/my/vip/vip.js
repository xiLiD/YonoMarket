const app = getApp();
import tool from '../../../utils/publics/tool.js';
import ajax from '../../../utils/api/my-requests.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: false,
    djone: 1,
    isXuan: '请选择',
    array: ['请选择', '积分卡', '会员卡'],
    index: 0,//默认选择‘请选择’
    isHiden: false,//默认弹框隐藏
    date: '请选择',
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
  /**获取会员级别 */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      dj: true
    })
  },
  /**获取时间 */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  
  /**获取设置默认 状态 */
  switch1Change: function (e) {
    console.log(e, '状态')
  },
  /**获取信息 */
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (e.detail.value.phone == '') {
      tool.alert('请填写会员卡号');
      return;
    }
    if (e.detail.value.xingbie == 0) {
      tool.alert('请选择会员级别');
      return;
    } 
    if (e.detail.value.name == '') {
      tool.alert('请填写会员姓名');
      return;
    } 
    if (e.detail.value.diqu=='请选择') {
      tool.alert('请选择时间');
      return;
    }
    console.log('请求领取接口！！')
    that.getAddcard(e.detail.value.name, e.detail.value.diqu); 
  },
  /**点击弹出说明框 */
  goTosm: function () {
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
  /**请求 领取会员卡 接口 */
  getAddcard: function (name, birthday){
    var that = this;
    tool.loading();
    ajax.addCard({
      token: wx.getStorageSync('token'),
      name: name,//姓名
      birthday: birthday//生日
    }).then((res)=>{
      let code = res.data.code;
      let msg = code == '0000' ? '领取成功!' : res.data.msg;
      setTimeout(() => {
        tool.loading_h();
        tool.alert(msg);
        if(code == '0000'){
          setTimeout(() => {
            tool.jump_back();
            // tool.jump_swi('/pages/my/my')
          }, 500)
        }
      }, 500)
    }).catch((err)=>{
      console.log(err)
    })
  }
  
})