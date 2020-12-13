<!--  -->
<template>
  <div class="database">
    <el-table :data="databaseList" border stripe style="width: 100%">
      <el-table-column label="序号" type="index" width="100px" align="center">
      </el-table-column>
      <el-table-column prop="type" label="type" width="400px" align="center">
      </el-table-column>
      <el-table-column prop="key" label="key" width="520px" align="center">
        <template slot-scope="scope">
          <div
            @dblclick="DoubleChange(scope.$index)"
            @keyup.enter="leaveChange(scope.$index)"
            @blur.capture="leaveChange(scope.$index)"
          >
            <el-input
              v-if="editable[scope.$index]"
              v-model="databaseList[scope.$index].key"
              ref="inputRef"
              :autofocus="true"
              class="setInput"
            ></el-input>
            <span v-else>{{ databaseList[scope.$index].key }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="time" width="500px" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >详情</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      connectForm: {
        name: '数据库',
        host: '119.29.41.207',
        port: '5792',
        password: 'admin',
      },
      databaseNum: 0,
      databaseList: [],
      editable: [],
      pre_keyName: '',
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getUrl() {
      //119.29.41.207:5792
      let url = `http://${this.connectForm.host}:${this.connectForm.port}/cors`
      return url
    },
    async getCurrentDataBase(num) {
      let { data } = await this.$http.post(`${this.getUrl()}/token/use`, {
        number: num,
      })
      localStorage.clear()
      localStorage.setItem('token', data.token)
      this.getCurrentDataBase1()
    },
    async getCurrentDataBase1() {
      let { data } = await this.$http.get(`${this.getUrl()}/token/selectx`)
      this.databaseList = data.array
      this.databaseList.forEach((item) => {
        if (item.is_durable) {
          item.time = '-'
        } else {
          let time = new Date(item.time)
          item.time = `${time.getFullYear()}-${time.getMonth()}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        }
      })
    },
    async renameKey(row) {
      let { data } = await this.$http.post(`${this.getUrl()}/token/renamex`, {
        key: this.pre_keyName,
        new_key: this.databaseList[row].key,
      })
      this.getCurrentDataBase1()
    },
    DoubleChange(row) {
      for (let i = 0; i < 16; i++) {
        if (i === row) {
          this.pre_keyName = this.databaseList[row].key
          this.editable[row] = true
          this.$set(this.editable, row, true)
          setTimeout(() => {
            this.$refs.inputRef.focus()
          }, 1)
        } else {
          this.editable[i] = false
        }
      }
    },
    leaveChange(row) {
      this.editable[row] = false
      this.$set(this.editable, row, false)
      this.renameKey(row)
    },
    async handleDelete(row) {
      let { data } = await this.$http.post(`${this.getUrl()}/token/del`, {
        keys: [row.key],
      })
      if (data.code == 200) {
        this.getCurrentDataBase1()
        this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success',
          center: true,
        })
      } else {
        this.$message({
          showClose: true,
          message: '删除失败',
          type: 'error',
          center: true,
        })
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCurrentDataBase(this.$route.params.num)
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {
    // this.getCurrentDataBase(this.$route.params.num)
  }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='stylus' scoped>
/* @import url(); 引入公共css类 */
.el-table
  font-size 20px
  font-weight bold
  .setInput
    font-size 20px
    font-weight bold
</style>
