<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品的级联选择框 -->
          <el-cascader
            v-model="selectKeyId"
            :options="cateList"
            :props="cateProps"
            @change="ahandleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态属性面板 -->
        <el-tab-pane label="动态属性" :disabled="isTabsDisabled" name="many">
          <!-- 添加参数按钮 -->
          <el-button type="primary" size="mini" :disabled="isTabsDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" :disabled="isTabsDisabled" name="only">
          <!-- 添加属性按钮 -->
          <el-button type="primary" size="mini" :disabled="isTabsDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDeleteDialog(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数/属性对话框 -->
      <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
        <!-- 添加参数/属性表单 -->
        <el-form :model="addParamsForm" :rules="paramsRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数/属性对话框 -->
      <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
        <!-- 添加参数/属性表单 -->
        <el-form :model="editParamsForm" :rules="paramsRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类数据列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的分类的id
      selectKeyId: [],

      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数数据列表
      manyTableData: [],
      // 动态参数数据列表
      onlyTableData: [],

      // 控制对话框显示
      addDialogVisible: false, // 添加
      editDialogVisible: false, // 编辑
      // 表单数据对象
      addParamsForm: {
        attr_name: '' // 添加参数
      },
      editParamsForm: {
        attr_name: '' // 编辑参数
      },
      // 参数表单验证规则对象
      paramsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }

      // 测试
      // opt: [
      //   {
      //     cat_id: 1,
      //     cat_name: '大家电',
      //     cat_pid: 0,
      //     cat_level: 0,
      //     cat_deleted: false,
      //     children: [
      //       {
      //         cat_id: 3,
      //         cat_name: '电视',
      //         cat_pid: 1,
      //         cat_level: 1,
      //         cat_deleted: false,
      //         children: [
      //           {
      //             cat_id: 6,
      //             cat_name: '曲面电视',
      //             cat_pid: 3,
      //             cat_level: 2,
      //             cat_deleted: false
      //           },
      //           {
      //             cat_id: 7,
      //             cat_name: '海信',
      //             cat_pid: 3,
      //             cat_level: 2,
      //             cat_deleted: false
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
    }
  },

  created () {
    this.getCateList()
  },

  methods: {
    // 获取商品分类数据列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类失败！') }
      this.cateList = res.data
      // console.log(this.cateList)
      // console.log(this.opt)
    },
    // 获取商品参数数据列表
    async getTableData () {
      if (this.selectKeyId.length !== 3) {
        this.selectKeyId = []
        // 清空表格数据
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      console.log(this.selectKeyId)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')
      // 判断是静态参数还是动态参数
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听 级联选择框 点击事件
    ahandleChange () {
      this.getTableData()
    },
    // 监听 标签页 点击事件
    handleClick () {
      // console.log(this.activeName)
      this.getTableData()
    },
    // 监听 添加参数 对话框关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields() // 通过ref调用表单方法resetFields重置表单，在关闭对话框时调用
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields() // 编辑对话框重置
    },
    // 点击添加参数
    addParams () {
      // 验证表单是否为空
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.info('请输入要添加的参数')
        // 表单不为空则发送添加参数请求
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName
          })
        // 提示是否添加成功
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.getTableData()
        this.addDialogVisible = false
      })
    },
    // 显示编辑对话框
    async showEditDialog (aid) {
      // 根据id查询参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${aid}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      this.editParamsForm = res.data
      this.editDialogVisible = true
    },
    // 编辑分类参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.info('参数名不能为空')
        // 表单不为空则发送编辑参数请求
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          })
        // 提示是否编辑成功
        if (res.meta.status !== 200) return this.$message.error('编辑参数失败！')
        this.$message.success('编辑参数成功！')
        this.getTableData()
        this.editDialogVisible = false
      })
    },
    // 根据id删除分类参数
    async showDeleteDialog (aid) {
      const confirmInfo = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 判断用户是否要删除参数
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除！')
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${aid}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getTableData()
    }
  },

  // 计算属性
  computed: {
    // 选中第三级分类，则返回false
    isTabsDisabled () {
      if (this.selectKeyId.length !== 3) {
        return true
      } else {
        return false
      }
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectKeyId.length === 3) {
        return this.selectKeyId[2]
      } else {
        return null
      }
    },
    // 动态计算标题的文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
