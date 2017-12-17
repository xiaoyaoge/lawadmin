import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import UserCenter from './views/user/user-center.vue'
import OrderMsg from './views/order/order-msg.vue'
import OrderEmail from './views/order/order-email.vue'
import OderLetter from './views/order/order-letter.vue'
import Enterprise from './views/enterprise/enterprise-center.vue'
import EnterInfo from './views/enterprise/enterprise-info.vue'
import EnterForm from './views/enterprise/enterprise-form.vue'
import EnterMsg from './views/enterprise/enterprise-msg.vue'
import EnterEmail from './views/enterprise/enterprise-email.vue'
import EnterLetter from './views/enterprise/enterprise-letter.vue'
import LawFirm from './views/firm/law-firm.vue'
import LawUser from './views/firm/law-user.vue'
import NewsAdd from './views/news/news-add.vue'
import NewsEdit from './views/news/news-edit.vue'
import NewsList from './views/news/news-list.vue'
import Banner from './views/banner/banner.vue'

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
    }, {
        path: '/',
        component: Home,
        name: '管理员',
        iconCls: 'icon-empty',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/manager',
        role: 99,
        children: [
            { path: '/manager', component: UserCenter, name: '账号管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'banner管理',
        iconCls: 'icon-id',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/banner',
        role: 99,
        children: [
            { path: '/banner', component: Banner, name: 'banner管理' },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '新闻管理',
        iconCls: 'icon-apps',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/news,/news/add,/news/edit',
        role: 99,
        children: [
            { path: '/news', component: NewsList, name: '新闻管理' },
            { path: '/news/add', component: NewsEdit, name: '新闻管理' },
            { path: '/news/edit', component: NewsAdd, name: '新闻管理' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '仁良律师',
        iconCls: 'icon-id',
        hidden: false,
        leaf: true, //只有一个节点
        paths: '/lawMannger',
        role: 99,
        children: [
            { path: '/lawMannger', component: LawUser, name: '仁良律师' }

        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '律所管理',
    //     iconCls: 'icon-id',
    //     hidden: false,
    //     leaf: true, //只有一个节点
    //     paths: '/lawFirm',
    //     role: 99,
    //     children: [
    //         { path: '/lawFirm', component: LawFirm, name: '仁良律所' }

    //     ]
    // },

    {
        path: '/',
        component: Home,
        name: '企业管理',
        iconCls: 'icon-apps',
        leaf: true, //只有一个节点
        hidden: false,
        paths: '/enterprise,/enterInfo/,/enterMsg/,/enterEmail/,/enterLetter/',
        role: 0,
        children: [
            { path: '/enterprise', component: Enterprise, name: '企业管理' },
            { path: '/enterprise/enterForm', component: EnterForm, name: '入驻新企业', hidden: true },
            { path: '/enterprise/enterInfo/:id', component: EnterInfo, name: '基本信息', hidden: true },
            { path: '/enterprise/enterMsg/:id', component: EnterMsg, name: '短信订单', hidden: true },
            { path: '/enterprise/enterEmail/:id', component: EnterEmail, name: '电子信函', hidden: true },
            { path: '/enterprise/enterLetter/:id', component: EnterLetter, name: '纸质信函', hidden: true }

        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '订单管理',
    //     iconCls: 'icon-order', //图标样式class
    //     leaf: false, //只有一个节点
    //     hidden: false,
    //     paths: '/msgOder,/emailOder,/letterOder',
    //     role: 0,
    //     children: [
    //         { path: '/msgOder', component: OrderMsg, name: '短信订单' },
    //         { path: '/emailOder', component: OrderEmail, name: '电子信函' },
    //         { path: '/letterOder', component: OderLetter, name: '信函下载' }

    //     ]
    // },
    {
        path: '*',
        hidden: true,
        role: 0,
        redirect: { path: '/404' }
    }
];



export default routes;