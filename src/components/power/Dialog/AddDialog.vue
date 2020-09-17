<template>
  <div>
  <el-dialog
  :title="title"
  :visible.sync="Visible"
  width="50%"
  @close="closeForm"
  :before-close="handleClose">
  <el-form :model="addUserForm" :rules="rules" ref="ruleForm" label-width="80px">
    <!-- <el-form-item label="角色编号" prop="roleId">
      <el-input v-model="addUserForm.roleId"></el-input>
    </el-form-item> -->
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="addUserForm.roleName"></el-input>
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="addUserForm.roleDesc"></el-input>
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
        return '添加角色'
      }
    }
  },
  data () {
    return {
      res: '',
      addUserForm: {
        // roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        // roleId: [
        //   { required: true, message: '请输入角色编号', trigger: 'blur' },
        //   { min: 2, max: 3, message: '长度为2-3个字符', trigger: 'blur' }
        // ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
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
        this.res = await this.$Http.post('roles', this.addUserForm)
        // console.log(this.res)
        if (this.res.data.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        this.$emit('changeVisible', false)
        this.$emit('addUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
