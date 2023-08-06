
export default {
    path: '/guidance',
    name: 'guidance',
    meta: { title: '返佣记录',back: true,key:'menu.Remittance_Records'},
    component: () => import('../../views/guidance/sharerecord.vue')
}