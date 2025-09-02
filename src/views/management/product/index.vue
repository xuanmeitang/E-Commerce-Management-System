<template>
    <div>
        <p>商品管理界面</p>
        <el-card style="height: 80px;" class="search">
            <el-form class="form">
                <el-form-item label="商品名称">
                    <el-input placeholder="请输入商品名称" v-model="searchData.productName" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select placeholder="请选择商品分类" style="width: 200px" v-model="searchData.category" clearable>
                        <el-option label="数码电器" value="数码电器"></el-option>
                        <el-option label="服装鞋帽" value="服装鞋帽"></el-option>
                        <el-option label="家居用品" value="家居用品"></el-option>
                        <el-option label="美妆护肤" value="美妆护肤"></el-option>
                        <el-option label="食品饮料" value="食品饮料"></el-option>
                        <el-option label="运动户外" value="运动户外"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品状态">
                    <el-select placeholder="请选择商品状态" style="width: 150px" v-model="searchData.status" clearable>
                        <el-option label="在售" value="在售"></el-option>
                        <el-option label="下架" value="下架"></el-option>
                        <el-option label="缺货" value="缺货"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="research" icon="Search">搜索</el-button>
                    <el-button type="" size="default" @click="refresh" icon="Refresh">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" size="default" @click="addProduct" icon="Plus">添加商品</el-button>
            <el-button type="danger" size="default" @click="delProduct" icon="Delete">批量删除</el-button>
            
            <!-- 展示商品信息 -->
            <el-table :data="currentPageData" stripe style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="商品图片" align="center" width="80px">
                    <template #default="{row}">
                        <el-image :src="row.image" style="width: 50px; height: 50px" fit="cover" :preview-src-list="[row.image]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="商品ID" align="center" prop="productId" width="120px"></el-table-column>
                <el-table-column label="商品名称" align="center" prop="name" show-overflow-tooltip min-width="150px"></el-table-column>
                <el-table-column label="商品分类" align="center" prop="category" width="100px">
                    <template #default="{row}">
                        <el-tag :type="getCategoryType(row.category)">{{row.category}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格" align="center" prop="price" width="100px">
                    <template #default="{row}">
                        <span style="color: #f56c6c; font-weight: bold;">¥{{row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="库存" align="center" prop="stock" width="80px">
                    <template #default="{row}">
                        <el-tag :type="getStockType(row.stock)">{{row.stock}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="销量" align="center" prop="sales" width="80px"></el-table-column>
                <el-table-column label="状态" align="center" prop="status" width="100px">
                    <template #default="{row}">
                        <el-switch v-model="row.status" active-text="在售" inactive-text="下架" @change="toggleProductStatus(row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="120px"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #default="{ row }">
                        <el-button type="info" size="small" icon="View" @click="viewProduct(row)">查看</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="editProduct(row)">编辑</el-button>
                        <el-button type="warning" size="small" icon="Box" @click="manageStock(row)">库存</el-button>
                        <el-popconfirm title="确定要删除此商品吗？" @confirm="deleteProduct(row.productId)">
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
                :total="totalCount"
                @current-change="getHasRole" 
                @size-change="sizeChange" 
            />
        </el-card>
        
        <!-- 添加商品抽屉 -->
        <el-drawer v-model="drawerVisible" title="添加新商品" size="50%">
            <el-form :model="productForm" label-width="120px">
                <el-form-item label="商品名称">
                    <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="productForm.category" placeholder="请选择商品分类" style="width: 100%">
                        <el-option v-for="category in categoryOptions" :key="category" :label="category" :value="category"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input-number v-model="productForm.price" :min="0" :precision="2" placeholder="请输入价格"></el-input-number>
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input-number v-model="productForm.stock" :min="0" placeholder="请输入库存数量"></el-input-number>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-input v-model="productForm.image" placeholder="请输入图片URL"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitProduct">提交</el-button>
                    <el-button @click="drawerVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        
        <!-- 编辑商品抽屉 -->
        <el-drawer v-model="drawerEdit" title="编辑商品" size="50%">
            <el-form :model="productForm" label-width="120px">
                <el-form-item label="商品名称">
                    <el-input v-model="productForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="productForm.category" placeholder="请选择商品分类" style="width: 100%">
                        <el-option v-for="category in categoryOptions" :key="category" :label="category" :value="category"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input-number v-model="productForm.price" :min="0" :precision="2" placeholder="请输入价格"></el-input-number>
                </el-form-item>
                <el-form-item label="库存数量">
                    <el-input-number v-model="productForm.stock" :min="0" placeholder="请输入库存数量"></el-input-number>
                </el-form-item>
                <el-form-item label="商品图片">
                    <el-input v-model="productForm.image" placeholder="请输入图片URL"></el-input>
                </el-form-item>
                <el-form-item label="商品描述">
                    <el-input v-model="productForm.description" type="textarea" :rows="3" placeholder="请输入商品描述"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateProduct">更新</el-button>
                    <el-button @click="drawerEdit = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const pageNo = ref(1)
const pageSize = ref(5)
const drawerVisible = ref(false)
const drawerEdit = ref(false)
const selectedProducts = ref([])

const categoryOptions = ['手机数码', '电脑办公', '家用电器', '服装鞋帽', '美妆护肤', '食品饮料', '运动户外', '图书音像']

const ProductData = reactive([
    {
        productId: 'P12345678',
        name: 'iPhone 15 Pro',
        category: '手机数码',
        price: 7999.00,
        stock: 50,
        sales: 128,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i1/6000000003436/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003436-0-tps-800-800.jpg',
        description: 'Apple iPhone 15 Pro 高端智能手机',
        createTime: '2024-01-15'
    },
    {
        productId: 'P23456789',
        name: 'MacBook Pro 14寸',
        category: '电脑办公',
        price: 15999.00,
        stock: 25,
        sales: 89,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i2/6000000003437/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003437-0-tps-800-800.jpg',
        description: 'Apple MacBook Pro 14寸 M3芯片',
        createTime: '2024-01-20'
    },
    {
        productId: 'P34567890',
        name: '海尔冰箱 BCD-521WDPD',
        category: '家用电器',
        price: 3299.00,
        stock: 15,
        sales: 67,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i3/6000000003438/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003438-0-tps-800-800.jpg',
        description: '海尔521升对开门冰箱',
        createTime: '2024-02-01'
    },
    {
        productId: 'P45678901',
        name: 'Nike Air Force 1',
        category: '服装鞋帽',
        price: 899.00,
        stock: 80,
        sales: 245,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i4/6000000003439/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003439-0-tps-800-800.jpg',
        description: 'Nike Air Force 1 经典白色板鞋',
        createTime: '2024-02-10'
    },
    {
        productId: 'P56789012',
        name: '雅诗兰黛小黑瓶精华',
        category: '美妆护肤',
        price: 1580.00,
        stock: 30,
        sales: 156,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i1/6000000003440/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003440-0-tps-800-800.jpg',
        description: '雅诗兰黛小黑瓶复合精华 30ml',
        createTime: '2024-02-15'
    },
    {
        productId: 'P67890123',
        name: '三只松鼠零食大礼包',
        category: '食品饮料',
        price: 168.00,
        stock: 200,
        sales: 389,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i2/6000000003441/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003441-0-tps-800-800.jpg',
        description: '三只松鼠综合坚果零食大礼包',
        createTime: '2024-02-20'
    },
    {
        productId: 'P78901234',
        name: 'Adidas 跑步鞋 UltraBoost 22',
        category: '运动户外',
        price: 1299.00,
        stock: 45,
        sales: 178,
        status: false,
        image: 'https://img.alicdn.com/imgextra/i3/6000000003442/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003442-0-tps-800-800.jpg',
        description: 'Adidas UltraBoost 22 专业跑步鞋',
        createTime: '2024-03-01'
    },
    {
        productId: 'P89012345',
        name: '《人类简史》三部曲',
        category: '图书音像',
        price: 168.00,
        stock: 120,
        sales: 267,
        status: true,
        image: 'https://img.alicdn.com/imgextra/i4/6000000003443/O1CN01Z8QJJJ1Z8QJJJ1Z8Q_!!6000000003443-0-tps-800-800.jpg',
        description: '尤瓦尔·赫拉利作品集',
        createTime: '2024-03-05'
    }
])

const productForm = reactive({
    productId: '',
    name: '',
    category: '',
    price: 0,
    stock: 0,
    image: '',
    description: ''
})

const searchData = reactive({
    productName: '',
    category: '',
    status: ''
})

// 筛选后的数据
const filteredData = computed(() => {
    return ProductData.filter((item) => {
        const nameMatch = !searchData.productName || item.name.includes(searchData.productName)
        const categoryMatch = !searchData.category || item.category === searchData.category
        const statusMatch = searchData.status === '' || 
            (searchData.status === '在售' && item.status) || 
            (searchData.status === '下架' && !item.status)
        return nameMatch && categoryMatch && statusMatch
    })
})

// 当前页数据
const currentPageData = computed(() => {
    const start = (pageNo.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredData.value.slice(start, end)
})

// 筛选后的总数量
const totalCount = computed(() => filteredData.value.length)

// 分页相关方法
const sizeChange = (newSize) => {
    pageSize.value = newSize
    pageNo.value = 1
}

const getHasRole = (newPage) => {
    pageNo.value = newPage
}

// 搜索和重置
const research = () => {
    pageNo.value = 1
}

const refresh = () => {
    searchData.productName = ''
    searchData.category = ''
    searchData.status = ''
    pageNo.value = 1
}

// 商品管理方法
const addProduct = () => {
    // 重置表单
    Object.assign(productForm, {
        productId: '',
        name: '',
        category: '',
        price: 0,
        stock: 0,
        image: '',
        description: ''
    })
    drawerVisible.value = true
}

const submitProduct = () => {
    if (!productForm.name || !productForm.category || productForm.price <= 0) {
        ElMessage.warning('请填写完整的商品信息')
        return
    }
    
    const newProduct = {
        productId: 'P' + Date.now(),
        ...productForm,
        sales: 0,
        status: true,
        createTime: new Date().toISOString().split('T')[0]
    }
    
    ProductData.push(newProduct)
    drawerVisible.value = false
    ElMessage.success('商品添加成功')
}

const viewProduct = (product) => {
    ElMessage.info(`查看商品: ${product.name}`)
}

const editProduct = (product) => {
    Object.assign(productForm, { ...product })
    drawerEdit.value = true
}

const updateProduct = () => {
    const index = ProductData.findIndex(p => p.productId === productForm.productId)
    if (index !== -1) {
        Object.assign(ProductData[index], productForm)
        drawerEdit.value = false
        ElMessage.success('商品更新成功')
    }
}

const manageStock = (product) => {
    ElMessage.info(`管理库存: ${product.name}，当前库存: ${product.stock}`)
}

const deleteProduct = (productId) => {
    const index = ProductData.findIndex(p => p.productId === productId)
    if (index !== -1) {
        ProductData.splice(index, 1)
        ElMessage.success('商品删除成功')
    }
}

const toggleProductStatus = (product) => {
    const status = product.status ? '上架' : '下架'
    ElMessage.success(`商品${status}成功`)
}

const handleSelectionChange = (selection) => {
    selectedProducts.value = selection
}

const delProduct = () => {
    if (selectedProducts.value.length === 0) {
        ElMessage.warning('请选择要删除的商品')
        return
    }
    
    selectedProducts.value.forEach(product => {
        const index = ProductData.findIndex(p => p.productId === product.productId)
        if (index !== -1) {
            ProductData.splice(index, 1)
        }
    })
    
    ElMessage.success(`批量删除${selectedProducts.value.length}个商品成功`)
    selectedProducts.value = []
}

// 获取分类标签类型
const getCategoryType = (category) => {
    const typeMap = {
        '手机数码': 'primary',
        '电脑办公': 'success',
        '家用电器': 'info',
        '服装鞋帽': 'warning',
        '美妆护肤': 'danger',
        '食品饮料': '',
        '运动户外': 'success',
        '图书音像': 'info'
    }
    return typeMap[category] || ''
}

// 获取库存标签类型
const getStockType = (stock) => {
    if (stock > 50) return 'success'
    if (stock > 20) return 'warning'
    if (stock > 0) return 'danger'
    return 'info'
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