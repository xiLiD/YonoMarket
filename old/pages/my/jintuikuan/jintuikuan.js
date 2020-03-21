const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dj: false,
    isShow:true,//默认上传凭证 添加按钮图片显示
    img:'',//默认是空图片
    index: 0,
    index2: 0,
    array: ['未收到货', '已收到货'],
    array2: ['拍错/多拍/不想要', '7天无理由退换货', '商品与实物不符合', '做工问题','材质面料与商品描述不符合'],
    tempFilePaths: {}, //存上传的图片,
    refundState : ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, '带来的参数')
    this.setData({
      goods: options
    });
    wx.setNavigationBarTitle({
      title: this.data.goods.titlename
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
  // onShareAppMessage: function() {

  // },
  /**获取货物状态 */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      dj: true
    })
  },
  /**获取退款原因 */
  bindPickerChange2: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value,
      dj2: true
    })
  },
  /**获取信息 点击保存 按钮 */
  formSubmit: function(e) {
    console.log(e, 'form发生')
    var that = this;
    console.log(e)
    // if (e.detail.value.zhuantai == 0) {
    //   wx.showToast({
    //     title: '请选择收货状态',
    //     icon: 'none'
    //   })
    // } else if (e.detail.value.yuanyin == 0) {
    //   wx.showToast({
    //     title: '请选择申请原因',
    //     icon: 'none'
    //   })
    // } else
     if (that.data.tempFilePaths == '') {
      wx.showToast({
        title: '请上传凭证',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '请稍等...',
      })
      wx.request({
        url: app.globalData.requestHost + app.globalData.Wx_Refund, //申请退款 接口
        data: {
          token: wx.getStorageSync('token'),
          refundType: (that.data.goods.titlename == '仅退款' ? '仅退款' : (that.data.goods.titlename == '退货退款' ?'退货退款':'换货')), //退货类型
          tradeNo: that.data.goods.dingdan, //订单号
          sonTradeNo: that.data.goods.zidingdan, //子订单号
          cargoStatus: (e.detail.value.zhuantai == 1 ? that.data.array[1] : that.data.array[2]), //货物状态
          refundCause: (e.detail.value.yuanyin == 1 ? that.data.array2[1] : that.data.array2[2]), //退货原因
          refundState: e.detail.value.shuoming,
          img: that.data.img, //退货上传凭证
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function(res) {
          console.log(res, '退款成功')

          setTimeout(()=>{
            wx.hideLoading();
            setTimeout(()=>{
              wx.showToast({
                title: '提交成功！待商家审核!',
                icon: 'none'
              })
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/order/order?id=' + 3
                })
              }, 1000)
            },500)
          },500)


        }
      })
    }

  },
  /**点击上传图片 */
  goToupImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: [compressed],
      // sourceType: [camera],
      success: function(res) {
        console.log(res,'上传图片')
        that.setData({
          img: res.tempFilePaths[0],
          isShow:false
        })
      }
    })
    // const selectNum = this.data.selectImageList.length;
    // const num = 3 - selectNum;
    // num != 0 && wx.chooseImage({
    //   count: num,
    //   success: (res) => {

    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     let tempFilePaths = res.tempFilePaths;
    //     let newList = this.data.selectImageList;
    //     for (let i = 0; i < tempFilePaths.length; i++) {
    //       newList.push(tempFilePaths[i]);
    //     }

    //     newList.length == 3 ? this.setData({
    //       isShow: false
    //     }) : null;
    //     this.setData({
    //       selectImageList: newList
    //     }, () => {
    //       console.log(this.data.selectImageList)
    //     })
    //     // console.log("tempFilePaths:"+JSON.stringify(tempFilePaths))
    //   }
    // })
  },
  /**关闭图片 */
  // closeOption(e) {
  //   const {
  //     index
  //   } = e.currentTarget.dataset;
  //   let imagelist = this.data.selectImageList;
  //   imagelist.splice(index, 1);
  //   this.setData({
  //     selectImageList: imagelist,
  //     isShow: true
  //   })
  //   console.log(JSON.stringify(e))

  // },
  chamgeShuoMing (e){

  }
})