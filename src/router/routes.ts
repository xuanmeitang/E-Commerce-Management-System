import { createRouter, createWebHashHistory } from 'vue-router'
let router = createRouter(
    {
        history: createWebHashHistory(),
        routes: [
            {
                path: '/login',
                component: () => import('@/views/login/index.vue'),
                name: 'Login'
            },
            {
                path: '/',
                redirect: '/login',
                name: 'Any'
            },
            {
                path: '/layout',
                component: () => import('@/layout/index.vue'),
                name: 'Layout',
                meta: { title: '' },
                children: [
                    {
                        path: '/home',
                        component: () => import('@/views/home/index.vue'),
                        name: 'Home',
                        meta: {
                            title: '主页',
                            icon: 'HomeFilled'
                        }
                    },

                    {
                        path: '/power',
                        component: () => import('@/views/power/index.vue'),
                        name: 'Power',
                        meta: {
                            title: '权限管理',
                            icon: 'Lock'
                        },
                        redirect: '/power/tourist',
                        children: [
                            {
                                path: 'tourist',
                                component: () => import('@/views/power/toursit/index.vue'),
                                name: 'Tourist',
                                meta: {
                                    title: '游客权限',
                                    icon: 'Avatar'
                                }
                            },
                            {
                                path: 'manager',
                                component: () => import('@/views/power/manager/index.vue'),
                                name: 'Manager',
                                meta: {
                                    title: '管理者权限',
                                    icon: 'User'
                                }
                            },
                            {
                                path: 'develop',
                                component: () => import('@/views/power/develop/index.vue'),
                                name: 'Develop',
                                meta: {
                                    title: '开发者权限',
                                    icon: 'UserFilled'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                path: '/screen',
                component: () => import('@/views/screen/screen.vue'),
                name: 'Screen',
                meta: {
                    title: '数据大屏'
                }
            },
            {
                path: '/404',
                component: () => import('@/views/404/index.vue'),
                name: '404'
            },


        ],
        //滚动
        scrollBehavior() {
            return {
                left: 0,
                top: 0
            }
        }
    }
);

export default router;