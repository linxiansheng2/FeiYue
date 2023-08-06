import instance from "./request";
export default{
    //查询下级列表接口
    postloser(pageNum:any,pageSize?:any){
        return instance.post('api/client/InviteList.php/lowerUserNumberInfo',{
            pageNum,
            pageSize
        })
    }
}