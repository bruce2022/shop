<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bor_bottom', i1 === 0 ? 'bor_top' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['vcenter', i2 === 0 ? '' : 'bor_top']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="角色操作" width="320px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="editRrightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配角色权限弹框 -->
    <el-dialog title="分配权限" :visible.sync="editDialogVisible" @close="resetRights" width="50%">
      <el-tree :data="rightsTree" :props="treeProps" show-checkbox default-expand-all
      node-key="id" :default-checked-keys="defKeys" ref="treeRef">
      </el-tree>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 用户角色列表数据
      rolesList: [],
      editDialogVisible: false,
      // 用户权限树状列表数据
      rightsTree: [],
      treeProps: {
        label: 'authName', // 指定节点标签
        children: 'children' // 指定子树
      },
      // 保存默认选中的节点id数组
      defKeys: [],
      roleId: ''
    }
  },

  created () {
    this.getRolesList()
  },

  methods: {

    // 获取用户角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.rolesList = res.data
    },

    // 根据id删除对应权限
    async removeRightsById (role, id) {
      // 点击删除按钮，弹出是否删除对话框
      const confirmInfo = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmInfo !== 'confirm') return this.$message.info('已取消删除')
      // 点击确定，发送删除权限请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data // scop.row是每个角色信息，scope.row.children是角色权限列表
    },

    // 点击分配权限按钮，显示当前角色的权限
    async editRrightsDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsTree = res.data
      this.getDefKeys(role, this.defKeys)
      console.log(this.defKeys)
      // 显示分配权限列表弹框
      this.editDialogVisible = true
    },
    // 用递归方法获取当前角色的权限id
    getDefKeys (node, arr) {
      // 没有children属性则说明此节点是三级权限
      if (!node.children) {
        return arr.push(node.id) // 将当前节点的id添加到数组中
      }
      // 遍历剩余节点的子节点
      node.children.forEach(item => this.getDefKeys(item, arr))
    },
    // 关闭弹框重置角色权限列表
    resetRights () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async editRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), // ...扩展运算符，分割获取到的选中的节点的key,下面为半选中的节点的key
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.editDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.bor_top {
  border-top: 1px solid #eee;
}
.bor_bottom {
  border-bottom: 1px solid #eee;
}
</style>
