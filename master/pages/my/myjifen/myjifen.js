// pages/my/myjifen/myjifen.js
const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
import tool from '../../../utils/publics/tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.m();
    var _this = this;
      //在这里做页面初始化请求操作，可保证本地缓存中有用户的openid/userId
      // _this.getCard();
      // _this.getScore();
      tool.loading();
      Promise.all([_this.getScore()]).then((res)=>{
        tool.loading_h();
        _this.setData({ key: true });
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
  onShow: function() {
    if(this.data.key){
      this.getScore();
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  /**点击 积分兑换 按钮 */
  linkNav(e){
    let url = e.currentTarget.dataset.link;
    tool.jump_nav(url)
  },
  x(num) {
    let a = new Array();
    for (var i = 0; i < num.length; i++) {
      var n = num.charAt(i);
      a.push(n);
    }
    let s = 0
    this.setData({
      a: a,
      s: s
    })
    this.m();
  },
  run(num) {
    let _this = this;
    var timeRun = 0;
    let oldNum = num;
    let count = 1
    // console.log(count)
    let randomNum = 0;
    if (num / 10 > 0) {
      randomNum = parseInt(num / 10)
    }
    let myTime = setInterval(function() {
      if (parseInt(oldNum / 3) > 10) {
        count = parseInt(oldNum / 20);
        oldNum--;
      }
      timeRun += count + parseInt(Math.round(Math.random() * randomNum));
      // timeRun += 1;
      _this.setData({
        num: timeRun
      })
      if (timeRun >= oldNum) {
        _this.setData({
          num: num
        })
        clearInterval(myTime)
      }
    }, 100)
  },
  m() {
    var k = 0;
    let _this = this;
    let s = _this.data.s;
    let times = setInterval(function() {

      if (k == _this.data.a[_this.data.s]) {
        clearInterval(times);
        s++;
        _this.setData({
          s: s
        })
        if (_this.data.a[_this.data.s]) {
          _this.m();
        }
      }
      k++;
    }, 100)

  },
  // 获取积分
  getScore(){
    let _this = this;
    ajax.memberCard({
      token: wx.getStorageSync('token')
    }).then((res)=>{
      console.log(res, '查看会员卡数据')
      _this.setData({
        vipCard: res.data.data,
        integralList: res.data.data.integral
      })
      _this.run(res.data.data.memberCard.cardIntegral);
    })
  }
})