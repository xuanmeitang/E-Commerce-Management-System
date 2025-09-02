<template>
  <div class="dashboard-container">
    <!-- 顶部导航栏 -->
    

    <!-- 主内容区 -->
    <main class="dashboard-main">
      <!-- 数据概览卡片 -->
      <div class="overview-cards">
        <el-card v-for="(card, index) in overviewCards" :key="index" class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{backgroundColor: card.bgColor}">
              <component :is="getIconComponent(card.icon)" :style="{color: card.color}"></component>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{card.title}}</div>
              <div class="stat-value">{{card.value}}</div>
              <div :class="['stat-trend', card.trendType]">
                <component :is="card.trendType === 'up' ? 'ArrowUp' : 'ArrowDown'"></component> {{card.trend}}%
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
              <el-progress type="dashboard" :percentage="targetCompletion.percentage" :width="120" 
                :color="['#409EFF', '#67C23A']">
                <template #default>
                  <div class="progress-label">
                    <div class="value">{{targetCompletion.percentage}}%</div>
                    <div class="text">完成率</div>
                  </div>
                </template>
              </el-progress>
              <div class="progress-stats">
                <div class="stat-item">
                  <div class="label">目标</div>
                  <div class="value">{{targetCompletion.target}}</div>
                </div>
                <div class="stat-item">
                  <div class="label">已完成</div>
                  <div class="value">{{targetCompletion.completed}}</div>
                </div>
                <div class="stat-item">
                  <div class="label">剩余</div>
                  <div class="value">{{targetCompletion.remaining}}</div>
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
            <el-button type="primary">
              <el-icon><Plus /></el-icon>新增商品
            </el-button>
            <el-button type="success">
              <el-icon><Tickets /></el-icon>订单处理
            </el-button>
            <el-button type="warning">
              <el-icon><Promotion /></el-icon>营销活动
            </el-button>
            <el-button type="info">
              <el-icon><User /></el-icon>会员管理
            </el-button>
            <el-button type="danger">
              <el-icon><Warning /></el-icon>售后处理
            </el-button>
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

<script setup lang="ts">
import { ref, onMounted, onActivated, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getHomeData } from '@/api/home'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Tickets,
  Promotion,
  User,
  Warning,
  ShoppingCart,
  Money,
  View,
  ChatLineSquare,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

// 类型定义
interface OrderItem {
  id: string;
  customer: string;
  amount: string;
  status: string;
  time: string;
}

interface OverviewCard {
  title: string;
  value: string;
  trend: number;
  trendType: 'up' | 'down';
  icon: string;
  color: string;
  bgColor: string;
}

interface CategoryItem {
  value: number;
  name: string;
}

interface SalesChartData {
  xAxis: string[];
  series: {
    name: string;
    type: string;
    data: number[];
  }[];
}

interface TargetCompletion {
  percentage: number;
  target: string;
  completed: string;
  remaining: string;
}

// 响应式数据
const chartType = ref('day')
const salesChart = ref<HTMLElement | null>(null)
const categoryChart = ref<HTMLElement | null>(null)
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 使用ref创建响应式数据
const orderData = ref<OrderItem[]>([])
const overviewCards = ref<OverviewCard[]>([])
const categoryData = ref<CategoryItem[]>([])
const salesChartData = ref<SalesChartData>({
  xAxis: [],
  series: []
})
const targetCompletion = ref<TargetCompletion>({
  percentage: 0,
  target: '',
  completed: '',
  remaining: ''
})

// 获取状态类型
const getStatusType = (status: string): string => {
  const map: Record<string, string> = {
    '待付款': 'warning',
    '已付款': '',
    '已发货': 'success',
    '已完成': 'info',
    '已退款': 'danger'
  }
  return map[status] || ''
}

// 图标映射函数
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'el-icon-shopping-cart-full': ShoppingCart,
    'el-icon-coin': Money,
    'el-icon-user': User,
    'el-icon-view': View,
    'el-icon-chat-line-square': ChatLineSquare
  }
  return iconMap[iconName] || ShoppingCart
}

// 加载状态
const loading = ref(true)

// 默认数据，确保在数据加载前有内容显示
orderData.value = [
  { id: '加载中...', customer: '加载中...', amount: '加载中...', status: '加载中...', time: '加载中...' },
]
overviewCards.value = [
  { title: '今日订单', value: '0', trend: 0, trendType: 'up', icon: 'el-icon-shopping-cart-full', color: '#409EFF', bgColor: '#f0f7ff' },
  { title: '今日销售额', value: '¥0', trend: 0, trendType: 'up', icon: 'el-icon-coin', color: '#67C23A', bgColor: '#f0f9eb' },
  { title: '新增用户', value: '0', trend: 0, trendType: 'up', icon: 'el-icon-user', color: '#E6A23C', bgColor: '#fdf6ec' },
  { title: '总访问量', value: '0', trend: 0, trendType: 'up', icon: 'el-icon-view', color: '#F56C6C', bgColor: '#fef0f0' }
]

// 定义首页数据接口
interface HomeData {
  orderData: OrderItem[];
  overviewCards: OverviewCard[];
  categoryData: CategoryItem[];
  salesData: SalesChartData;
  targetCompletion: TargetCompletion;
}

// 加载数据的方法
const loadData = () => {
  loading.value = true
  console.log('开始加载首页数据')
  
  // 使用axios获取数据
  getHomeData().then((res: any) => {
    const data = res as HomeData;
    console.log('获取到首页数据:', data)
    // 设置数据
    orderData.value = data.orderData
    overviewCards.value = data.overviewCards
    categoryData.value = data.categoryData
    salesChartData.value = data.salesData
    targetCompletion.value = data.targetCompletion
    loading.value = false
    
    // 使用nextTick确保DOM已经更新
    nextTick(() => {
      // 初始化图表
      initCharts()
    })
  }).catch(err => {
    loading.value = false
    console.error('获取首页数据失败:', err)
    // 添加错误提示
    ElMessage.error('获取数据失败，请稍后重试')
  })
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})

// 组件激活时重新加载数据（用于路由切换后返回）
onActivated(() => {
  loadData()
})

// 初始化图表的方法
const initCharts = () => {
  if (!salesChart.value || !categoryChart.value) return
  
  // 初始化销售趋势图表
  const salesChartInstance = echarts.init(salesChart.value)
  salesChartInstance.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: salesChartData.value.series.map(item => item.name)
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
      data: salesChartData.value.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: salesChartData.value.series.map(item => ({
      name: item.name,
      type: item.type,
      smooth: true,
      data: item.data,
      itemStyle: {
        color: item.name === '销售额' ? '#409EFF' : '#67C23A'
      },
      ...(item.name === '销售额' ? {
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        }
      } : {})
    }))
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
        data: categoryData.value,
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
      }
    ]
  })

  // 响应式调整图表大小
  window.addEventListener('resize', () => {
    salesChartInstance.resize()
    categoryChartInstance.resize()
  })
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