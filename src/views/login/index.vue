<template>
    <div class="login_container">
        <el-row>
            <el-col :span="8" :xs="0"></el-col>
            <el-col :span="8" :xs="24">
                <!-- 登录的表单 -->
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h2>密码登录</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="8" :xs="0"></el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElNotification, resultProps } from "element-plus";
import type { loginFormData } from '@/api/user/type'
//引入用户相关的小仓库
import useUserStore from '@/store/moudules/user';
let useStore = useUserStore()
//获取el-form组件
let loginForms = ref();
//获取路由器
let $router = useRouter();
//路由对象
let $route = useRoute();
//定义变量控制按钮加载效果
let loading = ref(false);
//收集账号与密码的数据
let loginForm = reactive({ username: "xuanmeitang", password: "111111" });
//登录按钮回调
useStore.clear()
const login = async () => {
    //保证全部表单相校验通过再发请求
    await loginForms.value.validate();
    //加载效果:开始加载
    loading.value = true;
    //点击登录按钮后调用userLogin函数
    //通知仓库发登录请求
    //请求成功->路由跳转，跳转到主页
    //请求失败->弹出登录失败信息
    
    try {
        //点击后调用pinia中的actions中的函数进行网络请求
        const result = await useStore.userLogin(loginForm);
        if (result == 'ok') {
            $router.push('/layout')
        } else {
            alert('登录失败，请重新登录！')
        }
        
        //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
        // let redirect: any = $route.query.redirect;
        // $router.push({ path: redirect || '/' });
        //登录成功提示信息
        ElNotification({
            type: 'success',
            message: '欢迎回来',
        });
        //登录成功加载效果也消失
        loading.value = false;
    } catch (error) {
        //登录失败加载效果消息
        loading.value = false;
        //登录失败的提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }
}

//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
    //rule:即为校验规则对象
    //value:即为表单元素文本内容
    //函数:如果符合条件callBack放行通过即为
    //如果不符合条件callBack方法,注入错误提示信息
    if (value.length >= 5) {
        callback();
    } else {
        callback(new Error("账号长度至少五位"));
    }
};

const validatorPassword = (rule: any, value: any, callback: any) => {
    if (value.length >= 6) {
        callback();
    } else {
        callback(new Error("密码长度至少六位"));
    }
};

//定义表单校验需要配置对象
const rules = {
    //规则对象属性:
    //required,代表这个字段务必要校验的
    //min:文本长度至少多少位
    //max:文本长度最多多少位
    //message:错误的提示信息
    //trigger:触发校验表单的时机 change->文本发生变化触发校验,blur:失去焦点的时候触发校验规则
    username: [
        // { required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
        { trigger: "change", validator: validatorUserName },
    ],
    password: [
        // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change' }
        { trigger: "change", validator: validatorPassword },
    ],
};
</script>
<style scoped>
.login_container {
    width: 100%;
    height: 100vh;
    background: url("@/assets/images/background.jpg") no-repeat;
    background-size: cover;
}

.login_container .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.jpg") no-repeat;
    background-size: cover;
    padding: 40px;
}


.login_container .login_form h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0px;
}

.login_container .login_form .login_btn {
    width: 100%;
}
</style>