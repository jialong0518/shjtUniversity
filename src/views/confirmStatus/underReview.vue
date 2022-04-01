<template>
  <div class="account">
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt('1')">批量通过</el-button>
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt('0')">批量拒绝</el-button>
    </div>
    <div style="padding: 0 0">
        <el-table
        @select="tableSelect"
    @select-all="tableSelectAll"
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
    <el-table-column
      label="操作">
      <template  slot-scope="scope">
        <el-button  type="text" @click="examineButt(scope.row)" size="small">审核</el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
    <el-dialog title="审核信息" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogAccountVisible">
      <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">年份：</div>
        {{roundObj.year}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">类型：</div>
        {{itemObj.dataType}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">院系：</div>
        {{itemObj.expertCollege}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">面试信息：</div>
        {{roundObj.auditionName}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">场次名称：</div>
        {{itemObj.round_name}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">限定人数：</div>
        {{itemObj.expertCollege}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">姓名：</div>
        {{itemObj.expertName}}
    </el-col>
    <el-col :span="24" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:20%;text-align: right;">面试时间段：</div>
        {{roundObj.audition_begin+'——'+roundObj.audition_end}}
    </el-col>
    </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit()">关 闭</el-button>
        <el-button @click="submitAccount('0')">拒绝</el-button>
        <el-button :loading="loadingAccount" type="primary" @click="submitAccount('1')">通过</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogBatchVisible">
      <div>是否确批量审批{{state}}?</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit()">取 消</el-button>
        <el-button :loading="loadingAccount" type="primary" @click="examineSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { expertconfirmadmin } from "@/api/confirmStatus";
import plupload from "@/components/plupload";

export default {
  name: 'UnderReview',
  components: {
    plupload,
  },
  props: {
      "tableData":{
        type:Array,
        default:{}
      },
      "roundObj": {
        type: Object,
        default: {}
      }
  },
  data() {
    return {
      ids:[],
      loadingAccount: false,
      dialogAccountVisible: false,
      dialogBatchVisible: false,
      itemObj: {},
      state: '',
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
      expertconfirmadmin({
            "ids": [data.id],
            "status": '已确认',
            "fid": this.roundObj.id
            })
            .then(r => {
              if(r.code === 1){
                this.$message({
                message: r.msg,
                type: 'error'
                });
                return
              }
              this.$emit('updata','已确认')
              this.$message({
                message: '操作成功！',
                type: 'success'
                });
            })
            .catch(() => {
            }); 
    },
    examineButt(data){
      this.itemObj = data;
      this.dialogAccountVisible = true;
      this.ids = [data.id]
      console.log(this.roundObj)
      console.log(this.itemObj)
    },
    tableSelect(selection, row) {
      this.ids = []
      selection.map(item=>{
        this.ids.push(item.id);
      })
    },
    tableSelectAll(selection) {
      this.ids = []
      selection.map(item=>{
        this.ids.push(item.id);
      })
    },
    addAccountButt(data) {
      if(this.ids.length === 0){
        this.$message({
                message: '请勾选数据',
                type: 'warning'
                });
                return
      }
      this.state = data === '0' ? '拒绝' : '通过';
      this.dialogBatchVisible = true;
    },
    submitAccount(data) {
      this.loadingAccount = true
      this.state = data === '0' ? '拒绝' : '通过';
      this.examineSubmit()
    },
    examineSubmit() {
      expertconfirmadmin({
            "ids": this.ids,
            "status": this.state === '通过' ? '已确认' : '已拒绝',
            "fid": this.roundObj.id
            })
            .then(r => {
              if(r.code === 1){
                this.$message({
                message: r.msg,
                type: 'error'
                });
                return
              }
              this.ids = [];
              this.loadingAccount = false;
              this.dialogAccountVisible = false;
              this.dialogBatchVisible = false;
              this.$emit('updata','审核')
              this.$message({
                message: '操作成功！',
                type: 'success'
                });
            })
            .catch(() => {
            }); 
    },
    cancelSubmit() {
      this.dialogBatchVisible = false;
      this.dialogAccountVisible = false;
      this.itemObj = {};
    }
    
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