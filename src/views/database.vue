<!--  -->
<template>
  <div class="database" v-if="$store.state.show">
    <div class="search">
      <el-row :gutter="10">
        <el-col :xs="4" :sm="6" :md="8" :lg="10" :xl="8">
          <!-- 搜索 -->
          <el-input
            v-model="searchData"
            placeholder="请输入key值进行搜索"
            clearable
            @clear="search"
            @change="search"
            @click="search"
            @input="search"
            class="setInput"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="btnSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :xs="10" :sm="8" :md="8" :lg="8" :xl="6">
          <el-button type="warning" @click="isShow = true" class="appendSearch"
            >添加数据</el-button
          >
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" class="go">
          <el-button
            v-if="isReturn"
            type="info"
            @click="toPre"
            class="appendSearch"
            >返回上层</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-table :data="filterList" border stripe style="width: 100%">
      <el-table-column label="序号" type="index" width="100px" align="center">
        <template v-slot="scope">
          <span>{{ (page - 1) * limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="type" min-width="22%" align="center">
      </el-table-column>
      <el-table-column prop="key" label="key" min-width="22%" align="center">
        <template slot-scope="scope">
          <div
            @dblclick="DoubleChange(scope.$index)"
            @keyup.enter="leaveChange(scope.$index)"
            @blur.capture="leaveChange(scope.$index)"
          >
            <el-input
              v-if="editable[scope.$index]"
              v-model="filterList[scope.$index].key"
              ref="inputRef"
              :autofocus="true"
              class="setInput"
            ></el-input>
            <span v-else>{{ filterList[scope.$index].key }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="time" min-width="20%" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="15%">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row)"
            >详情</el-button
          >
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >></el-pagination
      >
    </div>
    <div class="add_key">
      <el-dialog title="添加数据" :visible.sync="isShow" width="500px">
        <el-form ref="form" :model="dataForm" label-width="90px">
          <el-form-item label="数据类型">
            <el-select v-model="dataForm.type" placeholder="请选择数据类型">
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="key">
            <el-input
              v-model="dataForm.key"
              placeholder="请输入key name"
            ></el-input>
          </el-form-item>
          <el-form-item label="value" v-if="dataForm.type.value == 'string'">
            <el-input
              v-model="dataForm.value"
              placeholder="请输入value"
            ></el-input>
          </el-form-item>
          <el-form-item label="time">
            <el-input v-model="dataForm.time"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShow = flase">取 消</el-button>
          <el-button type="primary" @click="appendKey">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
/* eslint-disable */
import qs from 'qs'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      dataForm: {
        type: '',
        key: '',
        value: '',
        time: 0,
      },
      connectForm: {
        name: '数据库',
        host: '119.29.41.207',
        port: '5792',
        password: 'admin',
      },
      option: [
        { value: 'string', label: 'string' },
        { value: 'list', label: 'list' },
        { value: 'map', label: 'map' },
        { value: 'hash', label: 'hash' },
      ],
      isShow: false,
      databaseNum: 0,
      databaseList: [],
      editable: [],
      pre_keyName: '',
      curPath: '',
      isReturn: false,
      searchData: '',
      filterList: [],
      limit: 10,
      total: null,
      page: 1,
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
    getPath() {
      localStorage.setItem('key', qs.parse(this.$route.query).key ?? '')
    },
    async getCurrentDataBase(num) {
      let { data } = await this.$http.post(`${this.getUrl()}/token/use`, {
        number: num,
      })
      localStorage.setItem('token', data.token)
      this.getCurrentDataBase1()
    },
    async getCurrentDataBase1() {
      let { data } = await this.$http.get(
        `${this.getUrl()}/token/selectx${localStorage.getItem('key')}`
      )
      this.databaseList = data.array
      this.databaseList.forEach((item) => {
        if (item.is_durable) {
          item.time = '-'
        } else {
          let time = new Date(item.time)
          item.time = `${time.getFullYear()}-${time.getMonth()}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        }
      })
      this.getFilterList()
    },
    async renameKey(row) {
      let { data } = await this.$http.post(
        `${this.getUrl()}/token/renamex${localStorage.getItem('key')}`,
        {
          key: this.pre_keyName,
          new_key: this.filterList[row].key,
        }
      )
      this.getCurrentDataBase1()
    },
    DoubleChange(row) {
      for (let i = 0; i < 16; i++) {
        if (i === row) {
          this.pre_keyName = this.filterList[row].key
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
      let { data } = await this.$http.post(
        `${this.getUrl()}/token/del${localStorage.getItem('key')}`,
        {
          keys: [row.key],
        }
      )
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
    async appendKey(isShow) {
      this.isShow = false
      try {
        if (this.dataForm.type.value == 'string') {
          let { data } = await this.$http.post(
            `${this.getUrl()}/token/sset${localStorage.getItem('key')}`,
            {
              data: [
                {
                  key: this.dataForm.key,
                  time: this.dataForm.time,
                  type: this.dataForm.type.value,
                  value: this.dataForm.value,
                },
              ],
            }
          )
          if (data.code == 200) {
            console.log(data)
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              center: true,
            })
            this.getCurrentDataBase1()
          }
        } else {
          let { data } = await this.$http.post(
            `${this.getUrl()}/token/set${localStorage.getItem('key')}`,
            {
              key: this.dataForm.key,
              time: this.dataForm.time,
              type: this.dataForm.type.value,
            }
          )
          if (data.code == 200) {
            console.log(data)
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success',
              center: true,
            })
            this.getCurrentDataBase1()
          }
        }
        this.showTable(isShow)
      } catch (error) {
        if (data.code != 200) {
          this.$message({
            showClose: true,
            message: '添加失败',
            type: 'error',
            center: true,
          })
        }
      }
    },
    async handleEdit(row) {
      if (row.type == 'string') {
        let { data } = await this.$http.post(
          `${this.getUrl()}/token/sget${localStorage.getItem('key')}`,
          {
            keys: [row.key],
          }
        )
        this.$alert(`${data.strs[0]}`, `${row.type}`, {
          confirmButtonText: '确定',
          center: true,
        })
      } else if (row.type == 'hash') {
        let key = localStorage.getItem('key')
        localStorage.setItem('key', `${key}/${row.key}`)
        this.$router.replace({
          path: '/database',
          query: {
            num: this.$route.query.num,
            key: localStorage.getItem('key'),
          },
        })
      }
    },
    getFilterList() {
      //  es6过滤得到满足搜索条件的展示数据list
      //过滤分页
      let list = this.databaseList.filter((item, index) =>
        item.key.toLowerCase().includes(this.searchData.toLowerCase())
      )
      this.filterList = list.filter(
        (item, index) =>
          index < this.page * this.limit &&
          index >= this.limit * (this.page - 1)
      )
      this.total = list.length
    },
    handleSizeChange(val) {
      this.limit = val
      this.getFilterList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getFilterList()
    },
    search() {
      this.page = 1
      this.getFilterList()
    },
    toPre() {
      let path = localStorage.getItem('key')
      let num = path.lastIndexOf('/')
      path = path.slice(0, num)
      localStorage.setItem('key', path)
      this.$router.replace({
        path: '/database',
        query: {
          num: this.$route.query.num,
          key: localStorage.getItem('key'),
        },
      })
    },
    isShowReturn() {
      if (localStorage.getItem('key') == '') {
        this.isReturn = false
      } else {
        this.isReturn = true
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getCurrentDataBase(parseInt(this.$route.query.num))
    this.getPath()
    this.isShowReturn()
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
.database
  overflow hidden
.el-table
  width 100%
  font-size 20px
  font-weight bold
  .setInput
    font-size 20px
    font-weight bold
.add_key
  .el-select
    width 300px
  .el-input
    width 300px
.search
  height 70px
  .el-row
    height 100%
    .setInput
      height 70px
      width 500px
      &>>>.el-input__inner
        height 70px
        font-size 20px
        border-radius none
      .btnSearch
        width 110px
    .appendSearch
      height 70px
      width 120px
      font-size 20px
.data
  width 300px
.pagination
  transform translate(50%)
  margin-left -40%
  margin-top 30px
.go
  position absolute
  right 80px
</style>
