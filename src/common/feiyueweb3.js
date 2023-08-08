import Web3 from "web3";

var w;
var u;
var user;
var code;
//实例化

export default {
	ercchushihua: function(url, abi, value) {
		//实例化
		w = new Web3(Web3.givenProvider || url);
		u = new w.eth.Contract(abi, value);
		
	},
	erclianjie: async function() {
		user = undefined;
		//连接钱包
		try{ 
		    user = await w.eth.requestAccounts().then(); 
			
		} catch(err) { 
			
			code = err.code;
		}
		
		
		
		if(user != undefined){
			return 1;
		}else{
			return code;
		}
	},
	ercshouquan: async function(a){
		//授权
		try{
		    var shouquan = await u.methods.approve(a,'10000000000000000000000000000000000000').send({from:user[0]});
		} catch(err) { 
			code = err.code;
		}
		if(shouquan != undefined){
			return 1;
		}else{
			return code;
		}
	},
	getusers: async function(){
		//获取当前钱包地址
		if(user != undefined){
			return user[0];
		}
		return user;
	},
	ercshijian: async function(){
		// u.events.Transfer({
  //             fromBlock: 0,
  //             toBlock: 'latest'
  //           }, (error, event) => {
		//   if (error) {
		//     //console.error(error);
		//   } else {
		// 	  //console.log( event);
		//     console.log('https://etherscan.io/tx/' + event.transactionHash);
		//   }
		// });
	}
}