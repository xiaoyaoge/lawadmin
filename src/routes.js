import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserCenter from './views/user/user-center.vue'
import Customer from './views/user/customer.vue'

import LawFirm from './views/firm/law-firm.vue'
import LawyerUser from './views/firm/lawyer-user.vue'
import LawyerAdd from './views/firm/lawyer-add.vue'
import LawyerEdit from './views/firm/lawyer-edit.vue'

import NewsAdd from './views/news/news-add.vue'
import NewsEdit from './views/news/news-edit.vue'
import NewsList from './views/news/news-list.vue'

import Banner from './views/banner/banner.vue'
import BannerAdd from './views/banner/banner-add.vue'
import BannerEdit from './views/banner/banner-info.vue'



let routes = [{
        path: '/login',
        component: Login,
        name: '',
        role: 0,
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        role: 0,
        hidden: true
    },
    {
        path: '/banner',
        component: Home,
        name: '首页banner管理',
        iconCls: 'icon-home',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/banner,/banner/add,/banner/edit',
        role: 99,
        children: [
            { path: '/banner', component: Banner, name: '首页管理' },
            { path: '/banner/add', component: BannerAdd, name: '添加Banner', hidden: true },
            { path: '/banner/edit/:id', component: BannerEdit, name: '编辑Banner', hidden: true }
        ]
    },
    {
        path: '/news',
        component: Home,
        name: '新闻管理',
        iconCls: 'icon-list',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/news,/news/add,/news/info',
        role: 99,
        children: [
            { path: '/news', component: NewsList, name: '新闻管理' },
            { path: '/news/add', component: NewsAdd, name: '添加新闻' },
            { path: '/news/info/:id', component: NewsEdit, name: '编辑新闻' }

        ]
    },
    {
        path: '/lawyer',
        component: Home,
        name: '仁良律师',
        iconCls: 'icon-user',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/lawyer,/lawyer/add,/lawyer/edit',
        role: 99,
        children: [
            { path: '/lawyer', component: LawyerUser, name: '仁良律师' },
            { path: '/lawyer/add', component: LawyerAdd, name: '添加律师', hidden: true },
            { path: '/lawyer/edit/:id', component: LawyerEdit, name: '编辑律师信息', hidden: true }

        ]
    },
    {
        path: '/manager',
        component: Home,
        name: '管理员',
        iconCls: 'icon-id',
        hidden: false,
        leaf: false, //只有一个节点
        paths: '/manager,/customer',
        role: 99,
        children: [
            { path: '/manager', component: UserCenter, name: '管理员' },
            { path: '/customer', component: Customer, name: '注册用户' }
        ]
    },
    {
        path: '*',
        hidden: true,
        role: 0,
        redirect: { path: '/404' }
    }
];



export default routes;