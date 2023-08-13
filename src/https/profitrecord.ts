import instance from "./request";

export default{
    // /查询每日盈亏统计接口
    postyk(pageSize:any=7,type:any=2){
        return instance.post('api/clien/Profitandlossstatistics.php/list',{
            pageSize,
            type
        })
    }
    
}