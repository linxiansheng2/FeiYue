import instance from "./request";


export default{
    //邀请详情数据获取接口：
    getamout(){
        return instance.get('api/client/InviteIndex.php/findUserInvitationAndAmout')
    },
    //邀请返佣比例查询接口
    getrebeta(){
        return instance.get('api/client/InviteIndex.php/rebate')
    }
}