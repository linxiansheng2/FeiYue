import instance from "./request"

export default {
    // 充值渠道顶部图片
	getCzmoneySwiper(){
		return instance.get('api/public/slideshow.php/czmoney')
	},
	// 充值渠道列表
	getUsermoneylist()
	{
		return instance.get('api/clien/usermoneylist.php/index')
	},
	// 充值渠道详情
	getUsermoneyItem(id:number){
		return instance.post('api/clien/usermoneylist.php/get',
		{id},
		{
			headers:{"content-type": "multipart/form-data"}
		})
	},
	// 主账户申请充值【手动】 
	getRecharge(ordermoney:string|number,Bname:any){
		return instance.post('api/clien/usermoney.php/recharge',{
			ordermoney,
			Bname
		},
		{
			headers:{"content-type": "multipart/form-data"}
		})
	},
	// 主账户提现渠道列表 
	getUserTXmoneylist(){
		return instance.post('api/clien/usermoneylist.php/indexTX')
	},
	// 主账户申请提现
	getUserSubmitTX(ordermoney:string|number,Bname:string){
		return instance.post('api/clien/usermoney.php/withdraw',{
			ordermoney,
			Bname
		},
		{
			headers:{"content-type": "multipart/form-data"}
		})
	},
	// 查询余额 Type：空 查询主账户余额  zy = 查询质押挖矿账户余额  jy = 查询期权交易余额 all = 查询所有账户余额
	getMoney(Type:string|null){
		return instance.post('api/clien/usermoney.php/getmoney',{
			Type
		},
		{
			headers:{"content-type": "multipart/form-data"}
		})
	},
	// 	查询每日盈亏统计接口 pageSize：7 或者 30 type:可空 0=查询全部 1=查询期权交易 2=查询质押挖矿
	getLossstatistics(pageSize:number,type:number){
		return instance.post('api/clien/Profitandlossstatistics.php/list',{
			pageSize,
			type
		})
	},
	// 交换余额
	getUsermoney(params:any){
		let {money,from_user,to_user} = params
		return instance.post('api/clien/usermoney.php/swap',{
			money,from_user,to_user
		},{headers:{"content-type": "multipart/form-data"}})
	},
	// 充值记录
	getUserRechargelist(pageNum:number = 1,pageSize:number = 10){
		return instance.post('api/clien/usermoneyOrderlist.php/recharge',{
			pageNum,pageSize
		})
	},
	// 提现记录
	getUserWithdrawlist(pageNum:number = 1,pageSize:number = 10){
		return instance.post('api/clien/usermoneyOrderlist.php/withdraw',{
			pageNum,pageSize
		})
	},
}