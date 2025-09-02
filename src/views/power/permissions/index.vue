<template>
    <div>
        <!-- 搜索表单 -->
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="权限名称">
                    <el-input placeholder="请输入权限名称" v-model="searchData.permissionName" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="权限类型">
                    <el-select placeholder="请选择权限类型" style="width: 200px" v-model="searchData.permissionType">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="菜单权限" value="menu"></el-option>
                        <el-option label="按钮权限" value="button"></el-option>
                        <el-option label="数据权限" value="data"></el-option>
                        <el-option label="API权限" value="api"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限状态">
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
            <el-button type="primary" size="default" @click="addPermission" icon="Plus">添加权限</el-button>
            <el-button type="success" size="default" @click="exportPermissions" icon="Download">导出权限</el-button>
            <el-button type="danger" size="default" @click="batchDelete" icon="Delete">批量删除</el-button>
            
            <!-- 权限配置表格 -->
            <el-table :data="currentPageData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="权限ID" align="center" prop="id" width="120"></el-table-column>
                <el-table-column label="权限名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="权限编码" align="center" prop="code" show-overflow-tooltip></el-table-column>
                <el-table-column label="权限类型" align="center" prop="type" width="100">
                    <template #default="{row}">
                        <el-tag :type="getPermissionTypeColor(row.type)">{{getPermissionTypeText(row.type)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="父级权限" align="center" prop="parentName" show-overflow-tooltip></el-table-column>
                <el-table-column label="排序" align="center" prop="sort" width="80"></el-table-column>
                <el-table-column label="描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template #default="{row}">
                        <el-switch v-model="row.status" active-value="enabled" inactive-value="disabled" @change="togglePermissionStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="150"></el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template #default="{ row }">
                        <el-button type="info" size="small" icon="View" @click="viewPermission(row)">查看</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="editPermission(row)">编辑</el-button>
                        <el-button type="warning" size="small" icon="Connection" @click="manageRoles(row)">角色分配</el-button>
                        <el-button type="danger" size="small" icon="Delete" @click="deletePermission(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- 分页器 -->
            <el-pagination 
                v-model:current-page="pageNo" 
                v-model:page-size="pageSize" 
                :page-sizes="[5, 10, 15, 20]" 
                :background="true" 
                layout="prev, pager, next, jumper, ->, sizes, total" 
                :total="filteredPermissions.length"
                @current-change="getHasRole" 
                @size-change="sizeChange" 
            />
        </el-card>
        
        <!-- 添加权限抽屉 -->
        <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑权限' : '添加权限'" size="40%">
            <el-form :model="permissionForm" label-width="120px" :rules="formRules" ref="permissionFormRef">
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="permissionForm.name" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限编码" prop="code">
                    <el-input v-model="permissionForm.code" placeholder="请输入权限编码"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="type">
                    <el-select v-model="permissionForm.type" placeholder="请选择权限类型" style="width: 100%">
                        <el-option label="菜单权限" value="menu"></el-option>
                        <el-option label="按钮权限" value="button"></el-option>
                        <el-option label="数据权限" value="data"></el-option>
                        <el-option label="API权限" value="api"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="父级权限">
                    <el-select v-model="permissionForm.parentId" placeholder="请选择父级权限" style="width: 100%" clearable>
                        <el-option label="无" value=""></el-option>
                        <el-option 
                            v-for="permission in PermissionData.filter(p => p.type === 'menu')" 
                            :key="permission.id" 
                            :label="permission.name" 
                            :value="permission.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="permissionForm.sort" :min="0" style="width: 100%"></el-input-number>
                </el-form-item>
                <el-form-item label="权限描述">
                    <el-input v-model="permissionForm.description" type="textarea" placeholder="请输入权限描述"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="permissionForm.status" active-value="enabled" inactive-value="disabled"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitPermission">提交</el-button>
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

const pageNo = ref(1)
const pageSize = ref(5)
const drawerVisible = ref(false)
const isEdit = ref(false)
const selectedPermissions = ref([])
const permissionFormRef = ref(null)

// 权限数据
const PermissionData = reactive([
    {
        id: nanoid(8),
        name: '系统管理',
        code: 'system:manage',
        type: 'menu',
        parentId: '',
        parentName: '无',
        sort: 1,
        description: '系统管理菜单权限',
        status: 'enabled',
        createTime: '2024-01-01 10:00:00'
    },
    {
        id: nanoid(8),
        name: '用户管理',
        code: 'user:manage',
        type: 'menu',
        parentId: '',
        parentName: '系统管理',
        sort: 2,
        description: '用户管理菜单权限',
        status: 'enabled',
        createTime: '2024-01-01 10:05:00'
    },
    {
        id: nanoid(8),
        name: '添加用户',
        code: 'user:add',
        type: 'button',
        parentId: '',
        parentName: '用户管理',
        sort: 1,
        description: '添加用户按钮权限',
        status: 'enabled',
        createTime: '2024-01-01 10:10:00'
    },
    {
        id: nanoid(8),
        name: '编辑用户',
        code: 'user:edit',
        type: 'button',
        parentId: '',
        parentName: '用户管理',
        sort: 2,
        description: '编辑用户按钮权限',
        status: 'enabled',
        createTime: '2024-01-01 10:15:00'
    },
    {
        id: nanoid(8),
        name: '删除用户',
        code: 'user:delete',
        type: 'button',
        parentId: '',
        parentName: '用户管理',
        sort: 3,
        description: '删除用户按钮权限',
        status: 'enabled',
        createTime: '2024-01-01 10:20:00'
    },
    {
        id: nanoid(8),
        name: '查看用户详情',
        code: 'user:view',
        type: 'data',
        parentId: '',
        parentName: '用户管理',
        sort: 4,
        description: '查看用户详细信息数据权限',
        status: 'enabled',
        createTime: '2024-01-01 10:25:00'
    },
    {
        id: nanoid(8),
        name: '用户列表API',
        code: 'api:user:list',
        type: 'api',
        parentId: '',
        parentName: '用户管理',
        sort: 5,
        description: '获取用户列表API权限',
        status: 'enabled',
        createTime: '2024-01-01 10:30:00'
    },
    {
        id: nanoid(8),
        name: '角色管理',
        code: 'role:manage',
        type: 'menu',
        parentId: '',
        parentName: '系统管理',
        sort: 3,
        description: '角色管理菜单权限',
        status: 'enabled',
        createTime: '2024-01-01 10:35:00'
    },
    {
        id: nanoid(8),
        name: '权限配置',
        code: 'permission:config',
        type: 'menu',
        parentId: '',
        parentName: '系统管理',
        sort: 4,
        description: '权限配置菜单权限',
        status: 'enabled',
        createTime: '2024-01-01 10:40:00'
    },
    {
        id: nanoid(8),
        name: '商品管理',
        code: 'product:manage',
        type: 'menu',
        parentId: '',
        parentName: '无',
        sort: 5,
        description: '商品管理菜单权限',
        status: 'disabled',
        createTime: '2024-01-01 10:45:00'
    }
])

// 权限表单数据
const permissionForm = reactive({
    id: '',
    name: '',
    code: '',
    type: '',
    parentId: '',
    sort: 0,
    description: '',
    status: 'enabled'
})

// 表单验证规则
const formRules = {
    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }],
    type: [{ required: true, message: '请选择权限类型', trigger: 'change' }]
}

