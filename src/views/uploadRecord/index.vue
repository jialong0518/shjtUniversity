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
        <div style="display: inline-block;width:20%;">性别：</div>
        <el-select v-model="searchGender" style="width: 80%" placeholder="请选择">
          <el-option
            label="男"
            value="1">
          </el-option>
          <el-option
            label="女"
            value="2">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">在职：</div>
        <el-select v-model="searchInPosition" style="width: 80%" placeholder="请选择">
          <el-option
            label="是"
            value="1">
          </el-option>
          <el-option
            label="否"
            value="2">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">院系：</div>
        <el-select v-model="searchFaculty" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in facultyData"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
    </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 20px;">
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">学科：</div>
        <el-select v-model="searchSubject" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in subjectData"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">姓名：</div>
        <el-input style="width: 80%" v-model="searchName" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">电话：</div>
        <el-input style="width: 80%" v-model="searchPhone" @change="getTableData()" autocomplete="off"></el-input>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:20%;">职称：</div>
        <el-select v-model="searchTitle" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in titleData"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
    </el-col>
    </el-row>
    <!-- 导入结果：成功/失败；导入类型：基础库/资格库； -->
    <el-row :gutter="20" style="padding: 20px;">
      <el-col :span="6">
        <div style="display: inline-block;width:30%;">导入结果：</div>
        <el-select v-model="searchResult" style="width: 70%" placeholder="请选择">
          <el-option
            label="全部"
            value="全部">
          </el-option>
          <el-option
            label="成功"
            value="成功">
          </el-option>
          <el-option
            label="失败"
            value="失败">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <div style="display: inline-block;width:30%;">导入类型：</div>
        <el-select v-model="searchType" style="width: 70%" placeholder="请选择">
          <el-option
            label="全部"
            value="全部">
          </el-option>
          <el-option
            label="基础库"
            value="基础库">
          </el-option>
          <el-option
            label="资格库"
            value="资格库">
          </el-option>
        </el-select>
    </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
    </el-col>
    </el-row>
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;"  @click="batchDel()">批量删除</el-button>
    </div>
    <div style="padding: 0 20px">
        <el-table
        @select="tableSelect"
    @select-all="tableSelectAll"
    :data="tableData"
    border
    style="width: 100%;;border-radius: 10px;">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="expertName"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="expertNo"
      label="学工号">
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
      prop="expertPhone"
      label="电话">
    </el-table-column>
    <el-table-column
      prop="result"
      label="状态">
    </el-table-column>
    <el-table-column
      prop="source"
      label="导入类型">
    </el-table-column>
    <el-table-column
      prop="importMemo"
      label="描述">
    </el-table-column>
    <el-table-column
    width="200"
      label="操作">
      <template slot-scope="scope">
        <el-button  type="primary" :disabled="scope.row.result  !== '失败'" @click="editAccountButt(scope.row)" size="mini">修正提交</el-button>
        <el-popconfirm
            title="是否确定删除？"
            @onConfirm="delFun()" 
        >
          <el-button style="margin: 0  10px;" type="danger" slot="reference" @click="singleDel(scope.row)" size="mini">删除</el-button>
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
    <el-form-item label="专家工号" prop="expertNo">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" @input="expertNoFun" v-model="form.expertNo" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="form.sex">
        <el-radio label="1" :disabled="titleForm.indexOf('查看')!== -1">男</el-radio>
        <el-radio label="2" :disabled="titleForm.indexOf('查看')!== -1">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="院/系" prop="faculty">
      <el-select v-model="form.faculty" @change="facultyFun" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" placeholder="请选择">
          <el-option
            v-for="(item, index) in facultyData"
            :key="index"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="职称" prop="title">
      <el-select v-model="form.title" @change="titleFun" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" placeholder="请选择">
          <el-option
            v-for="(item, index) in titleData"
            :key="index"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="学科" prop="subject">
      <el-select v-model="form.subject" @change="subjectFun" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" placeholder="请选择">
          <el-option
            v-for="(item, index) in subjectData"
            :key="index"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="电话" prop="phone">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="在职" prop="inPosition">
      <el-radio-group v-model="form.inPosition">
        <el-radio label="1" :disabled="titleForm.indexOf('查看')!== -1">是</el-radio>
        <el-radio label="2" :disabled="titleForm.indexOf('查看')!== -1">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="密码" prop="expertPwd">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.expertPwd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.remark" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingAccount" type="primary" @click="submitAccount('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<el-dialog title="提示" :show-close="false" :close-on-click-modal="false" :visible.sync="batchAccountVisible">
  <div>您确定批量删除数据吗？</div>
  <div slot="footer" class="dialog-footer">
    <el-button  @click="batchAccountVisible = false">取 消</el-button>
    <el-button  type="primary" @click="delFun()">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import { getCollege, getSubject, getTitle, getTable, expertbasicbind, expertbasicadd, expertbasicdel, expertbasicedit, expertbasicexport, getYearlist, dataDel } from "@/api/uploadRecord";
