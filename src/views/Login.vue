<template>
  <div class="login-container">
      <div class="login-box">
          <div class="avatar-box">
              <img src="http://bpic.588ku.com/element_origin_min_pic/17/02/04/1550050248cc95866f6cefa4f92576a3.jpg" alt="">
          </div>
              <el-form :model="loginForm" :rules="rules" ref="loginRef" class="login-form" label-width="0px">
                <el-form-item  prop="username">
                  <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-user" autofocus='true'></el-input>
                </el-form-item>
                <el-form-item  prop="password">
                  <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                  <el-button type="primary" @click="login">登入</el-button>
                  <el-button type="info" @click="reset">重置</el-button>
              </el-form-item>
              </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginRef.resetFields()
    },
    login () {
      this.$refs.loginRef.validate(async val => {
        console.log(val)
        if (!val) return false
        var res = await this.$Http.post('Login', this.loginForm)
        // console.log(res.data.data.token)
        if (res.data.meta.status === 400) {
          this.$message.error('账号和密码输入错误，请重新输入！！！')
        } else {
          this.$message.success('登录成功，欢迎进入！！！')
          window.sessionStorage.setItem('token', res.data.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;
}
.login-box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #e2f2e2;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    opacity: .9;
    box-shadow: 0 0 3px #e0e0e0;
    transform: translate(-50%, -50%);

    .avatar-box {
        width: 130px;
        height: 130px;
        border: 2px solid #e2e2e2;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -55%);
        background-color: #fff;
        img {
          width: 100%;
          height: 100%;
          background-color: #eee;
          border-radius: 50%;
        }
    }
    .login-form {
        position: absolute;
        bottom: 0;
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
