<template>
  <div class="account">
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt('ruleForm')">添加年份</el-button>
    </div>
    <div style="padding: 0 20px">
        <el-table
    :data="tableData"
    border
    style="width: 100%;;border-radius: 10px;">
    <el-table-column
      prop="year"
      label="年份">
    </el-table-column>
    <el-table-column
      prop="expertGender"
      label="添加人">
    </el-table-column>
    <el-table-column
      prop="expertCollege"
      label="添加时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-popconfirm
            title="是否确定删除该年份？"
            @onConfirm="accountDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;" slot="reference"  type="text" size="small">删除</el-button>
        </el-popconfirm>
      </template>
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
  <el-dialog :title="titleForm" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogAccountVisible">
  <el-form :model="form" :rules="rulesAccount" ref="ruleForm" label-width="100px">
    <el-form-item label="年份" prop="year">
      <el-select v-model="form.year" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" placeholder="请选择">
          <el-option
            v-for="(item, index) in yearData"
            :key="index"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingAccount" type="primary" @click="submitAccount('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import {  getTable, expertbasicbind, expertbasicadd, expertbasicdel, expertbasicedit } from "@/api/yearManage";
import plupload from "@/components/plupload";

import { roleslist } from "@/api/role";
export default {
  name: 'Login',
  components: {
    plupload,
  },
  data() {
    return {
        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      yearData: [],
      form: {
        year: '',
      },
      message_: null,
      message1_:null,
      roleList: {},
      titleForm:'',
      rights_list: {},
      rulesAccount: {
        year: [
            { required: true, message: '请选择年份', trigger: 'blur' }
        ],
      },
      loadingAccount: false,
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      tableData: [],
      accountId: '',
      wordVisible: false,
      word:'',
      account:''
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
    searchFun() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData()
    },

    sizeChange(val){
        this.currentPage = 1;
        this.pageSize = val;
        this.getTableData()
    },
    currentChange(val){
        this.currentPage = val;
        this.getTableData()
    },
    
    seeAccountButt(data) {
      this.titleForm = '查看年份'
      this.accountId = data.id
      this.getuserbind()
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '编辑年份'
      // this.getuserbind()
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加年份'
      this.dialogAccountVisible = true
    },
    cancelSubmit(formName) {
      console.log(formName)
      this.accountId = '';
      this.$refs[formName].resetFields();
      this.dialogAccountVisible = false;
    },
    submitAccount(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.titleForm.indexOf('添加') !== -1){
              console.log(this.titleForm)
              this.addDataFun(formName)
            }else{
              console.log(this.titleForm)
              this.editDataFun(formName)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    addDataFun(formName1){
      this.loadingAccount = true
      expertbasicadd({
              "year": Number(this.form.year)
              }).then(r => {
                if(r.msg === '信息重复') {
                  this.loadingAccount = false
                  return
                }
              this.loadingAccount = false
              this.dialogAccountVisible = false
              this.account = this.form.account
              this.$refs[formName1].resetFields();
              this.getTableData()
            })
            .catch(() => {
              this.loadingAccount = false
            });
    },
    editDataFun(formName) {
      this.loadingAccount = true
      expertbasicedit({
              "id": this.accountId,
              "expertName": this.form.name,
              "expertGender": Number(this.form.sex),
              "expertCollege": this.form.facultyName,
              "expertCollegeCode": this.form.faculty,
              "expertTitle": this.form.titleName,
              "expertTitleCode": this.form.title,
              "expertSubject": this.form.subjectName,
              "expertSubjectCode": this.form.subject,
              "expertPhone": this.form.phone,
              "expertEmail": this.form.email,
              "inPosition": Number(this.form.inPosition),
              "expertNo": this.form.expertNo,
              "expertPwd": this.form.expertPwd,
              "remark": this.form.remark})
            .then(r => {
              if(r.msg === '信息重复') {
                  this.loadingAccount = false
                  return
                }
              this.loadingAccount = false
              this.dialogAccountVisible = false
              this.$refs[formName].resetFields();
              this.getTableData()
            })
            .catch(() => {
              this.loadingAccount = false
            });
    },
    accountDel(data) {
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
    getTableData() {
      getTable({})
      .then(r => {
            this.tableData = r.data;
            // this.totalPage = r.data.datacount
        }).catch(() => {});
    },
    
    getuserbind() {
      expertbasicbind({
        "id": this.accountId,
      })
      .then(r => {
      this.form.sex = r.data.expertGender+'';
      this.form.name = r.data.expertName;
      this.form.phone = r.data.expertPhone;
      this.form.faculty = r.data.expertCollegeCode;
      this.form.title = r.data.expertTitleCode;
      this.form.subject = r.data.expertSubjectCode;
      this.form.email = r.data.expertEmail;
      this.form.inPosition = r.data.inPosition+'';
      this.form.expertNo = r.data.expertNo;
      this.form.expertPwd = r.data.expertPwd;
      this.form.remark = r.data.remark;
      this.dialogAccountVisible = true
        }).catch(() => {});
    },
  },
  beforeDestroy(){
      this.message1_.close()
  },
//   message_
  mounted: function() {
    for( let i = 0; i < 15; i++ ){
      this.yearData.push({
        name: 2022 + i + '',
        code: 2022 + i + '',
      })
    }
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