<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">院系：</div>
        <el-select v-model="searchFaculty" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in facultyData"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">学科：</div>
        <el-select v-model="searchSubject" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in subjectData"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">姓名：</div>
        <el-input style="width: 80%" v-model="searchName" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">职称：</div>
        <el-select v-model="searchTitle" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in titleData"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 20px;">
      <el-col :span="6">
        <el-button type="primary" @click="getTableData()">搜 索</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;">
      <el-button type="primary"  style="float:right;" @click="addAccountButt('ruleForm')">添加账号</el-button>
      <el-button type="primary"  style="float:right;" @click="addAccountButt('ruleForm')">批量导入</el-button>
      <el-button type="primary"  style="float:right;" @click="addAccountButt('ruleForm')">导入到专家资格库</el-button>
      <el-button type="primary"  style="float:right;" @click="addAccountButt('ruleForm')">导出结果</el-button>
    </div>
    <div style="padding: 0 20px">
        <el-table
    :data="tableData"
    border
    style="width: 100%;;border-radius: 10px;">
    <el-table-column
      prop="phone"
      label="账号">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号">
    </el-table-column>
    <el-table-column
      prop="date"
      label="录入时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button  @click="seeAccountButt(scope.row)" type="text" size="small">查看</el-button>
        <el-button  type="text" @click="editAccountButt(scope.row)" size="small">编辑</el-button>
        <el-popconfirm
            title="是否确定删除该账号？"
            @onConfirm="accountDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;" slot="reference"  type="text" size="small">删除</el-button>
        </el-popconfirm>
        <!-- <el-button v-if="rights_list['删除']" @click="handleClick(scope.row)" type="text" size="small">删除</el-button> -->
        <el-popconfirm
            title="确认重置密码吗？"
            @onConfirm="resetAccount(scope.row)" 
        >
        <el-button  slot="reference" type="text" size="small">重置密码</el-button>
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
    <el-form-item label="姓名" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingAccount" type="primary" @click="submitAccount('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<el-dialog title="密码提示" :show-close="false" width="400px" :visible.sync="wordVisible">
  <div style="font-size: 18px;">账号：<span style="font-size: 18px;font-weight:600;">{{account}}</span></div>  
  <div style="font-size: 18px;">密码：<span style="font-size: 18px;font-weight:600;">{{word}}</span></div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="wordSubmit()">复制账号密码</el-button>
    <el-button  type="primary" @click="wordAccount()">关闭</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset, userdel, useredit, userbind } from "@/api/account";

import { getCollege, getSubject, getTitle, getTable } from "@/api/expertBasics";

import { roleslist } from "@/api/role";
export default {
  name: 'Login',
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
    return {
        searchFaculty:'',
        searchSubject: '',
        searchTitle: '',
        searchName:'',
        facultyData: [],
        subjectData: [],
        titleData: [],

        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      form: {
        account: '',
        name: '',
        phone: '',
        role: ''
      },
      message_: null,
      message1_:null,
      roleList: {},
      titleForm:'',
      rights_list: {},
      rulesAccount: {
        name: [
            { required: true, message: '请填写名字', trigger: 'blur' }
        ],
        phone: [
            { required: true, validator:validatePhone, trigger: 'blur' }
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
    getFacultyData() {
        getCollege(
        {"uid": sessionStorage.getItem('uid')}
      ).then(r => {
        this.facultyData = r.data;
      }).catch(() => {});    
    },

    getSubjectData() {
      getSubject({"uid": sessionStorage.getItem('uid')}).then(r => {
        this.subjectData = r.data;
      }).catch(() => {});
    },

    getTitleData() {
      getTitle({"uid": sessionStorage.getItem('uid')}).then(r => {
        this.titleData = r.data;
      }).catch(() => {});
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
      this.titleForm = '查看用户'
      this.accountId = data.id
      this.getuserbind()
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '编辑用户'
      this.getuserbind()
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加用户'
      this.dialogAccountVisible = true
    },
    cancelSubmit(formName) {
      this.accountId = '';
      this.dialogAccountVisible = false;
      this.$refs[formName].resetFields();
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
      userAdd({
              "name": this.form.name,
              "phone": this.form.phone,
              "uid": sessionStorage.getItem('uid')})
            .then(r => {
              this.loadingAccount = false
              this.dialogAccountVisible = false
              this.word = r.info
              this.account = this.form.account
              this.$refs[formName1].resetFields();
              // this.wordVisible = true
              console.log('123')
              this.getTableData()
              this.openHTML(r.info)
              setTimeout(()=>{
                // this.wordVisible = true
                console.log('123')
              },500)
              
            })
            .catch(() => {
              this.loadingAccount = false
            });
    },
    editDataFun(formName) {
      this.loadingAccount = true
      useredit({
              "name": this.form.name,
              "id": this.accountId,
              "phone": this.form.phone,
              "uid": sessionStorage.getItem('uid')})
            .then(r => {
              this.loadingAccount = false
              this.dialogAccountVisible = false
              this.$refs[formName].resetFields();
              this.getTableData()
            })
            .catch(() => {
              this.loadingAccount = false
            });
    },
    resetAccount(data) {
        passwordreset({
            "id": data.id,
            "uid": sessionStorage.getItem('uid')})
            .then(r => {
              console.log(r)
              this.word = r.info
              this.account = data.username
              this.openHTML(r.info)
              // this.wordVisible = true
            })
            .catch(() => {
            });      
    },
    accountDel(data) {
      userdel({
            "id": data.id,
            "uid": sessionStorage.getItem('uid')})
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
      getTable({"college": this.searchFaculty,
        "subject": this.searchSubject,
        "competent": this.searchTitle,
        "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize
        })
      .then(r => {
            this.tableData = r.data.list;
            this.totalPage = r.data.datacount
        }).catch(() => {});
    },
    getuserbind() {
      userbind({
        "id": this.accountId,
        "uid": sessionStorage.getItem('uid')})
      .then(r => {
        console.log(r.data)
      this.form.phone = r.data.phone;
      this.form.name = r.data.name;
      this.dialogAccountVisible = true
        }).catch(() => {});
    },
    
    wordSubmit(){
        let that = this
        let text = `账号：${that.account}，密码：${that.word}`
        let save = function (e) {
                //设置需要复制模板的内容账号：123，密码：rxw10m
                e.clipboardData.setData('text/plain',text);
                //阻止默认行为
                e.preventDefault();
            }
            // h5监听copy事件，调用save函数保存到模板中
            document.addEventListener('copy',save);
            // 调用右键复制功能
            document.execCommand('copy');
            //移除copy事件
            document.removeEventListener('copy',save);
            this.message1_ = this.$message({
                message: '复制成功！',
                type: 'success'
                });
    },
    wordAccount(){
        this.wordVisible = false
    },
  },
  beforeDestroy(){
      this.message1_.close()
  },
//   message_
  mounted: function() {
    this.getFacultyData()
    this.getSubjectData()
    this.getTitleData()
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