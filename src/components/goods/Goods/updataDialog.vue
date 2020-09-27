<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="editVisible"
      width="50%"
      @close="closeForm"
      :before-close="handleClose">
      <el-form :model="editGoodsForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
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
        return '修改商品'
      }
    },
    editGoodsForm: {
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
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
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
        console.log(this.editGoodsForm.goods_id)
        this.res = await this.$Http.put('goods/' + this.editGoodsForm.goods_id, {
          goods_name: this.editGoodsForm.goods_name,
          goods_price: this.editGoodsForm.goods_price,
          goods_weight: this.editGoodsForm.goods_weight,
          goods_number: this.editGoodsForm.goods_number
        })
        console.log(this.res)
        if (this.res.data.meta.status !== 200) {
          this.$message.error('更新商品失败!')
        } else {
          this.$message.success('更新商品成功')
          this.$emit('editVisible', false)
          this.$emit('editUser', this.res)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
