<template>
    <div>
        <!-- 搜索表单 -->
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="用户名称">
                    <el-input placeholder="请输入用户名称" v-model="searchData.userName" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="用户角色">
                    <el-select placeholder="请选择角色" style="width: 200px" v-model="searchData.userRole">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="超级管理员" value="super_admin"></el-option>
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                        <el-option label="客服" value="service"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-select placeholder="请选择状态" style="width: 150px" v-model="searchData.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用" value="enabled"></el-option>
                        <el-option label="禁用" value="disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">搜索</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" size="default" @click="addUser" icon="Plus">添加用户</el-button>
            <el-button type="success" size="default" @click="exportUsers" icon="Download">导出用户</el-button>
            <el-button type="danger" size="default" @click="batchDelete" icon="Delete">批量删除</el-button>
            
            <!-- 用户权限表格 -->
            <el-table :data="currentPageData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="用户ID" align="center" prop="id" width="120"></el-table-column>
                <el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip></el-table-column>
                <el-table-column label="真实姓名" align="center" prop="realName" show-overflow-tooltip></el-table-column>
                <el-table-column label="邮箱" align="center" prop="email" show-overflow-tooltip></el-table-column>
                <el-table-column label="手机号" align="center" prop="phone" width="120"></el-table-column>
                <el-table-column label="用户角色" align="center" prop="role" width="120">
                    <template #default="{row}">
                        <el-tag :type="getRoleTypeColor(row.role)">{{getRoleTypeText(row.role)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="部门" align="center" prop="department" show-overflow-tooltip></el-table-column>
                <el-table-column label="最后登录" align="center" prop="lastLogin" width="150"></el-table-column>
                <el-table-column label="状态" align="center" prop="status" width="80">
                    <template #default="{row}">
                        <el-switch v-model="row.status" active-value="enabled" inactive-value="disabled" @change="toggleUserStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="150"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template #default="{row}">
                        <el-button type="primary" size="small" icon="View" @click="viewUser(row)">查看</el-button>
                        <el-button type="success" size="small" icon="Edit" @click="editUser(row)">编辑</el-button>
                        <el-button type="warning" size="small" icon="Key" @click="resetPassword(row)">重置密码</el-button>
                        <el-button type="danger" size="small" icon="Delete" @click="deleteUser(row)">删除</el-button>
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
                :total="filteredData.length" 
                @current-change="getHasRole" 
                @size-change="sizeChange" 
            />
        </el-card>

        <!-- 添加/编辑用户抽屉 -->
        <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑用户' : '添加用户'" size="40%">
            <el-form :model="userForm" label-width="120px" :rules="formRules" ref="userFormRef">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="userForm.realName" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="role">
                    <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
                        <el-option label="超级管理员" value="super_admin"></el-option>
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="普通用户" value="user"></el-option>
                        <el-option label="客服" value="service"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="department">
                    <el-select v-model="userForm.department" placeholder="请选择部门" style="width: 100%">
                        <el-option label="技术部" value="技术部"></el-option>
                        <el-option label="产品部" value="产品部"></el-option>
                        <el-option label="市场部" value="市场部"></el-option>
                        <el-option label="人力资源部" value="人力资源部"></el-option>
                        <el-option label="财务部" value="财务部"></el-option>
                        <el-option label="运营部" value="运营部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态" prop="status">
                    <el-switch v-model="userForm.status" active-value="enabled" inactive-value="disabled" active-text="启用" inactive-text="禁用"></el-switch>
                </el-form-item>
                <el-form-item v-if="!isEdit" label="初始密码" prop="password">
                    <el-input v-model="userForm.password" type="password" placeholder="请输入初始密码" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitUser">{{isEdit ? '更新' : '添加'}}</el-button>
                    <el-button @click="closeDrawer">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { nanoid } from 'nanoid'
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const pageNo = ref(1)
const pageSize = ref(10)
const drawerVisible = ref(false)
const isEdit = ref(false)
const selectedUsers = ref([])
const userFormRef = ref()

// 搜索数据
const searchData = reactive({
    userName: '',
    userRole: '',
    status: ''
})

// 用户表单数据
const userForm = reactive({
    id: '',
    username: '',
    realName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'enabled',
    password: ''
})

// 表单验证规则
const formRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }],
    password: [{ required: true, message: '请输入初始密码', trigger: 'blur' }]
}

