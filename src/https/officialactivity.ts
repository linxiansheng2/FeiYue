import instance from "./request";

export default{
   // 平台公告 Type： 0=首页 1 = 质押挖矿 2=期权交易
   getactivity(Type:number,pageNum : number = 1,pageSize : number = 10){
		return instance.post('api/public/activity_bulletin.php/list',{
			Type,
			pageNum,
			pageSize
		})
	},
    // 	平台公告详情接口
	getbulletin(id:number){
		return instance.post('api/public/activity_bulletin.php/get',{
			id
		})
	},
}