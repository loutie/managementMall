<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="editVisible"
      width="50%"
      @close="closeForm"
      :before-close="handleClose">
      <el-form :model="editUserForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="分类名称" >
          <el-input v-model="editUserForm.cat_name"></el-input>
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
        return '修改角色'
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
    return {
      res: '',
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
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
        this.res = await this.$Http.put('categories/' + this.editUserForm.cat_id, {
          cat_name: this.editUserForm.cat_name
        })
        if (this.res.data.meta.status !== 200) {
          this.$message.error('更新角色失败!')
        }
        this.$message.success('更新角色成功')
        this.$emit('editVisible', false)
        this.$emit('editUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
