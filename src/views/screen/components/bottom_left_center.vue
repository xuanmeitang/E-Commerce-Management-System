<template>
    <div class="box1">
      <div class="title">
        <p>商品分类销售</p>
        <img src="../images/dataScreen-title.png" alt="">
      </div>
      <div class="category-list">
        <div class="category-item" v-for="(item, index) in categoryData" :key="index">
          <span class="category-name">{{ item.name }}</span>
          <span class="category-percent">{{ item.percent }}%</span>
        </div>
      </div>
      <div class="charts" ref='charts'></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  
  // 商品分类数据
  const categoryData = ref([
    { name: '电子产品', percent: 32.5 },
    { name: '服装鞋帽', percent: 28.3 },
    { name: '家居用品', percent: 18.7 },
    { name: '美妆护肤', percent: 12.8 },
    { name: '其他', percent: 7.7 }
  ]);
  
  //获取图形图标的DOM节点
  let charts = ref();
  onMounted(() => {
    // 等待DOM完全渲染
    setTimeout(() => {
      //初始化echarts实例
      let mycharts = echarts.init(charts.value);
    //设置配置项
    mycharts.setOption({
      //组件标题
      title: {
        text: '商品分类销售占比',//主标题
        textStyle: {//主标题颜色
          color: '#29fcff',
          fontSize: 11
        },
        left: 'center',
        top: '5px'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}% ({d}%)'
      },
      legend: {
        show: false
      },
      series: [
        {
          name: '商品分类',
          type: 'pie',
          radius: ['20%', '45%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            textStyle: {
              color: '#fff',
              fontSize: 10,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: '#29fcff'
            }
          },
          data: [
            { value: 32.5, name: '电子产品', itemStyle: { color: '#00d4ff' } },
            { value: 28.3, name: '服装鞋帽', itemStyle: { color: '#0099ff' } },
            { value: 18.7, name: '家居用品', itemStyle: { color: '#0066cc' } },
            { value: 12.8, name: '美妆护肤', itemStyle: { color: '#0033aa' } },
            { value: 7.7, name: '其他', itemStyle: { color: '#001177' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      grid: {
        left: '10%',
        top: '15%',
        right: '10%',
        bottom: '10%',
        containLabel: true
      }
    });
      
      // 监听窗口大小变化，自动调整图表大小
      window.addEventListener('resize', () => {
        mycharts.resize();
      });
    }, 100);
  })
  </script>
  
  <style scoped>
  .box1 {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 10px;
    box-sizing: border-box;
  }
  
  .box1 .title {
    margin-left: 10px;
    display: flex;
    align-items: center; /* 垂直居中 */
  }
  
  .box1 .title p {
    color: white;
    font-size: 10px;
    margin-right: 10px; /* 添加右边距 */
  }
  
  .box1 .category-list {
    position: absolute;
    top: 40px;
    left: 10px;
    right: 10px;
    height: 100px;
    overflow-y: auto;
  }
  
  .box1 .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    border-bottom: 1px solid rgba(41, 252, 255, 0.2);
  }
  
  .box1 .category-item:last-child {
    border-bottom: none;
  }
  
  .box1 .category-name {
    color: #29fcff;
    font-size: 12px;
  }
  
  .box1 .category-percent {
    color: #fff;
    font-size: 12px;
    font-weight: bold;
  }
  
  .box1 .charts {
    position: absolute;
    top: 150px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    min-height: 150px;
  }
  </style>