<template>
  <div class="chartModule">
    <div style="padding: 15px;">
        <!-- <div id="myChart" :style="{width: '300px', height: '300px'}"></div> -->
        <el-tabs v-model="activeName" @tab-click="tabsClick" :disabled="action.indexOf('see') !== -1">
            <el-tab-pane label="数列样式" name="数列"  :disabled="action.indexOf('see') !== -1">
                <div>
                    <div style="margin-bottom: 20px;">
                        <a style="color: #409EFF;margin-right: 20px;" download="数列模板" href="https://mob.hexntc.com/byd/web/uploads/sequence.xls">模板下载</a>
                        <div style="display:inline-block;">
                            <plupload
                                :limit="1"
                                biz-type="trainModule"
                                accept-files=".xml,.xlsx,.xls"
                                :up1="1"
                                :mid="mid"
                                :type="activeName"
                                @onChange="handleFileChange($event)"
                            />
                        </div>
                    </div>
                    <div style="width: 45%;margin-bottom: 20px;" :key="index" v-for="(item, index) in arrData">
                        <div style="margin-bottom: 10px">
                            <el-input
                            style="width: 300px"
                            placeholder="请输入标题"
                            autocomplete="off"
                            v-model="item.name"
                            >
                            </el-input>
                             <el-button style="width:100px;margin-left: 20px" type="primary" @click="addgroup(index)">添加新组</el-button>
                             <el-button style="width:100px" type="primary" @click="delgroup(index)">删除组</el-button>
                        </div>
                        <!-- 编号 指标名称 指标数值 指标 -->
                        <el-table
                            :data="item.tableData"
                            border
                            style="width: 100%">
                            <el-table-column
                            type="index"
                            width="50px"
                            label="编号"
                            >
                            </el-table-column>
                            <el-table-column
                            prop="title"
                            label="指标名称"
                            >
                            <template slot-scope="scope">
                                <el-input :disabled="action.indexOf('see') !== -1" @change="shuliechange" v-model="scope.row.title"  autocomplete="off"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="val"
                            label="指标数值">
                            <template slot-scope="scope">
                                <el-input :disabled="action.indexOf('see') !== -1" @change="shuliechange" v-model="scope.row.val"  autocomplete="off"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="unit"
                            label="指标单位">
                            <template slot-scope="scope">
                                <el-input :disabled="action.indexOf('see') !== -1" @change="shuliechange" v-model="scope.row.unit"  autocomplete="off"></el-input>
                            </template>
                            </el-table-column>
                            <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button v-show="item.tableData.length-1 === scope.$index" @click="addTableData(index, scope.$index)" type="text" size="small">添加</el-button>
                                <el-button v-show="item.tableData.length > 1" style="margin: 0 10px;" @click="delTableData(index, scope.$index)" slot="reference"  type="text" size="small">删除</el-button>
                            </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="表格样式" name="表格" :disabled="action.indexOf('see') !== -1">
                <div>
                  <div style="margin-bottom: 20px;">
                        <a style="color: #409EFF;margin-right: 20px;" download="表格模板" href="https://mob.hexntc.com/byd/web/uploads/table.xls">模板下载</a>
                        <div style="display:inline-block;">
                            <plupload
                                :limit="1"
                                biz-type="trainModule"
                                accept-files=".xml,.xlsx,.xls"
                                :mid="mid"
                                :up1="2"
                                :type="activeName"
                                @onChange="handleFileChange($event)"
                            />
                        </div>
                    </div>
                    <div style="display: inline-block;width: 100%">
                       
                        <!-- 编号 指标名称 指标数值 指标 -->
                        <el-table
                            :data="tableData"
                            :show-header='false'
                            border
                            style="width: 100%">
                            <el-table-column
                            type="index"
                            width="50px"
                            label="编号1"
                            >
                            </el-table-column>
                            <el-table-column width="120" :label="item" :key="index" v-for="(item, index) in Object.keys(tableData[0])">
                              <template slot-scope="scope" >
                                <el-input :disabled="action.indexOf('see') !== -1" @change="tableInput" v-model="scope.row[item]"  autocomplete="off"></el-input>
                              </template>
                            </el-table-column>
                            
                            <el-table-column
                            label="操作">
                            <template slot-scope="scope" width="100px">
                                <el-button v-show="tableData.length-1 === scope.$index" @click="addexecl" type="text" size="small">添加行</el-button>
                                <el-button v-show="tableData.length > 1" style="margin: 0 10px;" @click="delexecl(scope.$index)" slot="reference"  type="text" size="small">删除行</el-button>
                            </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-top: 10px;">
                            <el-button type="primary" v-if="action.indexOf('see') === -1" @click="addexecl_">添加列</el-button>
                            <el-button type="primary" v-if="action.indexOf('see') === -1" v-show="tableData.length > 1" style="margin: 0 10px;" @click="delexecl_" >删除列</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        
    </div>
  </div>
</template>

<script>
import { showModuleDeployList, showModuleDeployList1 } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";
import plupload from '@/components/pluploadData'

