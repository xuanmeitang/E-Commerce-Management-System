//统一管理咱们项目用户相关的接口
import request from "@/utils/request";
import type { loginFormData, loginResponseData } from '@/api/user/type'
//项目用户相关的请求地址
enum API {
    LOGIN_URL = "/user/login",
    USERINFO_URL = "/user/info",
    LOGOUT_URL = "/user/logout"
}

//登录接口
export const reqLogin = (data: loginFormData) => request.post<loginResponseData>(API.LOGIN_URL, data);
//获取用户信息
export const reqUserInfo = () => request.get(API.USERINFO_URL);
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
