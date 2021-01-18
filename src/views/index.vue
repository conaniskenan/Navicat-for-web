<!--  -->
<template>
  <div class="main" ref="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt="QLite" /><span>Qlite</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="150px">
        <el-button type="primary" icon="el-icon-plus" @click="openConnect"
          >新建连接</el-button
        >
        <side-bar
          :indexData="{ num, cname, databaseNum, isConnect }"
          @decrease="des"
        ></side-bar>
      </el-aside>
      <el-main>
        <el-dialog
          title="新建连接"
          :visible.sync="connectDialogFormVisible"
          width="430px"
          v-loading="connectLoading"
        >
          <el-form :model="connectForm">
            <el-form-item label="名 称">
              <el-input v-model="connectForm.name"></el-input>
            </el-form-item>
            <el-form-item label="主 机">
              <el-input v-model="connectForm.host"></el-input>
            </el-form-item>
            <el-form-item label="端 口">
              <el-input v-model="connectForm.port"></el-input>
            </el-form-item>
            <el-form-item label="密 码">
              <el-input
                v-model="connectForm.password"
                type="password"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button class="test" type="warning" @click="testConncet"
              >测试连接</el-button
            >
            <el-button @click="connectDialogFormVisible = false"
              >取 消</el-button
            >
            <el-button
              type="primary"
              native-type="submit"
              @click="handleConnect"
              >连接</el-button
            >
          </div>
        </el-dialog>
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */
import sideBar from '@/components/sideBar.vue'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    sideBar,
  },
  data() {
    //这里存放数据
    return {
      connectDialogFormVisible: false,
      connectForm: {
        name: '数据库',
        host: '119.29.41.207',
        port: '5792',
        password: 'admin',
      },
      cname: [],
      connectLoading: false,
      databaseNum: 0,
      isConnect: false,
      num: 0,
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handIsConnect() {
      if (localStorage.token) {
        this.isConnect = true
      } else {
        this.isConnect = false
      }
    },
    getUrl() {
      //119.29.41.207:5792
      let url = `http://${this.connectForm.host}:${this.connectForm.port}/cors`
      return url
    },

    getPath() {
      localStorage.setItem('key', qs.parse(this.$route.query).key ?? '')
    },
    //打开连接
    openConnect() {
      this.connectLoading = true
      setTimeout(() => {
        this.connectLoading = false
      }, 1000)
      this.connectDialogFormVisible = !this.connectDialogFormVisible
    },
    //断开连接
    offConnect() {
      localStorage.clear()
      this.handIsConnect()
      this.$router.replace('/')
    },
    //执行测试连接请求
    async testConncet() {
      try {
        let { data } = await this.$http.get(`${this.getUrl()}/ping`)
        if (data.msg == 'PONG') {
          this.$message({
            showClose: true,
            message: '测试连接成功',
            type: 'success',
            center: true,
          })
        }
      } catch (error) {
        this.$message({
          showClose: true,
          message: '测试连接失败',
          type: 'error',
          center: true,
        })
      }
    },
    //执行连接请求
    async handleConnect() {
      let { data } = await this.$http.post(`${this.getUrl()}/login`, {
        password: this.connectForm.password,
      })
      if (data.code === 200) {
        this.$message({
          showClose: true,
          message: '连接成功',
          type: 'success',
          center: true,
        })
        console.log(localStorage.getItem('name'))
        if (localStorage.getItem('name') !== null) {
          this.cname = JSON.parse(localStorage.getItem('name'))
          this.cname.push(this.connectForm.name)
          localStorage.setItem('name', JSON.stringify(this.cname))
        } else {
          this.cname.push(this.connectForm.name)
          localStorage.setItem('name', JSON.stringify(this.cname))
        }
        localStorage.setItem('token', data.token)
        if (localStorage.getItem('num')) {
          this.num = parseInt(localStorage.getItem('num')) + 1
        } else {
          this.num = 1
        }
        localStorage.setItem('num', this.num)
        this.handIsConnect()
        this.connectDialogFormVisible = false
        this.getDatabeseNum()
      }
    },
    //获取数据库数量
    async getDatabeseNum() {
      let { data } = await this.$http.get(`${this.getUrl()}/token/database`)
      this.databaseNum = data.num
    },
    getNum() {
      if (localStorage.getItem('num')) {
        this.num = parseInt(localStorage.getItem('num'))
      } else {
        this.num = 0
      }
      if (localStorage.getItem('name') !== null) {
        this.cname = JSON.parse(localStorage.getItem('name'))
      } else {
        localStorage.setItem('name', JSON.stringify(this.cname))
      }
    },
    des() {
      this.num = parseInt(localStorage.getItem('num'))
      this.cname = JSON.parse(localStorage.getItem('name'))
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    document.title = 'QLite'
    this.handIsConnect()
    this.getDatabeseNum()
    this.getNum()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.$router.replace('/')
    this.$refs.inputRef.focus()
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="stylus" scoped>
.main
  height 100%
  width 100%
  user-select none
  .el-header
    padding 0
    background-color #2B3A42
    opacity 0.7
    overflow hidden
    .logo
      display inline-block
      height 100%
      img
        width 60px
        height 60px
        margin-left 15px
        border-radius 50%
        margin-right 15px
        box-shadow 0px 0px 10px #E0E6E7
      span
        display inline-block
        font-size 40px
        height 60px
        line-height 60px
        vertical-align top 
        color #E0E6E7
        // opacity 0.8
    .el-menu
      position absolute
      top 0
      left 200px
  .el-aside
    .el-button
      border-radius 0
      height 70px
  .el-container
    height 100%
    min-width 800px
    .el-aside
      background #fff
      .el-button
        width 100%
        font-size 20px
    .el-main
      background-color #ccc
      padding 0
      .el-input
        width 300px
      .test
        position absolute
        left 10px
</style>
