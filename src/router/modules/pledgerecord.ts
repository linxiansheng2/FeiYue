export default {
    path: '/pledgerecord',
    name: 'pledgerecord',
    meta: { title: '質押記錄',back: true,key:'menu.Pledge_records'},
    component: () => import('../../views/pledgerecord/index.vue')
}