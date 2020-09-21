<template>
  <div>
  <el-dialog
  :title="'修改' + title"
  :visible.sync="editVisible"
  width="50%"
  @close="closeForm"
  :before-close="handleClose">
  <el-form :model="editParamsForm" :rules="rules" ref="ruleForm" label-width="80px">
    <el-form-item :label="title" prop="attr_name">
      <el-input v-model="editParamsForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeVisible">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
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
        return '动态参数'
      }
    },
    cateId: {
      type: Number,
      default: () => {
        return 0
      }
    },
    activeName: {
      type: String,
      default: () => {
        return ''
      }
    },
    editParamsForm: {
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
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeForm () {
      this.$emit('editVisibleParams', false)
      this.$refs.ruleForm.resetFields()
    },
    handleClose (done) {
      this.$emit('editVisibleParams', false)
      if (!this.editVisible) {
        done()
      }
    },
    closeVisible () {
      this.$emit('editVisibleParams', false)
    },
    editParams () {
      this.$refs.ruleForm.validate(async val => {
        if (!val) {
          return false
        }
        // console.log(this.activeName)
        this.res = await this.$Http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName })
        // console.log(this.res)
        if (this.res.data.meta.status !== 200) {
          this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.$emit('editVisibleParams', false)
        this.$emit('editUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
