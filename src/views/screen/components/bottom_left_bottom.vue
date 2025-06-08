<template>
    <div class="box8">
      <div class="title">
        <p>数据统计</p>
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
    let option = {
      title: {
        text: '游客消费统计',
        textStyle: {
          color: 'white'
        }
      },
      radar: {
        indicator: [
          { name: '消费', max: 6500 },
          { name: '好感', max: 16000 },
          { name: '出行', max: 30000 },
          { name: '小吃', max: 38000 },
          { name: '爱好', max: 52000 },
          { name: '景点', max: 25000 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: '购物'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: '吃饭'
            }
          ]
        }
      ]
    };
    // 设置配置项
    mychart.setOption(option);
  });
  </script>
  <style scoped>
  .box8 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%; /* 添加内边距 */
    box-sizing: border-box; /* 包括内边距和边框在内的总宽度和高度 */
  }
  
  .box8 .title {
    display: flex;
    align-items: center; /* 垂直居中 */
    margin-bottom: 20px; /* 添加底部边距 */
  }
  
  .box8 .title p {
    color: white;
    font-size: 12px;
    margin-right: 10px; /* 添加右边距 */
  }
  
  .box8 .charts {
    height: calc(100% - 50px); /* 减去标题和内边距的高度 */
  }
  </style>