// 用户数据
const UserData = reactive([
    {
        id: 'U' + nanoid(6),
        username: 'admin',
        realName: '系统管理员',
        email: 'admin@company.com',
        phone: '13800138000',
        role: 'super_admin',
        department: '技术部',
        lastLogin: '2024-01-15 10:30:00',
        status: 'enabled',
        createTime: '2023-01-01 09:00:00'
    },
    {
        id: 'U' + nanoid(6),
        username: 'zhangsan',
        realName: '张三',
        email: 'zhangsan@company.com',
        phone: '13800138001',
        role: 'admin',
        department: '产品部',
        lastLogin: '2024-01-15 09:15:00',
        status: 'enabled',
        createTime: '2023-03-15 14:20:00'
    },
    {
        id: 'U' + nanoid(6),
        username: 'lisi',
        realName: '李四',
        email: 'lisi@company.com',
        phone: '13800138002',
        role: 'user',
        department: '市场部',
        lastLogin: '2024-01-14 16:45:00',
        status: 'enabled',
        createTime: '2023-05-20 11:30:00'
    },
    {
        id: 'U' + nanoid(6),
        username: 'wangwu',
        realName: '王五',
        email: 'wangwu@company.com',
        phone: '13800138003',
        role: 'service',
        department: '运营部',
        lastLogin: '2024-01-15 08:20:00',
        status: 'enabled',
        createTime: '2023-07-10 16:45:00'
    },
    {
        id: 'U' + nanoid(6),
        username: 'zhaoliu',
        realName: '赵六',
        email: 'zhaoliu@company.com',
        phone: '13800138004',
        role: 'user',
        department: '财务部',
        lastLogin: '2024-01-12 14:30:00',
        status: 'disabled',
        createTime: '2023-09-05 10:15:00'
    },
    {
        id: 'U' + nanoid(6),
        username: 'sunqi',
        realName: '孙七',
        email: 'sunqi@company.com',
        phone: '13800138005',
        role: 'admin',
        department: '人力资源部',
        lastLogin: '2024-01-14 11:20:00',
        status: 'enabled',
        createTime: '2023-11-12 09:40:00'
    }
])

// 计算属性 - 筛选数据
const filteredData = computed(() => {
    return UserData.filter(item => {
        const matchName = !searchData.userName || item.realName.includes(searchData.userName) || item.username.includes(searchData.userName)
        const matchRole = !searchData.userRole || item.role === searchData.userRole
        const matchStatus = !searchData.status || item.status === searchData.status
        return matchName && matchRole && matchStatus
    })
})

// 计算属性 - 当前页数据
const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

// 分页相关方法
const sizeChange = (newSize) => {
    pageSize.value = newSize
}

const getHasRole = (newPage) => {
    pageNo.value = newPage
}

// 角色类型颜色
const getRoleTypeColor = (role) => {
    switch (role) {
        case 'super_admin': return 'danger'
        case 'admin': return 'warning'
        case 'user': return 'primary'
        case 'service': return 'success'
        default: return 'info'
    }
}

// 角色类型文本
const getRoleTypeText = (role) => {
    switch (role) {
        case 'super_admin': return '超级管理员'
        case 'admin': return '管理员'
        case 'user': return '普通用户'
        case 'service': return '客服'
        default: return '未知'
    }
}

// 添加用户
const addUser = () => {
    isEdit.value = false
    resetForm()
    drawerVisible.value = true
}

// 编辑用户
const editUser = (row) => {
    isEdit.value = true
    Object.assign(userForm, { ...row, password: '' })
    drawerVisible.value = true
}

// 查看用户
const viewUser = (row) => {
    ElMessageBox.alert(`
        <div style="text-align: left;">
            <p><strong>用户ID：</strong>${row.id}</p>
            <p><strong>用户名：</strong>${row.username}</p>
            <p><strong>真实姓名：</strong>${row.realName}</p>
            <p><strong>邮箱：</strong>${row.email}</p>
            <p><strong>手机号：</strong>${row.phone}</p>
            <p><strong>角色：</strong>${getRoleTypeText(row.role)}</p>
            <p><strong>部门：</strong>${row.department}</p>
            <p><strong>状态：</strong>${row.status === 'enabled' ? '启用' : '禁用'}</p>
            <p><strong>最后登录：</strong>${row.lastLogin}</p>
            <p><strong>创建时间：</strong>${row.createTime}</p>
        </div>
    `, '用户详情', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
    })
}

// 重置密码
const resetPassword = (row) => {
    ElMessageBox.confirm('确定要重置该用户的密码吗？', '重置密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        ElMessage.success(`用户 ${row.realName} 的密码已重置为：123456`)
    })
}