// 搜索数据
const searchData = reactive({
    permissionName: '',
    permissionType: '',
    status: ''
})

// 筛选后的数据
const filteredPermissions = computed(() => {
    return PermissionData.filter((item) => {
        const nameMatch = !searchData.permissionName || item.name.includes(searchData.permissionName)
        const typeMatch = !searchData.permissionType || item.type === searchData.permissionType
        const statusMatch = !searchData.status || item.status === searchData.status
        return nameMatch && typeMatch && statusMatch
    })
})

// 当前页数据
const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredPermissions.value.slice(start, end)
})

// 分页相关方法
const sizeChange = (newSize) => {
    pageSize.value = newSize
}

const getHasRole = (newPage) => {
    pageNo.value = newPage
}

// 权限类型颜色
const getPermissionTypeColor = (type) => {
    const colors = {
        menu: 'primary',
        button: 'success',
        data: 'warning',
        api: 'info'
    }
    return colors[type] || 'default'
}

// 权限类型文本
const getPermissionTypeText = (type) => {
    const texts = {
        menu: '菜单',
        button: '按钮',
        data: '数据',
        api: 'API'
    }
    return texts[type] || type
}

// 添加权限
const addPermission = () => {
    isEdit.value = false
    resetForm()
    drawerVisible.value = true
}

