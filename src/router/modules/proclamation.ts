export default {
    path: '/proclamation',
    name: 'proclamation',
    meta: { title: '平台公告'},
    redirect: '/proclamation/index',
    children: [
        {   path: 'index',
            name: 'proclamation_index',
            component: () => import('../../views/proclamation/index.vue'),
            meta: {title: '平台公告',back:true,key:'menu.navAsset_proclamation'}
        },
        {
            path: 'articleDetails/:id',
            component: () => import('../../views/proclamation/articleDetails.vue'),
            name: 'proclamation_articleDetails',
            meta: {title: '文章详情',back:true,key:'menu.navAsset_proclamationdetails'}
        },
    ]
}