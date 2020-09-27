<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <!-- 警告框 -->
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active - 0" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <el-form :model="addCateForm" :rules="rules" ref="ruleForm"  label-position="right" >
      <!-- tab栏 -->
      <el-tabs v-model="active" :tab-position="tabPosition" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称：" prop="goods_name">
              <el-input v-model="addCateForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格：" prop="goods_price">
              <el-input v-model="addCateForm.goods_price " type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量：" prop="goods_weight">
              <el-input v-model="addCateForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量：" prop="goods_number">
              <el-input v-model="addCateForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类：" prop="goods_cat">
              <el-cascader
                v-model="addCateForm.goods_cat"
                expandTrigger= 'hover'
                :options="list"
                :props="cascaderProps"
                @change="chanegParents"
                clearable
                ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyDataList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1, index) in item.attr_vals" :key="index" border size="small"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyDataList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addCateForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
    </el-form>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="" class="dialogImg">
    </el-dialog>
  </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: '0',
      tabPosition: 'left',
      addCateForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      list: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      res: '',
      manyDataList: [],
      onlyDataList: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewVisible: false,
      previewPath: '',
      deepForm: []
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addCateForm.goods_cat.length === 3) {
        return this.addCateForm.goods_cat[2]
      } else {
        return null
      }
    }
  },
  methods: {
    // 获取商品分类
    async getCateList () {
      this.res = await this.$Http.get('categories')
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取商品分类失败！')
      }
      this.list = this.res.data.data
    },
    // 商品分类级联选择三级处理
    chanegParents () {
      if (this.addCateForm.goods_cat.length !== 3) {
        this.addCateForm.goods_cat = []
      }
    },
    beforeTabLeave (actName, oldName) {
      if (oldName === '0' && this.addCateForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!!')
        return false
      }
    },
    // 切换tab
    async tabClick () {
      if (this.active === '1') {
        this.res = await this.$Http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (this.res.data.meta.status !== 200) {
          this.$message.error('获取动态参数失败！')
        } else {
          this.$message.success('获取动态参数成功！')
          this.res.data.data.forEach(i => {
            i.attr_vals = i.attr_vals.length === 0 ? [] : i.attr_vals.split(' ')
          })
          this.manyDataList = this.res.data.data
        }
      } else if (this.active === '2') {
        this.res = await this.$Http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        console.log(this.res)
        if (this.res.data.meta.status !== 200) {
          this.$message.error('获取静态参数失败！')
        } else {
          this.$message.success('获取静态参数成功！')
          this.onlyDataList = this.res.data.data
          // console.log(this.onlyDataList)
        }
      }
    },
    // 处理图片预览
    handlePreview (file) {
      // console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 关闭图片预览
    handleRemove (file) {
      // console.log(file)
      const filePath = file.response.data.tem_path
      this.res = this.addCateForm.pics.findIndex(i => {
        return i.pic === filePath
      })
      this.addCateForm.pics.splice(this.res, 1)
    },
    // 上传图片成功赋值到参数列表
    handleSuccess (res) {
      this.addCateForm.pics.push({ pic: res.data.tmp_path })
      // console.log(this.addCateForm)
    },
    add () {
      this.$refs.ruleForm.validate(async val => {
        if (!val) {
          return this.$message.error('请填写必要的选项!')
        }
        this.deepForm = this._lodash.cloneDeep(this.addCateForm)
        this.deepForm.goods_cat = this.deepForm.goods_cat.join(',')
        // 处理动态参数
        this.manyDataList.forEach(i => {
          this.addCateForm.attrs.push({
            attr_id: i.attr_id,
            attr_value: i.attr_vals.join(' ')
          })
        })
        // 处理静态属性
        this.onlyDataList.forEach(i => {
          this.addCateForm.attrs.push({
            attr_id: i.attr_id,
            attr_value: i.attr_vals
          })
        })
        this.deepForm.attrs = this.addCateForm.attrs
        console.log(this.deepForm)
        await this.$Http.post('goods', this.deepForm)
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px;
}
.el-cascader {
  float: left;
}
.el-checkbox-group {
  margin: 30px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.el-upload {
  margin: 15px;
}
.dialogImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
