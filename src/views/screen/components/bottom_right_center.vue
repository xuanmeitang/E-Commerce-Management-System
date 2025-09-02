<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../images/dataScreen-title.png" alt="">
    </div>
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
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white'
      }
    },
    xAxis: {
      type: 'category',
      data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
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
    grid: {
      left: 20,
      top: 20,
      right: 20,
      bottom: 20
    },
    series: [
      {
        type: 'scatter',
        data: [
          [0, 33],
          [1, 88],
          [2, 21],
          [3, 9],
          [4, 88],
          [5, 234],
          [6, 113],
          [7, 1231]
        ],
        // 标记图形设置
        symbol: 'diamond',
        symbolSize: 16,
        // 图文标签
        label: {
          show: true,
          position: 'top',
          color: 'red'
        },
        // 散点图标记的颜色
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'red' }, // 0% 处的颜色
              { offset: 1, color: 'blue' } // 100% 处的颜色
            ],
            global: false // 缺省为 false
          }
        }
      }
    ]
  });
});
</script>
<style scoped>
.box7 {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

.box7 .title {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-bottom: 20px; /* 添加底部边距 */
}

.box7 .title p {
  color: white;
  font-size: 18px;
  margin-right: 10px;
}

.box7 .charts {
  height: calc(100% - 60px); 
}
</style>