<template>
  <div class="box">
    <div class="top">
      <span class="title">实时游客统计</span>
      <span class="bg"></span>
      <span class="right">可预约总量<span>99999</span>人</span>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 盒子将来echarts展示图形图标的节点 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
//水球图拓展插件
import 'echarts-liquidfill'
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
let people = ref('215908人');


//获取节点
let charts = ref();
onMounted(() => {
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value);
  //设置实例的配置项
  mycharts.setOption({
      //标题组件
      title: {
          text: '水球图'
      },
      //x|y轴组件
      xAxis: {},
      yAxis: {},
      //系列:决定你展示什么样的图形图标
      series: {
          type: 'liquidFill',//系列
          data: [0.6, 0.4, 0.2],//展示的数据
          waveAnimation: true,//动画
          animationDuration: 3,
          animationDurationUpdate: 0,
          radius: '100%',//半径
          outline: {//外层边框颜色设置
              show: true,
              borderDistance: 8,
              itemStyle: {
                  color: 'skyblue',
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

.box .charts {
  width: 100%;
  height: 270px;
  margin-top: 20px; /* 增加顶部间距 */
}
</style>