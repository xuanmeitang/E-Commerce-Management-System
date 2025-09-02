<template>
    <div class="contain">
        <div class="left">
            <div class="left-top">
                <img src="@/assets/images/logo.png" alt="Logo">
            </div>
            <el-scrollbar class="menu-scrollbar">
                <el-menu class="custom-menu" :default-active="activeIndex" background-color="rgb(130, 150, 175)"
                    text-color="#fff" active-text-color="#ffd04b">
                    <el-menu-item index="1" @click="goHome">
                        <span class="nav-text"><el-icon size="14px">
                                <HomeFilled />
                            </el-icon>主页</span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="goScreen">
                        <span class="nav-text"><el-icon size="14px">
                                <Monitor />
                            </el-icon>数据大屏</span>
                    </el-menu-item>
                    <el-sub-menu index="3">
                        <template #title>
                            <span class="nav-text"><el-icon>
                                    <Lock />
                                </el-icon>权限管理</span>
                        </template>
                        <el-menu-item v-for="item in permissionItems" :key="item.index" :index="item.index"
                            @click="goPage(item)">
                            <component :is="item.icon" :style="size" /> {{ item.title }}
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="4">
                        <template #title>
                            <span class="nav-text"><el-icon>
                                    <Setting />
                                </el-icon>系统管理</span>
                        </template>
                        <el-menu-item v-for="item in managementItems" :key="item.index" :index="item.index"
                            @click="goPage(item)">
                            <component :is="item.icon" :style="size" /> {{ item.title }}
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <div class="right">
            <div class="right-top">
                <div class="breadcrumb">
                    <topNav></topNav>
                </div>
            </div>
            <div class="right-content">
                <div class="content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import topNav from './topNav/index.vue'
//获取用户信息
import useUserStore from '@/store/moudules/user'
let useStore = useUserStore()
const router = useRouter()
const route = useRoute()
const activeIndex = ref('1');
const permissionItems = ref([
    { index: '3-1', title: '角色管理', icon: 'Avatar', route: '/power/roles' },
    { index: '3-2', title: '权限配置', icon: 'Tools', route: '/power/permissions' },
    { index: '3-3', title: '用户权限', icon: 'UserFilled', route: '/power/users' },
])
const managementItems = ref([
    { index: '4-1', title: '客户管理', icon: 'User', route: '/management/customer' },
    { index: '4-2', title: '商品管理', icon: 'Goods', route: '/management/product' },
    { index: '4-3', title: '订单管理', icon: 'ShoppingCart', route: '/management/order' },
])
const size = {
    width: '14px',
    height: '14px'
}
const goHome = () => {
    router.push('/home')
    activeIndex.value = '1';
}
const goScreen = () => {
    router.push('/screen')
}
const goPage = (item) => {
    router.push(item.route)
}
// 监听路由变化，更新 activeIndex
watch(route, (newRoute) => {
    if (newRoute.path === '/') {
        activeIndex.value = '1';
    } else if (newRoute.path === '/screen') {
        activeIndex.value = '2';
    } else if (newRoute.path.startsWith('/power/')) {
        const path = newRoute.path.split('/').pop();
        if (path === 'roles') {
            activeIndex.value = '3-1';
        } else if (path === 'permissions') {
            activeIndex.value = '3-2';
        } else if (path === 'users') {
            activeIndex.value = '3-3';
        }
    } else if (newRoute.path.startsWith('/management/')) {
        const path = newRoute.path.split('/').pop();
        if (path === 'customer') {
            activeIndex.value = '4-1';
        } else if (path === 'product') {
            activeIndex.value = '4-2';
        } else if (path === 'order') {
            activeIndex.value = '4-3';
        }
    }
});

// 页面加载时设置 activeIndex  使的页面刷新时能够保持菜单的展开
onMounted(() => {
    if (route.path === '/') {
        activeIndex.value = '1';
    } else if (route.path === '/screen') {
        activeIndex.value = '2';
    } else if (route.path.startsWith('/power/')) {
        const path = route.path.split('/').pop();
        if (path === 'roles') {
            activeIndex.value = '3-1';
        } else if (path === 'permissions') {
            activeIndex.value = '3-2';
        } else if (path === 'users') {
            activeIndex.value = '3-3';
        }
    } else if (route.path.startsWith('/management/')) {
        const path = route.path.split('/').pop();
        if (path === 'customer') {
            activeIndex.value = '4-1';
        } else if (path === 'product') {
            activeIndex.value = '4-2';
        } else if (path === 'order') {
            activeIndex.value = '4-3';
        }
    }
    //登录成功后，组件完成加载，获取用户信息
    useStore.getUserInfo();
},

);

</script>

<style scoped>
.contain {
    display: flex;
    width: 100%;
    height: 100vh;
}

/* 左侧导航 */
.left {
    width: 250px;
    background-color: rgb(130, 150, 175);
    display: flex;
    flex-direction: column;
    border-radius: 10px 0 0 10px;
}

.left-top {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left-top img {
    max-width: 80%;
    height: auto;
}

.menu-scrollbar {
    flex: 1;
    height: calc(100vh - 80px);
}

.custom-menu {
    border-right: none;
    --el-menu-bg-color: rgb(130, 150, 175);
    --el-menu-hover-bg-color: rgba(110, 130, 160, 0.7);
    --el-menu-text-color: #fff;
    --el-menu-active-color: #ffd04b;
}

.custom-menu .el-menu-item,
.custom-menu .el-sub-menu__title {
    height: 48px;
    line-height: 48px;
}

.nav-text {
    font-size: 14px;
    letter-spacing: 0.5px;
}

.custom-menu .el-menu-item.is-active {
    background-color: rgba(255, 208, 75, 0.2) !important;
}

/* 右侧内容区 */
.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
}

.right-top {
    padding: 0 20px;
    height: 60px;
    width:100%;
    display: flex;
    align-items: center;
    background: white;
    border-bottom: 1px solid #e6e8eb;
    border-radius: 0 10px 10px 0;
    background-color:antiquewhite;
}

.breadcrumb {
    flex:1;
    font-size: 16px;
    color: #666;
}

.right-content {
    flex: 1;
    padding: 20px;
    overflow: auto;
}

.content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    height: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>