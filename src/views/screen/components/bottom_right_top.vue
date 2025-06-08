<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../images/dataScreen-title.png" alt="">
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, nextTick } from 'vue';

// 获取DOM节点
let charts = ref(null);

// 组件挂载完毕
onMounted(async () => {
  await nextTick();
  // 初始化echarts实例
  let mychart = echarts.init(charts.value);
  // 设置配置项
  mychart.setOption({
    // 标题组件
    title: {
      text: '景区排行',
      subtext: "各大景区排行",
      left: '50%',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      },
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16
      }
    },
    // x|y轴组件
    xAxis: {
      type: 'category',
      data: ['景区1', '景区2', '景区3', '景区4', '景区5', '景区6', '景区7'],
      axisLine: {
        show: true,
        lineStyle: {
          color: 'white'
        }
      },
      axisTick: {
        show: true,
        color: 'white'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: 'white'
        }
      },
      axisTick: {
        show: true,
        color: 'white'
      },
      splitLine: {
        show: false
      }
    },
    // 布局组件
    grid: {
      left: 20,
      bottom: 20,
      right: 20
    },
    // 系列:决定显示图形图标是哪一种的
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        label: {
          show: true,
          position: 'insideTop',
          color: 'yellowgreen'
        },
        showBackground: true,
        backgroundStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'black' },
              { offset: 1, color: 'blue' }
            ],
            global: false
          }
        },
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: function (data: any) {
            let arr = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'hotpink', 'skyblue'];
            return arr[data.dataIndex];
          }
        }
      },
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 90],
        smooth: true,
        lineStyle: {
          color: 'yellowgreen'
        }
      }
    ],
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)'
    }
  });
});
</script>
<style scoped>
.box6 {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
  /* 包括内边距和边框在内的总宽度和高度 */
}

.box6 .title {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  margin-bottom: 20px;
  /* 添加底部边距 */
}

.box6 .title p {
  color: white;
  font-size: 20px;
  margin-right: 10px;
  /* 添加右边距 */
}

.box6 .charts {
  height: calc(100% - 60px);
  /* 减去标题和内边距的高度 */
}
</style>