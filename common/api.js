const globalUrl = "https://www.magicdn.club/xince/";
let requestUrls = {
  "WeChatlogin": globalUrl + "XcWechat/WeChatlogin.do",//登录接口
  "findList": globalUrl + "module/findList.do",//四大模块接口
  "moduleDetail": globalUrl + "module/selectDetails.do",// 获取模板详情接口
  "testList": globalUrl + "testInfo/findList.do",//获取测试数据
  "updateTip": globalUrl + "testInfo/selectShow.do",//更新数据提示接口
  "swiperData": globalUrl + "pic/selectAllPic.do",//轮播图数据接口
  "payDetail": globalUrl + "testInfo/selectDetails.do",//付费数据页面接口
  "pointTestCourse": globalUrl + "testInfo/selectQuestion.do",//分数测试流程接口
  "skipTestCourse": globalUrl + "testInfo/selectSkipQuestion.do",//分数测试流程接口
  "pointTestResult": globalUrl + "testInfo/selectAnswer.do",//分数测试结果接口
  "skiptTestResult": globalUrl + "testInfo/selectSkipAnswer.do",//跳题测试结果接口
  
  "payOrder": globalUrl +"WechatPay/payOrder.do",//下单接口
}
export default requestUrls;