<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="sign_out">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggole-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
            @click="saveNavState('/' + subitem.path)">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{subitem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  // 生命周期函数
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出，清除token,跳转到登录页面
    sign_out () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 折叠按钮
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  align-items: center;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 10px;
      font-size: 21px;
      color: #fff;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
  .toggole-button {
    height: 25px;
    text-align: center;
    font-size: 16px;
    letter-spacing: 2px;
    color: #fff;
    background-color: #4a5064;
    cursor: pointer;
  }
  .iconfont {
    margin-right: 10px;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>
