<template>
    <div class="box1">
      <div class="title">
        <p>男女比例</p>
        <img src="../images/dataScreen-title.png" alt="">
      </div>
      <div class="sex">
        <div class="man">
          <img src="../images/man.png" alt="">
        </div>
        <div class="women">
          <img src="../images/woman.png" alt="">
        </div>
      </div>
      <div class="rate">
        <p>男士58%</p>
        <p>女士42%</p>
      </div>
      <div class="charts" ref='charts'></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as echarts from 'echarts';
  //获取图形图标的DOM节点
  let charts = ref();
  onMounted(() => {
    //初始化echarts实例
    let mycharts = echarts.init(charts.value);
    //设置配置项
    mycharts.setOption({
      //组件标题
      title: {
        text: '男女比例',//主标题
        textStyle: {//主标题颜色
          color: 'skyblue'
        },
        left: '40%'
      },
      //x|y
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [58],
          barWidth: 20,
          z: 100,
          itemStyle: {
            color: 'skyblue',
            borderRadius: 20
          }
        }
        ,
        {
          type: 'bar',
          data: [100],
          barWidth: 20,
          //调整女士柱条位置
          barGap: '-100%',
          itemStyle: {
            color: 'pink',
            borderRadius: 20
          }
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    });
  })
  </script>
  
  <style scoped>
  .box1 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 10px 0;
    padding: 10px; /* 添加内边距 */
    box-sizing: border-box; /* 包括内边距和边框在内的总宽度和高度 */
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
  
  .box1 .sex {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  
  .box1 .sex .man,
  .box1 .sex .women {
    margin: 0 10px; /* 添加左右边距 */
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .box1 .sex .man {
    background: url(../images/man-bg.png) no-repeat;
  }
  
  .box1 .sex .women {
    background: url(../images/woman-bg.png) no-repeat;
  }
  
  .box1 .rate {
    display: flex;
    justify-content: space-between;
    color: white;
    margin-top: 10px;
  }
  
  .box1 .charts {
    height: 50px;
    margin-top: 20px; /* 添加顶部边距 */
  }
  </style>