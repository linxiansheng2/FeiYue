export default {
    path: '/about',
    name: 'about',
    meta: { title: '關於我們',key:'silder.menu7',back:true},
    component: () => import('../../views/about/index.vue'),
}