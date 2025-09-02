import { createPinia, defineStore } from 'pinia'

// 创建 Pinia 实例
export const pinia = createPinia()

// 定义并导出 counter store
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0
    }),
    getters:{

    },
    actions:{

    }
})