// 编辑权限
const editPermission = (row) => {
    isEdit.value = true
    Object.assign(permissionForm, {
        ...row,
        parentId: row.parentId || ''
    })
    drawerVisible.value = true
}

// 查看权限
const viewPermission = (row) => {
    ElMessageBox.alert(
        `权限名称：${row.name}<br/>权限编码：${row.code}<br/>权限类型：${getPermissionTypeText(row.type)}<br/>父级权限：${row.parentName}<br/>排序：${row.sort}<br/>描述：${row.description}<br/>状态：${row.status === 'enabled' ? '启用' : '禁用'}<br/>创建时间：${row.createTime}`,
        '权限详情',
        {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定'
        }
    )
}

// 管理角色
const manageRoles = (row) => {
    ElMessage.info(`正在管理权限「${row.name}」的角色分配`)
}

// 删除权限
const deletePermission = (row) => {
    ElMessageBox.confirm(`确定要删除权限「${row.name}」吗？`, '删除确认', {
        type: 'warning'
    }).then(() => {
        const index = PermissionData.findIndex(item => item.id === row.id)
        if (index !== -1) {
            PermissionData.splice(index, 1)
            ElMessage.success('删除成功')
        }
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 切换权限状态
const togglePermissionStatus = (row) => {
    const status = row.status === 'enabled' ? '启用' : '禁用'
    ElMessage.success(`权限「${row.name}」已${status}`)
}

// 多选处理
const handleSelectionChange = (selection) => {
    selectedPermissions.value = selection
}

// 批量删除
const batchDelete = () => {
    if (selectedPermissions.value.length === 0) {
        ElMessage.warning('请选择要删除的权限')
        return
    }
    
    ElMessageBox.confirm(`确定要删除选中的 ${selectedPermissions.value.length} 个权限吗？`, '批量删除', {
        type: 'warning'
    }).then(() => {
        selectedPermissions.value.forEach(permission => {
            const index = PermissionData.findIndex(item => item.id === permission.id)
            if (index !== -1) {
                PermissionData.splice(index, 1)
            }
        })
        ElMessage.success('批量删除成功')
        selectedPermissions.value = []
    }).catch(() => {
        ElMessage.info('已取消删除')
    })
}

// 导出权限
const exportPermissions = () => {
    ElMessage.success('权限数据导出成功')
}

// 提交权限表单
const submitPermission = () => {
    permissionFormRef.value.validate((valid) => {
        if (valid) {
            if (isEdit.value) {
                // 编辑模式
                const index = PermissionData.findIndex(item => item.id === permissionForm.id)
                if (index !== -1) {
                    const parentName = permissionForm.parentId 
                        ? PermissionData.find(p => p.id === permissionForm.parentId)?.name || '无'
                        : '无'
                    
                    Object.assign(PermissionData[index], {
                        ...permissionForm,
                        parentName
                    })
                    ElMessage.success('权限修改成功')
                }
            } else {
                // 新增模式
                const parentName = permissionForm.parentId 
                    ? PermissionData.find(p => p.id === permissionForm.parentId)?.name || '无'
                    : '无'
                
                const newPermission = {
                    id: nanoid(8),
                    ...permissionForm,
                    parentName,
                    createTime: new Date().toLocaleString('zh-CN')
                }
                PermissionData.push(newPermission)
                ElMessage.success('权限添加成功')
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
    Object.assign(permissionForm, {
        id: '',
        name: '',
        code: '',
        type: '',
        parentId: '',
        sort: 0,
        description: '',
        status: 'enabled'
    })
    permissionFormRef.value?.clearValidate()
}

// 重置搜索
const refresh = () => {
    Object.assign(searchData, {
        permissionName: '',
        permissionType: '',
        status: ''
    })
}

// 搜索
const research = () => {
    pageNo.value = 1 // 重置到第一页
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

.el-tag {
    margin-right: 5px;
}
</style>