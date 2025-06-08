<template>
  <div class="all">
    <div class="left">
      <div class="icon">
      <el-icon size="20px" @click="expand" padding="10px"><Expand /></el-icon>
    </div>
      <el-breadcrumb :separator-icon="ArrowRight" >
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.icon" :to="item.path">
          <el-icon>
            <component :is="item.meta.icon"> </component>
          </el-icon>
            <span>{{item.meta.title}}</span>
        </el-breadcrumb-item>
        
      </el-breadcrumb>
    </div>
    <div class="right">
          <el-button  icon="Refresh" circle  color="white" @click="refresh"/>
          <el-button icon="Search" circle />
          <el-button  icon="FullScreen" circle  color="white" @click="fullScreen"/>
          <img :src="userStore.avatar" style="width :24px;height :24px; margin:0px 10px">
          <el-dropdown>
        <span class="el-dropdown-link">
                {{ userStore.username }} 
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="CirclePlusFilled">
              <el-button @click="goOut">退出登录</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute ,useRouter} from 'vue-router'
import useUserStore from '@/store/moudules/user';
const $route = useRoute();
const $router = useRouter();
const expand = () => { }
const refresh = () => { }
let userStore = useUserStore()
const fullScreen = () => {
    // 检查是否有元素处于全屏模式
    let full = document.fullscreenElement;
    if (!full) {
        // 如果没有元素处于全屏模式，尝试让文档的根元素进入全屏
        document.documentElement.requestFullscreen().catch(err => {
            // 捕获可能的错误，例如用户拒绝或API不可用
            console.error(`无法进入全屏模式: ${err.message}`);
        });
    } else {
        // 如果有元素处于全屏模式，退出全屏
        document.exitFullscreen().catch(err => {
            // 捕获可能的错误
            console.error(`无法退出全屏模式: ${err.message}`);
        });
  }
  
}
    const goOut = () => {
      userStore.clear()
      $router.push('/login')
      }
      ;
</script> 

<style scoped>
.all {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  background-color:antiquewhite;
}

.left {
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.right {
  display: flex;
  align-items: center;
  margin-right : 20px;
}
.icon {
  padding: 0 10px;
}
</style>