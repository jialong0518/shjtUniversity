<template>
  <div class="editShowModule">
    <div style="padding: 15px;">
      <span style="margin-right: 10px;">{{type}}模块</span>
      <span>{{moduleName}}</span>
      <el-button type="primary" style="float:right;" v-if="action.indexOf('see') === -1" :loading="loadingShowModuleDeploy" @click="addShowModuleDeployButt()">保存</el-button>
    </div>
    <div style="padding: 15px;z-index: 1;position: relative;">
      <el-row :gutter="20">
        <el-col :span="12">
          <div 
            style="display: flex;align-items: center;"><span>模块标题：</span>
            <el-input :disabled="action.indexOf('see') !== -1" style="flex: 1;" v-model="moduleName" autocomplete="off"></el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div><span>显示/隐藏：</span>
          <el-select :disabled="action.indexOf('see') !== -1" v-model="isShow" placeholder="请选择显示/隐藏">
            <el-option label="显示" value="显示"></el-option>
            <el-option label="隐藏" value="隐藏"></el-option>
          </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div><span>展示顺序：</span>
          <el-select :disabled="action.indexOf('see') !== -1" v-model="sort" placeholder="请选择展示顺序">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
            <el-option label="6" value="6"></el-option>
            <el-option label="7" value="7"></el-option>
            <el-option label="8" value="8"></el-option>
          </el-select>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="z-index: 0;position: relative;">
        <picTextModule @imgfile="imgfile" :filesList="files" @abstract="abstract" :action="action" @onChange="htmlText" v-if="type === '图文'" />
        <videoModule @imgfile="imgfile" @imgfile1="imgfile1" @abstract="abstract" :filesList="files" :action="action" @onChange="htmlText" v-if="type === '视频'" />
        <picModule @fileList="getfileList" :filesList="files" :action="action" v-if="type === '图片'" />
        <chartModule :mid="id" @echartData="echartData" :action="action" :echartType_="echartType1" :data_flag="data_flag" :statsData="statsData" v-if="['图表','折线图','柱状图','饼图','雷达图','漏斗图'].indexOf(type) !== -1" />
        <tabularData :mid="id" @execlData="execlData" :action="action" :echartType_="echartType1" :statsData="statsData" v-if="['数据','数列','表格'].indexOf(type) !== -1" />
        <!-- @fileList="getfileList" :filesList="files" -->
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { userlist, userAdd, passwordreset, userdel, useredit } from "@/api/account";
import { showModuleDeployList, } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";
import plupload from '@/components/plupload'

import picTextModule from './picTextModule'

import videoModule from './videoModule'

import picModule from './picModule'

import chartModule from './chartModule'

import tabularData from './tabularData'

