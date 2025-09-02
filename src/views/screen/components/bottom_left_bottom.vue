<template>
    <div class="box8">
      <div class="title">
        <p>热销商品排行</p>
        <img src="../images/dataScreen-title.png" alt="">
      </div>
      <div class="product-list">
        <div class="product-item" v-for="(item, index) in hotProducts" :key="index">
          <div class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
          <div class="product-info">
            <div class="product-name">{{ item.name }}</div>
            <div class="sales-count">销量: {{ item.sales }}</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // 热销商品数据
  const hotProducts = ref([
    { name: 'iPhone 15 Pro', sales: '12,580件' },
    { name: '运动鞋 Nike Air', sales: '8,967件' },
    { name: '无线耳机AirPods', sales: '7,234件' },
    { name: '智能手表', sales: '6,123件' },
    { name: '美容仪', sales: '5,456件' }
  ]);
  </script>
  <style scoped>
  .box8 {
    width: 100%;
    height: 100%;
    background: url(../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
  }
  
  .box8 .title {
    display: flex;
    align-items: center; 
    margin-bottom: 20px; 
  }
  
  .box8 .title p {
    color: white;
    font-size: 12px;
    margin-right: 10px; 
  }
  
  .box8 .product-list {
    padding: 10px;
    height: calc(100% - 60px);
    overflow-y: auto;
  }
  
  .box8 .product-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(41, 252, 255, 0.2);
  }
  
  .box8 .product-item:last-child {
    border-bottom: none;
  }
  
  .box8 .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    margin-right: 10px;
    color: #fff;
  }
  
  .box8 .rank-1 {
    background: linear-gradient(45deg, #FFD700, #FFA500);
  }
  
  .box8 .rank-2 {
    background: linear-gradient(45deg, #C0C0C0, #A9A9A9);
  }
  
  .box8 .rank-3 {
    background: linear-gradient(45deg, #CD7F32, #B8860B);
  }
  
  .box8 .rank-4,
  .box8 .rank-5 {
    background: linear-gradient(45deg, #29fcff, #0099ff);
  }
  
  .box8 .product-info {
    flex: 1;
  }
  
  .box8 .product-name {
    color: #29fcff;
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .box8 .sales-count {
    color: #fff;
    font-size: 10px;
    opacity: 0.8;
  }
  </style>