<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <div class="top-left">
          <div class="left-button" @click="goHome"><span>首页</span></div>
        </div>
        <div class="top-center">
          <div class="center-title">指挥旅游可视化数据中心</div>
        </div>
        <div class="top-right">
          <div class="right-button">
            <span>统计报告</span>
          </div> 
          <span class="time">{{ formattedTime }}</span>
        </div>
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

//获取时间
let currentTime = new Date();
let formattedTime = currentTime.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
}).replace(/\//g, '-').replace(/,/, '');

//解决自适应问题
function updateTransform() {
  if (screen.value) {
    const scale = getScale()
    screen.value.style.transform = `scale(${scale}) translate(-50%, -50%)`
  }
}
onMounted(() => {
  updateTransform()
  window.addEventListener('resize', updateTransform)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateTransform)
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
  background:url(./images/bg.png) no-repeat;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
}

.screen {
  position: fixed;
  width: 1920px;
  height: 1080px;

  left: 50%;
  top: 50%;
  transform-origin: 0 0;  /* 关键修改点 */
  transform: translate(-50%, -50%);  /* 初始变换 */
}
.top {
  width:100%;
  height:50px;
  display:flex;
  position :relative;
}
.top-left {
  flex :1;
  background:url(./images/dataScreen-header-left-bg.png) no-repeat ;
  background-size :cover;
  padding-top : 5px;
}
.top-center{
  flex :2;
  background:url(./images/dataScreen-header-center-bg.png) no-repeat;
  background-size :cover;
}
.top-right{
  flex:1;
  background:url(./images/dataScreen-header-right-bg.png) no-repeat;
  background-size :cover;
}
.left-button{
  width:150px;
  height :50px;
  float:right;
  background: url(./images/dataScreen-header-btn-bg-r.png) no-repeat;
  text-align: center;
  line-height: 50px;
  color:#29fcff;
  font-size: 20x;

}
.right-button{
  width:150px;
  height :50px;
  float:left;
  background: url(./images/dataScreen-header-btn-bg-l.png) no-repeat;
  text-align: center;
  line-height: 50px;
  color:#29fcff;
  font-size: 20x;
}
.center-title  {
  background:url(./images/dataScreen-header-center-bg.png) no-repeat;
  background-size : 100% 100%;
  align-items: center;
  width:100%;
  height: 74px;
  font-size: 30px;
  text-align: center;
  line-height: 74px;
  color:#29fcff;
}
.time {
  color:#29fcff;
  line-height: 50px;
  font-size: 20px;
  float:right;
  padding-right : 30px;
}
.bottom {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  gap: 10px;
}

/* 左侧盒子（1:2:1比例） */
.bottom-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.left-top {
  flex: 1.5; /* 占左侧总高度的1.5/3.5 */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
  max-width: 100%; /* 或者具体的像素值 */
  max-height: 100%;
  overflow: hidden;
}
.left-middle, .left-bottom {
  flex: 1; /* 各占1/3.5 */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
}

/* 中间盒子（7:3比例） */
.bottom-center {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.center-top {
  flex: 7; /* 70% */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
}
.center-bottom {
  flex: 3; /* 30% */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
}

/* 右侧盒子（1.5:1:1比例） */
.bottom-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.right-top {
  flex: 1.5; /* 占右侧总高度的1.5/3.5 */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
}
.right-middle, .right-bottom {
  flex: 1; /* 各占1/3.5 */
  background: rgba(0, 92, 169, 0.3);
  border: 1px dashed #29fcff;
}
</style>  