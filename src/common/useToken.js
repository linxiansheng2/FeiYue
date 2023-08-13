import { reactive } from 'vue';

export function useToken() {
  const token = reactive({
    value: null,
    expiryDate: null,
    flag:false
  });

  function setToken(value) {
    token.value = value;
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 天的时间戳
    token.expiryDate = expiryDate;
    token.flag = true;
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  function getToken() {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      const parsedToken = JSON.parse(storedToken);
      // 检查 Token 是否已过期
      if (!parsedToken.expiryDate || new Date(parsedToken.expiryDate) > new Date()) {
        token.value = parsedToken.value;
        token.expiryDate = parsedToken.expiryDate;
      } else {
        // Token 已过期，将其移除
        removeToken();
      }
    }
    return token;
  }

  function removeToken() {
    sessionStorage.removeItem('token');
    token.value = null;
    token.expiryDate = null;
    token.flag = false;
  }

  return { setToken, getToken, removeToken };
}

// import { useToken } from './useToken.js';

// export default {
//   mounted() {
//     const { setToken, getToken, removeToken } = useToken();
//     // 设置 Token
//     setToken('your_token_value');
//     // 获取 Token
//     const token = getToken();
//     console.log(token.value);
//     console.log(token.expiryDate);
//     // 移除 Token
//     removeToken();
//   },
// };