// pages/index/index.js
import requestUrls from "../../common/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testList: [//测试数据
    ],
    canRequest: true,
    showNone:false,
    pageNum: 1,//页码
    partsData: [],
    imgUrls: [//轮播数据图片
      // 'https://www.westorehere.shop/img/swiper.png',
      // 'https://www.westorehere.shop/img/swiper.png',
      // 'https://www.westorehere.shop/img/swiper.png'
    ],
    showPop: true,//是否展示弹窗
    search_work: "",//搜索关键字
    updateMsg: {//更新提醒
      total: "",
      list: [
      ]
    },
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fourPartData();
    this.getTestData(0);
    this.getUpdateList();
    this.getSwiperData();
  },


  //获取模板详情接口
  getModuleDetails(e) {
    let obj = {};
    obj.moduleType = e.currentTarget.dataset.moduletype;
    obj.moduleId = e.currentTarget.dataset.moduleid;
    wx.request({
      url: requestUrls.moduleDetail,
      method: "POST",
      data: {
        "obj": obj
      },
      success: res => {
        
      }
    })
  },

  //轮播图数据
  getSwiperData(){
    wx.request({
      url: requestUrls.swiperData,
      success:res=>{
        this.setData({
          imgUrls: res.data.obj
        })
      }
    })
  },

  //更新数据提示
  getUpdateList(){
    wx.request({
      url: requestUrls.updateTip,
      success:res=>{
          if(res.data.success){
            let obj = {};
            obj.total = res.data.total;
            obj.list = res.data.obj;
            this.setData({
              updateMsg:obj
            })
          }
      }
    })
  },

  //获取测试数据
  getTestData(request_way) {
    wx.showLoading({
      title: "加载中...",
    })
    let pageNum = this.data.pageNum;
    wx.request({
      url: requestUrls.testList + "?pageSize=10&pageNum=" + pageNum,
      method: "POST",
      data: {
        "obj": {}
      },
      success: res => {
        if(res.data.success){
          let testList = res.data.obj;
          this.setData({
            testList: request_way == 0 ? this.data.testList.concat(testList) : testList,

          })
          
        }else{
          this.setData({
            testList:  this.data.testList,

          })
        }
        this.setData({
          showNone: this.data.testList.length == 0 ? true : false,
          canRequest: res.data.total > this.data.testList.length ? true : false
        })
        wx.hideLoading();
      }
    })
  },

  //四大模块接口
  fourPartData() {
    wx.request({
      url: requestUrls.findList,
      success: res => {
        console.log(res.data);

        if (res.data.success) {
          this.setData({
            partsData: res.data.obj
          })
        }
      }
    })
  },

  //跳转测试
  launchToTest(e) {
    let payFlag = e.currentTarget.dataset.payflag;
    let testId = e.currentTarget.dataset.id;
    if (payFlag==2){
      wx.navigateTo({
        url: '/pages/payPage/payPage?testId=' + testId,
      })
    }else{
      wx.navigateTo({
        url: '/pages/test/test?testId=' + testId,
      })
    }
   
  },

  //点击轮播图
  tapSwiper(e) {
    let payFlag = e.currentTarget.dataset.payflag;
    let testId = e.currentTarget.dataset.id;
    let pictype = e.currentTarget.dataset.pictype;
    let picpath = e.currentTarget.dataset.picpath;
    console.log(pictype);
    if (pictype == 1 && testId){
    if (payFlag == 2) {
      wx.navigateTo({
        url: '/pages/payPage/payPage?testId=' + testId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/test/test?testId=' + testId,
      })
    }
  }else{
    // wx.previewImage({
    //   urls: [picpath],
    // })
  }
  },

  //跳转搜索页面
  launchToSearch() {
    wx.navigateTo({
      url: '/pages/search/search?search_work=' + this.data.search_work,
    })
  },

  //更新input的值
  uodateInputValue(e) {
    this.setData({
      search_work: e.detail.value
    })

  },

  //影藏弹窗
  hidePop() {
    this.setData({
      showPop: false
    })
  },

  onReachBottom: function () {
    if (!this.data.showNone) {
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