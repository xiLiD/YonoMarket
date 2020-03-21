const app = getApp();
import ajax from '../../../utils/api/my-requests.js';
import tool from '../../../utils/publics/tool.js';
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
    refundState : '', // 说明
    showTank : false, // 商品弹窗
    goodsIndex : 0, // 商品下标
    sizeObject : {} // 尺码对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, '带来的参数')
    // this.setData({
    //   goods: options
    // });
    this.setData({
      goods: options
    });
    wx.setNavigationBarTitle({
      title: this.data.goods.titlename
    })
    this.getGoods(this.data.goods.goodsId);
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
    var that = this;
    if (that.data.tempFilePaths == '') {
       tool.alert('请上传凭证')
       return;
    }
    if (this.data.goods.titlename == '换货' && !this.data.sizeObject.csrId ){
      tool.alert('请选择换货商品尺码');
      return;
    }
    let data = {
      token: wx.getStorageSync('token'),
      refundType: (that.data.goods.titlename == '仅退款' ? '仅退款' : (that.data.goods.titlename == '退货退款' ? '退货退款' : '换货')), //退货类型
      tradeNo: that.data.goods.dingdan, //订单号
      sonTradeNo: that.data.goods.zidingdan, //子订单号
      cargoStatus: (e.detail.value.zhuantai == 1 ? that.data.array[0] : that.data.array[1]), //货物状态
      refundCause: (e.detail.value.yuanyin == 1 ? that.data.array2[0] : that.data.array2[1]), //退货原因
      refundState: e.detail.value.shuoming,
      img: that.data.img, //退货上传凭证
    }
    if(this.data.sizeObject.csrId){
      data.csrId = this.data.sizeObject.csrId
    }
    console.log(data);
    tool.loading();
    ajax.wxRefund(data).then((res) => {
      setTimeout(() => {
        tool.loading_h();
        setTimeout(() => {
          tool.alert('提交成功！待商家审核!')
          setTimeout(() => {
            tool.jump_red('/pages/order/order?id=' + 3)
          }, 1000)
        }, 500)
      }, 500)
    })  
    

  },
  /**点击上传图片 */
  goToupImg: function() {
    var that = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: 'https://dev.flyh5.cn/yoplait/admin/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = JSON.parse(res.data);
            that.setData({
              img: data.data.src,
              isShow: false
            })
          }
        })
      }
    })
  },
  checkTitle(){
    let title = this.data.goods.titlename;
    if(title == '换货'){
      // 获取符合规则的尺码商品集合
      let csrArray = this.data.sizeList.filter((item)=>{
        return ()=>{
          if (item.name == this.data.size && item.color == this.data.yanse) {
            return item.id;
          }
        }
      })
      let sizeObject = {
        yanse : this.data.yanse,
        size: this.data.size,
        csrId: csrArray[0].id
      }
      // 获取尺码Id
      this.setData({ sizeObject: sizeObject });
    }
  },
  /**请求商品详情页 数据接口 */
  getGoods: function (goodid) {
    var that = this;
    ajax.findDetail({
      id: goodid,
      token: wx.getStorageSync('token')
    }).then((res) => {
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
        showName: res.data.data.name,
      })
      let colorNList = that.unique(res.data.data.colo)
      let sizeNList = that.uniqueCM(res.data.data.colo)
      that.setData({
        sizeList: res.data.data.colo,
        colorNList: colorNList,
        sizeNList: sizeNList
      })
    })
  },
  // /**点击 立即购买 按钮 弹出选择颜色 / 尺寸*/
  // selectSize: function () {
  //   var that = this;
  //   let yanse = this.data.yanse ? this.data.yanse : (this.data.goodList.colo[0].color ? this.data.goodList.colo[0].color : '');
  //   let size = this.data.size ? this.data.size : (this.data.goodList.colo[0].name ? this.data.goodList.colo[0].name : '');
  //   that.setData({
  //     yanse: yanse,
  //     size: size,
  //     num: 1
  //   })
  //   that.setData({
  //     isHide: true,
  //     showTank: true
  //   })
  // },
  changeTank(e){
    let num = e.currentTarget.dataset.num;
    let show = num == 1;
    // 弹窗显示 给默认初始值
    if(show){
      let yanse = this.data.yanse ? this.data.yanse : (this.data.goodList.colo[0].color ? this.data.goodList.colo[0].color : '');
      let size = this.data.size ? this.data.size : (this.data.goodList.colo[0].name ? this.data.goodList.colo[0].name : '');
      this.setData({
        yanse: yanse,
        size: size,
        num: 1
      })
    }
    this.setData({
      isHide: show,
      showTank: show
    })
  },
  // 选择弹窗
  sureSize(){
    this.checkTitle();
    this.setData({
      isHide: false,
      showTank: false
    })
  },
  /**点击选择颜色规格按钮 */
  goTocolor: function (e) {
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
    // this.setData({ goodsIndex: that.checkPrice(that.data.goodList.colo, priceInfo) });
  },
  /**点击选择 尺码规格 按钮 */
  goTochima: function (e) {
    var that = this;
    this.setData({ goodsIndex: e.currentTarget.dataset.index });
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
    // this.setData({ goodsIndex: that.checkPrice(that.data.goodList.colo, priceInfo) });
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
  }
})