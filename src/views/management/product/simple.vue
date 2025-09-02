<template>
  <div>
    <h1>商品管理页面</h1>
    <el-card>
      <el-table :data="products" style="width: 100%">
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { name: 'iPhone 15', price: 7999 },
  { name: 'MacBook Pro', price: 15999 }
])

console.log('简化商品管理页面加载成功')
</script>

<style scoped>
h1 {
  color: #409eff;
  margin-bottom: 20px;
}
</style>
