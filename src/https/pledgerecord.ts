import instance from "./request"

export default {
  //质押订单接口：
  getzyorder(State: any, pageNum: any) {
    return instance.post('api/clien/zyOrder.php/list', {
      State, pageNum
    })
  },
  //继续质押
  postsubmits(comboInfoId: any, amount: any, fid: any) {
    return instance.post('api/clien/zySubmitOrder.php/ZY', {
      comboInfoId, amount, fid
    })
  }
}