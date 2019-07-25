<template>
  <div>
   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
       <el-card>
       <el-row >
         <el-col :span="7">
       <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="goodsListData">
             <el-button slot="append" icon="el-icon-search" @click="goodsListData"></el-button>
      </el-input>
         </el-col>
         <el-col :span="4">
           <el-button type="success" @click="addIndex">添加分类</el-button>
         </el-col>
         <!-- 表格区域 -->
        <el-table :data="goodsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name"></el-table-column>
             <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
             <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
             <el-table-column label="商品创建时间" prop="add_time" width="140px">
               <!-- 转化时间戳 -->
               <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
               </template>
             </el-table-column>
             <el-table-column label="操作" width="190px">
                   <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="editUpData(scope.row.attr_id)">修改</el-button>
                     <el-button type="danger" icon="el-icon-delete" size="small" @click="removeById(scope.row.goods_id)">删除</el-button>
                 </template>
             </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 17]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
       </el-row>
  </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {

        query: '',
        // 当前页
        pagenum: 1,
        // 当前页的总条数
        pagesize: 10
      },
      goodsList: [],
      // 总条数
      total: 0
    }
  },
  created() {
    this.goodsListData()
  },
  methods: {
    async goodsListData() {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 赋值得到的数据
      this.goodsList = res.data.goods
      // 赋值总条数
      this.total = res.data.total
    },
    // 当前页总条数
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      // 调用获取所以数据的函数渲染页面
      this.goodsListData()
    },
    // 当前页码
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      // 调用获取所以数据的函数渲染页面
      this.goodsListData()
    },
    // 根据id删除商品
    async removeById(id) {
      const remoFoRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (remoFoRes !== 'confirm') {
        return this.$message.info('已取消该操作')
      } else {
        const { data: res } = await this.$http.delete(`goods/${id}`)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsListData()
        this.$message.success(res.meta.msg)
      }
    },
    // 根据路由导航跳转页面
    addIndex() {
      this.$router.push('/addres')
    }
  }
}
</script>
<style lang="less" scoped>
.el-input {
  margin-bottom: 10px;
}
.el-button{
  margin-left: 10px
}
</style>
