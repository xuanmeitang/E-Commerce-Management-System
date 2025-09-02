<template>
  <div class="box4">
    <div class="title">
      <span class="title-text">销售趋势分析</span>
      <div class="time-tabs">
        <span 
          v-for="tab in timeTabs" 
          :key="tab.value"
          :class="['tab-item', { active: activeTab === tab.value }]"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </span>
      </div>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

// 获取DOM元素
let charts = ref(null);
let mychart: echarts.ECharts | null = null;

// 时间选项卡
const timeTabs = ref([
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' }
]);

const activeTab = ref('today');

// 模拟数据
const salesData = {
  today: {
    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    sales: [120, 200, 150, 800, 700, 1100, 900],
    orders: [20, 35, 28, 120, 98, 156, 128]
  },
  week: {
    categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    sales: [3200, 4100, 3800, 5200, 4900, 6800, 7200],
    orders: [245, 312, 289, 398, 367, 456, 523]
  },
  month: {
    categories: ['第1周', '第2周', '第3周', '第4周'],
    sales: [18500, 22300, 19800, 26700],
    orders: [1245, 1567, 1398, 1876]
  }
};

// 切换时间选项卡
const switchTab = (value: string) => {
  activeTab.value = value;
  updateChart();
};

// 更新图表
const updateChart = () => {
  if (!mychart) return;
  
  const currentData = salesData[activeTab.value as keyof typeof salesData];
  
  mychart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#29fcff',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      data: ['销售额', '订单数'],
      textStyle: {
        color: '#29fcff'
      },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: currentData.categories,
      axisLine: {
        lineStyle: {
          color: '#29fcff'
        }
      },
      axisLabel: {
        color: '#29fcff',
        fontSize: 10
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#29fcff'
          }
        },
        axisLabel: {
          color: '#29fcff',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(41, 252, 255, 0.2)'
          }
        }
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#ff6b6b'
          }
        },
        axisLabel: {
          color: '#ff6b6b',
          fontSize: 10
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        smooth: true,
        data: currentData.sales,
        itemStyle: {
          color: '#29fcff'
        },
        lineStyle: {
          color: '#29fcff',
          width: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(41, 252, 255, 0.3)' },
              { offset: 1, color: 'rgba(41, 252, 255, 0.1)' }
            ]
          }
        }
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        yAxisIndex: 1,
        data: currentData.orders,
        itemStyle: {
          color: '#ff6b6b'
        },
        lineStyle: {
          color: '#ff6b6b',
          width: 2
        }
      }
    ]
  });
};

onMounted(async () => {
  await nextTick();
  mychart = echarts.init(charts.value);
  updateChart();
});
</script>
<style scoped>
.box4 {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  padding: 10px;
  box-sizing: border-box;
}

.box4 .title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.box4 .title-text {
  color: #29fcff;
  font-size: 14px;
  font-weight: bold;
}

.box4 .time-tabs {
  display: flex;
  gap: 10px;
}

.box4 .tab-item {
  padding: 4px 12px;
  background: rgba(41, 252, 255, 0.1);
  border: 1px solid rgba(41, 252, 255, 0.3);
  border-radius: 4px;
  color: #29fcff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.box4 .tab-item:hover {
  background: rgba(41, 252, 255, 0.2);
}

.box4 .tab-item.active {
  background: #29fcff;
  color: #000;
}

.box4 .charts {
  height: calc(100% - 50px);
}
</style>