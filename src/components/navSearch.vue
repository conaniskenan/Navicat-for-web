<!--  -->
<template>
  <div class="search" v-if="$store.state.isClickDatabase">
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 搜索 -->
        <div class="grid-content bg-purple">
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
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button type="primary" @click="appendSearch" class="appendSearch"
            >添加数据</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="设置数据"
      :visible.sync="dialogVisible"
      width="430px"
    >
      <el-form :model="dataForm">
        <el-form-item label="type">
          <el-input v-model="dataForm.type"></el-input>
        </el-form-item>
        <el-form-item label="key">
          <el-input v-model="dataForm.key"></el-input>
        </el-form-item>
        <el-form-item label="time">
          <el-input v-model="dataForm.time"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  name: 'navSearch',
  components: {},
  data() {
    //这里存放数据
    return {
      searchData: '',
      dataForm: {
        type: '',
        key: '',
        time: 0,
      },
      dialogVisible: true,
      addDialogVisible: false,
    }
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    appendSearch() {
      this.dialogVisible = true
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
.search
  height 70px
  .el-row
    height 100%
    .setInput
      height 70px
      width 400px
      &>>>.el-input__inner
        height 70px
        font-size 20px
        border-radius none
      .btnSearch
        width 70px
    .appendSearch
      height 70px
      width 120px
      font-size 20px
.data
  width 300px
  &>>>.el-form-item_label
    font-size 18px
</style>
