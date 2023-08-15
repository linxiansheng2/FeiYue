import instance from "./request";


export default{
    //邀请详情数据获取接口：
    getamout(){
        return instance.get('api/client/InviteIndex.php/findUserInvitationAndAmout')
    },
    //邀请返佣比例查询接口
    getrebeta(){
        return instance.get('api/client/InviteIndex.php/rebate')
    },
    getauxii(represent:any='invite_friends_Xck'){
        return instance.post('api/public/auxiliary_content.php/get',{
            represent
        })
    },
    //邀请接口
    postyaoqing(address:any,ycode:any){
        return instance.post('api/client/login.php/login',{
            address,ycode
        })
    }
}