//index.js
//获取应用实例
const app = getApp()
import requestUrls from "../../common/api.js"
const WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    talkList: [
    ],
    ifNext: "Y",
    ifResult: "N",
    testPic: "",
    position: "id-1",
    testId: "",
    buttonState: 1,
    options: [],
    pointStr: "",
    title: "",
    testType: "",
    finalOptionsId:"",
  },

  onLoad: function (options) {
    this.setData({
      testId: options.testId
    })

    this.getTestDetil(this.data.testId);
  },
  onReady() {
  },
  onShow() {

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
          this.setBarTitle(res.data.obj.testSubject)
          let testPresentation = res.data.obj.testPresentation;
          WxParse.wxParse('article', 'html', testPresentation, this, 5);
          this.setData({
            testPic: res.data.obj.testPic,
            title: res.data.obj.testSubject,
            testType: res.data.obj.testType//1表示跳题类型，0表示分数类型
          })
        }
      }
    })
  },

  //设置标题
  setBarTitle(title) {
    wx.setNavigationBarTitle({
      title: title,
    })
  },

  //跳转结果页
  launchToResult() {
    console.log(this.data.finalOptionsId);
    console.log(this.data.testType);

    wx.navigateTo({
      url: this.data.testType == 1 ? '/pages/result/result?testId=' + this.data.testId + "&optionsId=" + this.data.finalOptionsId + "&testType=" + this.data.testType : '/pages/result/result?testId=' + this.data.testId + "&pointStr=" + this.data.pointStr + "&testType=" + this.data.testType,
    })
  },


  //点击测试
  handleClick(e) {
    var optionsId = e.currentTarget.dataset.optionsid ? e.currentTarget.dataset.optionsid : "";
    var optionsKeyword = e.currentTarget.dataset.optionskeyword;
    if (e.currentTarget.dataset.optionspoint || e.currentTarget.dataset.optionspoint == 0) {
      var optionspoint = e.currentTarget.dataset.optionspoint;

    } else {
      var optionspoint = ""
    }
    this.setData({
      pointStr: this.data.pointStr == "" ? optionspoint : this.data.pointStr + "," + optionspoint

    })
    if (this.data.testType == 1) {
      this.skipTest(optionsId, optionsKeyword);
    } else if (this.data.testType == 0) {
      this.pointTest(optionsId, optionsKeyword);

    }
  },

  //跳题类型测试
  skipTest(optionsId, optionsKeyword) {
    this.setData({
      finalOptionsId: optionsId != "" ? optionsId : this.data.finalOptionsId,
    })
    let talkList = this.data.talkList;
    if (this.data.ifResult == "N") {
      if (this.data.buttonState == 1) {
        var obj = {};
        obj.key = "1";
        obj.msg = "开始";
        talkList.push(obj);
      } else {
        var obj = {};
        obj.key = "1";
        obj.msg = optionsKeyword;
        talkList.push(obj);
      }
      wx.request({
        url: requestUrls.skipTestCourse,
        method: "POST",
        data: {
          "obj": {
            "testId": this.data.testId,
            "optionsId": optionsId //获取第一个问题是不用传指，之后传用户所选的选项的id
          }
        },
        success: res => {
          if (res.data.success) {
            if (res.data.obj.questionDetails) {
              let obj_out = {}
              obj_out.key = 0;
              obj_out.msg = res.data.obj.questionDetails;
              obj_out.isPic = false;
              talkList.push(obj_out);
              let list = res.data.obj.options;
              for (let i in list) {
                let obj = {}
                obj.key = 0;
                obj.msg = list[i].optionsKeyword + "." + list[i].optionsDetails;
                obj.isPic = obj.msg.indexOf('http:') > 0 ? true : false;
                talkList.push(obj);
                var id = talkList.length - 1;
                this.setData({
                  talkList: talkList,
                  position: "id-" + id,
                  options: list,
                  buttonState: 2,
                  ifResult: res.data.obj.ifResult,
                })
              }
            } else {
              let obj2 = {}
              obj2.key = 0;
              obj2.msg = "正在为您分析结果...";
              obj2.isPic = false;
              talkList.push(obj2);
              var id = talkList.length - 1;
              this.setData({
                talkList: talkList,
                position: "id-" + id,
                buttonState: 3,
                ifResult: res.data.obj.ifResult,
              })
            }


          }
        }
      })
    } else {
      //添加答案数组
      let obj = {};
      obj.key = "1";
      obj.msg = optionsKeyword;
      talkList.push(obj);
      //添加分析结果提示
      let obj1 = {}
      obj1.key = 0;
      obj1.msg = "正在为您分析结果...";
      obj1.isPic = false;
      talkList.push(obj1);
      var id = talkList.length - 1;
      this.setData({
        talkList: talkList,
        position: "id-" + id,
        buttonState: 3
      })
    }
    
  },

  //点击分数类型测试
  pointTest(optionsId, optionsKeyword) {



    let talkList = this.data.talkList;

    if (this.data.ifNext == "Y") {
      if (this.data.buttonState == 1) {
        var obj = {};
        obj.key = "1";
        obj.msg = "开始";
        talkList.push(obj);
      } else {
        var obj = {};
        obj.key = "1";
        obj.msg = optionsKeyword;
        talkList.push(obj);
      }
      wx.request({
        url: requestUrls.pointTestCourse,
        method: "POST",
        data: {
          "obj": {
            "testId": this.data.testId,
            "optionsId": optionsId //获取第一个问题是不用传指，之后传用户所选的选项的id
          }
        },
        success: res => {
          if (res.data.success) {
            if (res.data.obj.questionDetails) {
              let obj_out = {}
              obj_out.key = 0;
              obj_out.msg = res.data.obj.questionDetails;
              obj_out.isPic = false;
              talkList.push(obj_out);
              let list = res.data.obj.options;
              for (let i in list) {
                let obj = {}
                obj.key = 0;
                obj.msg = list[i].optionsKeyword + "." + list[i].optionsDetails;
                obj.isPic = obj.msg.indexOf('http:') > 0 ? true : false;
                talkList.push(obj);
                var id = talkList.length - 1;
                this.setData({
                  talkList: talkList,
                  position: "id-" + id,
                  options: list,
                  buttonState: 2,
                  ifNext: res.data.obj.ifNext,
                })
              }
            } else {
              let obj2 = {}
              obj2.key = 0;
              obj2.msg = "正在为您分析结果...";
              obj2.isPic = false;
              talkList.push(obj2);
              var id = talkList.length - 1;
              this.setData({
                talkList: talkList,
                position: "id-" + id,
                buttonState: 3,
                ifNext: res.data.obj.ifNext,
              })
            }


          }
        }
      })
    } else {
      //添加答案数组
      let obj = {};
      obj.key = "1";
      obj.msg = optionsKeyword;
      talkList.push(obj);
      //添加分析结果提示
      let obj1 = {}
      obj1.key = 0;
      obj1.msg = "正在为您分析结果...";
      obj1.isPic = false;
      talkList.push(obj1);
      var id = talkList.length - 1;
      this.setData({
        talkList: talkList,
        position: "id-" + id,
        buttonState: 3
      })

    }
  },


})
