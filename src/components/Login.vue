<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-users"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    login () {
      // console.log(this)
      this.$refs.loginFormRef.validate(async valid => {
        // 回调函数的第一个形参是布尔值，valid为false表示登录失败
        if (!valid) return
        // 接收登录请求后的promise对象的data属性
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res) 根据状态码判断是否登录成功
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登录成功')
        // 1.将登录成功的token，保存到客户端的sessionStorage中
        // 1.1 项目中除了登录之外的API接口，必须在登录之后才可以访问
        // 1.2 token只应在当前网页打开期间有效，所以保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    },
    // 重置，点击重置按钮用element-ui中Form表单的resetFields方法
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 50%;
        box-shadow: 0 0 5px #ddd;
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>
