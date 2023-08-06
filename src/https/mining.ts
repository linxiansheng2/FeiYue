import instance from "./request";

export default {
    //获取质押挖矿账户信息
    getlogin() {
        return instance.get('api/client/zylogin.php/login')
    },
    //质押挖矿——兑换体现
    postexchange(ordermoney: any) {
        return instance.post('api/clien/zyConvert.php/DH', {
            ordermoney
        })
    },
    //质押挖矿——体现数量
    postreflect(ordermoney: any) {
        return instance.post('api/clien/zyConvert.php/TX', {
            ordermoney
        })
    },
    //质押挖矿-矿池数据接口：
    getHomeStatistical() {
        return instance.get('api/clien/zyMiningpooldata.php/getHomeStatistical')
    },
    //质押挖矿-滚动收益接口
    getshouyia() {
        return instance.get('api/clien/zyMiningpooldata.php/getwithdrawalInfo')
    },
    //矿池数据接口：
    getkcshuju(){
        return instance.get('api/clien/zyTeam.php/index')
    },
    //记录数据接口
    
    postrecorded(type:any,pageNum:any){
        return instance.post('api/clien/zyTeam.php/list',{
            type,pageNum
        })
    },
    //质押套餐列表接口：
    getzycombo(){
        return instance.get('api/clien/zyCombo.php/list')
    },
    //质押下单接口
    postgobuy(comboInfoId:any,amount:any,fid?:any){
        return instance.post('api/clien/zySubmitOrder.php/ZY',
            {
                comboInfoId,amount
            },
            {
                headers: {
                    "content-type": "multipart/form-data",
                }
            }
        )
    },
    //下级记录数据接口：
    postsubordinate(u:any,pageNum:any){
         return instance.post('api/clien/zyTeam.php/listx',{
            u,pageNum
         })
    },
    //获取链上usdt余额
    getlxmoney(){
        return instance.get('api/clien/tool.php/LXmoney')
    }
}