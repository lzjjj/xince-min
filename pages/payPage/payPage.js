// pages/payPage/payPage.js
import requestUrls from "../../common/api.js"
const WxParse = require('../../wxParse/wxParse.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexSelect: 1,//1表示男，2表示女
    isShowPop: 0,
    testId: "",
    testData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var testId = options.testId;
    this.setData({
      testId: testId
    })
    this.getTestDetail(testId);
    this.getTrd_session();
  },

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

  //修改性别
  changeSex(e) {
    let sex = e.currentTarget.dataset.sex;
    this.setData({
      sexSelect: sex
    })
  },

  //下单
  payOrder() {
    wx.request({
      url: requestUrls.payOrder + "?trd_session=" + this.data.trd_session,
      method: "POST",
      data: {
        "obj": {
          "testId": this.data.testId,
          "userSex": this.data.sexSelect,//1是男，2是女
          "payType":"1",//1是正常支付，2是打赏
        }
      },
      success:res=>{
          if(res.data.success){
            wx.requestPayment({
              timeStamp: res.data.obj.timeStamp,
              nonceStr: res.data.obj.nonceStr,
              package: res.data.obj.package,
              signType: "MD5",
              paySign: res.data.obj.paySign,
              success:res=>{
                this.luanchToTest();
              },
              fail:res=>{
                console.log(res)
              }
            })
          }
      }
    })
  },

  //更新pop弹窗状态
  updatePop(e) {
    let status = e.currentTarget.dataset.status;
    console.log(e);
    this.setData({
      isShowPop: status
    })
  },

  //跳转测试页面
  luanchToTest() {
    wx.navigateTo({
      url: '/pages/test/test?testId=' + this.data.testId,
    })
  },

  //获取测试详情
  getTestDetail(testId) {
    wx.request({
      url: requestUrls.payDetail,
      method: "POST",
      data: {
        "obj": {
          "testId": testId,
        }
      },
      success: res => {
        if (res.data.success) {
          let testPresentation = res.data.obj.testPresentation;
          let testPrompt = res.data.obj.testPrompt;
          WxParse.wxParse('article', 'html', testPresentation, this, 5);
          WxParse.wxParse('article1', 'html', testPrompt, this, 5);
          this.setData({
            testData: res.data.obj
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})