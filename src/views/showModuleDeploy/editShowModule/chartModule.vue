<template>
  <div class="chartModule">
    <div style="padding: 15px;">
        <!-- <div id="myChart" :style="{width: '300px', height: '300px'}"></div> -->
        <el-tabs v-model="activeName" @tab-click="tabsClick" :disabled="action.indexOf('see') !== -1">
            <el-tab-pane label="折线图" name="折线图"  :disabled="action.indexOf('see') !== -1"></el-tab-pane>
            <el-tab-pane label="柱状图" name="柱状图" :disabled="action.indexOf('see') !== -1"></el-tab-pane>
            <el-tab-pane label="饼图" name="饼图" :disabled="action.indexOf('see') !== -1"></el-tab-pane>
            <el-tab-pane label="雷达图" name="雷达图" :disabled="action.indexOf('see') !== -1"></el-tab-pane>
            <el-tab-pane label="漏斗图" name="漏斗图" :disabled="action.indexOf('see') !== -1"></el-tab-pane>
        </el-tabs>
        <div>
            <div style="margin-bottom: 20px;">
                        <a style="color: #409EFF;margin-right: 20px;" download="图表模板" href="https://mob.hexntc.com/byd/web/uploads/chart.xls">模板下载</a>
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
                    <div style="margin-bottom: 15px;">
                        <el-radio-group @change="radioTypeChange" v-model="type" :disabled="action.indexOf('see') !== -1" v-show="'折线图柱状图雷达图'.indexOf(activeName) !== -1">
                            <el-radio label="single">单{{activeName}}</el-radio>
                            <el-radio label="many">多{{activeName}}</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="dataChartModule">
                        <div style="width: 400px;">
                            <div :key="index" v-for="(item, index) in dataArr">
                                <div style="margin-bottom: 15px;" v-show="type === 'many'"><span>数据名称：</span><el-input @change="tableDataChange" :disabled="action.indexOf('see') !== -1" v-model="item.name" style="width: 200px;" autocomplete="off"></el-input></div>
                                <el-table
                                    :data="item.tableData"
                                    border
                                    style="width: 100%">
                                    <el-table-column
                                    label="指标名称">
                                        <template slot-scope="scope">
                                            <el-input @change="tableDataChange" :disabled="action.indexOf('see') !== -1" v-model="scope.row.name"  autocomplete="off"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="指标数值">
                                        <template slot-scope="scope">
                                            <el-input @change="tableDataChange" :disabled="action.indexOf('see') !== -1" v-model="scope.row.record"  autocomplete="off"></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                    label="指标单位">
                                        <template slot-scope="scope">
                                            <el-input @change="tableDataChange" :disabled="action.indexOf('see') !== -1" v-model="scope.row.unit"  autocomplete="off"></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div  v-if="action.indexOf('see') === -1" style="padding: 20px">
                                    <el-button style="width:45%" type="primary" @click="addTableData(index)">添加</el-button>
                                    <el-button style="width:45%;float:right;" type="primary" @click="delTableData(index)">删除</el-button>
                                </div>
                            </div>
                            <div v-if="action.indexOf('see') === -1" style="padding: 20px">
                                    <el-button style="width:100%" type="primary" v-show="type === 'many'" @click="addDataArr">添加{{activeName}}数据</el-button>
                            </div>
                        </div>
                        <div :style="{height: 'auto',flex: 1}">
                            <div id="myChart" :style="{'min-height': '400px'}"></div>
                            <div>
                                <div :style="{'margin-left': '30px','margin-bottom': '10px'}"><el-checkbox @change="checkchange" v-model="checked">展示图标数据</el-checkbox></div>
                                <div style="margin-left: 40px;font-size: 14px;margin-bottom: 5px;" v-show="checked&&type === 'single'" :key="index" v-for="(item, index) in dataArr[0].tableData">·  {{item.name}}：{{item.record}}{{item.unit}}</div>
                                <div style="margin-left: 40px;font-size: 14px;margin-bottom: 5px;display: inline-block;" v-show="checked&&type === 'many'" :key="index" v-for="(item, index) in dataArr">
                                    <div style="font-size: 16px;margin-bottom: 5px;">名称：{{item.name}}</div>
                                    <div style="font-size: 14px;margin-bottom: 5px;" :key="q" v-for="(val, q) in item.tableData">·  {{val.name}}：{{val.record}}{{val.unit}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="action.indexOf('see') === -1">
                        <el-button style="width:400px" type="primary" @click="chartUpdata">图表预览</el-button>
                    </div>
                </div>
    </div>
  </div>
</template>

<script>
import { showModuleDeployList, showModuleDeployList1 } from "@/api/showModuleDeploy";
import { roleslist } from "@/api/role";
import plupload from '@/components/pluploadData'

export default {
  name: 'chartModule',
  components: {
    plupload,
  },
  data() {
    return {
        activeName: '折线图',
        type:'single',
        dataArr:[
            {
                tableData: [{
                    name:'',
                    record:'',
                    unit:''
                }],
                name: '',
            }
        ],
        checked: false,
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
    },
    data_flag:{
        type:Number,
        default:'',
    }
  },
  watch: {
    filesList(val) {
      console.log(val[0],'filesList')
      this.editor.txt.html(val[0].contents);
      this.filename = val[0].file_url;
    },
    statsData(val) {
      console.log(val,'filesList')
        let dataArr = [];
        if(val.length > 1) this.type = 'many'
        val.map((item, index)=>{
            dataArr.push({
                name: item.title,
                tableData: []
            })
            item.list_detail.map(item1=>{
                dataArr[index].tableData.push({
                    name: item1.name,
                    record: item1.val,
                    unit: item1.unit,
                })
            })
        })
        this.dataArr = dataArr
        this.$emit('echartData', this.dataArr, this.activeName, this.checked)
    },
    echartType_(val) {
        console.log(val,'val')
       this.activeName = val;  
       console.log(this.activeName)
       this.chartUpdata()
    },
    data_flag(val) {
        this.checked = val === 1 ? true : false;
    }
    // echartType_:{
    // handler:function(newVal, oldVal) {
    //     console.log(newVal, oldVal)
    // },
    // immediate: true,
    // }
  },
  methods: {
      tableDataChange(data){
          this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      radioTypeChange(data){
        this.dataArr =[
            {
                tableData: [{
                    name:'',
                    record:'',
                    unit:''
                }],
                name: '',
            }
        ]
        this.checked = false
        this.chartUpdata();
        this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      checkchange(data){
          this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      tabsClick(tab, event){
          this.dataArr =[
            {
                tableData: [{
                    name:'',
                    record:'',
                    unit:''
                }],
                name: '',
            }
        ]
        this.type = 'single'
        this.checked = false
        this.chartUpdata();
        this.$emit('echartData', this.dataArr, this.activeName, this.checked)
          console.log(tab.name, event)
      },
      wideChange(data, index){
          console.log(data, index)
          this.tableData[index].wide = data
      },
      highChange(data, index){
          this.tableData[index].high = data
      },
      unitChange(data, index){
          this.tableData[index].unit = data
      },
      addTableData(index){
          let tableData = this.dataArr[index].tableData;
          tableData.push({
              name:'',
              record:'',
              unit:''
          })
          console.log(this.dataArr)
          this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      delTableData(index){
          let tableData = this.dataArr[index].tableData;
          tableData.splice(tableData.length -1, 1)
          this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      addDataArr() {
          let arr = JSON.parse(JSON.stringify(this.dataArr[0].tableData))
          arr.map(item=>{
              item.record = ''
          })
          console.log(this.dataArr)
          this.dataArr.push({
                tableData: arr,
                name: '',
                myChart: null,
            })
            this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      chartUpdata(){
          if(this.activeName === '折线图')this.brokenLineData()
          if(this.activeName === '柱状图')this.columnData()
          if(this.activeName === '饼图')this.cakeData()
          if(this.activeName === '雷达图')this.radarData()
          if(this.activeName === '漏斗图')this.funnelData()
          this.$emit('echartData', this.dataArr, this.activeName, this.checked)
      },
      //折线图
      brokenLineData(){
          let legend = [];
          let series = [];
          let xAxis = [];
          this.dataArr.map((item, index)=>{
              legend.push(item.name)
              series.push({
                  name: item.name,
                  type: 'line',
                  stack: '总量',
                  data: []
              })  
              item.tableData.map(val=>{
                  series[index].data.push(val.record)
                 if(index === 0)xAxis.push(val.name)
              })
          })
          this.chartInit(legend,xAxis,series)
      },
      //漏斗图
      funnelData() {
          let table = this.dataArr[0].tableData;
          let data = []
          let name = []
          let num = 0
          table.map((item, index)=>{
              name.push(item.name)
              data.push({
                  value: item.record, name: item.name
              })
              num = num + Number(item.record)
          })
          console.log(num)
          if(this.myChart)this.myChart.dispose();
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          this.myChart.setOption({
              title: {
                text: '漏斗图',
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                feature: {
                    dataView: {readOnly: false},
                    restore: {},
                    saveAsImage: {}
                }
            },
            legend: {
                data: name
            },

            series: [
                {
                    name:'漏斗图',
                    type: 'funnel',
                    left: '10%',
                    width: '80%',
                    label: {
                        formatter: '{b}'
                    },
                    labelLine: {
                        show: false
                    },
                    itemStyle: {
                        opacity: 0.7
                    },
                    emphasis: {
                        label: {
                        position: 'inside',
                        }
                    },
                    data: data
                }
            ]
        });
      },
      //雷达图
      radarData() {
          let legend = [];
          let series = [];
          let xAxis = [];
          console.log(this.dataArr)
          this.dataArr.map((item, index)=>{
              legend.push(item.name)
              series.push({
                  value:[],
                  name:item.name
              })
              item.tableData.map(val=>{
                  if(index === 0)xAxis.push({name: val.name})
                  series[index].value.push(Number(val.record))
              })
          })
          
          setTimeout(()=>{
              if(this.myChart)this.myChart.dispose();
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          if(this.type==='single'){
              let series_ = JSON.parse(JSON.stringify(series[0].value||[]))
                series_.sort(function(a, b){return a - b}); 
                xAxis.map(item=>item.max = series_[series_.length -1])
          }else{
              let series_ = JSON.parse(JSON.stringify(series))
              let maxArr = []
              console.log(series_[0])
              series_[0].value.map((item, index)=>{
                //   let max = 0
                  maxArr.push(0)
                  series_.map((v,q)=>{
                    maxArr[index] = maxArr[index] < v.value[index] ? v.value[index] : maxArr[index]
                  })
              })
              xAxis.map((item, index)=>item.max = maxArr[maxArr.length -1])
          }
          this.myChart.setOption({
              title: {
                text: '雷达图',
            },
            legend: {
                data: legend
            },
            radar: {
                // shape: 'circle',
                indicator: xAxis
            },
            series: [{
                type: 'radar',
                data: series
            }]
        });
          },500)
      },
      //饼图
      cakeData() {
          let table = this.dataArr[0].tableData;
          let data = []
          table.map((item, index)=>{
              data.push({
                  value: item.record, name: item.name
              })
          })
          if(this.myChart)this.myChart.dispose();
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          this.myChart.setOption({
              title: {
                text: '饼图',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    data: data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        });  
      },
      //柱状图
      columnData(){
          let legend = [];
          let series = [];
          let xAxis = [];
          console.log(this.dataArr)
          this.dataArr.map((item, index)=>{
              series.push({name:item.name,type:'bar',data:[]})
              item.tableData.map(val=>{
                  if(index === 0)legend.push(val.name)
                  series[index].data.push(Number(val.record))
              })
          })
          console.log(legend)
          console.log(series)
          if(this.myChart)this.myChart.dispose();
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          this.myChart.setOption({
              title: {
                text: '柱状图'
            },
            legend: {},
            tooltip: {},
            xAxis: {type: 'category',data: legend},
            yAxis: {},
            series: series
        });  
      },
      chartInit(legend,xAxis,series){
          if(this.myChart)this.myChart.dispose();
          this.myChart = this.$echarts.init(document.getElementById('myChart'))
          this.myChart.setOption({
            title: {
                text: '折线图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: series
        });  
      },
      handleFileChange(file) {
        let url = '/byd/web/index.php?r=reg/importstats'
        showModuleDeployList(url, {
            "mid": this.mid === ''? 0 : this.mid,
            "uid": sessionStorage.getItem('uid'),
            "type": this.activeName,
            "filename": file.name
        }).then(r => {
        console.log(r.data.stats)
        let dataArr = [];
        if(r.data.stats.length > 1) this.type = 'many'
        r.data.stats.map((item, index)=>{
            dataArr.push({
                name: item.title,
                tableData: []
            })
            item.list_detail.map(item1=>{
                dataArr[index].tableData.push({
                    name: item1.name,
                    record: item1.val,
                    unit: item1.unit,
                })
            })
        })
        this.dataArr = dataArr
        this.$emit('echartData', this.dataArr, this.activeName, this.checked)
        }).catch(() => {});
      }
  },
  mounted: function() {
        // 绘制图表
        this.chartInit([],[],[])
        // this.columnData()

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
