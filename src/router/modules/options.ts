export default {
    path: '/options',
    name: 'options',
    meta: { title: '期權交易'},
    redirect: '/options/options',
    children: [
        {
            path: 'options',
            component: () => import('../../views/options/options.vue'),
            name: 'options_index',
            meta: {title: '期權交易',key:'silder.menu4_1'}
        },
        {
            path: 'trade',
            component: () => import('../../views/options/trade.vue'),
            name: 'options_trade',
            meta: {title: '交易訂單',back:true,key:'silder.menu4_2'},
        },
        {
            path: 'opdetaile',
            component: () => import('../../views/options/opdetaile.vue'),
            name: 'options_opdetaile',
            meta: {title: '玩法说明',back:true,key:'silder.menu4_3'},
        },
        {
            path: 'details/:id',
            component: () => import('../../views/options/details.vue'),
            name: 'options_details',
            meta: {title: '玩法说明',back:true,key:'menu.how_to_play_details'},
        }
    ]
}