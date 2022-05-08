<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">年份：</div>
        <el-select v-model="searchYear" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in yearData"
            :key="item.year"
            :label="item.year"
            :value="item.year">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">名称：</div>
        <el-input style="width: 80%" v-model="searchName" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="addAccountButt('ruleForm')">添加面试</el-button>
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
      prop="audition_name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button  @click="seeAccountButt(scope.row)" type="primary" size="mini">查看场次</el-button>
        <el-button  type="primary" @click="editAccountButt(scope.row)" size="mini">编辑</el-button>
        <el-popconfirm
            title="是否确定删除该记录？"
            @onConfirm="accountDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;" slot="reference"  type="danger" size="mini">删除</el-button>
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
      <el-select v-model="form.year" :disabled="titleForm.indexOf('查看')!== -1" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in yearData"
            :key="item.year"
            :label="item.year"
            :value="item.year">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
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
import { getTable, expertbasicbind, expertbasicadd, expertbasicdel, expertbasicedit, expertbasicexport, getYearlist } from "@/api/interviewManage";
import plupload from "@/components/plupload";

export default {
  name: 'Login',
  components: {
    plupload,
  },
  data() {
      let validatePhone = (rule, value, callback) => {
          console.log(rule, value)
          let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (!myreg.test(value)) {
            callback(new Error('手机号格式不正确'));
            return;
        }
        callback();
      };
      let validateNo = (rule, value, callback) => {
          let myreg = /^[0-9A-Za-z]+$/;
        if (!myreg.test(value) || value.length > 15 || value.length === 0) {
            callback(new Error('专家工号1至15位，数组或者字母'));
            return;
        }
        callback();
      };
      let validateEml = (rule, value, callback) => {
          let myreg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
        if (!myreg.test(value)) {
            callback(new Error('邮箱格式不正确'));
            return;
        }
        callback();
      };
    return {
        searchYear:'',
        searchName:'',
        yearData:[],

        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      form: {
        year: '',
        name: '',
        
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
        name: [
            { required: true, message: '请填写名称', trigger: 'change' }
        ]
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
    getYearData() {
      getYearlist({}).then(r => {
        this.yearData = r.data;
      }).catch(() => {});    
    },

    batchImport(data) {
      console.log(data,'批量导入')
       this.$router.push({
         path:'/importResults',
         query:{data: JSON.stringify(data)}
        });
    },

    expertNoFun(data) {
      console.log(data)
      this.form.expertPwd = data
    },
    
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
      this.titleForm = '查看面试';
      this.accountId = data.id;
      this.$router.push({path:'/interviewRound',query:{id:data.id, auditionName: data.audition_name}});
      // this.getuserbind()
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '编辑面试'
      this.getuserbind()
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加面试'
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
              "audition_name": this.form.name,
              "year": Number(this.form.year),
              }).then(r => {
                if(r.code === 1){
                this.$message({
                message:  r.msg,
                type: 'warning'
                });
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
              "audition_name": this.form.name,
              "year": Number(this.form.year),
              "id": this.accountId,
              })
            .then(r => {
              if(r.code === 1){
                this.$message({
                message:  r.msg,
                type: 'warning'
                });
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
              if(r.code === 1){
                this.$message({
                message:  r.msg,
                type: 'warning'
                });
                return
              }
              this.getTableData()
              this.$message({
                message: '删除成功！',
                type: 'success'
                });
            })
            .catch(() => {
            }); 
    },
    resetSearch() {
      this.searchYear = '';
      this.searchName = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    getTableData() {
      getTable({"year": this.searchYear === '' ? 0 : this.searchYear,
        "audition_name": this.searchName,
        // "competent": this.searchTitle,
        // "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize
        })
      .then(r => {
            this.tableData = r.data.list;
            this.totalPage = r.data.datacount
        }).catch(() => {});
    },
    exportData() {
      expertbasicexport({"college": this.searchFaculty,
        "subject": this.searchSubject,
        "competent": this.searchTitle,
        "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize
        })
      .then(r => {
        window.location.href= r.data;
        }).catch(() => {});
    },
    getuserbind() {
      expertbasicbind({
        "id": this.accountId,
      })
      .then(r => {
      this.form.year = r.data.year+'';
      this.form.name = r.data.audition_name;
      this.dialogAccountVisible = true
        }).catch(() => {});
    },
  },
  beforeDestroy(){
      this.message1_.close()
  },
//   message_
  mounted: function() {
    this.getYearData()
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