export default {
  name: 'tabularData',
  components: {
    plupload,
  },
  data() {
    return {
        activeName: '数列',
        arrData:[
            {
                tableData: [{
                    title:'',
                    val:'',
                    unit:''
                }],
                name: ''
            }
        ],
        tableData:[
            {
                val0:'',
                val1:'',
                val2:''
            }
        ]
    }
  },
  props:{
      filesList: {
      type: Array,
      default: () => []
    },
    action: {
      type: String,
      default: ''
    },
    statsData: {
      type: Array,
      default: () => []
    },
    echartType_:{
      type: String,
      default: ''
    },
    mid:{
        type: String,
        default: ''
    }
  },
  watch: {
    filesList(val) {
      console.log(val[0],'filesList')
      this.editor.txt.html(val[0].contents);
      this.filename = val[0].file_url;
    },
    echartType_(val) {
       this.activeName = val;  
    },
    statsData(val) {
        console.log(val,'123')
        let dataArr = [];
        let row = []
        if(this.activeName === '数列'){
            val.map((item, index)=>{
                dataArr.push({
                    name: item.title,
                    tableData: []
                })
                item.sequence_detail.map(item1=>{
                    dataArr[index].tableData.push({
                        title: item1.name,
                        val: item1.val,
                        unit: item1.unit,
                    })
                })
            })
            this.arrData = dataArr
            this.$emit('execlData', this.arrData, this.activeName)
        }else{
            val.map((item, index)=>{
                item.rows_list.splice(0,0,{'row_val':item.cols_val})
                item.rows_list.map((val, q)=>{
                    if(index === 0){
                        dataArr.push({})
                    }
                     dataArr[q][item.cols_val] = val.row_val
                })
            })
            console.log(val)
            console.log(dataArr)
            this.tableData = dataArr
            this.handle()
        }
        
    }
  },
  methods: {
      delexecl(index){
          this.tableData.splice(index,1)
          this.handle()
      },
      delexecl_(){
        let row = JSON.parse(JSON.stringify(this.tableData[0]));
        let table = JSON.parse(JSON.stringify(this.tableData));
         row = Object.keys(row); 
         row = row[row.length-1]
         table.map(item=> {
             delete item[row];
         })
         this.tableData = table
         this.handle()
      },
      tabsClick(tab, event){
          this.arrData = [
            {
                tableData: [{
                    title:'',
                    val:'',
                    unit:''
                }],
                name: ''
            }
        ]
        this.$emit('execlData', this.arrData, this.activeName)
          console.log(tab.name, event)
      },
      addTableData(index,q) {
          this.arrData[index].tableData.push({
              title:'',
              val:'',
              unit:''
          })
          this.$emit('execlData', this.arrData, this.activeName)
      },
      shuliechange() {
        this.$emit('execlData', this.arrData, this.activeName)
      },
      delTableData(index,q) {
          this.arrData[index].tableData.splice(q, 1)
          this.$emit('execlData', this.arrData, this.activeName)
      },
      addgroup(index){
        //   let arr = JSON.parse(JSON.stringify(this.arrData[0].tableData))
        //   arr.map(item=>{
        //       item.val = ''
        //   })
          this.arrData.splice(index+1, 0,{
                tableData:  [{
                    title:'',
                    val:'',
                    unit:''
                }],
                name: ''
            })
            this.$emit('execlData', this.arrData, this.activeName)
      },
      delgroup(index){
          this.arrData.splice(index, 1)
          this.$emit('execlData', this.arrData, this.activeName)
      },
      addexecl_(){
        let row = JSON.parse(JSON.stringify(this.tableData[0]));
        let table = JSON.parse(JSON.stringify(this.tableData));
         row = Object.keys(row); 
         console.log(row)
         row = `val${row.length}`
         table.map(item=> {
           item[row] = ''
         })
         this.tableData = table
         this.handle()
      },
      addexecl(){
          let row = JSON.parse(JSON.stringify(this.tableData[0]));
          // console.log(row)
          for(let rowitem in row){
              row[rowitem] = ''
          }
          this.tableData.push(row)
          this.handle()
      },
      tableInput(){
        this.handle()
      },
      handle(){
        // { "val":"a", "rows": [ {"val":"a1"}, {"val":"a2"} ] }, 
        let arr =[];
        let objarr = Object.keys(this.tableData[0])
        this.tableData.map((item, index)=>{
          if(index === 0){
            for(let rowitem in item){
                arr.push({
                  val: rowitem,
                  rows: [{val:item[rowitem]}]
                })
            }
          }else{
            objarr.map((val1, q)=>{
              arr[q].rows.push({
                val:item[val1]
              })
            })
          }
        })
        this.$emit('execlData', arr, this.activeName)
      },
      handleFileChange(file) {
        let url = '/byd/web/index.php?r=reg/importstats'
        showModuleDeployList(url, {
            "mid": this.mid === ''? 0 : this.mid,
            "uid": sessionStorage.getItem('uid'),
            "type": this.activeName,
            "filename": file.name
        }).then(r => {
          if(this.activeName === '数列'){
            this.arrData = [];
             r.data.stats.map(item=>{
               item.sequence_detail.map(val=>{
                 val.title = val.name
               })
               this.arrData.push({
                 tableData: item.sequence_detail,
                 name: item.title,
               })
               this.$emit('execlData', this.arrData, this.activeName)
             })
          }else{
            let dataArr = [];
            r.data.stats.map((item, index)=>{
                item.rows_list.splice(0,0,{'row_val':item.cols_val})
                item.rows_list.map((val, q)=>{
                    if(index === 0){
                        dataArr.push({})
                    }
                     dataArr[q][item.cols_val] = val.row_val
                })
            })
            this.tableData = dataArr
            this.handle()
          }
          
        }).catch(() => {});
      }
  },
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
.dataChartModule{
    display: flex;

}
</style>