export default {
  components: {
    plupload,
    picTextModule,
    videoModule,
    picModule,
    chartModule,
    tabularData
  },
  name: 'editShowModule',
  data() {
    return {
       type:'',
       moduleName: '',
       module:'',
       isShow:'显示',
       sort:'1',
       imgfile_:'',
       htmlText_:'',
       loadingShowModuleDeploy: false,
       id:'',
       action:'',
       files:[],
       fileList: [],
       echartDataArr: [],
       echartType: '',
       echartType1:'',
       statsData:[],
       abstractText: '',
       checkedState:false,
    }
  },
  
  methods: {
    abstract(data){
        this.abstractText = data
    },
    execlData(data, type){
      console.log(data, type)
      let echartDataArr = [];
      this.echartType = type;
      if(type === '表格'){
        this.echartDataArr = data
      }
      if(type === '数列'){
        data.map((item, index)=>{
            item.tableData.map((val, q)=>{
                echartDataArr.push({
                    title: item.name,
                    groupnum: index+1,
                    name: val.title,
                    val: val.val,
                    unit: val.unit
                })
            })
        })
        this.echartDataArr = echartDataArr
      }
    },
    echartData(data, type, checked){
        console.log(data,'echartData')
        this.echartType = type;
        this.checkedState = checked;
        let echartDataArr = [];
        data.map((item, index)=>{
            item.tableData.map((val, q)=>{
                echartDataArr.push({
                    title: item.name,
                    groupnum: index+1,
                    row_val: val.name,
                    cols_val: val.record,
                    unit: val.unit
                })
            })
        })
        this.echartDataArr = echartDataArr
    },
    getfileList(data){
      this.fileList = data;
      console.log(data)
    },
    imgfile(data){
        this.imgfile_ = data
        console.log(data,'imgfile')
    },
    imgfile1(data){
        this.imgfile_1 = data
        console.log(data,'imgfile')
    },
    htmlText(data){
        console.log(data,'htmlText')
        this.htmlText_ = data
    },
    addShowModuleDeployButt(){
        let url = '';
        let params = {
            title:"",
            type:'',
            sort:'',
            display:'',
            files:'',
            uid:'',
            stats:''
        };
        if(this.module.indexOf('/water') !== -1){
            url = `/byd/web/index.php?r=reg/water_module${this.action}`;
        }

        if(this.module.indexOf('/organisms') !== -1){
            url = `/byd/web/index.php?r=reg/organisms_module${this.action}`;
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = `/byd/web/index.php?r=reg/carbon_module${this.action}`;
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = `/byd/web/index.php?r=reg/sub4_module${this.action}`;
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = `/byd/web/index.php?r=reg/sub5_module${this.action}`;
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = `/byd/web/index.php?r=reg/sub6_module${this.action}`;
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = `/byd/web/index.php?r=reg/sub7_module${this.action}`;
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = `/byd/web/index.php?r=reg/sub8_module${this.action}`;
        }
        
        //////////
        if(this.type.indexOf('图文') !== -1){
            params = {
                title:this.moduleName,
                type:this.type,
                sort:this.sort,
                display:this.isShow,
                files:[
                    {
                       "file_url": this.imgfile_,
                       "contents": this.htmlText_,
                       "headimg": "",
                       "abstract": this.abstractText,
                       "sort":'1'
                    }
                ],
                uid:'1',
                stats:''
            }
            if(this.abstractText === ''){
                this.$message({
                message: '图文摘要必填！',
                type: 'warning'
            });
            return
            }
        }
        if(this.type.indexOf('视频') !== -1){
            params = {
                title:this.moduleName,
                type:this.type,
                sort:this.sort,
                display:this.isShow,
                files:[
                    {
                       "file_url": this.imgfile_,
                       "contents": this.htmlText_,
                       "headimg": this.imgfile_1,
                       "abstract": this.abstractText,
                       "sort":'1'
                    }
                ],
                uid:'1',
                stats:''
            }
        }
        let  sortState = false
        if(this.type.indexOf('图片') !== -1){
          let files = [];
          this.fileList.map(item=>{
              if(item.sort === '')sortState = true
            files.push({
              "file_url": item.src,
              "contents": item.html,
              "headimg": "",
              "abstract": this.fileList[0].abstract,
              "sort":item.sort
            })
          })
            params = {
                title:this.moduleName,
                type:this.type,
                sort:this.sort,
                display:this.isShow,
                files:files,
                uid:'1',
                stats:''
            }
        }
        if(sortState){
            this.$message({
                message: '图片顺序必选！',
                type: 'warning'
            });
            return
        }
        if(['图表','折线图','柱状图','饼图','雷达图','漏斗图','数据','数列','表格'].indexOf(this.type) !== -1){
            params = {
                title:this.moduleName,
                type:this.echartType,
                sort:this.sort,
                display:this.isShow,
                files:[],
                uid:'1',
                stats:this.echartDataArr,
                data_flag:this.checkedState?1:0,
            }
        }
        if(this.id !== '')params.id = this.id
        this.loadingShowModuleDeploy = false
        console.log(params)
        showModuleDeployList(url, params)
            .then(r => {
              this.loadingShowModuleDeploy = false
              this.$router.push({
                path:'showModuleDeploy',
                query:{}
            });
            })
            .catch(() => {
              this.loadingShowModuleDeploy = false
            });
    },
    getData(){
        let url = '';
        if(this.module.indexOf('/water') !== -1){
            url = '/byd/web/index.php?r=reg/water_modulebind';
        }
        if(this.module.indexOf('/organisms') !== -1){
            url = '/byd/web/index.php?r=reg/organisms_modulebind';
        }
        if(this.module.indexOf('/carbon') !== -1){
            url = '/byd/web/index.php?r=reg/carbon_modulebind';
        }
        if(this.module.indexOf('/sub4') !== -1){
            url = '/byd/web/index.php?r=reg/sub4_modulebind';
        }
        if(this.module.indexOf('/sub5') !== -1){
            url = '/byd/web/index.php?r=reg/sub5_modulebind';
        }
        if(this.module.indexOf('/sub6') !== -1){
            url = '/byd/web/index.php?r=reg/sub6_modulebind';
        }
        if(this.module.indexOf('/sub7') !== -1){
            url = '/byd/web/index.php?r=reg/sub7_modulebind';
        }
        if(this.module.indexOf('/sub8') !== -1){
            url = '/byd/web/index.php?r=reg/sub8_modulebind';
        }
        
        showModuleDeployList(url, {
            "id": this.id,
            "uid": sessionStorage.getItem('uid')
        }).then(r => {
             this.moduleName = r.data.title
            this.sort = r.data.sort
            this.isShow = r.data.display
            this.data_flag = r.data.data_flag
            this.files = r.data.files || []
            if(this.files.length !== 0){
                this.imgfile_ = r.data.files[0].file_url
                this.htmlText_ = r.data.files[0].contents
            }
            this.statsData = r.data.stats
            this.echartType1 = r.data.type
            })
            .catch(() => {
            });
    }
  },
  mounted: function() {
      this.type = this.$route.query.type;
      this.moduleName = this.$route.query.moduleName;
      this.module = this.$route.query.fullPath;
      this.action = this.$route.query.action
      if(this.$route.query.action !== 'add'){
          this.id = this.$route.query.id
          this.getData()
      }
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
