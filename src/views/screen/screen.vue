<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="header">
        <button class="home-btn" @click="goHome">
          <i class="home-icon">🏠</i>
          <span>返回首页</span>
        </button>
        <h1>电商运营数据可视化中心</h1>
        <span class="time">{{ formattedTime }}</span>
      </div>
      <div class="bottom">
      <!-- 左侧：垂直三等分 -->
      <div class="bottom-left">
        <div class="left-top">
            <bottom_left_top></bottom_left_top>
        </div>  <!-- 1.5份 -->
        <div class="left-middle">
          <bottom_left_center></bottom_left_center>
        </div> <!-- 1份 -->
        <div class="left-bottom">
          <bottom_left_bottom></bottom_left_bottom>
        </div> <!-- 1份 -->
      </div>
      
      <!-- 中间：垂直两等分 -->
      <div class="bottom-center">
        <div class="center-top">
          <bottom_center_top></bottom_center_top>
        </div> <!-- 70% -->
        <div class="center-bottom">
          <bottom_center_bottom></bottom_center_bottom>
        </div> <!-- 30% -->
      </div>
      
      <!-- 右侧：垂直三等分 -->
      <div class="bottom-right">
        <div class="right-top">
          <bottom_right_top></bottom_right_top>
        </div>  <!-- 1.5份 -->
        <div class="right-middle">
          <bottom_right_center></bottom_right_center>
        </div> <!-- 1份 -->
        <div class="right-bottom">
          <bottom_right_bottom></bottom_right_bottom>
        </div> <!-- 1份 -->
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import bottom_left_top from './components/bottom_left_top.vue'
import bottom_left_center from './components/bottom_left_center.vue'
import bottom_left_bottom from './components/bottom_left_bottom.vue'
import bottom_center_top from './components/bottom_center_top.vue'
import bottom_center_bottom from './components/bottom_center_bottom.vue'
import bottom_right_bottom from './components/bottom_right_bottom.vue'
import bottom_right_top from './components/bottom_right_top.vue'
import bottom_right_center from './components/bottom_right_center.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import {useRouter} from 'vue-router'
const screen = ref(null)
const $router = useRouter();
const goHome = () => {
    $router.push('/home')
}
//计算放大或缩小比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return Math.min(ww, wh)
}

// 实时时间显示
const formattedTime = ref('');

// 更新时间的函数
function updateTime() {
  const now = new Date();
  formattedTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
}

// 定时器更新时间
let timeInterval = null;

//解决自适应问题
function updateTransform() {
  if (screen.value) {
    const scale = getScale()
    screen.value.style.transform = `scale(${scale}) translate(-50%, -50%)`
  }
}
onMounted(() => {
  updateTransform()
  updateTime() // 初始化时间
  timeInterval = setInterval(updateTime, 1000) // 每秒更新时间
  window.addEventListener('resize', updateTransform)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTransform)
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 25%, #0d1117 50%, #1c2331 75%, #0a0e1a 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(41, 252, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(138, 43, 226, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.screen {
  position: fixed;
  width: 1920px;
  height: 1080px;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  transform: translate(-50%, -50%);
}

.header {
  width: 100%;
  height: 60px;
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.9) 100%);
  border-bottom: 2px solid rgba(41, 252, 255, 0.4);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 50px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
  box-shadow: 0 0 10px #29fcff;
}

.header h1 {
  font-size: 28px;
  text-align: center;
  line-height: 60px;
  color: #29fcff;
  text-shadow: 0 0 20px rgba(41, 252, 255, 0.5);
  font-weight: bold;
  letter-spacing: 2px;
  position: relative;
  margin: 0;
}

.header h1::before {
  content: '';
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff);
}

.header h1::after {
  content: '';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #29fcff, transparent);
}
.home-btn {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, rgba(41, 252, 255, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 6px;
  color: #29fcff;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.home-btn:hover {
  background: linear-gradient(135deg, rgba(41, 252, 255, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%);
  border-color: #29fcff;
  box-shadow: 0 4px 15px rgba(41, 252, 255, 0.3);
  transform: translateY(-50%) translateY(-2px);
}

.home-icon {
  font-size: 16px;
  filter: drop-shadow(0 0 5px rgba(41, 252, 255, 0.5));
}

.header .time {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: #29fcff;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(41, 252, 255, 0.5);
  font-weight: 500;
  letter-spacing: 1px;
}
.bottom {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
}

/* 左侧盒子（1:2:1比例） */
.bottom-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.left-top {
  flex: 1.5;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.left-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}
.left-middle, .left-bottom {
  flex: 1;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.left-middle::before, .left-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}

/* 中间盒子（7:3比例） */
.bottom-center {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.center-top {
  flex: 7;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.center-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}
.center-bottom {
  flex: 3;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.center-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}

/* 右侧盒子（1.5:1:1比例） */
.bottom-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.right-top {
  flex: 1.5;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.right-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}
.right-middle, .right-bottom {
  flex: 1;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 12px;
}
.right-middle::before, .right-bottom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #29fcff, transparent);
}

/* 添加悬停效果 */
.left-top:hover, .left-middle:hover, .left-bottom:hover,
.center-top:hover, .center-bottom:hover,
.right-top:hover, .right-middle:hover, .right-bottom:hover {
  border-color: #29fcff;
  box-shadow: 0 8px 25px rgba(41, 252, 255, 0.3);
  transform: translateY(-3px);
}

/* 添加动画效果 */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 4px 25px rgba(41, 252, 255, 0.3);
  }
}

.left-top, .left-middle, .left-bottom,
.center-top, .center-bottom,
.right-top, .right-middle, .right-bottom {
  animation: glow 3s ease-in-out infinite;
  transition: all 0.3s ease;
}
</style>  