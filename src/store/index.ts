import { createPinia } from 'pinia'
import useUserStore from './modules/user'

// 创建 Pinia 实例
export const pinia = createPinia()

// 统一导出所有 store
export {
    useUserStore
}
