<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px;">
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
    <el-row :gutter="20" style="padding: 20px;">
      <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
        <el-button type="success" plain @click="goBack()">返回场次列表</el-button>
    </el-col>
    </el-row>
    <div style="padding: 0 20px">
      <el-tabs v-model="status" type="border-card" @tab-click="tabsClick">
        <el-tab-pane label="已确认" name="已确认"><Confirmed @updata="moduleUp" :roundObj="roundObj" :tableData="tableData"/></el-tab-pane>
        <el-tab-pane label="递补名单" name="递补已确认"><Alternate @updata="moduleUp" :roundObj="roundObj" :tableData="tableData"/></el-tab-pane>
        <el-tab-pane label="未确认" name="未确认"><Unconfirmed @updata="moduleUp" :roundObj="roundObj" :tableData="tableData"/></el-tab-pane>
        <el-tab-pane label="已取消" name="已取消"><Cancelled :tableData="tableData"/></el-tab-pane>
        <el-tab-pane label="审核中" name="审核中"><UnderReview @updata="moduleUp" :roundObj="roundObj" :tableData="tableData"/></el-tab-pane>
        <el-tab-pane label="已拒绝" name="已拒绝"><Rejected :tableData="tableData"/></el-tab-pane>
      </el-tabs>
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
  </div>
</template>

<script>
import { getCollege, getSubject, getTitle, getTable } from "@/api/confirmStatus";
import plupload from "@/components/plupload";

import Confirmed from "./confirmed";
import Alternate from "./alternate";
import Unconfirmed from "./unconfirmed";
import Cancelled from "./cancelled";
import UnderReview from "./underReview";
import Rejected from "./rejected";

export default {
  name: 'Login',
  components: {
    plupload,
    Confirmed,
    Alternate,
    Unconfirmed,
    Cancelled,
    UnderReview,
    Rejected
  },
  data() {
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
      tableData: [],
      status: '已确认', //已取消;已确认；未确认；递补已确认；已拒绝；审核中
      auditionId: '',
      auditionRoundId: '',
      roundObj: {}
    }
  },
  watch: {},
  methods: {
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
    tabsClick(data) {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData()
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
    resetSearch() {
      this.searchFaculty = '';
      this.searchSubject = '';
      this.searchTitle = '';
      this.searchName = '';
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData()
    },
    getTableData() {
      getTable({
        "college": this.searchFaculty,
        "subject": this.searchSubject,
        "competent": this.searchTitle,
        "name": this.searchName,
        "page":this.currentPage,
        "pageSize":this.pageSize,
        "auditionId": this.auditionId,
        "auditionRoundId": this.auditionRoundId,
        "status": this.status,
        })
      .then(r => {
        this.tableData = []
          if(r.data.list) {
            r.data.list.map(item=>{
          item.year = JSON.parse(this.$route.query.data).year;
          item.round_name = JSON.parse(this.$route.query.data).round_name;
        })
            this.tableData = r.data.list
          }
            this.totalPage = r.data.datacount
        }).catch(() => {});
    },
    moduleUp(data){
      this.getTableData();
    },
    goBack(){
      this.$router.push({path:'/interviewRound',query:{id:JSON.parse(this.$route.query.data).searchNo, auditionName: JSON.parse(this.$route.query.data).auditionName}});     
    }
  },
  
  mounted: function() {
    this.getFacultyData()
    this.getSubjectData()
    this.getTitleData()
    console.log(JSON.parse(this.$route.query.data))
    this.auditionId = JSON.parse(this.$route.query.data).audition_id || '';
    this.auditionRoundId = JSON.parse(this.$route.query.data).id || '';
    this.roundObj = JSON.parse(this.$route.query.data);
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