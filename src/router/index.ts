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


/**
 * key : 多语言翻译字段，不添加显示标题为空
 * back ：设置为true，使用带返回按钮的顶部导航栏
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
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: { 
          title: '登录测试',
      },
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

router.beforeEach((to, from, next) => {
  let token = window.sessionStorage.getItem('token');
  
  if(token || to.path == "/home"){
    next();
  }else{
    showToast('请先连接钱包');
    next(false);
  }  
  // next();
});

router.afterEach(() => {

});


export default router;
