<template>
  <div class="account">
      <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">用户名ID：</div>
        <el-input style="width: 70%" v-model="searchID" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">用户名：</div>
        <el-input style="width: 70%" v-model="searchusername" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">院系：</div>
        <el-input style="width: 70%" v-model="searchcollege" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">院系编码：</div>
        <el-input style="width: 70%" v-model="searchcollegecode" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">手机号：</div>
        <el-input style="width: 70%" v-model="searchphone" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <div style="display: inline-block;width:30%;">email:</div>
         <el-input style="width: 70%" v-model="searchemail" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6" style="margin-bottom: 10px;">
        <el-button type="primary" @click="getTableData()">搜索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;">
      <el-button type="primary" style="float:right;" @click="addAccountButt('ruleForm')">添加用户</el-button>
    </div>
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="编号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="password"
      label="密码"
      width="180">
    </el-table-column>
    <el-table-column
      prop="type_name"
      label="类型">
    </el-table-column>
    <el-table-column
      prop="college"
      label="院/系">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="电话">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        {{scope.row.status === 1 ? '启用' : '停用'}}
      </template>
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="enableButt(scope.row)" type="text" size="small">{{scope.row.status === 0 ? '启用' : '停用'}}</el-button>
        <el-button @click="seeAccountButt(scope.row)" type="text" size="small">查看</el-button>
        <!-- <el-button type="text" @click="editAccountButt(scope.row)" size="small">编辑</el-button> -->
        <!-- <el-popconfirm
            title="是否确定删除该用户？"
            @onConfirm="accountDel(scope.row)" 
        >
        <el-button style="margin: 0 10px;" slot="reference"  type="text" size="small">删除</el-button>
        </el-popconfirm> -->
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
  <el-dialog :title="titleForm" :show-close="false" :visible.sync="dialogAccountVisible">
  <el-form :model="form" :rules="rulesAccount" ref="ruleForm" label-width="100px">
    <el-form-item label="用户名" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="角色" prop="role">
      <el-select style="width: 300px" @change="roleFun" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.role" placeholder="请选择角色">
        <el-option v-for="item in roleList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="院系" prop="faculty">
      <el-select style="width: 300px" @change="facultyFun" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.faculty" placeholder="请选择院系">
        <el-option v-for="item in facultyData" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="手机" prop="phone">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="email" prop="email">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.email" autocomplete="off"></el-input>
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
import { userlist, userAdd, passwordreset, userdel, useredit, userbind, getCollege, userstartstop } from "@/api/account";
import { roleslist } from "@/api/role";


export default {
  name: 'Login',
  data() {
    return {
        searchemail: '',
        searchphone: '',
        searchcollegecode: '',
        searchcollege: '',         
        searchID: '',
        searchusername:'',
        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      form: {
        email:'',
        faculty: '',
        facultyName:'',
        name: '',
        phone: '',
        role: '',
        roleName: ''
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
            { required: true, message: '请填写电话', trigger: 'blur' }
        ],
        role: [
            { required: true, message: '请填选择角色', trigger: 'change' }
        ],
        faculty: [
            { required: false, message: '请填选择院系', trigger: 'change' }
        ],
        email: [
            { required: true, message: '请填写email', trigger: 'blur' }
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
      roleList: [{name:'超级管理员',code:1}, {name:'院系教学秘书', code: 2}, {name:'教学院长', code: 3}, {name:'院系管理员', code: 4}],
      facultyData: [],
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
    enableButt(data) {
      console.log(data.status)
      userstartstop(
        {"id": data.id}
      ).then(r => {
        this.getTableData()
      }).catch(() => {});    
      // userstartstop
    },
    roleFun(data) {
      this.roleList.map(item=>{
        if(item.code === data) {
          this.form.roleName = item.name;
          console.log(item.name)
        }
      })
    },
    facultyFun(data) {
      this.facultyData.map(item=>{
        if(item.code === data) {
          this.form.facultyName = item.name;
          console.log(item.name)
        }
      })
    },
    getFacultyData() {
        getCollege(
        {"uid": sessionStorage.getItem('uid')}
      ).then(r => {
        this.facultyData = r.data;
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // this.$refs[formName].resetFields();
    seeAccountButt(data) {
      this.titleForm = '查看用户'
      console.log(data)
        this.form.email = data.email
        this.form.faculty = data.college_code
        this.form.facultyName = data.college
        this.form.name = data.username
        this.form.phone = data.phone
        this.form.role = data.type
        this.form.roleName = data.type_name
      this.accountId = data.id
      this.dialogAccountVisible = true
      // this.getuserbind()
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '编辑用户'
      // this.getuserbind()
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加用户'
      this.dialogAccountVisible = true
    },
    cancelSubmit(formName) {
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
      console.log(this.form)
      this.loadingAccount = true
      userAdd({
              "username": this.form.name,
              "type": Number(this.form.role),
              "type_name": this.form.roleName,
              "college": this.form.facultyName,
              "college_code": this.form.faculty,
              "phone": this.form.phone,
              "email": this.form.email,
              })
            .then(r => {
              if(r.code === 1) {
                this.$message.error(r.msg);
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
      useredit({
              "username": this.form.account,
              "name": this.form.name,
              "id": this.accountId,
              "phone": this.form.phone,
              "roleid": this.form.role,
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
            "id": data.id})
            .then(r => {
              if(r.code === 0){
                this.$message({
                message: '密码重置成功！',
                type: 'success'
                });
              }
              this.getTableData()
              // this.word = r.info
              // this.account = data.username
              // this.openHTML(r.info)
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
    resetSearch() {
      this.searchID = '';
        this.searchusername = '';
        this.searchcollege = '';
        this.searchcollegecode = '';
        this.searchphone = '';
        this.searchemail = '';
        this.currentPage = 1;
        this.pageSize = 10;
        this.getTableData()
    },
    getTableData() {
      userlist({"id": this.searchID === '' ? 0 : this.searchID,
        "username": this.searchusername,
        "college": this.searchcollege,
        "college_code": this.searchcollegecode,
        "phone": this.searchphone,
        "email": this.searchemail,
        "pages":this.currentPage,
        "pagesize":this.pageSize
        })
      .then(r => {
            this.tableData = r.data.list;
            this.totalPage = r.data.datacount
            // r.data.rights_list.map(item=>{
            // this.rights_list[item.rights] = item.rights_id
            // })
        }).catch(() => {});
    },
    getuserbind() {
      userbind({
        "id": this.accountId,
        "uid": sessionStorage.getItem('uid')})
      .then(r => {
      this.form.phone = r.data.phone;
      this.form.role = r.data.roleid.toString();
      this.form.account = r.data.username;
      this.form.name = r.data.name;
      this.dialogAccountVisible = true

        }).catch(() => {});
    },
    openHTML(word) {
        
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
      this.getTableData()
    //   roleslist({"rolename": "",
    // "memo": "",
    // "uid": sessionStorage.getItem('uid')})
    //   .then(r => {
    //       this.roleList = r.data.data_list
    //         console.log(r)            
    //     }).catch(() => {});
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
