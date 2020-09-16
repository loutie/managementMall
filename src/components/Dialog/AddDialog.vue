<template>
  <div>
  <el-dialog
  :title="title"
  :visible.sync="Visible"
  width="50%"
  @close="closeForm"
  :before-close="handleClose">
  <el-form :model="addUserForm" :rules="rules" ref="ruleForm" label-width="80px">
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="addUserForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="addUserForm.password"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="addUserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="mobile">
      <el-input v-model="addUserForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeVisible">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    Visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    title: {
      type: String,
      default: () => {
        return '添加用户'
      }
    }
  },
  data () {
    var checkEmail = (rule, value, cb) => {
      var regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      var regMobile = /^(0|86|17952)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      res: '',
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeForm () {
      this.$emit('changeVisible', false)
      this.$refs.ruleForm.resetFields()
    },
    handleClose (done) {
      this.$emit('changeVisible', false)
      if (!this.Visible) {
        done()
      }
    },
    closeVisible () {
      this.$emit('changeVisible', false)
    },
    addUser () {
      this.$refs.ruleForm.validate(async val => {
        console.log(val)
        if (!val) {
          return false
        }
        this.res = await this.$Http.post('users', this.addUserForm)
        // console.log(this.res)
        if (this.res.data.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.$emit('changeVisible', false)
        this.$emit('addUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
