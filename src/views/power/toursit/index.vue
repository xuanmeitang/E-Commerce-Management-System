<template>
    <div>
        <p>用户界面</p>
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="用户名">
                    <el-input placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research">搜索</el-button>
                    <el-button type="" size="default" @click="refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
            <el-button type="" size="default" @click="delUser">批量删除</el-button>
            <!-- 展示用户信息 -->
            <el-table :data="currentPageData">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="用户姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户昵称" align="center" prop="username" show-overflow-tooltip></el-table-column>
                <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createdTime"></el-table-column>
                <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="User" >分配权限</el-button>
                        <el-button type="primary" size="small" icon="Edit" >编辑</el-button>
                        <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" >
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="UserData.length"
                @current-change="getHasRole" @size-change="sizeChange" />
        </el-card>
        <el-drawer v-model="drawer">
            <template>
                <el-form></el-form>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { nanoid } from 'nanoid'
import { ref, reactive, computed } from 'vue'
const pageNo = ref(1);      // 当前页码
const pageSize = ref(3);   // 每页条数
const drawer = ref(false)

const UserData = reactive([
    {
        id: nanoid(3),
        createdTime: '2025-02-03',
        updateTime: '2025-03-04',
        username: 'xuanmeitang',
        name: '炫梅塘',
        password: '0000000',
        roleName: '前端开发工程师',
        phone: '10086'
    },
    {
        id: nanoid(3), // 唯一ID（需自行引入 nanoid 库）
        createdTime: '2025-01-15',
        updateTime: '2025-04-22',
        username: 'dev_lihua',
        name: '李华',
        password: '123456',
        roleName: '前端开发工程师',
        phone: '13800138001'
    },
    {
        id: nanoid(3),
        createdTime: '2025-02-10',
        updateTime: '2025-05-30',
        username: 'coder_zhang',
        name: '张明',
        password: 'abcdefg',
        roleName: '全栈工程师',
        phone: '15900215900'
    },
    {
        id: nanoid(3),
        createdTime: '2025-03-05',
        updateTime: '2025-06-18',
        username: 'design_wang',
        name: '王设计',
        password: 'qwerty',
        roleName: 'UI设计师',
        phone: '18600318600'
    },
    {
        id: nanoid(3),
        createdTime: '2025-01-28',
        updateTime: '2025-04-15',
        username: 'test_chen',
        name: '陈测试',
        password: 'test123',
        roleName: '测试工程师',
        phone: '18700418700'
    },
    {
        id: nanoid(3),
        createdTime: '2025-02-20',
        updateTime: '2025-05-10',
        username: 'pm_zhao',
        name: '赵经理',
        password: 'pm@2025',
        roleName: '产品经理',
        phone: '18800518800'
    }
])
const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return UserData.slice(start, end);
});
const sizeChange = (newSize) => {
    pageSize.value = newSize;
};

const getHasRole = (newPage) => {
    pageNo.value = newPage;

};

const addUser = () => { 
    drawer.value = true
}
const delUser = ()=> {}
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




