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
