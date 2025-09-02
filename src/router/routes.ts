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
                        path: '/management',
                        component: () => import('@/views/management/index.vue'),
                        name: 'Management',
                        meta: {
                            title: '系统管理',
                            icon: 'Setting'
                        },
                        redirect: '/management/customer',
                        children: [
                            {
                                path: 'customer',
                                component: () => import('@/views/management/customer/index.vue'),
                                name: 'CustomerManagement',
                                meta: {
                                    title: '客户管理',
                                    icon: 'User'
                                }
                            },
                            {
                                path: 'product',
                                component: () => import('@/views/management/product/index.vue'),
                                name: 'ProductManagement',
                                meta: {
                                    title: '商品管理',
                                    icon: 'Goods'
                                }
                            },
                            {
                                path: 'order',
                                component: () => import('@/views/management/order/index.vue'),
                                name: 'OrderManagement',
                                meta: {
                                    title: '订单管理',
                                    icon: 'ShoppingCart'
                                }
                            }
                        ],
                    },

                    {
                        path: '/power',
                        component: () => import('@/views/power/index.vue'),
                        name: 'Power',
                        meta: {
                            title: '权限管理',
                            icon: 'Lock'
                        },
                        redirect: '/power/roles',
                        children: [
                            {
                                path: 'roles',
                                component: () => import('@/views/power/roles/index.vue'),
                                name: 'RoleManagement',
                                meta: {
                                    title: '角色管理',
                                    icon: 'Avatar'
                                }
                            },
                            {
                                path: 'permissions',
                                component: () => import('@/views/power/permissions/index.vue'),
                                name: 'PermissionManagement',
                                meta: {
                                    title: '权限配置',
                                    icon: 'Tools'
                                }
                            },
                            {
                                path: 'users',
                                component: () => import('@/views/power/users/index.vue'),
                                name: 'UserPermission',
                                meta: {
                                    title: '用户权限',
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