import instance from "./request"

export default {
  //质押订单接口：
  getzyorder(State:any,pageNum:any){
    return instance.post('api/clien/zyOrder.php/list',{
        State,pageNum
    })
}
}