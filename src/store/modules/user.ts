import { defineStore } from 'pinia'
import type { loginFormData, userInfoReponseData, ResponseData } from '@/api/user/type'
import { reqLogin, reqUserInfo } from '@/api/user'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'
import type { UserState } from './types/type'

const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: GET_TOKEN(),//用户唯一标识token  
            username: '',
            avatar: '',
            //存储当前用户是否包含某一个按钮
            buttons: [],
        }
    },
    actions: {
        //发送登录请求，获取登录信息
        async userLogin(data: loginFormData): Promise<string | Error> {
            try {
                const result: any = await reqLogin(data);
                if (result.code === 200) {
                    this.token = result.data.token;
                    SET_TOKEN(result.data.token);
                    return 'ok';
                }
                throw new Error(result.message || '登录失败');
            } catch (error) {
                console.error('登录失败:', error);
                return Promise.reject(error);
            }
        },
        //请求并获取用户信息
        async getUserInfo() {
            try {
                const result: any = await reqUserInfo();
                if (result.code === 200) {
                    // 修正数据结构匹配
                    this.username = result.data.name || result.data.checkUser?.username || '';
                    this.avatar = result.data.avatar || result.data.checkUser?.avatar || '';
                    return 'success';
                } else {
                    return Promise.reject(result.message || 'failure');
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                return Promise.reject(error);
            }
        },
        //清除用户信息
        clear() {
            this.token = '';
            this.username = '';
            this.avatar = '';
            localStorage.removeItem('TOKEN');
        }
    },

    getters: {
        // 获取用户名
        getUsername(): string {
            return this.username;
        },
        // 获取头像
        getAvatar(): string {
            return this.avatar;
        }
    }
});

export default useUserStore;