// 删除用户
const deleteUser = (row) => {
    ElMessageBox.confirm('确定要删除该用户吗？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        const index = UserData.findIndex(item => item.id === row.id)
        if (index > -1) {
            UserData.splice(index, 1)
            ElMessage.success('删除成功')
        }
    })
}

// 切换用户状态
const toggleUserStatus = (row) => {
    const statusText = row.status === 'enabled' ? '启用' : '禁用'
    ElMessage.success(`用户 ${row.realName} 已${statusText}`)
}

// 多选处理
const handleSelectionChange = (selection) => {
    selectedUsers.value = selection
}

// 批量删除
const batchDelete = () => {
    if (selectedUsers.value.length === 0) {
        ElMessage.warning('请选择要删除的用户')
        return
    }
    
    ElMessageBox.confirm(`确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`, '批量删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        selectedUsers.value.forEach(user => {
            const index = UserData.findIndex(item => item.id === user.id)
            if (index > -1) {
                UserData.splice(index, 1)
            }
        })
        ElMessage.success('批量删除成功')
        selectedUsers.value = []
    })
}

// 导出用户
const exportUsers = () => {
    ElMessage.success('用户数据导出成功')
}

// 提交用户表单
const submitUser = () => {
    userFormRef.value.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                // 编辑用户
                const index = UserData.findIndex(item => item.id === userForm.id)
                if (index > -1) {
                    Object.assign(UserData[index], {
                        username: userForm.username,
                        realName: userForm.realName,
                        email: userForm.email,
                        phone: userForm.phone,
                        role: userForm.role,
                        department: userForm.department,
                        status: userForm.status
                    })
                    ElMessage.success('用户更新成功')
                }
            } else {
                // 添加用户
                const newUser = {
                    id: 'U' + nanoid(6),
                    username: userForm.username,
                    realName: userForm.realName,
                    email: userForm.email,
                    phone: userForm.phone,
                    role: userForm.role,
                    department: userForm.department,
                    status: userForm.status,
                    lastLogin: '从未登录',
                    createTime: new Date().toLocaleString()
                }
                UserData.push(newUser)
                ElMessage.success('用户添加成功')
            }
            closeDrawer()
        }
    })
}

// 关闭抽屉
const closeDrawer = () => {
    drawerVisible.value = false
    resetForm()
}

// 重置表单
const resetForm = () => {
    Object.assign(userForm, {
        id: '',
        username: '',
        realName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'enabled',
        password: ''
    })
    if (userFormRef.value) {
        userFormRef.value.clearValidate()
    }
}

// 重置搜索
const refresh = () => {
    Object.assign(searchData, {
        userName: '',
        userRole: '',
        status: ''
    })
    pageNo.value = 1
}

// 搜索
const research = () => {
    pageNo.value = 1
}
</script>

<style scoped>
.form {
    display: flex;
    align-items: center;
    gap: 20px;
}

.content {
    margin-top: 20px;
}

.el-table {
    margin-top: 20px;
}

