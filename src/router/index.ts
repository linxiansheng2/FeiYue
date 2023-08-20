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
import { getMessage } from '@/lang'
const message:any = getMessage();
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
          key:'undefined.undefined',
          requiresAuth: true
      },
  },
  {
    name: "invite",
    path: "/:id",
    component: () => import('../views/invite.vue'),
    meta: { 
        title: '推广',
        key:'share_index.share_index9',
        requiresAuth: true
    },
  },
  {
    name: "testpage",
    path: "/test",
    component: () => import('../views/test.vue'),
    meta: { 
        title: '测试链接',
        key:'undefined.undefined',
        requiresAuth: true
    },
  },
  {
    name: "cusservice",
    path: "/service",
    component: () => import('../views/service.vue'),
    meta: { 
        title: '客服',
        key:'undefined.undefined',
        requiresAuth: true,
        link:'https://a1.feiyuechat.com/chat/index?noCanClose=1&token=be790a8ed6e1b7890cfe2afd8696294c'
    },
  },
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
  if(!to.meta['requiresAuth']){
    const language = localStorage.getItem('language') || (navigator.language || 'en').toLocaleLowerCase().split('-')[0] || 'zh';
    // 判断用户是否已登录 或 已过期
    const isAuthenticated = JSON.parse(sessionStorage.getItem('vuex') as any);
    if(isAuthenticated && isAuthenticated['login']){
      next();
    }else{
      if(to.path != '/home'){
        showToast(message[language].cusGlobal.state14);
        next({path:"/home"});
        return
      }
      showToast(message[language].cusGlobal.state14);
      next(false);
    }
  }else{
    // 不需要登录直接访问
    next();
  }
});

router.afterEach(() => {

});




export default router;
