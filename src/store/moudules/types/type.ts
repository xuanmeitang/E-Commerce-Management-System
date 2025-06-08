//定义数据state类型
import type { RouteRecordRaw } from "vue-router";
//定义小仓库数据state类型
export interface UserState {
    token: string | null;
    username: string,
    avatar: string,
    buttons: string[]
}
