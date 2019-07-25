<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品区域" type="warning" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 activeIdex-0 对应的是哪一步-0是把字符串转化为数字型 对应下面的标签页-->
      <el-steps :space="200" :active="activeIdex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 v-model="activeIdex"对应的是字符串的所索引name-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIdex"
          :tab-position="'left'"
          :before-leave="beforTableLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateView"
                @change="catelistChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- // -->
          <el-tab-pane label="商品参数" name="1">
            <!--  -->
             <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
               <el-checkbox-group v-model="item.attr_vals" >
                <el-checkbox :label="cb" v-for="(cb ,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item2.attr_name" v-for="item2 in onlyData" :key="item2.attr_id">
              <!-- 把每一项的数据绑定对应的数据身上，这样页面数据就会对应 -->
              <el-input v-model="item2.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIdex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: []
      },
      // 表单分类
      cateView: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 所有数据列表
      catelist: [],
      // 表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      manyData: [],
      onlyData: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.catelist = res.data
    },
    // 监听级联选择器的数据
    catelistChange(value) {
      // if (this.addForm.goods_cat.length !== 3) return this.$message.info('请选择最后一项')
      console.log(value)
    },
    // 阻止标签页点击activeName即将离开的oldActiveName即将进入的
    beforTableLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.info('请选择三级分类')
        return false // 在上一步没提价之前 不能点击下一步
      }
    },
    // 获取动态参数列表
    async tabClick() {
      // console.log(this.activeIdex)
      // 证明访问的是标签页动态参数面板
      if (this.activeIdex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.errr(res.meta.msg)
        // 循环每一项并且赋值给自己
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyData = res.data
        // 证明访问的是标签页静态参数
      } else if (this.activeIdex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.errr(res.meta.msg)
        this.onlyData = res.data
      }
    }
  },
  computed: {
    cateId() {
      // 判断联级选择器里面选择了三级 就返回三级的索引 否则就返回一个空的
      if (this.addForm.goods_cat.length === 3) {
        console.log(this.addForm.goods_cat[2])
        return this.addForm.goods_cat[2]
      } else {
        console.log(2)
        return null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0  0 !important;
}
</style>
