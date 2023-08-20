import instance from "./request"

export default {
    // 获取首页banner
	getHomeBanner() {
		return instance.get('api/public/slideshow.php/index')
	},
	// 合作伙伴
	getCooperate(pageNum:number = 1,pageSize:number = 10){
		return instance.post('api/public/cooperate.php/index',{
			pageNum,pageSize
		})
	},
	// 平台公告 Type： 0=首页 1 = 质押挖矿 2=期权交易
	getBulletin(Type:number,pageNum : number = 1,pageSize : number = 10){
		return instance.post('api/public/bulletin.php/list',{
			Type,
			pageNum,
			pageSize
		})
	},
	// 	平台公告详情接口
	getBulletinDetail(id:number){
		return instance.post('api/public/bulletin.php/get',{
			id
		})
	},
	// 获取程序配置
	getfindConfigList(){
		return instance.post('api/public/config.php/findConfigList')
	},
	// 主功能平台公告
	getMainmessage(){
		return instance.post('api/clien/popup_message.php/popup_message')
	}
}