<template>
  <div>
  <el-dialog
  :title="'添加' + title"
  :visible.sync="Visible"
  width="50%"
  @close="closeForm"
  :before-close="handleClose">
  <el-form :model="addParamsForm" :rules="rules" ref="ruleForm" label-width="80px">
    <el-form-item :label="title" prop="attr_name">
      <el-input v-model="addParamsForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeVisible">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
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
    }
  },
  data () {
    return {
      res: '',
      addParamsForm: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
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
    addParams () {
      this.$refs.ruleForm.validate(async val => {
        if (!val) {
          return false
        }
        console.log(this.activeName)
        this.res = await this.$Http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName })
        console.log(this.res)
        if (this.res.data.meta.status !== 201) {
          this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.$emit('changeVisible', false)
        this.$emit('addUser', this.res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
