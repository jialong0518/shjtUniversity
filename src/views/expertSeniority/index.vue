<template>
  <div class="account">
    <el-row :gutter="20" style="padding: 20px">
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">年份：</div>
        <el-select v-model="searchYear" style="width: 80%" placeholder="请选择">
          <el-option
            v-for="item in yearData"
            :key="item.year"
            :label="item.year"
            :value="item.year"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">院系：</div>
        <el-select
          v-model="searchFaculty"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in facultyData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">学科：</div>
        <el-select
          v-model="searchSubject"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in subjectData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">姓名：</div>
        <el-input
          style="width: 80%"
          v-model="searchName"
          @change="getTableData()"
          autocomplete="off"
        ></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 20px">
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">职称：</div>
        <el-select
          v-model="searchTitle"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in titleData"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">状态：</div>
        <el-select
          v-model="searchState"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option label="通过" value="通过"> </el-option>
          <el-option label="拒绝" value="拒绝"> </el-option>
          <el-option label="已撤回" value="已撤回"> </el-option>
          <el-option label="审核中" value="审核中"> </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">工号：</div>
        <el-input
          style="width: 80%"
          v-model="searchExpertNo"
          @change="getTableData()"
          autocomplete="off"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <div style="display: inline-block; width: 20%">承诺书确认状态：</div>
        <el-select v-model="exconfirm" style="width: 80%" placeholder="请选择">
          <el-option label="全部" value="全部"> </el-option>
          <el-option label="已确认" value="已确认"> </el-option>
          <el-option label="未确认" value="未确认"> </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="padding: 20px">
      <el-col :span="6">
        <el-button type="primary" @click="searchFun">搜 索</el-button>
        <el-button type="primary" plain @click="resetSearch()">重置</el-button>
        <!-- <el-button type="primary" @click="exportData">导 出</el-button> -->
      </el-col>
    </el-row>
    <div
      style="
        padding: 15px;
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
      "
    >
      <el-button
        type="primary"
        style="margin-left: 15px"
        @click="addAccountButt('form')"
        >添加</el-button
      >
      <el-button type="primary" style="margin-left: 15px" @click="downFile"
        >导入模板下载</el-button
      >
      <plupload @updata="batchImport">批量导入</plupload>
      <el-button
        type="primary"
        style="margin-left: 15px"
        @click="exportData('form')"
        >导 出</el-button
      >
      <el-button
        type="primary"
        style="margin-left: 15px"
        @click="exportLastData('form')"
        >导出上一年名单</el-button
      >
      <el-button
        type="primary"
        style="margin-left: 15px"
        v-show="powerType !== '4'"
        @click="batchRefuse('通过')"
        >批量通过</el-button
      >
      <el-button
        type="primary"
        style="margin-left: 15px"
        v-show="powerType !== '4'"
        @click="batchRefuse('拒绝')"
        >批量拒绝</el-button
      >
      <el-button type="primary" v-show="powerType !== '4'&&powerType !== '3'" style="margin-left: 15px" @click="downSMSFile"
        >批量短信模板下载</el-button
      >
      <plupload1  v-show="powerType !== '4'&&powerType !== '3'" @updata="batchImportSMS">批量发送短信</plupload1>
    </div>
    <div style="padding: 0 20px">
      <el-table
        :data="tableData"
        border
        @select="tableSelect"
        @select-all="tableSelectAll"
        style="width: 100%; border-radius: 10px"
      >
        <el-table-column type="selection" :selectable="selected" width="55">
        </el-table-column>
        <el-table-column prop="year" label="年份"> </el-table-column>
        <el-table-column prop="expertName" label="姓名"> </el-table-column>
        <el-table-column prop="expertGender" label="性别">
          <template slot-scope="scope">{{
            scope.row.expertGender === 1 ? "男" : "女"
          }}</template>
        </el-table-column>
        <el-table-column prop="expertCollege" label="院/系"> </el-table-column>
        <el-table-column prop="expertTitle" label="职称"> </el-table-column>
        <el-table-column prop="expertSubject" label="学科"> </el-table-column>
        <el-table-column prop="source" label="类型"> </el-table-column>
        <el-table-column prop="commitment" label="承诺书">
          <template slot-scope="scope">{{
            scope.row.commitment === "1" ? "已确认" : "未确认"
          }}</template>
        </el-table-column>
        <el-table-column prop="commitmentTime" label="承诺时间">
        </el-table-column>
        <el-table-column prop="expertPhone" label="电话"> </el-table-column>
        <el-table-column prop="status" label="状态"> </el-table-column>
        <el-table-column width="250" label="操作">
          <template slot-scope="scope">
            <el-button
              style="margin: 0 10px"
              @click="seeAccountButt(scope.row)"
              v-show="scope.row.status === '通过'"
              type="primary"
              size="mini"
              >详情</el-button
            >
            <el-popconfirm
              title="是否确定申请撤回？"
              @onConfirm="recallFun(scope.row)"
            >
              <el-button
                v-show="scope.row.status === '通过' && powerType == '4'"
                style="margin: 0 10px"
                slot="reference"
                type="primary"
                size="mini"
                >申请撤回</el-button
              >
            </el-popconfirm>
            <el-button
              style="margin: 0 10px"
              v-show="
                (scope.row.status === '拒绝' || scope.row.status === '通过') &&
                powerType == '1'
              "
              type="primary"
              @click="editAccountButt(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <el-popconfirm
              title="是否确定删除该账号？"
              @onConfirm="accountDel(scope.row)"
            >
              <el-button
                style="margin: 0 10px"
                slot="reference"
                type="danger"
                size="mini"
                >删除</el-button
              >
            </el-popconfirm>
            <el-button
              style="margin: 0 10px"
              type="primary"
              v-show="
                ('导入添加'.indexOf(scope.row.source) !== -1 &&
                  scope.row.status === '审核中' &&
                  powerType !== '4') ||
                ('撤回'.indexOf(scope.row.source) !== -1 &&
                  scope.row.status === '审核中' &&
                  powerType === '1')
              "
              @click="examineAccountButt(scope.row)"
              size="mini"
              >审核</el-button
            >
            <el-popconfirm
              title="是否确定撤回数据？"
              @onConfirm="backDataButt(scope.row)"
            >
              <el-button
                style="margin: 10px 10px 0"
                slot="reference"
                v-show="scope.row.status === '通过' && powerType === '1'"
                type="primary"
                size="mini"
                >强制退回</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center; margin-top: 20px">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 100]"
        :page-size="pageSize"
        layout="total,  prev, pager, next, sizes,jumper"
        :total="totalPage"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="titleForm"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialogAccountVisible"
    >
      <el-form
        :model="form"
        :rules="rulesAccount"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="专家工号" prop="expertNo">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            @input="expertNoFun"
            v-model="form.expertNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-select
            v-model="form.year"
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in yearData"
              :key="index"
              :label="item.year"
              :value="item.year"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="1" :disabled="titleForm.indexOf('查看') !== -1"
              >男</el-radio
            >
            <el-radio label="2" :disabled="titleForm.indexOf('查看') !== -1"
              >女</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="院/系"
          v-show="
            '123'.indexOf(powerType) !== -1 || titleForm.indexOf('查看') !== -1
          "
          prop="faculty"
        >
          <el-select
            v-model="form.faculty"
            @change="facultyFun"
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in facultyData"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select
            v-model="form.title"
            @change="titleFun"
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in titleData"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学科" prop="subject">
          <el-select
            v-model="form.subject"
            @change="subjectFun"
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in subjectData"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.phone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="在职" prop="inPosition">
      <el-radio-group v-model="form.inPosition">
        <el-radio label="1" :disabled="titleForm.indexOf('查看')!== -1">是</el-radio>
        <el-radio label="2" :disabled="titleForm.indexOf('查看')!== -1">否</el-radio>
      </el-radio-group>
    </el-form-item> -->
        <el-form-item label="密码" prop="expertPwd">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.expertPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="开户行"
          prop="bankName"
          :rules="[
            {
              required: form.facultyName === '医学院',
              message: '请填写开户行名称',
            },
          ]"
        >
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.bankName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="银行卡号"
          prop="bankNumber"
          :rules="[
            {
              required: form.facultyName === '医学院',
              message: '请填写银行卡号',
            },
          ]"
        >
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.bankNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            style="width: 300px"
            :disabled="titleForm.indexOf('查看') !== -1"
            v-model="form.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-show="titleForm.indexOf('审核') === -1"
      >
        <el-button @click="cancelSubmit('form')">取 消</el-button>
        <el-button
          :disabled="titleForm.indexOf('查看') !== -1"
          :loading="loadingAccount"
          type="primary"
          @click="submitAccount('form')"
          >确 定</el-button
        >
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        v-show="titleForm.indexOf('审核') !== -1"
      >
        <el-button
          :loading="loadingAccount"
          @click="dialogAccountVisible = false"
          >关闭</el-button
        >
        <el-button
          :loading="loadingAccount"
          @click="refuseSubmit('form', '拒绝')"
          >拒 绝</el-button
        >
        <el-button
          :loading="loadingAccount"
          type="primary"
          @click="refuseSubmit('form', '通过')"
          >通 过</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="batchAccountVisible"
    >
      <div>您确定批量审批{{ batchState }}数据吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="loadingAccount"
          @click="batchAccountVisible = false"
          >取 消</el-button
        >
        <el-button
          :loading="loadingAccount"
          type="primary"
          @click="refuseSubmit('form', batchState)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getYearlist,
  smsimport,
  getCollege,
  adminback,
  getSubject,
  getTitle,
  getTable,
  expertbasicbind,
  expertbasicadd,
  expertreadydel,
  expertbasicedit,
  expertreadyapprove,
  expertreadyexport,
  getApplyBack,
  expertReadyExportLastYear,
} from "@/api/expertSeniority";
import plupload from "@/components/plupload";
import plupload1 from "@/components/plupload";
import {download} from '@/utils'
export default {
  name: "Login",
  components: {
    plupload,
    plupload1,
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      console.log(rule, value);
      let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!myreg.test(value)) {
        callback(new Error("手机号格式不正确"));
        return;
      }
      callback();
    };
    let validateNo = (rule, value, callback) => {
      let myreg = /^[0-9A-Za-z]+$/;
      if (!myreg.test(value) || (value.length !== 5 && value.length !== 11)) {
        callback(new Error("专家工号5位或者11位，数组或者字母"));
        return;
      }
      callback();
    };
    let validateEml = (rule, value, callback) => {
      let myreg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
      if (!myreg.test(value)) {
        callback(new Error("邮箱格式不正确"));
        return;
      }
      callback();
    };
    return {
      powerType: sessionStorage.getItem("jd_powerType"),
      searchFaculty: "",
      searchSubject: "",
      searchTitle: "",
      searchName: "",
      searchYear: "",
      searchState: "",
      searchExpertNo: "",
      exconfirm: "全部",
      facultyData: [],
      subjectData: [],
      titleData: [],
      yearData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      dialogAccountVisible: false,
      batchAccountVisible: false,
      form: {
        sex: "",
        name: "",
        phone: "",
        faculty: "",
        facultyName: "",
        title: "",
        titleName: "",
        subject: "",
        subjectName: "",
        email: "",
        // inPosition: '',
        expertNo: "",
        expertPwd: "",
        remark: "",
        year: "",
        bankName: "",
        bankNumber: "",
      },
      message_: null,
      message1_: null,
      roleList: {},
      titleForm: "",
      rights_list: {},
      rulesAccount: {
        year: [{ required: true, message: "请选择年份", trigger: "blur" }],
        name: [{ required: true, message: "请填写名字", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        faculty: [
          {
            required:
              "123".indexOf(sessionStorage.getItem("jd_powerType")) !== -1,
            message: "请选择院/系",
            trigger: "blur",
          },
        ],
        title: [{ required: true, message: "请选择职称", trigger: "blur" }],
        subject: [{ required: true, message: "请选择学科", trigger: "blur" }],
        // inPosition: [
        //     { required: true, message: '请选择在职状态', trigger: 'change' }
        // ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        email: [{ required: true, message: "请填写邮箱", trigger: "blur" }],
        // bankName: [
        //     { required: this.form.facultyName === '医学院', message: '请填写开户行名称', trigger: 'blur' }
        // ],
        // bankNumber: [
        //     { required: this.form.facultyName === '医学院', message: '请填写银行卡号', trigger: 'blur' }
        // ],
        expertNo: [{ required: true, validator: validateNo, trigger: "blur" }],
        expertPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        remark: [{ required: false, message: "请输入备注", trigger: "blur" }],
      },
      loadingAccount: false,
      loginForm: {
        username: "admin",
        password: "111111",
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      tableData: [],
      accountId: "",
      wordVisible: false,
      word: "",
      account: "",
      batchState: "",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    backDataButt(data) {
      console.log(data);
      adminback({ id: data.id })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          this.getTableData();
        })
        .catch(() => {});
    },
    downSMSFile() {
      let url = window.location.href;
      if (
        url.indexOf("mob.hexntc.com") !== -1 ||
        url.indexOf("localhost") !== -1
      ) {
        download('https://mob.hexntc.com/expert/downloadfile?file=sms.xlsx','sms.xlsx')
        // window.location.href =
        //   "https://mob.hexntc.com/expert/downloadfile?file=sms.xlsx";
      }
      if (
        url.indexOf("expert.sjtu.edu.cn") !== -1 ||
        url.indexOf("localhost") !== -1
      ) {
        download('https://expert.sjtu.edu.cn/expert/downloadfile?file=sms.xlsx','sms.xlsx')
        // window.location.href =
        //   "https://expert.sjtu.edu.cn/expert/downloadfile?file=sms.xlsx";
      }
    },
    butbck() {
      return <div>123</div>;
    },
    downFile() {
      download('https://expert.sjtu.edu.cn/expert/downloadfile?file=expertready.xlsx','expertready.xlsx')
      // window.location.href =
      //   "https://expert.sjtu.edu.cn/expert/downloadfile?file=expertready.xlsx";
    },
    recallFun(data) {
      getApplyBack({ id: data.id })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          this.getTableData();
        })
        .catch(() => {});
    },
    selected(row, index) {
      if (row.status !== "审核中") {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },
    batchRefuse(name) {
      this.batchState = name;
      this.batchAccountVisible = true;
    },
    tableSelect(selection, row) {
      this.accountId = [];
      selection.map((item) => {
        this.accountId.push(item.id);
      });
    },
    tableSelectAll(selection) {
      this.accountId = [];
      selection.map((item) => {
        this.accountId.push(item.id);
      });
    },
    getYearData() {
      getYearlist({})
        .then((r) => {
          this.yearData = r.data;
        })
        .catch(() => {});
    },

    getFacultyData() {
      getCollege({})
        .then((r) => {
          this.facultyData = r.data;
        })
        .catch(() => {});
    },

    getSubjectData() {
      getSubject({})
        .then((r) => {
          this.subjectData = r.data;
        })
        .catch(() => {});
    },

    getTitleData() {
      getTitle({})
        .then((r) => {
          this.titleData = r.data;
        })
        .catch(() => {});
    },

    batchImport(data) {
      console.log(data, "批量导入");
      let time = new Date(); //time为现在的时间
      let year_ = time.getFullYear(); //获取现在的年份
      data.year = year_;
      data.source = "资格库";
      this.$router.push({
        path: "/importResults",
        query: { data: JSON.stringify(data) },
      });
    },
    batchImportSMS(data) {
      console.log(data, "批量导入sms");
      // return
      smsimport({
        fileName: `${data.fileHash}/${data.name}`,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.$message({
            message: "批量发送短信成功",
            type: "success",
          });
          this.loadingAccount = false;
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },

    facultyFun(data) {
      this.facultyData.map((item) => {
        if (item.code === data) {
          this.form.facultyName = item.name;
        }
      });
    },

    subjectFun(data) {
      this.subjectData.map((item) => {
        if (item.code === data) {
          this.form.subjectName = item.name;
        }
      });
    },
    titleFun(data) {
      this.titleData.map((item) => {
        if (item.code === data) {
          this.form.titleName = item.name;
        }
      });
    },

    expertNoFun(data) {
      console.log(data);
      this.form.expertPwd = data;
    },

    searchFun() {
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData();
    },

    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getTableData();
    },
    currentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },

    seeAccountButt(data) {
      this.titleForm = "查看专家信息";
      this.accountId = data.id;
      this.getuserbind();
    },
    editAccountButt(data) {
      this.accountId = data.id;
      this.titleForm = "编辑专家信息";
      this.getuserbind();
    },
    examineAccountButt(data) {
      this.accountId = data.id;
      this.titleForm = "审核专家信息";
      this.getuserbind();
    },
    addAccountButt(formName) {
      this.form.sex = "";
      this.form.name = "";
      this.form.phone = "";
      this.form.faculty = "";
      this.form.facultyName = "";
      this.form.title = "";
      this.form.titleName = "";
      this.form.subject = "";
      this.form.subjectName = "";
      this.form.email = "";
      this.form.expertNo = "";
      this.form.expertPwd = "";
      this.form.remark = "";
      this.form.year = "";
      this.form.bankName = "";
      this.form.bankNumber = "";
      this.accountId = "";
      this.titleForm = "添加专家信息";
      this.dialogAccountVisible = true;
    },
    cancelSubmit(formName) {
      console.log(formName);
      this.accountId = "";
      this.$refs[formName].resetFields();
      this.dialogAccountVisible = false;
    },
    refuseSubmit(name, state) {
      console.log(this.accountId.length);
      if (this.accountId.length === 0) {
        this.$message({
          message: "请先勾选记录！",
          type: "warning",
        });
        return;
      }
      if (typeof this.accountId !== "object") {
        this.accountId = [this.accountId];
      }
      this.loadingAccount = true;
      expertreadyapprove({
        ids: this.accountId,
        status: state,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.loadingAccount = false;
          this.dialogAccountVisible = false;
          this.batchAccountVisible = false;
          // this.account = this.form.account
          // this.$refs[name].resetFields();
          this.getTableData();
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    submitAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.titleForm.indexOf("添加") !== -1) {
            console.log(this.titleForm);
            this.addDataFun(formName);
          } else {
            console.log(this.titleForm);
            this.editDataFun(formName);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addDataFun(formName1) {
      this.loadingAccount = true;
      expertbasicadd({
        expertName: this.form.name,
        expertGender: Number(this.form.sex),
        expertCollege: this.form.facultyName,
        expertCollegeCode: this.form.faculty,
        expertTitle: this.form.titleName,
        expertTitleCode: this.form.title,
        expertSubject: this.form.subjectName,
        expertSubjectCode: this.form.subject,
        expertPhone: this.form.phone,
        expertEmail: this.form.email,
        expertNo: this.form.expertNo,
        expertPwd: this.form.expertPwd,
        remark: this.form.remark,
        year: Number(this.form.year),
        bankName: this.form.bankName,
        bankNumber: this.form.bankNumber,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.loadingAccount = false;
          this.dialogAccountVisible = false;
          // this.account = this.form.account
          this.$refs[formName1].resetFields();
          this.getTableData();
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    editDataFun(formName) {
      this.loadingAccount = true;
      expertbasicedit({
        id: this.accountId,
        expertName: this.form.name,
        expertGender: Number(this.form.sex),
        expertCollege: this.form.facultyName,
        expertCollegeCode: this.form.faculty,
        expertTitle: this.form.titleName,
        expertTitleCode: this.form.title,
        expertSubject: this.form.subjectName,
        expertSubjectCode: this.form.subject,
        expertPhone: this.form.phone,
        expertEmail: this.form.email,
        expertNo: this.form.expertNo,
        expertPwd: this.form.expertPwd,
        remark: this.form.remark,
        year: Number(this.form.year),
        bankName: this.form.bankName,
        bankNumber: this.form.bankNumber,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            this.loadingAccount = false;
            return;
          }
          this.loadingAccount = false;
          this.dialogAccountVisible = false;
          this.$refs[formName].resetFields();
          this.getTableData();
        })
        .catch(() => {
          this.loadingAccount = false;
        });
    },
    accountDel(data) {
      expertreadydel({
        id: data.id,
      })
        .then((r) => {
          if (r.code === 1) {
            this.$message({
              message: r.msg,
              type: "warning",
            });
            return;
          }
          this.getTableData();
          this.$message({
            message: "删除成功！",
            type: "success",
          });
        })
        .catch(() => {});
    },
    resetSearch() {
      this.searchFaculty = "";
      this.searchSubject = "";
      this.searchTitle = "";
      this.searchName = "";
      this.currentPage = 1;
      this.pageSize = 10;
      this.searchYear = "";
      this.searchState = "";
      this.searchExpertNo = "";
      this.exconfirm = "全部";
      this.getTableData();
    },
    getTableData() {
      getTable({
        college: this.searchFaculty,
        subject: this.searchSubject,
        competent: this.searchTitle,
        expertNo: this.searchExpertNo,
        name: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize,
        year: this.searchYear === "" ? 0 : Number(this.searchYear),
        status: this.searchState,
        exconfirm: this.exconfirm,
      })
        .then((r) => {
          this.tableData = r.data.list;
          this.totalPage = r.data.datacount;
        })
        .catch(() => {});
    },
    exportData() {
      expertreadyexport({
        college: this.searchFaculty,
        subject: this.searchSubject,
        competent: this.searchTitle,
        name: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize,
        year: this.searchYear === "" ? 0 : Number(this.searchYear),
        status: this.searchState,
        exconfirm: this.exconfirm,
      })
        .then((r) => {
          download(r.data,'expertreadyexport.xlsx')
          // window.location.href = r.data;
        })
        .catch(() => {});
    },
    exportLastData() {
      expertReadyExportLastYear({
        college: this.searchFaculty,
        subject: this.searchSubject,
        competent: this.searchTitle,
        name: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize,
        year: this.searchYear === "" ? 0 : Number(this.searchYear),
        status: this.searchState,
      })
        .then((r) => {
          download(r.data,'expertReadyExportLastYear.xlsx')
          // window.location.href = r.data;
        })
        .catch(() => {});
    },
    getuserbind() {
      expertbasicbind({
        id: this.accountId,
      })
        .then((r) => {
          this.form.bankName = r.data.bankName;
          this.form.bankNumber = r.data.bankNumber;
          this.form.subjectName = r.data.expertSubject;
          this.form.titleName = r.data.expertTitle;
          this.form.facultyName = r.data.expertCollege;
          this.form.sex = r.data.expertGender + "";
          this.form.name = r.data.expertName;
          this.form.phone = r.data.expertPhone;
          this.form.faculty = r.data.expertCollegeCode;
          this.form.title = r.data.expertTitleCode;
          this.form.subject = r.data.expertSubjectCode;
          this.form.email = r.data.expertEmail;
          this.form.inPosition = r.data.inPosition + "";
          this.form.expertNo = r.data.expertNo;
          this.form.expertPwd = r.data.expertPwd;
          this.form.remark = r.data.remark;
          this.form.year = r.data.year + "";
          this.dialogAccountVisible = true;
        })
        .catch(() => {});
    },
  },
  beforeDestroy() {
    this.message1_.close();
  },
  //   message_
  mounted: function () {
    this.getFacultyData();
    this.getSubjectData();
    this.getTitleData();
    this.getYearData();
    this.getTableData();
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #283443;
$light_gray: #fff;
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
.role {
  height: 100%;
  background: #fff;
}
</style>