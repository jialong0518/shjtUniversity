<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
      <el-col :span="18" style="line-height: 30px;">
        导入结果：成功<span style="color: green;">{{successNum}}</span>条，失败<span style="color: red;">{{failNum}}</span>条
      </el-col>
      <el-col :span="6">
        <el-button style="float: right;margin-right: 20px;" @click="goHandle" type="primary">去处理</el-button>
      </el-col>
    </el-row>
    <div style="padding: 0 20px" v-show="tableData.length > 0">
        <el-table
    :data="tableData"
    border
    style="width: 100%;;border-radius: 10px;">
    <el-table-column
      prop="expertName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="expertGender"
      label="性别">
      <template slot-scope="scope">{{ scope.row.expertGender === 1 ? '男' : '女' }}</template>
    </el-table-column>
    <el-table-column
      prop="expertCollege"
      label="院/系">
    </el-table-column>
    <el-table-column
      prop="expertTitle"
      label="职称">
    </el-table-column>
    <el-table-column
      prop="expertSubject"
      label="学科">
    </el-table-column>
    <el-table-column
      prop="result"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="importMemo"
      label="描述">
    </el-table-column>
    
  </el-table>
    </div>
    
   
  </div>
</template>

<script>

import { getCollege, getSubject, getTitle, getTable, expertimport } from "@/api/expertBasics";
export default {
  name: 'Login',
  
  data() {
    return {
        failNum: '',
        successNum: '',
        tableData: []
    }
  },
  watch: {
    
  },
  methods: {
    goHandle() {
      this.$router.push({
         path:'/uploadRecord/uploadRecord'
        });
    },
    expertImportData(data) {
      expertimport({
        "fileName": `${data.fileHash}/${data.name}`,
        "year": data.year,
        "source": data.source
        }).then(r => {
        this.tableData = r.data.fail_list;
        this.failNum = r.data.fail;
        this.successNum = r.data.success;
      }).catch(() => {});
    },
  },
  mounted: function() {
    console.log(this.$route.query.data)
    let data = JSON.parse(this.$route.query.data)
    this.expertImportData(data)
    // {"code":200,"msg":"","data":"http://127.0.0.1:9999/uploadFile/c67a93b8756ecacdc13dda1de8661dda/Book12.xlsx","fileHash":"c67a93b8756ecacdc13dda1de8661dda","name":"Book12.xlsx"}
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