<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    

    <!-- 主内容区 -->
    <main class="dashboard-main">
      <!-- 数据概览卡片 -->
      <div class="overview-cards">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f7ff;">
              <i class="el-icon-shopping-cart-full" style="color: #409EFF;"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日订单</div>
              <div class="stat-value">1,248</div>
              <div class="stat-trend up">
                <i class="el-icon-top"></i> 12.5%
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f0f9eb;">
              <i class="el-icon-coin" style="color: #67C23A;"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">今日销售额</div>
              <div class="stat-value">¥86,540</div>
              <div class="stat-trend up">
                <i class="el-icon-top"></i> 8.3%
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fdf6ec;">
              <i class="el-icon-user" style="color: #E6A23C;"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">新增用户</div>
              <div class="stat-value">326</div>
              <div class="stat-trend down">
                <i class="el-icon-bottom"></i> 2.1%
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fef0f0;">
              <i class="el-icon-chat-line-square" style="color: #F56C6C;"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">待处理售后</div>
              <div class="stat-value">24</div>
              <div class="stat-trend up">
                <i class="el-icon-top"></i> 3.2%
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 图表区域 -->
      <div class="chart-area">
        <el-card class="main-chart" shadow="hover">
          <template #header>
            <div class="chart-header">
              <span>近30天销售趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="salesChart"></div>
        </el-card>

        <div class="side-charts">
          <el-card class="pie-chart" shadow="hover">
            <template #header>
              <span>商品类别占比</span>
            </template>
            <div class="chart-container" ref="categoryChart"></div>
          </el-card>

          <el-card class="progress-chart" shadow="hover">
            <template #header>
              <span>月度目标完成度</span>
            </template>
            <div class="progress-container">
              <el-progress type="dashboard" :percentage="75" :width="120" 
                :color="['#409EFF', '#67C23A']">
                <template #default>
                  <div class="progress-label">
                    <div class="value">75%</div>
                    <div class="text">完成率</div>
                  </div>
                </template>
              </el-progress>
              <div class="progress-stats">
                <div class="stat-item">
                  <div class="label">目标</div>
                  <div class="value">¥500,000</div>
                </div>
                <div class="stat-item">
                  <div class="label">已完成</div>
                  <div class="value">¥375,000</div>
                </div>
                <div class="stat-item">
                  <div class="label">剩余</div>
                  <div class="value">¥125,000</div>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <el-card shadow="hover">
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="action-buttons">
            <el-button type="primary" icon="el-icon-plus">新增商品</el-button>
            <el-button type="success" icon="el-icon-tickets">订单处理</el-button>
            <el-button type="warning" icon="el-icon-s-promotion">营销活动</el-button>
            <el-button type="info" icon="el-icon-user-solid">会员管理</el-button>
            <el-button type="danger" icon="el-icon-warning">售后处理</el-button>
          </div>
        </el-card>
      </div>

      <!-- 最近订单 -->
      <div class="recent-orders">
        <el-card shadow="hover">
          <template #header>
            <div class="table-header">
              <span>最近订单</span>
              <el-button type="text">查看全部</el-button>
            </div>
          </template>
          <el-table :data="orderData" style="width: 100%" height="300">
            <el-table-column prop="id" label="订单号" width="180"></el-table-column>
            <el-table-column prop="customer" label="客户" width="120"></el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{row}">
                <span style="color: #F56C6C;">¥{{row.amount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{row}">
                <el-tag :type="getStatusType(row.status)" effect="plain">
                  {{row.status}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="下单时间"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default>
                <el-button type="text" size="small">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

export default {
  setup() {
    const chartType = ref('day')
    const salesChart = ref(null)
    const categoryChart = ref(null)
    const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
    
    const orderData = ref([
      { id: '20230516001', customer: '张先生', amount: '568.00', status: '已付款', time: '2023-05-16 09:23:45' },
      { id: '20230515002', customer: '李女士', amount: '1299.00', status: '已发货', time: '2023-05-15 14:12:33' },
      { id: '20230515003', customer: '王先生', amount: '328.00', status: '已完成', time: '2023-05-15 11:45:21' },
      { id: '20230514004', customer: '赵女士', amount: '789.00', status: '待付款', time: '2023-05-14 18:30:15' },
      { id: '20230514005', customer: '刘先生', amount: '1560.00', status: '已退款', time: '2023-05-14 16:22:47' },
      { id: '20230513006', customer: '陈女士', amount: '432.00', status: '已发货', time: '2023-05-13 10:11:09' },
      { id: '20230512007', customer: '杨先生', amount: '899.00', status: '已完成', time: '2023-05-12 13:45:30' }
    ])

    const getStatusType = (status) => {
      const map = {
        '待付款': 'warning',
        '已付款': '',
        '已发货': 'success',
        '已完成': 'info',
        '已退款': 'danger'
      }
      return map[status] || ''
    }

    onMounted(() => {
      // 初始化销售趋势图表
      const salesChartInstance = echarts.init(salesChart.value)
      salesChartInstance.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售额', '订单量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Array.from({length: 30}, (_, i) => `${i+1}日`)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售额',
            type: 'line',
            smooth: true,
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 10000) + 5000),
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            }
          },
          {
            name: '订单量',
            type: 'line',
            smooth: true,
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 200) + 100),
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      })

      // 初始化商品类别图表
      const categoryChartInstance = echarts.init(categoryChart.value)
      categoryChartInstance.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: [
          {
            name: '商品类别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '电子产品' },
              { value: 735, name: '家居用品' },
              { value: 580, name: '服装服饰' },
              { value: 484, name: '食品饮料' },
              { value: 300, name: '其他' }
            ],
            color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
          }
        ]
      })

      // 响应式调整图表大小
      window.addEventListener('resize', () => {
        salesChartInstance.resize()
        categoryChartInstance.resize()
      })
    })

    return {
      chartType,
      salesChart,
      categoryChart,
      userAvatar,
      orderData,
      getStatusType
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.dashboard-header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.logo span {
  color: #409EFF;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px 0 12px;
  font-size: 14px;
}

.dashboard-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon i {
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

.chart-area {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .chart-area {
    grid-template-columns: 1fr;
  }
}

.main-chart, .pie-chart, .progress-chart {
  border-radius: 8px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.side-charts {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.progress-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 0;
}

.progress-label .value {
  font-size: 24px;
  font-weight: bold;
}

.progress-label .text {
  font-size: 12px;
  color: #909399;
}

.progress-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-item .value {
  font-size: 16px;
  font-weight: bold;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>