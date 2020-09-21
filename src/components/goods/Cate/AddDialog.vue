<template>
  <div>
  <el-dialog
  :title="title"
  :visible.sync="Visible"
  width="50%"
  @close="closeForm"
  :before-close="handleClose">
  <el-form :model="addCateForm" :rules="rules" ref="ruleForm" label-width="80px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类" >
      <el-cascader
        v-model="selectValue"
        expandTrigger= 'hover'
        :options="list"
        :props="cascaderProps"
        @change="chanegParents"
        clearable
        change-on-select
        ></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="closeVisible">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
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
        return '添加分类'
      }
    }
  },
  data () {
    return {
      res: '',
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      selectValue: [],
      list: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      rules: {
        cat_Name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getParentsCateList()
  },
  methods: {
    closeForm () {
      this.$emit('changeVisible', false)
      this.$refs.ruleForm.resetFields()
      this.selectValue = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.getParentsCateList()
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
    addCate () {
      this.$refs.ruleForm.validate(async val => {
        console.log(val)
        if (!val) {
          return false
        }
        console.log(this.addCateForm)
        this.res = await this.$Http.post('categories', this.addCateForm)
        console.log(this.res)
        if (this.res.data.meta.status !== 201) {
          this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.$emit('changeVisible', false)
        this.$emit('addUser', this.res)
      })
    },
    async getParentsCateList () {
      this.res = await this.$Http.get('categories', { params: { type: 2 } })
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取父级分类失败！')
      }
      this.list = this.res.data.data
      console.log(this.list)
    },
    chanegParents () {
      console.log(this.selectValue)
      if (this.selectValue.length > 0) {
        this.addCateForm.cat_pid = this.selectValue[this.selectValue.length - 1]
        this.addCateForm.cat_level = this.selectValue.length
      } else {
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
