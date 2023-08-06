
export default {
    path: '/home',
    name: 'home',
    component: () => import('../../views/home.vue'),
    meta: { 
        title: '首页',
        index:'1',
        islogin:true
    },
}