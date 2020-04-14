<template>
    <div>
        <el-button type="primary" @click="sign_out">退出登录</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    // 退出，清除token,跳转到登录页面
    sign_out () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
