<template>
  <div class="box">
    <div class="top">
      <span class="title">今日销售统计</span>
      <span class="bg"></span>
      <span class="right">目标销售额<span>1000000</span>元</span>
    </div>
    <div class="number">
      <span v-for="(item, index) in salesAmount" :key="index">{{ item }}</span>
    </div>
    <div class="order-info">
      <div class="order-item">
        <span class="label">今日订单:</span>
        <span class="value">{{ todayOrders }}笔</span>
      </div>
      <div class="order-item">
        <span class="label">完成率:</span>
        <span class="value">{{ completionRate }}%</span>
      </div>
    </div>
    <!-- 盒子将来echarts展示图形图标的节点 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
//水球图拓展插件
import 'echarts-liquidfill'
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
let salesAmount = ref('￥658,900');
let todayOrders = ref(1247);
let completionRate = ref(85.6);

//获取节点
let charts = ref();
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value);
  //设置实例的配置项
  mycharts.setOption({
      //标题组件
      title: {
          text: '销售完成度',
          textStyle: {
              color: '#29fcff',
              fontSize: 14
          },
          left: 'center',
          top: '10%'
      },
      //x|y轴组件
      xAxis: {},
      yAxis: {},
      //系列:决定你展示什么样的图形图标
      series: {
          type: 'liquidFill',//系列
          data: [0.659],//展示的数据 (65.9%)
          waveAnimation: true,//动画
          animationDuration: 3000,
          animationDurationUpdate: 1000,
          radius: '80%',//半径
          outline: {//外层边框颜色设置
              show: true,
              borderDistance: 8,
              itemStyle: {
                  color: '#29fcff',
                  borderColor: '#294D99',
                  borderWidth: 8,
                  shadowBlur: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.25)'
              }
          },
      },
      //布局组件
      grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
      }

  })
})
</script>

<style scoped>
.box {
  background: url(../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  padding: 10px; /* 添加内边距 */
}

.box .top {
  display: flex;
  align-items: center; /* 垂直居中 */
  margin-left: 20px;
  gap: 10px; /* 设置元素之间的间距 */
}

.box .top .title {
  color: white;
  font-size: 20px;
}

.box .top .bg {
  width: 68px;
  height: 7px;
  background: url(../images/dataScreen-title.png) no-repeat;
  background-size: 100% 100%;
}

.box .top .right {
  color: white;
  font-size: 20px;
}

.box .top .right span {
  color: yellowgreen;
}

.box .number {
  padding: 10px;
  margin-top: 20px; /* 减少顶部间距 */
  display: flex;
  gap: 5px; /* 设置元素之间的间距 */
}

.box .number span {
  flex: 1;
  height: 40px;
  text-align: center;
  line-height: 40px;
  background: url(../images/total.png) no-repeat;
  background-size: 100% 100%;
  color: #29fcff;
}

.box .order-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin-top: 10px;
}

.box .order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.box .order-item .label {
  color: #29fcff;
  font-size: 14px;
}

.box .order-item .value {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.box .charts {
  width: 100%;
  height: 200px;
  margin-top: 10px;
}
</style>