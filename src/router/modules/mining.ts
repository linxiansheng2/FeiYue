export default {
    path: '/mining',
    name: 'mining',
    meta: { title: '挖礦'},
    redirect: '/mining/index',
    children: [
        {
            path: 'index',
            component: () => import('../../views/mining/mining.vue'),
            name: 'mining_index',
            meta: {title: '挖礦',key:'silder.menu3_1'}
        },
        {
            path: 'faq',
            component: () => import('../../views/mining/faq.vue'),
            name: 'mining_faq',
            meta: {title: '玩法说明',back:true,key:'silder.menu3_2'}
        },
        {
            path: 'profitrecord',
            component: () => import('../../views/mining/profitrecord.vue'),
            name: 'mining_profitrecord',
            meta: {title: '盈利統計',back:true,key:'silder.menu3_3'}
        },{
            path: 'faqdetaile/:id',
            component: () => import('../../views/mining/faqdetaile.vue'),
            name:'mining_faqdetaile',
            meta: {title: '盈利明細',back:true,key:'menu.how_to_play'}
        }
    ]
}