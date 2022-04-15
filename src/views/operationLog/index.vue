<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">IP：</div>
        <el-input style="width: 70%" v-model="searchIP" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">姓名：</div>
        <el-input style="width: 70%" v-model="searchName" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">关键词：</div>
        <el-input style="width: 70%" v-model="searchKey" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">开始时间：</div>
        <el-date-picker
          style="width: 70%" v-model="searchBegin"
          type="datetime"
          @change="getTableData()"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="请选择日期时间">
        </el-date-picker>
    </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 20px;">
       <el-col :span="6">
        <div style="display: inline-block;width:30%;">结束时间：</div>
        <el-date-picker
          style="width: 70%" v-model="searchEnd"
          type="datetime"
          @change="getTableData()"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="请选择日期时间">
        </el-date-picker>
    </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
    </el-col>
    </el-row>
    <div style="padding: 0 20px">
        <el-table
    :data="tableData"
    border
    style="width: 100%;;border-radius: 10px;">
    <el-table-column
      prop="log_content"
      label="内容">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="IP">
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户">
    </el-table-column>
    <el-table-column
      prop="ctime"
      label="时间">
    </el-table-column>
  </el-table>
    </div>
  <div style="text-align: center;
    margin-top: 20px;">
      <el-pagination
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total,  prev, pager, next, sizes,jumper"
      :total="totalPage">
    </el-pagination>
  </div> 
  </div>
</template>

<script>
import { getlogrecordlist } from "@/api/log";
import plupload from "@/components/plupload";

export default {
  name: 'Login',
  components: {
    plupload,
  },
  data() {
    return {
        searchIP:'',
        searchName: '',
        searchBegin: '',
        searchEnd:'',
        searchKey: '',

        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
    }
  },
  watch: {},
  methods: {
    
    sizeChange(val){
        this.currentPage = 1;
        this.pageSize = val;
        this.getTableData()
    },
    currentChange(val){
        this.currentPage = val;
        this.getTableData()
    },
   resetSearch() {
     this.searchName = '';
     this.searchIP = '';
     this.searchKey = '';
     this.searchEnd = '';
     this.searchBegin = '';
     this.currentPage = 1;
     this.pageSize = 10;
     this.getTableData()
   },
    getTableData() {
      getlogrecordlist({"name": this.searchName,
        "ip": this.searchIP,
        "keyWords": this.searchKey,
        "timeEnd": this.searchEnd,
        "timeBegin": this.searchBegin,
        "page":this.currentPage,
        "pageSize":this.pageSize
        })
      .then(r => {
            this.tableData = r.data.list;
            this.totalPage = r.data.datacount
        }).catch(() => {});
    },
  },
  beforeDestroy(){
  },
//   message_
  mounted: function() {
      this.getTableData()
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.role{
  height: 100%;
  background: #fff;
}
</style>