import plupload from "@/components/plupload";
import {download} from '@/utils'
import { roleslist } from "@/api/role";
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
        searchFaculty:'',
        searchSubject: '',
        searchTitle: '',
        searchName:'',
        searchResult: '',
        searchType: '',
        searchYear: '',
        searchInPosition: '',
        searchGender: '',
        searchPhone:'',
        facultyData: [],
        subjectData: [],
        titleData: [],

        currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      form: {
        sex: '',
        name: '',
        phone: '',
        faculty: '',
        facultyName: '',
        title: '',
        titleName: '',
        subject: '',
        subjectName: '',
        email: '',
        inPosition: '',
        expertNo: '',
        expertPwd: '',
        remark:'',
        year: ''
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
        sex: [
            { required: true, message: '请选择性别', trigger: 'change' }
        ],
        faculty: [
            { required: true, message: '请选择院/系', trigger: 'change' }
        ],
        title: [
            { required: true, message: '请选择职称', trigger: 'change' }
        ],
        subject: [
            { required: true, message: '请选择学科', trigger: 'change' }
        ],
        inPosition: [
            { required: true, message: '请选择在职状态', trigger: 'change' }
        ],
        phone: [
            { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        expertNo: [
            { required: true, validator: validateNo, trigger: 'blur' }
        ],
        expertPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        remark: [
            { required: false, message: '请输入备注', trigger: 'blur' }
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
      account:'',
      delId: [],
      batchAccountVisible: false,
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
    singleDel(data) {
      this.delId = [data.id];
    },
    batchDel() {
      if(this.delId.length === 0){
        this.$message({
          message: '请先勾选记录！',
          type: 'warning'
        });
        return
      }
      this.batchAccountVisible = true;
    },
    tableSelect(selection, row) {
      this.delId = []
      selection.map(item=>{
        this.delId.push(item.id);
      })
    },
    tableSelectAll(selection) {
      this.delId = []
      selection.map(item=>{
        this.delId.push(item.id);
      })
    },
    getYearData() {
        getYearlist(
        {}
      ).then(r => {
        this.yearData = r.data;
      }).catch(() => {});    
    },
    getFacultyData() {
        getCollege(
        {}
      ).then(r => {
        this.facultyData = r.data;
      }).catch(() => {});    
    },

    getSubjectData() {
      getSubject({}).then(r => {
        this.subjectData = r.data;
      }).catch(() => {});
    },

    getTitleData() {
      getTitle({}).then(r => {
        this.titleData = r.data;
      }).catch(() => {});
    },

    batchImport(data) {
      console.log(data,'批量导入')
       this.$router.push({
         path:'/importResults',
         query:{data: JSON.stringify(data)}
        });
    },

    facultyFun(data){
      this.facultyData.map(item=>{
        if(item.code === data) {
          this.form.facultyName = item.name;
        }
      })
    },

    subjectFun(data) {
      this.subjectData.map(item=>{
        if(item.code === data) {
          this.form.subjectName = item.name;
        }
      })
    },
    titleFun(data) {
      this.titleData.map(item=>{
        if(item.code === data) {
          this.form.titleName = item.name;
        }
      })
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
      this.titleForm = '查看专家信息'
      this.accountId = data.id
      this.getuserbind()
    },
    editAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '编辑专家信息'
      this.getuserbind()
    },
    addAccountButt(formName) {
      this.accountId = '';
      this.titleForm = '添加专家信息'
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
              "remark": this.form.remark
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
              "remark": this.form.remark,
              "year": this.form.year,
              }).then(r => {
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
    delFun() {
      dataDel({
            "ids":this.delId,
            })
            .then(r => {
              this.$message({
                message: '删除成功！',
                type: 'success'
                });
                this.batchAccountVisible = false;
              this.getTableData()  
            })
            .catch(() => {
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
    resetSearch(){
      this.searchYear = '';
      this.searchGender = '';
      this.searchInPosition = '';
      this.searchPhone = '';
      this.searchFaculty = '';
      this.searchSubject = '';
      this.searchTitle = '';
      this.searchName = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchType = '';
      this.searchResult = '';
      this.getTableData();
    },
    getTableData() {
      getTable({
        "year": this.searchYear === '' ? 0 : Number(this.searchYear),
        "gender": this.searchGender === '' ? 0 : Number(this.searchGender),
        "inposition": this.searchInPosition === '' ? 0 : Number(this.searchInPosition),
        "phone": this.searchPhone,
        "college": this.searchFaculty,
        "subject": this.searchSubject,
        "competent": this.searchTitle,
        "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize,
        "type": this.searchType,
        "result": this.searchResult
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
        "result": this.searchResult,
        "type": this.searchType,
        "page":this.currentPage,
        "pageSize":this.pageSize
        })
      .then(r => {
        // window.location.href= r.data;
        download(r.data,'expertbasicexport.xlsx')
        }).catch(() => {});
    },
    getuserbind() {
      expertbasicbind({
        "id": this.accountId,
      })
      .then(r => {
      this.form.subjectName = r.data.expertSubject;        
      this.form.titleName = r.data.expertTitle;
      this.form.facultyName = r.data.expertCollege;       
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
      this.form.year = r.data.year;
      this.dialogAccountVisible = true
        }).catch(() => {});
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