.el-pagination {
    margin-top: 20px;
    justify-content: center;
}
</style>

            <!-- 展示管理者信息 -->
            <el-table :data="currentPageData" border style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="工号" align="center" prop="employeeId"></el-table-column>
                <el-table-column label="姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="部门" align="center" prop="department"></el-table-column>
                <el-table-column label="职位" align="center" prop="position"></el-table-column>
                <el-table-column label="管理级别" align="center" prop="level">
                    <template #default="{ row }">
                        <el-tag :type="getLevelTagType(row.level)">{{ row.level }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="下属人数" align="center" prop="subordinates"></el-table-column>
                <el-table-column label="入职时间" align="center" prop="joinDate" sortable></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="Edit" @click="changeInfo(row)"
                            v-model="dialogChange">编辑</el-button>
                        <el-button type="success" size="small" icon="Promotion" @click="promoteManager(row)"
                            :disabled="row.level === '高级'">晋升</el-button>
                        <el-popconfirm title="确定要删除此管理者吗？" @confirm="confirmDelete(row.employeeId)">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 50]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="ManagerData.length"
                @current-change="getHasRole" @size-change="sizeChange" />
        </el-card>

        <!-- 新增管理者对话框 -->
        <el-dialog v-model="dialogVisible" title="新增管理者" width="50%">
            <el-form :model="managerForm" label-width="120px">
                <el-form-item label="姓名">
                    <el-input v-model="managerForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="managerForm.department" placeholder="请选择部门">
                        <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept"></el-option>
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
                    <el-date-picker v-model="managerForm.joinDate" type="date" placeholder="选择日期"
                        style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitManager">提交</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改人员信息 -->
        <el-drawer v-model="dialogChange" title="修改管理者信息" :before-close="handleClose" direction="rtl" size="50%">
            <div class="demo-drawer__content">
                <el-form :model="changeForm" label-width="120px">
                    <el-form-item label="工号">
                        <el-input v-model="changeForm.employeeId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="changeForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="部门">
                        <el-select v-model="changeForm.department" placeholder="请选择部门">
                            <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-input v-model="changeForm.position" placeholder="请输入职位"></el-input>
                    </el-form-item>
                    <el-form-item label="管理级别">
                        <el-select v-model="changeForm.level" placeholder="请选择级别">
                            <el-option label="初级" value="初级"></el-option>
                            <el-option label="中级" value="中级"></el-option>
                            <el-option label="高级" value="高级"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="入职时间">
                        <el-date-picker v-model="changeForm.joinDate" type="date" placeholder="选择日期"
                            style="width: 100%"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitChange">提交修改</el-button>
                        <el-button @click="dialogChange = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>

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
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '张总监',
        department: '技术部',
        position: '技术总监',
        level: '高级',
        subordinates: 15,
        joinDate: '2020-05-10'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '李经理',
        department: '产品部',
        position: '产品经理',
        level: '中级',
        subordinates: 8,
        joinDate: '2021-08-15'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '王主管',
        department: '市场部',
        position: '市场主管',
        level: '初级',
        subordinates: 5,
        joinDate: '2022-03-22'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '赵部长',
        department: '人力资源部',
        position: '人力资源部长',
        level: '高级',
        subordinates: 12,
        joinDate: '2019-11-05'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '钱科长',
        department: '财务部',
        position: '财务科长',
        level: '中级',
        subordinates: 6,
        joinDate: '2021-02-18'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
        name: '孙主任',
        department: '运营部',
        position: '运营主任',
        level: '初级',
        subordinates: 4,
        joinDate: '2022-07-30'
    },
    {
        employeeId: 'M' + nanoid(4).toUpperCase(),
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
        employeeId: 'M' + nanoid(4).toUpperCase(),
        ...managerForm,
        subordinates: Math.floor(Math.random() * 10) + 1,

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
    switch (level) {
        case '初级': return ''
        case '中级': return 'warning'
        case '高级': return 'success'
        default: return 'info'
    }
}

const tableRowClassName = ({ row }) => {
    if (row.level === '高级') {
        return 'senior-row'
    } else if (row.level === '中级') {
        return 'middle-row'
    }
    return ''
}

//实现修改用户信息功能
const dialogChange = ref(false)
//用于存储修改表单的数据
const changeForm = reactive({
    employeeId: '',
    name: '',
    department: '',
    position: '',
    level: '',
    joinDate: ''
})
//格式化时间
const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
//用于引入已有用户数据
const changeInfo = (row) => {
    dialogChange.value = true
    Object.assign(changeForm, {
        employeeId: row.employeeId,
        name: row.name,
        department: row.department,
        position: row.position,
        level: row.level,
        joinDate: row.joinDate
    })
}

const submitChange = () => {
    const index = ManagerData.findIndex(mgr => mgr.employeeId === changeForm.employeeId)
    if (index !== -1) {
        Object.assign(ManagerData[index], {
            name: changeForm.name,
            department: changeForm.department,
            position: changeForm.position,
            level: changeForm.level,
            joinDate: formatDate(changeForm.joinDate)
        })
        dialogChange.value = false
    }
}

const handleClose = (done) => {
    // 添加确认是否放弃修改的逻辑
    ElMessageBox.confirm('确定要放弃修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        done()
    }).catch(() => {
        // 取消关闭
    })
}

//筛选功能实现
// 筛选表单
const searchForm = reactive({
    department: '',
    level: ''
})

// 筛选方法
const research = () => {
    pageNo.value = 1 // 重置到第一页
}

// 重置方法
const refresh = () => {
    searchForm.department = ''
    searchForm.level = ''
    pageNo.value = 1
}

// 修改后的计算属性
const currentPageData = computed(() => {
    // 筛选数据
    const filteredData = ManagerData.filter(item => {
        const departmentMatch = searchForm.department ? item.department === searchForm.department : true
        const levelMatch = searchForm.level ? item.level === searchForm.level : true
        return departmentMatch && levelMatch
    })

    // 分页
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.slice(start, end)
})
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