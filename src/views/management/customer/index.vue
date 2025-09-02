<template>
    <div>
        <div class="page-header">
            <h2>客户管理</h2>
            <p>管理电商平台的客户信息和会员等级</p>
        </div>
        
        <el-card style="height: 100px;" class="search">
            <el-form class="form">
                <el-form-item label="客户姓名">
                    <el-input placeholder="请输入客户姓名" v-model="searchData.customerName" @keyup.enter="research"></el-input>
                </el-form-item>
                <el-form-item label="会员等级">
                    <el-select v-model="searchData.memberLevel" placeholder="请选择会员等级" style="width: 150px" clearable>
                        <el-option label="普通会员" value="普通会员"></el-option>
                        <el-option label="银牌会员" value="银牌会员"></el-option>
                        <el-option label="金牌会员" value="金牌会员"></el-option>
                        <el-option label="钻石会员" value="钻石会员"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间">
                    <el-date-picker v-model="searchData.registerDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">搜索</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <div class="header-actions">
                <el-button type="primary" size="default" @click="addCustomer" icon="Plus">添加客户</el-button>
                <el-button type="success" size="default" @click="exportCustomers" icon="Download">导出客户</el-button>
                <el-button type="warning" size="default" @click="batchUpgrade" icon="Top">批量升级</el-button>
            </div>
            
            <!-- 展示客户信息 -->
            <el-table :data="currentPageData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="客户ID" align="center" prop="customerId" width="100"></el-table-column>
                <el-table-column label="客户姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="手机号" align="center" prop="phone" show-overflow-tooltip></el-table-column>
                <el-table-column label="邮箱" align="center" prop="email" show-overflow-tooltip></el-table-column>
                <el-table-column label="会员等级" align="center" prop="memberLevel">
                    <template #default="{ row }">
                        <el-tag :type="getMemberLevelType(row.memberLevel)">{{ row.memberLevel }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="消费金额" align="center" prop="totalSpent" sortable>
                    <template #default="{ row }">
                        <span style="color: #f56c6c; font-weight: bold;">￥{{ row.totalSpent.toLocaleString() }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单数量" align="center" prop="orderCount" sortable></el-table-column>
                <el-table-column label="注册时间" align="center" prop="registerTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="最后登录" align="center" prop="lastLogin" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" align="center" prop="status">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" active-text="正常" inactive-text="禁用" @change="toggleCustomerStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="View" @click="viewCustomer(row)">查看</el-button>
                        <el-button type="success" size="small" icon="Edit" @click="editCustomer(row)">编辑</el-button>
                        <el-button type="warning" size="small" icon="Top" @click="upgradeMember(row)">升级</el-button>
                        <el-popconfirm :title="`确定要删除客户 ${row.name} 吗？`" width="200px" @confirm="deleteCustomer(row.customerId)">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total"
                :total="totalCount" @current-change="getHasRole" @size-change="sizeChange" />
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

const CustomerData = reactive([
    {
        customerId: 'C' + nanoid(6),
        name: '张三',
        phone: '13812345678',
        email: 'zhangsan@email.com',
        memberLevel: '金牌会员',
        totalSpent: 15680,
        orderCount: 23,
        registerTime: '2023-01-15',
        lastLogin: '2025-08-30',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '李四',
        phone: '13987654321',
        email: 'lisi@email.com',
        memberLevel: '银牌会员',
        totalSpent: 8950,
        orderCount: 15,
        registerTime: '2023-03-22',
        lastLogin: '2025-08-29',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '王五',
        phone: '13765432109',
        email: 'wangwu@email.com',
        memberLevel: '钻石会员',
        totalSpent: 32450,
        orderCount: 45,
        registerTime: '2022-11-08',
        lastLogin: '2025-08-31',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '赵六',
        phone: '13654321098',
        email: 'zhaoliu@email.com',
        memberLevel: '普通会员',
        totalSpent: 2340,
        orderCount: 8,
        registerTime: '2024-05-12',
        lastLogin: '2025-08-28',
        status: false
    },
    {
        customerId: 'C' + nanoid(6),
        name: '孙七',
        phone: '13543210987',
        email: 'sunqi@email.com',
        memberLevel: '金牌会员',
        totalSpent: 18750,
        orderCount: 31,
        registerTime: '2023-07-19',
        lastLogin: '2025-08-30',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '周八',
        phone: '13432109876',
        email: 'zhouba@email.com',
        memberLevel: '银牌会员',
        totalSpent: 6780,
        orderCount: 12,
        registerTime: '2024-02-03',
        lastLogin: '2025-08-27',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '吴九',
        phone: '13321098765',
        email: 'wujiu@email.com',
        memberLevel: '钻石会员',
        totalSpent: 45230,
        orderCount: 67,
        registerTime: '2022-08-14',
        lastLogin: '2025-08-31',
        status: true
    },
    {
        customerId: 'C' + nanoid(6),
        name: '郑十',
        phone: '13210987654',
        email: 'zhengshi@email.com',
        memberLevel: '普通会员',
        totalSpent: 1250,
        orderCount: 3,
        registerTime: '2024-06-25',
        lastLogin: '2025-08-26',
        status: true
    }
])

const sizeChange = (newSize) => {
    pageSize.value = newSize;
};

const getHasRole = (newPage) => {
    pageNo.value = newPage;

};

// 客户管理相关方法
const selectedCustomers = ref([])

const addCustomer = () => {
    drawer.value = true
}

const exportCustomers = () => {
    ElMessage.success('客户数据导出成功！')
}

const batchUpgrade = () => {
    if (selectedCustomers.value.length === 0) {
        ElMessage.warning('请选择要升级的客户')
        return
    }
    ElMessage.success(`成功升级 ${selectedCustomers.value.length} 位客户的会员等级`)
}

const handleSelectionChange = (selection) => {
    selectedCustomers.value = selection
}

const viewCustomer = (row) => {
    ElMessage.info(`查看客户：${row.name}`)
}

const editCustomer = (row) => {
    ElMessage.info(`编辑客户：${row.name}`)
}

const upgradeMember = (row) => {
    const levels = ['普通会员', '银牌会员', '金牌会员', '钻石会员']
    const currentIndex = levels.indexOf(row.memberLevel)
    if (currentIndex < levels.length - 1) {
        row.memberLevel = levels[currentIndex + 1]
        ElMessage.success(`${row.name} 已升级为 ${row.memberLevel}`)
    } else {
        ElMessage.warning('已是最高等级会员')
    }
}

const deleteCustomer = (customerId) => {
    const index = CustomerData.findIndex(item => item.customerId === customerId)
    if (index > -1) {
        const customerName = CustomerData[index].name
        CustomerData.splice(index, 1)
        ElMessage.success(`客户 ${customerName} 删除成功`)
    }
}

const toggleCustomerStatus = (row) => {
    const status = row.status ? '启用' : '禁用'
    ElMessage.success(`客户 ${row.name} 已${status}`)
}

const getMemberLevelType = (level) => {
    const typeMap = {
        '普通会员': '',
        '银牌会员': 'info',
        '金牌会员': 'warning',
        '钻石会员': 'danger'
    }
    return typeMap[level] || ''
}

//实现搜索功能
const searchData = reactive({
    customerName: '',
    memberLevel: '',
    registerDate: null
})

//重置搜索条件
const refresh = () => {
    searchData.customerName = ''
    searchData.memberLevel = ''
    searchData.registerDate = null
    pageNo.value = 1
}

//执行搜索
const research = () => {
    pageNo.value = 1
}

// 筛选后的数据
const filteredData = computed(() => {
    return CustomerData.filter(item => {
        // 客户姓名筛选
        if (searchData.customerName && !item.name.toLowerCase().includes(searchData.customerName.toLowerCase())) {
            return false
        }
        // 会员等级筛选
        if (searchData.memberLevel && item.memberLevel !== searchData.memberLevel) {
            return false
        }
        // 注册时间筛选
        if (searchData.registerDate && searchData.registerDate.length === 2) {
            const registerTime = new Date(item.registerTime)
            const startDate = new Date(searchData.registerDate[0])
            const endDate = new Date(searchData.registerDate[1])
            if (registerTime < startDate || registerTime > endDate) {
                return false
            }
        }
        return true
    })
})

// 当前页显示的数据
const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(start, end);
});

// 总数据量（用于分页）
const totalCount = computed(() => filteredData.value.length);
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
