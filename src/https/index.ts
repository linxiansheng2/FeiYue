import axios from "./request"
import home from './home'
import assetcenter from './assetcenter'
import mining from "./mining"
import options from "./options"
import pledgerecord from "./pledgerecord"
import share from "./share"
import guidance from "./guidance"
import profitrecord from "./profitrecord"
import about from "./about"
import officialactivity from "./officialactivity"
// 登录验证
const globalAxios = {
	logins(address:any) {
		let ycode = localStorage.getItem('ycode');
		return axios.post('api/client/login.php/login',{
			address,
			ycode
		})
	}
}

// 导出api对象
export default Object.assign(globalAxios,home,assetcenter,mining,options,pledgerecord,share,guidance,profitrecord,about,officialactivity)