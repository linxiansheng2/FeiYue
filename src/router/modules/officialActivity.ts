export default {
    path: '/officialActivity',
    name: 'officialActivity',
    meta: { title: '官方活動'},
    redirect: '/officialActivity/index',
    children:[
        {
            path:'index',
            name:'officialActivity_index',
            component:()=>import('../../views/officialActivity/index.vue'),
            meta:{title:'官方活動',back:true,key:'silder.menu5'}
        },
        {
            path:'detaile/:id',
            name:'officialActivity_detaile',
            component:()=>import('../../views/officialActivity/detaile.vue'),
            meta:{title:'官方活動',back:true,key:'menu.Official_activities'}
        }
    ]
}