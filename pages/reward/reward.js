import requestUrls from "../../common/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testId:"",
    trd_session: "",
    rewardList: [
      { money: "2.88", title: "要发发" },
      { money: "5.20", title: "我爱你" },
      { money: "7.88", title: "祝你发财" },
      { money: "10.10", title: "十全十美" },
      { money:"13.14", title: "一生一世永相爱" },
      { money: "16.66", title: "六六大顺" },
      { money: "20.18", title: "2018快乐" },
      { money: "88.88", title: "一生大发" },
      { money: "188.8", title: "2018要发发" },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      testId:options.testId
    })
    this.getTrd_session();
  },

  //获取trd_session
  getTrd_session() {
    wx.getStorage({
      key: 'trd_session',
      success: res => {
        this.setData({
          trd_session: res.data
        })
      },
    })
  },
  //下单
  payOrder(e) {
    var payPrice = e.currentTarget.dataset.payprice;
    wx.request({
      url: requestUrls.payOrder + "?trd_session=" + this.data.trd_session,
      method: "POST",
      data: {
        // "obj": {
        //   "payType": "2",//1是正常支付，2是打赏
        //   "payPrice": payPrice,//支付金额
        //   "testId": this.data.testId,
        //   "userSex":"1"
        // }
        "obj": {
          "testId": this.data.testId,
          "userSex": "1",
          "payPrice": payPrice,
          "payType": "2"

        }
      },
      success: res => {
        if (res.data.success) {
          wx.requestPayment({
            timeStamp: res.data.obj.timeStamp,
            nonceStr: res.data.obj.nonceStr,
            package: res.data.obj.package,
            signType: "MD5",
            paySign: res.data.obj.paySign,
            success: res => {
              this.luanchToIndex();
            },
            fail: res => {
              console.log(res)
            }
          })
        }
      }
    })
  },
  //跳转首页
  luanchToIndex() {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})