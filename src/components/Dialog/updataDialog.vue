<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="editVisible"
      width="50%"
      @close="closeForm"
      :before-close="handleClose">
      <el-form :model="editUserForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="用户名称" prop="username">
        <el-input v-model="editUserForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="editUserForm.mobile"></el-input>
      </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVisible">取 消</el-button>
        <el-button type="primary" @click="updata">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    editVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    title: {
      type: String,
      default: () => {
        return '修改用户'
      }
    },
    editUserForm: {
      type: Object,
      default: () => {
        return {}
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
      rules: {
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
      this.$emit('editVisible', false)
      this.$refs.ruleForm.resetFields()
    },
    handleClose (done) {
      this.$emit('editVisible', false)
      if (!this.editVisible) {
        done()
      }
    },
    closeVisible () {
      this.$emit('editVisible', false)
    },
    updata () {
      this.$refs.ruleForm.validate(async val => {
        console.log(val)
        if (!val) {
          return false
        }
        this.res = await this.$Http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (this.res.data.meta.status !== 200) {
          this.$message.error('更新用户失败!')
        }
        this.$message.success('更新用户成功')
        this.$emit('editVisible', false)
        this.$emit('editUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
