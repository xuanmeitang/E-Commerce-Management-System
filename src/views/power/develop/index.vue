<template>
    <div>
      <p>开发者界面</p>
      <el-card style="height: 80px;" class="search">
        <el-form class="form">
          <el-form-item label="开发者姓名">
            <el-input placeholder="请输入开发者姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="searchDevelopers">搜索</el-button>
            <el-button size="default" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <el-card class="content">
        <el-button type="primary" size="default" @click="addDeveloper">添加开发者</el-button>
        <el-button size="default" @click="deleteDevelopers">批量删除</el-button>
        <!-- 展示开发者信息 -->
        <el-table :data="currentPageDevelopers">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column type="index" align="center" label="#"></el-table-column>
          <el-table-column label="ID" align="center" prop="id"></el-table-column>
          <el-table-column label="开发者姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="开发者昵称" align="center" prop="nickname" show-overflow-tooltip></el-table-column>
          <el-table-column label="技术栈" align="center" prop="techStack" show-overflow-tooltip></el-table-column>
          <el-table-column label="加入时间" align="center" prop="joinTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="280px" align="center">
            <template #default="{ row }">
              <el-button type="primary" size="small" icon="Edit" @click="editDeveloper(row)">编辑</el-button>
              <el-popconfirm :title="`你确定要删除开发者 ${row.name} 吗?`" width="260px">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" @click="deleteDeveloper(row)">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="developersData.length"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { nanoid } from 'nanoid';
  import { ref, reactive, computed } from 'vue';
  
  const pageNo = ref(1); // 当前页码
  const pageSize = ref(3); // 每页条数
  
  const developersData = reactive([
    {
      id: nanoid(3),
      name: '张三',
      nickname: 'zhangsan',
      techStack: 'JavaScript, Vue.js',
      joinTime: '2023-01-01',
    },
    {
      id: nanoid(3),
      name: '李四',
      nickname: 'lisi',
      techStack: 'Python, Django',
      joinTime: '2023-02-01',
    },
    {
      id: nanoid(3),
      name: '王五',
      nickname: 'wangwu',
      techStack: 'Java, Spring Boot',
      joinTime: '2023-03-01',
    },
  ]);
  
  const currentPageDevelopers = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return developersData.slice(start, end);
  });
  
  const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
  };
  
  const handlePageChange = (newPage) => {
    pageNo.value = newPage;
  };
  
  const searchDevelopers = () => {
    // 模拟搜索功能
    console.log('搜索开发者');
  };
  
  const resetSearch = () => {
    // 模拟重置搜索功能
    console.log('重置搜索');
  };
  
  const addDeveloper = () => {
    // 模拟添加开发者功能
    console.log('添加开发者');
  };
  
  const deleteDevelopers = () => {
    // 模拟批量删除开发者功能
    console.log('批量删除开发者');
  };
  
  const editDeveloper = (row) => {
    // 模拟编辑开发者功能
    console.log(`编辑开发者: ${row.name}`);
  };
  
  const deleteDeveloper = (row) => {
    // 模拟删除开发者功能
    console.log(`删除开发者: ${row.name}`);
  };
  </script>
  
  <style scoped>
  .form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .content {
    margin-top: 20px;
  }
  
  .el-pagination {
    justify-content: flex-end;
    margin-top: 20px;
  }
  </style>