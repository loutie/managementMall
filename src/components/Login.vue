<template>
  <div class="login-container">
      <div class="login-box">
          <div class="avatar-box">
              <img src="../assets/logo.png" alt="">
              <el-row>
                <el-button>默认按钮</el-button>
                <el-button type="primary">主要按钮</el-button>
                <el-button type="success">成功按钮</el-button>
                <el-button type="info">信息按钮</el-button>
                <el-button type="warning">警告按钮</el-button>
                <el-button type="danger">危险按钮</el-button>
            </el-row>
          </div>
      </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
.login-container {
    background-color: #2b4b6b;
    height: 100%;
}
.login-box {
    position: absolute;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
        width: 130px;
        height: 130px;
        border: 2px solid #e2e2e2;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -55%);
        background-color: #fff;
        img {
            width: 100%;
            height: 100%;
            background-color: #eee;
            border-radius: 50%;
        }
    }
}
</style>
