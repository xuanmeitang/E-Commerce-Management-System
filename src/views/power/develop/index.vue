<template>
    <div>
        <p>开发者界面</p>
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="技术栈">
                    <el-select placeholder="请选择技术栈" style="width: 200px">
                        <el-option label="前端" value="frontend"></el-option>
                        <el-option label="后端" value="backend"></el-option>
                        <el-option label="全栈" value="fullstack"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="GitHub账号">
                    <el-input placeholder="请输入GitHub用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">搜索</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" size="default" @click="addDeveloper" icon="Plus">添加开发者</el-button>
            <el-button type="danger" size="default" @click="delDeveloper" icon="Delete">批量删除</el-button>
            
            <!-- 展示开发者信息 -->
            <el-table :data="currentPageData" stripe style="width: 100%">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="开发者ID" align="center" prop="id"></el-table-column>
                <el-table-column label="姓名" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="技术栈" align="center" prop="techStack">
                    <template #default="{row}">
                        <el-tag v-for="tech in row.techStack" :key="tech" style="margin-right: 5px">{{tech}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="GitHub" align="center" prop="github" show-overflow-tooltip>
                    <template #default="{row}">
                        <el-link :href="'https://github.com/'+row.github" target="_blank">{{row.github}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="项目数" align="center" prop="projectCount"></el-table-column>
                <el-table-column label="活跃度" align="center" prop="activity">
                    <template #default="{row}">
                        <el-progress :percentage="row.activity" :color="getActivityColor(row.activity)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="280px" align="center">
                    <template #default="{ row }">
                        <el-button type="success" size="small" icon="Connection">分配项目</el-button>
                        <el-button type="primary" size="small" icon="Edit">编辑</el-button>
                        <el-popconfirm title="确定要删除此开发者吗？" @confirm="confirmDelete(row.id)">
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
                :page-sizes="[5, 10, 15, 20]" 
                :background="true" 
                layout="prev, pager, next, jumper, ->, sizes, total" 
                :total="DeveloperData.length"
                @current-change="getHasRole" 
                @size-change="sizeChange" 
            />
        </el-card>
        
        <!-- 添加开发者抽屉 -->
        <el-drawer v-model="drawerVisible" title="添加新开发者" size="40%">
            <el-form :model="developerForm" label-width="120px">
                <el-form-item label="开发者姓名">
                    <el-input v-model="developerForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="技术栈">
                    <el-select 
                        v-model="developerForm.techStack" 
                        multiple 
                        placeholder="请选择技术栈"
                        style="width: 100%"
                    >
                        <el-option 
                            v-for="tech in techOptions" 
                            :key="tech" 
                            :label="tech" 
                            :value="tech"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="GitHub账号">
                    <el-input v-model="developerForm.github" placeholder="请输入GitHub用户名"></el-input>
                </el-form-item>
                <el-form-item label="初始项目数">
                    <el-input-number v-model="developerForm.projectCount" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitDeveloper">提交</el-button>
                    <el-button @click="drawerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { nanoid } from 'nanoid'
import { ref, reactive, computed } from 'vue'

const pageNo = ref(1)
const pageSize = ref(5)
const drawerVisible = ref(false)
const techOptions = ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Python', 'Java', 'Go']

const DeveloperData = reactive([
    {
        id: nanoid(5),
        name: '张全栈',
        techStack: ['Vue', 'Node.js', 'Python'],
        github: 'fullstack-zhang',
        projectCount: 8,
        activity: 85
    },
    {
        id: nanoid(5),
        name: '李前端',
        techStack: ['JavaScript', 'Vue', 'React'],
        github: 'frontend-li',
        projectCount: 5,
        activity: 72
    },
    {
        id: nanoid(5),
        name: '王后端',
        techStack: ['Java', 'Spring', 'MySQL'],
        github: 'backend-wang',
        projectCount: 6,
        activity: 68
    },
    {
        id: nanoid(5),
        name: '赵移动',
        techStack: ['Flutter', 'Swift', 'Kotlin'],
        github: 'mobile-zhao',
        projectCount: 4,
        activity: 55
    },
    {
        id: nanoid(5),
        name: '钱数据',
        techStack: ['Python', 'TensorFlow', 'PyTorch'],
        github: 'data-qian',
        projectCount: 3,
        activity: 45
    },
    {
        id: nanoid(5),
        name: '孙架构',
        techStack: ['Go', 'Kubernetes', 'Docker'],
        github: 'arch-sun',
        projectCount: 7,
        activity: 92
    },
    {
        id: nanoid(5),
        name: '周测试',
        techStack: ['Cypress', 'Jest', 'Selenium'],
        github: 'test-zhou',
        projectCount: 4,
        activity: 60
    }
])

const developerForm = reactive({
    name: '',
    techStack: [],
    github: '',
    projectCount: 0
})

const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return DeveloperData.slice(start, end)
})

const sizeChange = (newSize) => {
    pageSize.value = newSize
}

const getHasRole = (newPage) => {
    pageNo.value = newPage
}

const addDeveloper = () => {
    drawerVisible.value = true
}

const confirmDelete = (id) => {
    const index = DeveloperData.findIndex(dev => dev.id === id)
    if (index !== -1) {
        DeveloperData.splice(index, 1)
    }
}

const submitDeveloper = () => {
    const newDeveloper = {
        id: nanoid(5),
        ...developerForm,
        activity: Math.floor(Math.random() * 30) + 50 // 随机生成50-80的活跃度
    }
    DeveloperData.push(newDeveloper)
    drawerVisible.value = false
    // 重置表单
    Object.assign(developerForm, {
        name: '',
        techStack: [],
        github: '',
        projectCount: 0
    })
}

const getActivityColor = (activity) => {
    if (activity >= 80) return '#67C23A'
    if (activity >= 60) return '#409EFF'
    if (activity >= 40) return '#E6A23C'
    return '#F56C6C'
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