<template>
  <div>
  <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <!-- 搜索和添加 -->
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getGoodsList()">
          <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="showGoods">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="GoodsList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="650px"></el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="160px">
        <template slot-scope="scope">
          {{ scope.row.add_time | dataFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.goods_id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <EidtDialog :editVisible="editVisible" :editGoodsForm="editGoodsForm"  @editUser="getGoodsList" @editVisibleParams="updataVisible($event)"></EidtDialog>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  </div>
</template>

<script>
import EidtDialog from './Goods/updataDialog'
export default {
  components: {
    EidtDialog
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      res: '',
      GoodsList: [],
      total: 0,
      data: '',
      tip: '',
      editVisible: false,
      editGoodsForm: {},
      userInfo: [],
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      this.res = await this.$Http.get('goods', {
        params: this.queryInfo
      })
      if (this.res.data.meta.status !== 200) {
        return this.$message.error('获取商品列表信息失败')
      }
      // console.log(this.res.data.data.goods)
      this.GoodsList = this.res.data.data.goods
      this.total = this.res.data.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听页面值
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    showGoods () {
      this.$router.push('/addGoods')
    },
    updataVisible (res) {
      // console.log(res)
      this.editVisible = res
    },
    async editDialog (id) {
      this.res = await this.$Http.get('goods/' + id)
      console.log(this.res)
      if (this.res.data.meta.status !== 200) {
        this.$message.error('获取商品信息失败！')
      }
      this.editGoodsForm = this.res.data.data
      this.editVisible = true
    },
    // 移除商品
    async removeGoodsById (id) {
      this.tip = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(this.tip)
      if (this.tip !== 'confirm') {
        this.$message.info('已取消删除')
      } else {
        this.data = await this.$Http.delete('goods/' + id)
        if (this.data.data.meta.status !== 200) {
          this.$message.error('删除用户失败!')
        }
        this.$message.success('删除用户成功')
        this.getGoodsList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
