<template>
  <div class="account">
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt()">批量代确认</el-button>
    </div>
    <div style="padding: 0 0">
        <el-table
    :data="tableData"
    @select="tableSelect"
    @select-all="tableSelectAll"
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
      <template slot-scope="scope">
        <el-popconfirm
            title="是否确定代确认？"
            @onConfirm="accountDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;" slot="reference"  type="primary" size="mini">代确认</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
    </div>
    <el-dialog title="提示" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogAccountVisible">
      <div>是否确定转为代确认？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit()">取 消</el-button>
        <el-button :loading="loadingAccount" type="primary" @click="submitAccount()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTable, expertbasicbind, expertbasicadd, expertbasicdel, expertbasicedit, expertbasicexport, getYearlist } from "@/api/interviewManage";
import plupload from "@/components/plupload";
import { expertconfirmadmin } from "@/api/confirmStatus";

export default {
  name: 'Unconfirmed',
  components: {
    plupload,
  },
  props: {
      "tableData":{
        type:Array,
        default:{},
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
    addAccountButt() {
      if(this.ids.length === 0){
        this.$message({
                message: '请勾选数据',
                type: 'warning'
                });
      }
      this.dialogAccountVisible = true;
    },
    submitAccount() {
      this.loadingAccount = true
      expertconfirmadmin({
            "ids": this.ids,
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
              this.ids = [];
              this.loadingAccount = false;
              this.dialogAccountVisible = false;
              this.$emit('updata','已确认')
              this.$message({
                message: '操作成功！',
                type: 'success'
                });
            })
            .catch(() => {
            }); 
    },
    cancelSubmit() {
      this.dialogAccountVisible = false;
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