<template>
  <div>
  <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card class="box-card">
    <!-- 搜索和添加 -->
    <el-row :gutter="10">
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getOrderList()">
          <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="OrderList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="订单编号" prop="order_number" width="550px"></el-table-column>
      <el-table-column label="订单价格（元）" prop="order_price"  width="80px"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status"  width="140px">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"  width="80px"></el-table-column>
      <el-table-column label="下单时间" prop="create_time" width="160px">
        <template slot-scope="scope">
          {{ scope.row.create_time | dataFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template >
          <el-button type="primary" icon="el-icon-edit" size="mini" ></el-button>
          <el-button type="success" icon="el-icon-location" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
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
export default {
  components: {
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      res: '',
      OrderList: [],
      total: 0,
      data: '',
      tip: '',
      editVisible: false,
      editOrderForm: {},
      userInfo: [],
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      this.res = await this.$Http.get('orders', {
        params: this.queryInfo
      })
      if (this.res.data.meta.status !== 200) {
        return this.$message.error('获取订单列表信息失败')
      }
      this.OrderList = this.res.data.data.goods
      this.total = this.res.data.data.total
    },
    // 监听pagesize改变事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页面值
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showOrder () {
      this.$router.push('/addOrder')
    },
    updataVisible (res) {
      // console.log(res)
      this.editVisible = res
    }
  }
}
</script>

<style lang="less" scoped>
</style>
