<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
    <!-- <el-col :span="6">
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
        <div style="display: inline-block;width:20%;">院系：</div>
        <el-select v-model="searchFaculty" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in facultyData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
    </el-col> -->
    <!-- <el-col :span="6">
        <div style="display: inline-block;width:20%;">面试：</div>
        <el-select v-model="searchInterview" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in interviewData"
            :key="item.audition_name"
            :label="item.audition_name"
            :value="item.audition_name">
          </el-option>
        </el-select>
    </el-col>
    <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" @click="exportData">导 出</el-button>
    </el-col> -->
    </el-row>
    <div style="padding: 15px;overflow: hidden;display: flex;justify-content: flex-end;">
      <el-button type="primary" style="margin-left: 15px;" @click="addAccountButt('ruleForm')">导出结果</el-button>
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
      prop="auditionName"
      label="场次名称">
    </el-table-column>
    <el-table-column
      prop="expertGender"
      label="应抽取人数">
    </el-table-column>
    <el-table-column
      prop="countPlan"
      label="确认人数">
    </el-table-column>
    <el-table-column
      prop="rateRefuse"
      label="拒绝率">
    </el-table-column>
    <el-table-column
      prop="countCancle"
      label="取消人数">
    </el-table-column>
    <el-table-column
      prop="countUnconfirm"
      label="未确认人数">
    </el-table-column>
    <el-table-column
      prop="countRefuse"
      label="拒绝人数">
    </el-table-column>
  </el-table>
    </div>
  <!-- <div style="text-align: center;
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
  </div>  -->
  <el-dialog :title="titleForm" :show-close="false" :close-on-click-modal="false" :visible.sync="dialogAccountVisible">
  <el-form :model="form" :rules="rulesAccount" ref="ruleForm" label-width="100px">
    <el-form-item label="专家工号" prop="expertNo">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" @input="expertNoFun" v-model="form.expertNo" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="年份" prop="year">
      <el-select v-model="form.year" style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" placeholder="请选择">
          <el-option
            v-for="(item, index) in yearData"
            :key="item.year"
            :label="item.year"
            :value="item.year">
          </el-option>
        </el-select>
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
    <!-- <el-form-item label="在职" prop="inPosition">
      <el-radio-group v-model="form.inPosition">
        <el-radio label="1" :disabled="titleForm.indexOf('查看')!== -1">是</el-radio>
        <el-radio label="2" :disabled="titleForm.indexOf('查看')!== -1">否</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="密码" prop="expertPwd">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.expertPwd" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input style="width: 300px" :disabled="titleForm.indexOf('查看')!== -1" v-model="form.remark" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer" v-show="titleForm.indexOf('审核')=== -1">
    <el-button @click="cancelSubmit('ruleForm')">取 消</el-button>
    <el-button :disabled="titleForm.indexOf('查看')!== -1" :loading="loadingAccount" type="primary" @click="submitAccount('ruleForm')">确 定</el-button>
  </div>
  <div slot="footer" class="dialog-footer" v-show="titleForm.indexOf('审核')!== -1">
    <el-button :loading="loadingAccount" @click="refuseSubmit('ruleForm','拒绝')">拒 绝</el-button>
    <el-button :loading="loadingAccount" type="primary" @click="refuseSubmit('ruleForm','通过')">通 过</el-button>
  </div>
</el-dialog>
<div style="display: flex;justify-content: space-around;">
      <div style="height: 400px;width: 400px;display:inline-block;" id="mainBing"></div>
      <div style="height: 400px;width: 400px;display:inline-block;" id="mainZhe"></div>
    </div>
  </div>
</template>

<script>
import { getTable, getCollege, getYearlist, expertauditionlist } from "@/api/statistics";
import * as echarts from 'echarts';
export default {
  name: 'Login',
  components: {
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
        searchYear: '',
        searchState:'',
        searchInterview: '',
        facultyData: [],
        subjectData: [],
        titleData: [],
        yearData: [],
        interviewData: [],
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
        // inPosition: '',
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
        year: [
            { required: true, message: '请选择年份', trigger: 'blur' }
        ],
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
        // inPosition: [
        //     { required: true, message: '请选择在职状态', trigger: 'change' }
        // ],
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
            { required: true, message: '请输入备注', trigger: 'blur' }
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
        getYearlist(
        {}
      ).then(r => {
        this.yearData = r.data;
      }).catch(() => {});    
    },
    
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

    getInterviewData() {
      expertauditionlist({
        "year": 0,
        "audition_name": '',
        "page": 1,
        "pageSize": 1000
        }).then(r => {
        this.interviewData = r.data.list;
      }).catch(() => {});
    },

    getTitleData() {
      getTitle({"uid": sessionStorage.getItem('uid')}).then(r => {
        this.titleData = r.data;
      }).catch(() => {});
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
    examineAccountButt(data) {
      this.accountId = data.id
      this.titleForm = '审核专家信息'
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
    refuseSubmit(name,state) {
      this.loadingAccount = true
      expertreadyapprove({
              "id": this.accountId,
              "status": state
              }).then(r => {
                if(r.msg === '信息重复') {
                  this.loadingAccount = false
                  return
                }
              this.loadingAccount = false
              this.dialogAccountVisible = false
              // this.account = this.form.account
              this.$refs[name].resetFields();
              this.getTableData()
            })
            .catch(() => {
              this.loadingAccount = false
            });
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
              "expertNo": this.form.expertNo,
              "expertPwd": this.form.expertPwd,
              "remark": this.form.remark,
              "year": Number(this.form.year)
              }).then(r => {
                if(r.msg === '信息重复') {
                  this.loadingAccount = false
                  return
                }
              this.loadingAccount = false
              this.dialogAccountVisible = false
              // this.account = this.form.account
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
              "expertNo": this.form.expertNo,
              "expertPwd": this.form.expertPwd,
              "remark": this.form.remark,
              "year": Number(this.form.year)
              })
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
      expertreadydel({
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
      getTable({"auditionName": this.$route.query.auditionName,
        "auditionRoundName": this.$route.query.auditionRoundName,
        "auditionId": 0,
        "statsType": 1,
        })
      .then(r => {
            this.tableData = r.data;
            this.chartInit(r.data);
        }).catch(() => {});
    },
    exportData() {
      expertreadyexport({"college": this.searchFaculty,
        "subject": this.searchSubject,
        "competent": this.searchTitle,
        "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize,
        "year": this.searchYear === '' ? 0 : Number(this.searchYear),
        "status": this.searchState,
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
      this.form.year = r.data.year + '';
      this.dialogAccountVisible = true
        }).catch(() => {});
    },
    chartInit(data) {
      console.log(data)
      let bingData = [];
      let zheData = [];
      let zheName = [];
      data.map(item=>{
        bingData.push({
          value: item.countPlan,
          name: item.auditionName
        })
        zheName.push(item.auditionName)
        zheData.push(item.countPlan)
      })
      var chartDom = document.getElementById('mainBing');
      var myChart = echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: bingData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      
      var chartDom1 = document.getElementById('mainZhe');
      var myChart1 = echarts.init(chartDom1);
      let option1 = {
        xAxis: {
          type: 'category',
          data: zheName,
          axisLabel:{
                    interval:0,
                   rotate:-45,//倾斜度 -90 至 90 默认为0
                    margin:2,
                   textStyle:{
                     
                  fontSize: 9,//横轴字体大小
                      color:"#000000"
                    }
                  }
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
        series: [
          {
            data: zheData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
          }
        ]
      };
      myChart1.setOption(option1);
    }
  },
  beforeDestroy(){
      this.message1_.close()
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