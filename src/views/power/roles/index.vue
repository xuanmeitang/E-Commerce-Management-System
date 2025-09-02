<template>
    <div>
        <div class="page-header">
            <h2>角色管理</h2>
            <p>管理系统角色，定义不同角色的基本信息和权限</p>
        </div>
        
        <el-card style="height: 100px;" class="search">
            <el-form class="form">
                <el-form-item label="角色名称">
                    <el-input placeholder="请输入角色名称" v-model="searchData.roleName" @keyup.enter="research"></el-input>
                </el-form-item>
                <el-form-item label="角色状态">
                    <el-select v-model="searchData.status" placeholder="请选择状态" style="width: 150px" clearable>
                        <el-option label="启用" value="启用"></el-option>
                        <el-option label="禁用" value="禁用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="searchData.createDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">搜索</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <div class="header-actions">
                <el-button type="primary" size="default" @click="addRole" icon="Plus">添加角色</el-button>
                <el-button type="success" size="default" @click="exportRoles" icon="Download">导出角色</el-button>
                <el-button type="danger" size="default" @click="batchDelete" icon="Delete">批量删除</el-button>
            </div>
            
            <!-- 展示角色信息 -->
            <el-table :data="currentPageData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="角色ID" align="center" prop="roleId" width="100"></el-table-column>
                <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="角色编码" align="center" prop="roleCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="角色描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
                <el-table-column label="角色类型" align="center" prop="roleType">
                    <template #default="{ row }">
                        <el-tag :type="getRoleTypeColor(row.roleType)">{{ row.roleType }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="用户数量" align="center" prop="userCount" sortable>
                    <template #default="{ row }">
                        <span style="color: #409eff; font-weight: bold;">{{ row.userCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="权限数量" align="center" prop="permissionCount" sortable>
                    <template #default="{ row }">
                        <span style="color: #67c23a; font-weight: bold;">{{ row.permissionCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" align="center" prop="status">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" active-text="启用" inactive-text="禁用" @change="toggleRoleStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="280">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" @click="viewRole(row)" icon="View">查看</el-button>
                        <el-button size="small" type="warning" @click="editRole(row)" icon="Edit">编辑</el-button>
                        <el-button size="small" type="success" @click="managePermissions(row)" icon="Setting">权限</el-button>
                        <el-button size="small" type="info" @click="manageUsers(row)" icon="User">用户</el-button>
                        <el-button size="small" type="danger" @click="deleteRole(row.roleId)" icon="Delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total"
                :total="totalCount" @current-change="getHasRole" @size-change="sizeChange" />
        </el-card>
        <!-- 角色添加/编辑抽屉 -->
        <el-drawer v-model="drawer" :title="drawerTitle" size="400px">
            <el-form :model="roleForm" label-width="80px" style="padding: 20px;">
                <el-form-item label="角色名称" required>
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" required>
                    <el-input v-model="roleForm.roleCode" placeholder="请输入角色编码"></el-input>
                </el-form-item>
                <el-form-item label="角色类型" required>
                    <el-select v-model="roleForm.roleType" placeholder="请选择角色类型" style="width: 100%">
                        <el-option label="系统角色" value="系统角色"></el-option>
                        <el-option label="业务角色" value="业务角色"></el-option>
                        <el-option label="普通角色" value="普通角色"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleForm.description" type="textarea" :rows="3" placeholder="请输入角色描述"></el-input>
                </el-form-item>
                <el-form-item label="角色状态">
                    <el-switch v-model="roleForm.status" active-text="启用" inactive-text="禁用"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitRole">确定</el-button>
                    <el-button @click="drawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { nanoid } from 'nanoid'
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
const pageNo = ref(1);      // 当前页码
const pageSize = ref(3);   // 每页条数
const drawer = ref(false)
const drawerTitle = ref('添加角色')
const isEdit = ref(false)

// 角色表单数据
const roleForm = reactive({
    roleId: '',
    roleName: '',
    roleCode: '',
    roleType: '',
    description: '',
    status: true
})

const RoleData = reactive([
    {
        roleId: 'R' + nanoid(6),
        roleName: '超级管理员',
        roleCode: 'SUPER_ADMIN',
        description: '系统最高权限管理员，拥有所有功能权限',
        roleType: '系统角色',
        userCount: 2,
        permissionCount: 50,
        createTime: '2022-01-01',
        updateTime: '2025-08-30',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '系统管理员',
        roleCode: 'SYSTEM_ADMIN',
        description: '系统管理员，负责系统配置和用户管理',
        roleType: '系统角色',
        userCount: 5,
        permissionCount: 35,
        createTime: '2022-01-15',
        updateTime: '2025-08-29',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '运营管理员',
        roleCode: 'OPERATION_MANAGER',
        description: '运营管理员，负责商品、订单等业务管理',
        roleType: '业务角色',
        userCount: 8,
        permissionCount: 25,
        createTime: '2022-02-01',
        updateTime: '2025-08-28',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '客服专员',
        roleCode: 'CUSTOMER_SERVICE',
        description: '客服专员，负责客户咨询和售后服务',
        roleType: '业务角色',
        userCount: 15,
        permissionCount: 12,
        createTime: '2022-03-01',
        updateTime: '2025-08-27',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '财务专员',
        roleCode: 'FINANCE_STAFF',
        description: '财务专员，负责财务统计和报表管理',
        roleType: '业务角色',
        userCount: 3,
        permissionCount: 18,
        createTime: '2022-04-01',
        updateTime: '2025-08-26',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '仓库管理员',
        roleCode: 'WAREHOUSE_MANAGER',
        description: '仓库管理员，负责库存管理和物流跟踪',
        roleType: '业务角色',
        userCount: 6,
        permissionCount: 15,
        createTime: '2022-05-01',
        updateTime: '2025-08-25',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '普通用户',
        roleCode: 'NORMAL_USER',
        description: '普通用户，只能查看基本信息',
        roleType: '普通角色',
        userCount: 50,
        permissionCount: 5,
        createTime: '2022-06-01',
        updateTime: '2025-08-24',
        status: true
    },
    {
        roleId: 'R' + nanoid(6),
        roleName: '游客',
        roleCode: 'GUEST',
        description: '游客用户，只能访问公开信息',
        roleType: '普通角色',
        userCount: 0,
        permissionCount: 2,
        createTime: '2022-07-01',
        updateTime: '2025-08-23',
        status: false
    }
])

const sizeChange = (newSize) => {
    pageSize.value = newSize;
};

const getHasRole = (newPage) => {
    pageNo.value = newPage;

};

// 角色管理相关方法
const selectedRoles = ref([])

const addRole = () => {
    drawerTitle.value = '添加角色'
    isEdit.value = false
    // 重置表单
    Object.assign(roleForm, {
        roleId: '',
        roleName: '',
        roleCode: '',
        roleType: '',
        description: '',
        status: true
    })
    drawer.value = true
}

const exportRoles = () => {
    ElMessage.success('角色数据导出成功！')
}

const batchDelete = () => {
    if (selectedRoles.value.length === 0) {
        ElMessage.warning('请选择要删除的角色')
        return
    }
    ElMessage.success(`成功删除 ${selectedRoles.value.length} 个角色`)
}

const handleSelectionChange = (selection) => {
    selectedRoles.value = selection
}

const viewRole = (row) => {
    ElMessage.info(`查看角色：${row.roleName}`)
}

const editRole = (row) => {
    drawerTitle.value = '编辑角色'
    isEdit.value = true
    // 填充表单数据
    Object.assign(roleForm, {
        roleId: row.roleId,
        roleName: row.roleName,
        roleCode: row.roleCode,
        roleType: row.roleType,
        description: row.description,
        status: row.status
    })
    drawer.value = true
}

const submitRole = () => {
    if (!roleForm.roleName || !roleForm.roleCode || !roleForm.roleType) {
        ElMessage.warning('请填写必要信息')
        return
    }
    
    if (isEdit.value) {
        // 编辑角色
        const index = RoleData.findIndex(item => item.roleId === roleForm.roleId)
        if (index > -1) {
            Object.assign(RoleData[index], {
                roleName: roleForm.roleName,
                roleCode: roleForm.roleCode,
                roleType: roleForm.roleType,
                description: roleForm.description,
                status: roleForm.status,
                updateTime: new Date().toISOString().split('T')[0]
            })
            ElMessage.success('角色修改成功')
        }
    } else {
        // 添加角色
        const newRole = {
            roleId: 'R' + nanoid(6),
            roleName: roleForm.roleName,
            roleCode: roleForm.roleCode,
            roleType: roleForm.roleType,
            description: roleForm.description,
            userCount: 0,
            permissionCount: 0,
            createTime: new Date().toISOString().split('T')[0],
            updateTime: new Date().toISOString().split('T')[0],
            status: roleForm.status
        }
        RoleData.push(newRole)
        ElMessage.success('角色添加成功')
    }
    
    drawer.value = false
}

const managePermissions = (row) => {
    ElMessage.info(`管理角色权限：${row.roleName}`)
}

const manageUsers = (row) => {
    ElMessage.info(`管理角色用户：${row.roleName}`)
}

const deleteRole = (roleId) => {
    const index = RoleData.findIndex(item => item.roleId === roleId)
    if (index > -1) {
        const roleName = RoleData[index].roleName
        RoleData.splice(index, 1)
        ElMessage.success(`角色 ${roleName} 删除成功`)
    }
}

const toggleRoleStatus = (row) => {
    const status = row.status ? '启用' : '禁用'
    ElMessage.success(`角色 ${row.roleName} 已${status}`)
}

const getRoleTypeColor = (type) => {
    const typeMap = {
        '系统角色': 'danger',
        '业务角色': 'warning',
        '普通角色': 'info'
    }
    return typeMap[type] || ''
}

//实现搜索功能
const searchData = reactive({
    roleName: '',
    status: '',
    createDate: null
})

//重置搜索条件
const refresh = () => {
    searchData.roleName = ''
    searchData.status = ''
    searchData.createDate = null
    pageNo.value = 1
}

//执行搜索
const research = () => {
    pageNo.value = 1
}

// 筛选后的数据
const filteredData = computed(() => {
    return RoleData.filter(item => {
        // 角色名称筛选
        if (searchData.roleName && !item.roleName.toLowerCase().includes(searchData.roleName.toLowerCase())) {
            return false
        }
        // 角色状态筛选
        if (searchData.status) {
            const statusText = item.status ? '启用' : '禁用'
            if (statusText !== searchData.status) {
                return false
            }
        }
        // 创建时间筛选
        if (searchData.createDate && searchData.createDate.length === 2) {
            const createTime = new Date(item.createTime)
            const startDate = new Date(searchData.createDate[0])
            const endDate = new Date(searchData.createDate[1])
            if (createTime < startDate || createTime > endDate) {
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
