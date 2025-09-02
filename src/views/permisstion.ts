//通过路由守卫来进行路由鉴权
import router from "@/router/routes";
import { pinia } from '../store/user'
import useUserStore from "../store/moudules/user";
const userStore = useUserStore(pinia)
const username = userStore.username
const whiteList = ['/login', '/register', '/404'];
router.beforeEach(async (to: any, from: any, next: any) => {
    let token = userStore.token
    document.title = to.meta.title
    if (whiteList.includes(to.path)) {
        next(); // 直接放行
        return; // 终止后续逻辑
    }
    if (token) {
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            if (username) {
                next()
            } else {
                try {
                    await userStore.getUserInfo()
                    next()
                } catch (error) {
                    userStore.clear()
                    next({ path: '/login' })
                }

            }
        }
    } else {
        if (to.path == '/login') {
            next();
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }

    }



})
router.afterEach((to: any, from: any) => {

})