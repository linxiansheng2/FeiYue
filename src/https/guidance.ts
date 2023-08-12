import instance from "./request";
export default{
    //查询下级列表接口
    postloser(type:any,pageNum:any,pageSize:any){
        return instance.post('api/client/InviteList.php/lowerUserNumberInfo',{
            type,
            pageNum,
            pageSize
        })
    },
    //下级返佣记录接口
    posttelist(type:any,pageNum:number,pageSize:any){
        return instance.post('api/client/InviteList.php/RebateList',{
            type,
            pageNum,
            pageSize
        })
    }
}