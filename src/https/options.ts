import instance from "./request"

export default {
    // 期权登录验证
    getQQJYlogin() {
        return instance.get('api/client/QQJYlogin.php/login')
    },
    // K线走势数据
    getQQJYKX(symbol:string,period ? :string){
        return instance.post('api/public/QQJYKX.php/k',{
            symbol,
            period:period?period.toLowerCase():''
        })
    },
    // 买卖数据
    getTotalTrades(symbol:string){
        return instance.get(`api/public/QQJYKX.php/getTotalTrades?symbol=${symbol}`,)
    },
    // 产品列表查询接口[推荐]：只显示推荐产品
    getRecommendlist(){
        return instance.get('api/public/QQJYproduct.php/recommendlist')
    },
    // 产品列表查询接口[普通]：所有产品
    getList(){
        return instance.get('api/public/QQJYproduct.php/list')
    },
    // 产品列表查询接口[带行情]：会加上 当前价格 和 当前涨跌百分比 【这个接口可以带参数】
    getQQJYproduct(type:number|null){
        // type: 空为查询 全部 1=USDT 2=WEB3 3=NFT 
        return instance.get(`api/public/QQJYproduct.php/list1?type=${type}`)
        // ,{headers:{"content-type": "multipart/form-data"}}
    },
    // 期权交易提交订单
    getSubmitOrder(formdata:any){
        return instance.post('api/clien/QQJYSubmitOrder.php/TJ',formdata)
    },
    // 期权交易下单选项
    getSubmitOptions(){
        return instance.get('api/public/QQJYoptions.php/options')
    },
    // 期权交易手续费
    getHandlingfee(){
        return instance.get('api/public/QQJYoptions.php/handlingfee')
    },
    // 期权交易提现
    getSubmitTX(ordermoney:number){
        return instance.post('api/clien/QQJYConvert.php/TX',{
            ordermoney
        })
    },
    // 辅助功能展示
    getAuxiliary(represent:string){
        return instance.post('api/public/auxiliary_content.php/get',{
            represent
        })
    },

    // 

}