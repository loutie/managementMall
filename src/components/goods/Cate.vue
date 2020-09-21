<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-edit" @click="showUser">添加分类</el-button>
          <AddDialog  @addUser="getcateList" :list="parentsList" :Visible="Visible" @changeVisible="changeVisible($event)"></AddDialog>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="false"
        class="table">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <EidtDialog :editVisible="editVisible" :editUserForm="editUserForm" @editUser="getcateList" @editVisible="updataVisible($event)"></EidtDialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </el-card>
  </div>
</template>

<script>
import AddDialog from './Cate/AddDialog'
import EidtDialog from './Cate/updataDialog'
export default {
  components: {
    AddDialog,
    EidtDialog
  },
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      Visible: false,
      editVisible: false,
      addCateForm: [],
      editUserForm: {},
      total: 0,
      cateList: [],
      parentsList: [],
      res: '',
      tip: '',
      data: '',
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ]
    }
  },
  created () {
    this.getcateList()
  },
  methods: {
    async getcateList () {
      this.res = await this.$Http.get('categories', { params: this.queryInfo })
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取权限列表失败！')
      }
      this.cateList = this.res.data.data.result
      this.total = this.res.data.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getcateList()
    },
    // 监听页面值
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getcateList()
    },
    showUser () {
      // this.getParentsCateList()
      this.Visible = true
      // console.log(this.Visible)
    },
    changeVisible (res) {
      // console.log(res)
      this.Visible = res
    },
    async getParentsCateList () {
      this.res = await this.$Http.get('categories', { params: { type: 2 } })
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取父级分类失败！')
      }
      this.parentsList = this.res.data.data
      // console.log(this.parentsList)
    },
    updataVisible (res) {
      this.editVisible = res
    },
    async editDialog (id) {
      this.res = await this.$Http.get('categories/' + id)
      // console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('更新分类信息失败！')
      }
      this.editUserForm = this.res.data.data
      this.editVisible = true
    },
    // 删除角色
    async removeRoleById (id) {
      this.tip = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.data = await this.$Http.delete('categories/' + id)
        if (this.data.data.meta.status !== 200) {
          this.$message.error('删除分类失败!')
        }
        this.$message.success('删除分类成功')
        this.getcateList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  margin: 15px;
}
</style>
