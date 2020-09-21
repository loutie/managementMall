<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card >
    <!-- 警告框 -->
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
    <!-- 选择列表 -->
    <el-row class="tbrow">
      <el-col :span="4">
        <div class="rowcontent">选择商品分类:</div>
      </el-col>
      <el-col :span="8">
        <!-- 级联 -->
        <el-cascader
        v-model="selectValue"
        expand-trigger= 'hover'
        :options="list"
        :props="cascaderProps"
        @change="chanegParents"
        clearable
        ></el-cascader>
      </el-col>
    </el-row>
    <!-- 分页标签 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isActive" @click="showUser" class="addbtn">添加参数</el-button>
        <el-table :data="manyDataList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 渲染标签 -->
              <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small">
              </el-input>
              <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="参数名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" size="mini" :disabled="isActive" @click="showUser">添加参数</el-button>
        <el-table :data="onlyDataList" border stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{ item }}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParamsById(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <AddDialog :title="title" :cateId="cateId" :activeName="activeName" @addUser="getParamsData" :Visible="Visible" @changeVisible="changeVisible($event)"></AddDialog>
      <EidtDialog :title="title" :cateId="cateId" :editVisible="editVisible" :editParamsForm="editParamsForm" :activeName="activeName" @editUser="getParamsData" @editVisibleParams="updataVisible($event)"></EidtDialog>
    </el-tabs>
  </el-card>
  </div>
</template>

<script>
import AddDialog from './Params/AddDialog'
import EidtDialog from './Params/updataDialog'
export default {
  components: {
    AddDialog,
    EidtDialog
  },
  data () {
    return {
      selectValue: [],
      list: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many',
      res: '',
      tip: '',
      data: '',
      manyDataList: [],
      onlyDataList: [],
      Visible: false,
      editVisible: false,
      editParamsForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    isActive () {
      if (this.selectValue.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId () {
      if (this.selectValue.length === 3) {
        return this.selectValue[2]
      } else {
        return null
      }
    },
    title () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },
  methods: {
    // 获取级联
    async getCateList () {
      this.res = await this.$Http.get('categories')
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取商品分类失败！')
      }
      this.list = this.res.data.data
    },
    // 改变级联值
    chanegParents () {
      this.getParamsData()
    },
    // 切换标签页
    handleClick () {
      this.getParamsData()
    },
    // 获取属性列表
    async getParamsData () {
      if (this.selectValue.length !== 3) {
        this.selectValue = []
        this.manyDataList = []
        this.onlyDataList = []
      }
      // console.log(this.selectValue)
      this.res = await this.$Http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取参数列表失败！')
      }
      this.res.data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(this.res.data.data)
      if (this.activeName === 'many') {
        this.manyDataList = this.res.data.data
      } else {
        this.onlyDataList = this.res.data.data
      }
    },
    // 添加属性
    showUser () {
      this.Visible = true
    },
    // 改变添加属性的布尔值
    changeVisible (res) {
      // console.log(res)
      this.Visible = res
    },
    // 修改属性
    updataVisible (res) {
      this.editVisible = res
    },
    async editDialog (attrId) {
      this.res = await this.$Http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
      console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取参数信息失败！')
      }
      this.editParamsForm = this.res.data.data
      this.editVisible = true
      // console.log(this.editVisible)
    },
    // 删除角色
    async removeParamsById (attrId) {
      this.tip = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.data = await this.$Http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if (this.data.data.meta.status !== 200) {
          this.$message.error('删除参数信息失败!')
        }
        this.$message.success('删除参数信息成功')
        this.getParamsData()
      }
    },
    handleInputConfirm (row) {
      if (row.inputVisible.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        console.log(row.attr_vals)
        row.inputValue = ''
        row.inputVisible = false
        this.addTag(row)
      }
    },
    async addTag (row) {
      this.res = await this.$Http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      // console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        // this.$refs.saveTagInput.$refs.input.focus()
      })
      // console.log(row)
    },
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.addTag(row)
    }
  }
}
</script>

<style lang="less" scoped>
.tbrow {
  margin: 15px 0;
}
.rowcontent {
  padding: 10px 0;
}
.addbtn {
  float: left;
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
  }
</style>
