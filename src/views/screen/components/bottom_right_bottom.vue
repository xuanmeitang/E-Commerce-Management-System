<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../images/dataScreen-title.png" alt="">
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
// 引入echarts
import * as echarts from 'echarts';

let charts = ref(null);

// 组件挂载完毕初始化图形图标
onMounted(async () => {
  await nextTick();
  let mychart = echarts.init(charts.value);
  // 设置配置项
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: 30,
      top: 40,
      orient: 'vertical', // 图例组件方向的设置
      textStyle: {
        color: 'white',
        fontSize: 14
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white'
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' }
        ]
      }
    ],
    // 调整图形图标的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  };
  mychart.setOption(option);
});
</script>
<style scoped>
.box2 {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box; /* 包括内边距和边框在内的总宽度和高度 */
}

.box2 .title {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-bottom: 20px; /* 添加底部边距 */
}

.box2 .title p {
  color: white;
  font-size: 20px;
  margin-right: 10px; /* 添加右边距 */
}

.box2 .charts {
  height: calc(100% - 80px); /* 减去标题和内边距的高度 */
}
</style>