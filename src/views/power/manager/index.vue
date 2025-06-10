<template>
    <div>
        <p>管理者界面</p>
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="部门">
                    <el-select placeholder="请选择部门" style="width: 150px">
                        <el-option 
                            v-for="dept in departments" 
                            :key="dept" 
                            :label="dept" 
                            :value="dept"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="管理级别">
                    <el-select placeholder="请选择级别" style="width: 150px">
                        <el-option label="初级" value="junior"></el-option>
                        <el-option label="中级" value="middle"></el-option>
                        <el-option label="高级" value="senior"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">筛选</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <div class="header-actions">
                <el-button type="primary" size="default" @click="addManager" icon="Plus">新增管理者</el-button>
                <el-button type="warning" size="default" @click="exportData" icon="Download">导出数据</el-button>
                <el-button type="info" size="default" @click="printTable" icon="Printer">打印</el-button>
            </div>
            
            <!-- 展示管理者信息 -->
            <el-table 
                :data="currentPageData" 
                border 
                style="width: 100%"
                :row-class-name="tableRowClassName"
            >
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="工号" align="center" prop="employeeId"></el-table-column>
                <el-table-column label="姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="部门" align="center" prop="department"></el-table-column>
                <el-table-column label="职位" align="center" prop="position"></el-table-column>
                <el-table-column label="管理级别" align="center" prop="level">
                    <template #default="{row}">
                        <el-tag :type="getLevelTagType(row.level)">{{row.level}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下属人数" align="center" prop="subordinates"></el-table-column>
                <el-table-column label="入职时间" align="center" prop="joinDate" sortable></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #default="{ row }">
                        <el-button type="info" size="small" icon="View">查看</el-button>
                        <el-button type="primary" size="small" icon="Edit">编辑</el-button>
                        <el-button 
                            type="success" 
                            size="small" 
                            icon="Promotion"
                            @click="promoteManager(row)"
                            :disabled="row.level === '高级'"
                        >晋升</el-button>
                        <el-popconfirm 
                            title="确定要删除此管理者吗？" 
                            @confirm="confirmDelete(row.employeeId)"
                        >
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页器 -->
            <el-pagination 
                v-model:current-page="pageNo" 
                v-model:page-size="pageSize" 
                :page-sizes="[10, 20, 30, 50]" 
                :background="true" 
                layout="prev, pager, next, jumper, ->, sizes, total" 
                :total="ManagerData.length"
                @current-change="getHasRole" 
                @size-change="sizeChange" 
            />
        </el-card>
        
        <!-- 新增管理者对话框 -->
        <el-dialog v-model="dialogVisible" title="新增管理者" width="50%">
            <el-form :model="managerForm" label-width="120px">
                <el-form-item label="姓名">
                    <el-input v-model="managerForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="managerForm.department" placeholder="请选择部门">
                        <el-option 
                            v-for="dept in departments" 
                            :key="dept" 
                            :label="dept" 
                            :value="dept"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位">
                    <el-input v-model="managerForm.position" placeholder="请输入职位"></el-input>
                </el-form-item>
                <el-form-item label="管理级别">
                    <el-select v-model="managerForm.level" placeholder="请选择级别">
                        <el-option label="初级" value="初级"></el-option>
                        <el-option label="中级" value="中级"></el-option>
                        <el-option label="高级" value="高级"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入职时间">
                    <el-date-picker 
                        v-model="managerForm.joinDate" 
                        type="date" 
                        placeholder="选择日期"
                        style="width: 100%"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitManager">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { nanoid } from 'nanoid'
import { ref, reactive, computed } from 'vue'

const pageNo = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const departments = ['技术部', '产品部', '市场部', '人力资源部', '财务部', '运营部']

const ManagerData = reactive([
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '张总监',
        department: '技术部',
        position: '技术总监',
        level: '高级',
        subordinates: 15,
        joinDate: '2020-05-10'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '李经理',
        department: '产品部',
        position: '产品经理',
        level: '中级',
        subordinates: 8,
        joinDate: '2021-08-15'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '王主管',
        department: '市场部',
        position: '市场主管',
        level: '初级',
        subordinates: 5,
        joinDate: '2022-03-22'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '赵部长',
        department: '人力资源部',
        position: '人力资源部长',
        level: '高级',
        subordinates: 12,
        joinDate: '2019-11-05'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '钱科长',
        department: '财务部',
        position: '财务科长',
        level: '中级',
        subordinates: 6,
        joinDate: '2021-02-18'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '孙主任',
        department: '运营部',
        position: '运营主任',
        level: '初级',
        subordinates: 4,
        joinDate: '2022-07-30'
    },
    {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        name: '周经理',
        department: '技术部',
        position: '开发经理',
        level: '中级',
        subordinates: 10,
        joinDate: '2020-12-12'
    }
])

const managerForm = reactive({
    name: '',
    department: '',
    position: '',
    level: '初级',
    joinDate: '',
    subordinates: 0
})

const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return ManagerData.slice(start, end)
})

const sizeChange = (newSize) => {
    pageSize.value = newSize
}

const getHasRole = (newPage) => {
    pageNo.value = newPage
}

const addManager = () => {
    dialogVisible.value = true
}

const confirmDelete = (employeeId) => {
    const index = ManagerData.findIndex(mgr => mgr.employeeId === employeeId)
    if (index !== -1) {
        ManagerData.splice(index, 1)
    }
}

const submitManager = () => {
    const newManager = {
        employeeId: 'M'+nanoid(4).toUpperCase(),
        ...managerForm,
        subordinates: Math.floor(Math.random() * 10) + 1
    }
    ManagerData.push(newManager)
    dialogVisible.value = false
    // 重置表单
    Object.assign(managerForm, {
        name: '',
        department: '',
        position: '',
        level: '初级',
        joinDate: '',
        subordinates: 0
    })
}

const promoteManager = (row) => {
    const index = ManagerData.findIndex(mgr => mgr.employeeId === row.employeeId)
    if (index !== -1) {
        if (row.level === '初级') {
            ManagerData[index].level = '中级'
        } else if (row.level === '中级') {
            ManagerData[index].level = '高级'
        }
    }
}

const getLevelTagType = (level) => {
    switch(level) {
        case '初级': return ''
        case '中级': return 'warning'
        case '高级': return 'success'
        default: return 'info'
    }
}

const tableRowClassName = ({row}) => {
    if (row.level === '高级') {
        return 'senior-row'
    } else if (row.level === '中级') {
        return 'middle-row'
    }
    return ''
}

const exportData = () => {
    // 实际项目中这里会有导出逻辑
    ElMessage.success('导出数据功能将在实际项目中实现')
}

const printTable = () => {
    // 实际项目中这里会有打印逻辑
    ElMessage.success('打印功能将在实际项目中实现')
}
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

.header-actions {
    margin-bottom: 20px;
}

:deep(.senior-row) {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}
:deep(.middle-row) {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
</style>