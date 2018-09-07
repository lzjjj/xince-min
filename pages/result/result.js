// pages/result/result.js
import requestUrls from "../../common/api.js"
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    activeState:0,
    resultObj: {},
    testId: "",
    testDetail: "",
    trd_session: "",
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      testId: options.testId, 
    })
    this.resultDetail(options.testId, options.pointStr, options.testType, options.optionsId);
    this.getTestDetil(options.testId);
    this.getTrd_session();
  },


  //测试详情接口
  getTestDetil(testId) {
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
          this.setData({
            testDetail: res.data.obj
          })
        }
      }
    })
  },
  //结果详情接口
  resultDetail(testId, pointStr, testType, optionsId) { 
    var obj = testType == 0 ? {
          "testId": testId,
          "pointStr": pointStr
        }:{
        "optionsId": optionsId
        };
    wx.request({
      url:testType == 0 ? requestUrls.pointTestResult : requestUrls.skiptTestResult,
      method: "POST",
      data: {
        "obj": obj
      },
      success: res => {
        if (res.data.success) {
          let answerKeyword = res.data.obj.answerKeyword
          WxParse.wxParse('answerKeyword', 'html', answerKeyword, this, 5);
          let answerSketch = res.data.obj.answerSketch
          WxParse.wxParse('answerSketch', 'html', answerSketch, this, 5);
          let answerDetails = res.data.obj.answerDetails
          WxParse.wxParse('answerDetails', 'html', answerDetails, this, 5);
          this.setData({
            resultObj: res.data.obj
          })
        }
      }
    })
  },
  //跳转打赏界面
  luanchToReward() {
    wx.navigateTo({
      url: '/pages/reward/reward?testId=' + this.data.testId,
    })
  },

  //点击预览图片
  tapErCode(e) {
    let url = e.currentTarget.dataset.imgurl;
    wx.previewImage({
      urls: [url],
    })
  },


  //跳转测试
  launchToTest(e) {
    let payFlag = e.currentTarget.dataset.payflag;
    let testId = e.currentTarget.dataset.id;
    if (payFlag == 2) {
      wx.navigateTo({
        url: '/pages/payPage/payPage?testId=' + testId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/test/test?testId=' + testId,
      })
    }

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
     activestate
     var activestate = e.currentTarget.dataset.activestate;
     this.setData({
       activeState: activestate
     })
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
  onShareAppMessage() {
    let payFlag = this.data.testDetail.payFlag;
    return {
      title: this.data.testDetail.testSubject,
      path: payFlag == 2 ? '/pages/payPage/payPage?testId=' + this.data.testId : '/pages/test/test?testId=' + this.data.testId,
      imageUrl: this.data.resultObj.answerPic,
      success: function (res) {

        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})