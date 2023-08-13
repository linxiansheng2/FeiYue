import { createRouter,createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../components/layout.vue'
import home from './modules/home'
import mining from './modules/mining'
import options from './modules/options'
import assetcenter from './modules/assetcenter'
import { showToast } from 'vant';
import officialActivity from './modules/officialActivity'
import about from './modules/about'
import guidance from './modules/guidance'
import proclamation from './modules/proclamation'
import pledgerecord from './modules/pledgerecord'
import { useToken } from '@/common/useToken';
/**
 * key : 多语言翻译字段，不添加显示标题为空
 * back ：设置为true，使用带返回按钮的顶部导航栏
 * requiresAuth: true 不需要登录权限，即可访问，默认false
 */
const routes: Array<RouteRecordRaw> = [
  {
      path: '/',
      name: 'app',
      component: Layout,
      redirect: '/home',
      children:[
        home,
        assetcenter,
        mining,
        options,
        officialActivity,
        about,
        guidance,
        proclamation,
        pledgerecord
      ],
  },
  {
      path: '/share',
      name: 'share',
      meta: { title: '邀請好友',key:'silder.menu6'},
      component: () => import('../views/share/index.vue'),
  },
  {
      name: "404",
      path: "/:pathMatch(.*)*",
      component: () => import('../views/NotFound.vue'),
      meta: { 
          title: '页面不存在',
          key:'undefined.undefined'
      },
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return Object.assign({...savedPosition,...{ top: 0 }});
		} else {
			return { top: 0 };
		}
	},
})

const { getToken} = useToken();

router.beforeEach((to, from, next) => {

  // 判断用户是否已登录 或 已过期
  const isLoggedIn = getToken(); 
  if(isLoggedIn.value || to.meta['requiresAuth']){
    next();
  }else{
    if(!isLoggedIn.flag && from.name != 'home'){
      showToast('登录过期,请重新登录');
      setTimeout(() => {
        if(from.path == "/home"){
          next(false);
        }
        next({path:"/home"});
      }, 500);
    }else{
      showToast('请先连接钱包');
      next(false);
    }
  }  
});

router.afterEach(() => {

});


export default router;
