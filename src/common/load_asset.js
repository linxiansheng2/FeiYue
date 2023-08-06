import Big from 'big.js'
// 获取图片
export const getAssetURL = (image) =>{
    // 参数一：相对路径；参数二：绝对路径URL
    // return new URL(`../assets/${image}`, import.meta.url).href
	return require(`../assets/${image}`);
}

export const getLanguage = (key) => {
	return key
}
/**
 * 设置缓存数据 支持设置过期时间  0不过期 单位毫秒
 */
export const setCache = (key, value, expire = 0) => {	
	let data = {
		expire : expire ? (new Date().getTime()) + expire : 0,
		value : value
	}
	window.setStorageSync(key, JSON.stringify(data));
}

/**
 * 获取缓存数据
 */
export const getCache = (key) => {
	let data = uni.getStorageSync(key);
	if (!data) {
		return null;
	}
	data = JSON.parse(data);
	if (data.expire && data.expire < new Date().getTime()) {
		deleteCache(key);
		return null;
	}
	return data.value;
}

/**
 * 删除缓存数据
 */
export const deleteCache = (key) => {
	return window.removeStorageSync(key);
}

export const strip_tags = (content) => {
	return content.replace(/<\.+?>/g, '');
}

export const  nl2br = (str) => {
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
}

/**
 * 防抖ref
 * @param {*} value  初始值
 * @param {*} delay  间隔时间
 * @returns 
 */
// export const debounce = (fn,wait) => {
//     var timer = null;
//     return function(){
//         clearTimeout(timer)
//         timer = setTimeout(()=>{
//             fn()
//         },wait)
//     }
// }
export const debounce = (fn, delay = 300) =>{
	console.log(delay)
    let timer = null
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.call(this, ...args)
        }, delay);
    }
}
  
  /**
   * 节流ref   
   * @param {*} value 初始值
   * @param {*} delay 节流间隔时间
   * @returns 
   */
  export const useThrottleRef = (value, delay = 500) => {
	let flag = true;
	return customRef((tract, trigger) => {
	  return {
		get() {
		  tract()
		  return value;
		},
		set(newVal) {        
		  value = newVal;
		  if (!flag) {
			return;
		  }
		  flag = false;
  
		  setTimeout(() => {
			trigger()
			flag = true;
		  }, delay)
		}
	  }
	})
  }
  
  
/**
 * number转Scientific
 * @param {String} number 数字
 * @param {Number} power 到多少位才转换
 * @returns 科学记数法
 */
export const NumberToScientfic = (number, power = 10) => {
  if (number && typeof number === 'string') {
    if (number.toString().includes('e')) return number
    const value = Number(number)
    if (value.toString().includes('e')) return value.toString()
    const p = Math.floor(Math.log(Math.abs(value)) / Math.LN10)
    if (Math.abs(p) < power) return value.toString()
    const bigNumber = new Big(value)
    return bigNumber.toExponential()
  } else return ''
}