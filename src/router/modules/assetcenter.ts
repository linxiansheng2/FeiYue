export default {
    path: '/assetcenter',
    name: 'assetcenter',
    meta: { title: '資產中心'},
    redirect: '/assetcenter/index',
    children: [
        {
            path: 'index',
            component: () => import('../../views/assetcenter/index.vue'),
            name: 'assetcenter_index',
            meta: {title: '資產中心',back:true,key:'menu.navAsset'}
        },
        {
            path: 'deposit',
            component: () => import('../../views/assetcenter/deposit.vue'),
            name: 'assetcenter_deposit',
            meta: {title: '總資產充值',back:true,key:'menu.navAsset_Deposit'}
        },
        {
            path: 'withdraw',
            component: () => import('../../views/assetcenter/withdraw.vue'),
            name: 'assetcenter_withdraw',
            meta: {title: '總資產提幣',back:true,key:'menu.navAsset_Withdraw'}
        },
        {
            path: 'transfer',
            component: () => import('../../views/assetcenter/transfer.vue'),
            name: 'assetcenter_transfer',
            meta: {title: '資產中心',back:true,key:'menu.navAsset_Transfer'}
        },
        {
            path: 'history',
            component: () => import('../../views/assetcenter/history.vue'),
            name: 'assetcenter_history',
            meta: {title: '財務記錄',back:true,key:'menu.navAsset_History'}
        },
    ]
}