<!--  -->
<template>
  <div class="sidebar" v-if="indexData.isConnect">
    <el-row class="tac">
      <el-col :span="12">
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
        >
          <el-submenu
            :index="`${indexData.cname[m - 1]}`"
            v-for="m in indexData.num"
            :key="m"
          >
            <template slot="title">
              <img src="../assets/database.png" alt="" class="database" />
              <span class="databaseName"> {{ indexData.cname[m - 1] }}</span>
            </template>
            <el-button type="info" class="off" @click="offConnect(m - 1)"
              >断开连接</el-button
            >
            <el-menu-item
              @click="go(n)"
              :index="`${indexData.cname[m - 1]}-${n}`"
              v-for="n in indexData.databaseNum"
              :key="n"
              ><img src="../assets/database.png" alt="" class="database" /> --
              {{ n - 1 }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */
export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'sideBar',
  components: {},
  props: {
    indexData: {
      type: Object,
    },
  },
  data() {
    //这里存放数据
    return {
      num: 0,
      cname: [],
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    go(n) {
      // :default-active="`${parseInt(m)}-${parseInt($route.query.num) + 1}`"
      localStorage.setItem('key', '')
      this.$router.replace({ path: '/database', query: { num: n - 1 } })
      this.$store.commit('isShow', true)
    },
    getNum() {
      if (localStorage.getItem('num')) {
        this.num = parseInt(localStorage.getItem('num'))
      } else {
        this.num = 0
      }
      this.cname = JSON.parse(localStorage.getItem('name'))
    },
    offConnect(n) {
      localStorage.setItem('num', parseInt(localStorage.getItem('num')) - 1)
      let name = JSON.parse(localStorage.getItem('name'))
      name.splice(n, 1)
      localStorage.setItem('name', JSON.stringify(name))
      // this.cname = JSON.parse(localStorage.getItem('name'))
      this.$emit('decrease')
      this.$store.commit('isShow', false)
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getNum()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='stylus' scoped>
/* @import url(); 引入公共css类 */
.el-row
  .el-col
    width 100%
    padding 0
    overflow hidden
    .el-menu
      width 100%
      padding 0
      .el-submenu
        overflow hidden
        width 100%
        padding 0 !important
        .database
          width 16px
          height 18px
        .databaseName
          padding-left 5px
          font-size 16px
          font-style bold
        .el-menu-item
          width 150px
          padding-left 0 !important
          text-align center
          font-size 18px
          color #f6f6f6
          img
            width 14px
            height 16px
.off
  width 100%
  border-radius 0
</style>
