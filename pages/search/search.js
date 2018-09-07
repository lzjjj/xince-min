// pages/search/search.js
import requestUrls from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_work: "",
    pageNum: 1,
    showNone: false,
    canRequest: false,
    testList: [//测试数据

    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      search_work: options.search_work
    })
   
      this.getTestData(0, options.search_work);
      
   
  },


  //修改input的值
  changeIpnutValue(e){
    this.setData({
      search_work:e.detail.value
    })
  },

  //点击搜索
  tapSearch(){
    this.setData({
      testList:[]
    })
    if (this.data.search_work==""){
      wx.showModal({
        title: '提示',
        content:"输入内容不能为空！",
        success:res=>{
          this.setData({
            showNone:true
          })
        }
        
      })
    }else{
      this.getTestData(1, this.data.search_work);
      
    }
  },

  //获取测试数据
  getTestData(request_way, testSubject) {
    wx.showLoading({
      title: "加载中...",
    })
    let pageNum = this.data.pageNum;
    wx.request({
      url: requestUrls.testList + "?pageSize=10&pageNum=" + pageNum,
      method: "POST",
      data: {
        "obj": {
          "testSubject": testSubject
        }
      },
      success: res => {
        let testList = res.data.obj;
        this.setData({
          testList: request_way == 0 ? this.data.testList.concat(testList) : testList,
        })
        this.setData({
          showNone: this.data.testList.length == 0 ? true : false,
          canRequest: res.data.total > this.data.testList.length ? true : false
        })
        wx.hideLoading();
      }
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.showNone){
    if (this.data.canRequest) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getTestData(0);
    } else {
      wx.showToast({
        title: '已到底部',
      })
    }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})