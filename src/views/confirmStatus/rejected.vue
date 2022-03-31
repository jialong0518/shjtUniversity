<template>
  <div class="account">
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt('ruleForm')">添加面试</el-button>
    </div>
    <div style="padding: 0 0">
        <el-table
    :data="tableData"
    border
    style="width: 100%;border-radius: 10px;">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="year"
      label="年份">
    </el-table-column>
    <el-table-column
      prop="round_name"
      label="场次名称">
    </el-table-column>
    <el-table-column
      prop="expertName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="expertNo"
      label="专家工号">
    </el-table-column>
    <el-table-column
      prop="expertCollege"
      label="院系">
    </el-table-column>
    <el-table-column
      prop="expertSubject"
      label="学科">
    </el-table-column>
    <el-table-column
      prop="expertTitle"
      label="职称">
    </el-table-column>
    <el-table-column
      prop="expertPhone"
      label="电话">
    </el-table-column>
    <el-table-column
      prop="ctime"
      label="确认时间">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
    </el-table-column>
  </el-table>
    </div>
  
  </div>
</template>

<script>
import { getTable, expertbasicbind, expertbasicadd, expertbasicdel, expertbasicedit, expertbasicexport, getYearlist } from "@/api/interviewManage";
import plupload from "@/components/plupload";

export default {
  name: 'Rejected',
  components: {
    plupload,
  },
  props: {
      "tableData":{
        type:Array,
        default:{}
      }
  },
  data() {
    return {
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    accountDel(data) {
        return
      expertbasicdel({
            "id": data.id,
            })
            .then(r => {
              console.log(r)
              this.getTableData()
              this.$message({
                message: '删除成功！',
                type: 'success'
                });
            })
            .catch(() => {
            }); 
    },
    
  },
  beforeDestroy(){
  },
//   message_
  mounted: function() {
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