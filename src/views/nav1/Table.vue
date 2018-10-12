<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filterParam">
                <el-form-item>
                    <el-input v-model="filterParam.name" placeholder="公司名称" clearable @change="getJobs">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filterParam.progress" placeholder="当前进度" clearable @change="getJobs">
                        <el-option label="初筛" value="初筛"></el-option>
                        <el-option label="待笔试" value="待笔试"></el-option>
                        <el-option label="待初面" value="待初面"></el-option>
                        <el-option label="待复面" value="待复面"></el-option>
                        <el-option label="待三面" value="待三面"></el-option>
                        <!--<el-option label="待四面" value="待四面"></el-option>-->
                        <el-option label="待HR面" value="待HR面"></el-option>
                        <el-option label="待通知" value="待通知"></el-option>
                        <el-option label="被拒" value="被拒"></el-option>
                        <el-option label="OFFER" value="OFFER"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="filterParam.addr" placeholder="工作地点" clearable @change="getJobs">
                        <el-option label="杭州" value="杭州"></el-option>
                        <el-option label="北京" value="北京"></el-option>
                        <el-option label="上海" value="上海"></el-option>
                        <el-option label="广州" value="广州"></el-option>
                        <el-option label="深圳" value="深圳"></el-option>
                        <el-option label="武汉" value="武汉"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="exportExcel">全部导出</el-button>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table id="job" :data="jobs" highlight-current-row v-loading="listLoading"
                  @selection-change="selsChange" @sort-change="sortChange">
            <el-table-column type="expand" min-width="30">
                <template slot-scope="props">
                    <el-steps :active="props.row.step.active" :process-status="props.row.step.status">
                        <el-step v-for="(item,index) in props.row.step.stepDatas" :title="item.progress"
                                 :description="item.updateTime"></el-step>
                    </el-steps>
                </template>
            </el-table-column>
            <el-table-column type="selection" min-width="30">
            </el-table-column>
            <el-table-column width="60">
                <template scope="scope">
                    {{scope.$index + 1 + pageSize*(page-1)}}
                </template>
            </el-table-column>
            <!--<el-table-column prop="id" label="ID" min-width="60">-->
            <!--</el-table-column>-->
            <el-table-column prop="companyName" label="公司" min-width="80">
            </el-table-column>
            <el-table-column prop="companyAddress" label="地点" min-width="60">
            </el-table-column>
            <el-table-column prop="submitType" label="投递类型" min-width="80">
            </el-table-column>
            <el-table-column prop="submitTime" label="投递时间" min-width="80" sortable="custom">
            </el-table-column>
            <el-table-column prop="progress" label="当前进度" min-width="80">
            </el-table-column>
            <el-table-column prop="comment" label="备注" min-width="100" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" min-width="80" sortable="custom">
            </el-table-column>
            <el-table-column label="操作" min-width="100">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--对话框-->
        <el-dialog title="投递记录" v-model="editFormVisible" :close-on-click-modal="false" :show-close="false">
            <el-form :model="editForm" label-width="50px" :rules="editFormRules" ref="editForm"
                     style="padding:0px 0px;">
                <el-form-item label="公司" prop="companyName">
                    <el-input v-model="editForm.companyName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地点">
                    <el-radio-group v-model="editForm.companyAddress" size="medium">
                        <el-radio-button label="杭州"></el-radio-button>
                        <el-radio-button label="北京"></el-radio-button>
                        <el-radio-button label="上海"></el-radio-button>
                        <el-radio-button label="广州"></el-radio-button>
                        <el-radio-button label="深圳"></el-radio-button>
                        <el-radio-button label="武汉"></el-radio-button>
                        <el-radio-button label="其他"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker v-model="editForm.submitTime" type="date" placeholder="选择日期"
                                    :clearable="false" :editable="false" @change="subTimeChange"
                                    format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="editForm.submitType">
                        <el-radio-button label="网申"></el-radio-button>
                        <el-radio-button label="内推"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="进度">
                    <el-radio-group v-model="editForm.progress" size="medium">
                        <el-radio-button label="初筛"></el-radio-button>
                        <el-radio-button label="待笔试"></el-radio-button>
                        <el-radio-button label="待初面"></el-radio-button>
                        <el-radio-button label="待复面"></el-radio-button>
                        <el-radio-button label="待三面"></el-radio-button>
                        <!--<el-radio-button label="待四面"></el-radio-button>-->
                        <el-radio-button label="待HR面"></el-radio-button>
                        <el-radio-button label="待通知"></el-radio-button>
                        <el-radio-button label="被拒"></el-radio-button>
                        <el-radio-button label="OFFER"></el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="padding:0px 10px;">
                <el-button @click.native="dialogCancel">取消</el-button>
                <el-button type="primary" @click.native="dialogSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    import util from '../../common/js/util'
    import {getJobList, getJobListByParams, downExcel, addJob, editJob, delJob, delJobs} from '../../api/api';

    export default {
        data() {
            return {
                downExcelUrl: downExcel,
                filterParam: {
                    name: '',
                    progress: '',
                    addr: ''
                },
                subSort: 0,
                updSort: -1,
                sels: [],//列表选中列
                jobs: [],
                total: 0,
                page: 1,
                pageSize: 10,
                listLoading: false,
                isEdit: false,
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    companyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    companyName: '',
                    companyAddress: '杭州',
                    submitTime: new Date(),
                    submitType: '网申',
                    progress: '初筛',
                    comment: ''
                }
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getJobs();
            },
            subTimeChange(val) {
                this.editForm.submitTime = util.formatDate.format(new Date(val), 'yyyy-MM-dd');
            },
            //获取投递列表
            getJobs() {
                // let param = {
                //     page: this.page,
                //     pageSize: this.pageSize
                // };
                // this.listLoading = true;
                // //NProgress.start();
                // getJobList(param).then((res) => {
                //     if (res.status === 200) {
                //         this.total = res.data.totalElements;
                //         this.jobs = res.data.content;
                //     }
                //     this.listLoading = false;
                //     //NProgress.done();
                // });
                if (!util.checkCompanyName(this.filterParam.name)) {
                    this.$message({
                        message: "请输入12字以内的合法字符",
                        type: 'error'
                    });
                    return;
                }
                let param = {
                    name: this.filterParam.name,
                    progress: this.filterParam.progress,
                    addr: this.filterParam.addr,
                    subSort: this.subSort,
                    updSort: this.updSort,
                    page: this.page,
                    pageSize: this.pageSize
                };
                this.listLoading = true;
                //NProgress.start();
                getJobListByParams(param).then((res) => {
                    if (res.status === 200) {
                        this.total = res.data.totalElements;
                        this.jobs = res.data.content;
                        this.updateSteps(res.data.content);
                    }
                    this.listLoading = false;
                    //NProgress.done();
                }).catch(error => {
                    this.listLoading = false;
                });
            },
            //显示新增界面
            handleAdd: function () {
                this.isEdit = false;
                this.editFormVisible = true;
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.isEdit = true;
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //更新
            dialogSubmit: function () {
                if (this.editForm.progress === '结束' && this.editForm.comment === '') {
                    this.$message({
                        message: '求职结束请备注OFFER信息或最终结果',
                        type: 'warning'
                    });
                    return;
                }
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if (!util.checkCompanyName(this.editForm.companyName)) {
                            this.$message({
                                message: "请输入12字以内的合法字符",
                                type: 'error'
                            });
                            return;
                        }
                        if (!util.checkComment(this.editForm.comment)) {
                            this.$message({
                                message: "请输入50字以内的合法字符",
                                type: 'error'
                            });
                            return;
                        }
                        this.editLoading = true;
                        //NProgress.start();
                        let param = Object.assign({}, this.editForm);
                        if (this.isEdit) {
                            editJob(param).then((res) => {
                                var msgType = 'warning';
                                if (res.code === 200) {
                                    this.dialogCancel();
                                    this.getJobs();
                                    msgType = 'success';
                                }
                                this.editLoading = false;

                                this.$message({
                                    message: res.msg,
                                    type: msgType
                                });
                                //NProgress.done();
                            }).catch(error => {
                                this.editLoading = false;
                            });
                        } else {
                            addJob(param).then((res) => {
                                var msgType = 'warning';
                                if (res.code === 200) {
                                    this.dialogCancel();
                                    this.getJobs();
                                    msgType = 'success';
                                }
                                this.editLoading = false;

                                this.$message({
                                    message: res.msg,
                                    type: msgType
                                });
                                //NProgress.done();
                            }).catch(error => {
                                this.editLoading = false;
                            });
                        }
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        //
                        // });
                    }
                });
            },
            //取消
            dialogCancel: function () {
                this.editFormVisible = false;
                this.editForm = {
                    id: 0,
                    companyName: '',
                    companyAddress: '杭州',
                    submitTime: new Date(),
                    submitType: '网申',
                    progress: '初筛',
                    comment: ''
                };
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    //NProgress.start();

                    delJob(row.id).then((res) => {
                        var msgType = 'warning';
                        if (res.data.code === 200) {
                            this.getJobs();
                            msgType = 'success';
                        }
                        // this.listLoading = false;

                        this.$message({
                            message: res.data.msg,
                            type: msgType
                        });
                        //NProgress.done()
                    });
                });
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    // this.listLoading = true;
                    //NProgress.start();

                    delJobs(ids).then((res) => {
                        var msgType = 'warning';
                        if (res.data.code === 200) {
                            this.getJobs();
                            msgType = 'success';
                        }
                        // this.listLoading = false;

                        this.$message({
                            message: res.data.msg,
                            type: msgType
                        });
                        //NProgress.done()
                    });
                });
            },
            exportExcel() {
                window.location.href = this.downExcelUrl;

                /**
                 * 单页导出
                 */
                // var wb = XLSX.utils.table_to_book(document.querySelector('#job'));
                // var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'array'});
                // try {
                //     FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '秋招投递记录.xlsx');
                // } catch (e) {
                //     if (typeof console !== 'undefined') {
                //         console.log(e, wbout);
                //     }
                // }
                // return wbout;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            sortChange: function ({column, prop, order}) {
                if (order === "ascending") {
                    if (prop === "submitTime") {
                        this.subSort = 0;
                        this.updSort = -1;
                    }
                    if (prop === "updateTime") {
                        this.updSort = 0;
                        this.subSort = -1;
                    }
                }
                if (order === "descending") {
                    if (prop === "submitTime") {
                        this.subSort = 1;
                        this.updSort = -1;
                    }
                    if (prop === "updateTime") {
                        this.updSort = 1;
                        this.subSort = -1;
                    }
                }
                this.getJobs();
            },
            /* 进度条函数 */
            updateSteps(data) {
                for (let k = 0; k < data.length; k++) {
                    let history = JSON.parse(data[k].history),
                        progress = data[k].progress,
                        l = 0,
                        is = ['初筛通过', '笔试通过', '初面通过', '复面通过', '三面通过', 'HR面通过', '拿到OFFER'],
                        isf = ['初筛未通过', '笔试未通过', '初面未通过', '复面未通过', '三面未通过', 'HR面未通过', '未拿到OFFER'],
                        ws = ['初筛', '待笔试', '待初面', '待复面', '待三面', '待HR面', '待通知', '被拒', 'OFFER'],
                        step = [{
                            progress: '初筛',
                            updateTime: ''
                        }, {
                            progress: '笔试',
                            updateTime: ''
                        }, {
                            progress: '初面',
                            updateTime: ''
                        }, {
                            progress: '复面',
                            updateTime: ''
                        }, {
                            progress: '三面',
                            updateTime: ''
                        }, {
                            progress: 'HR面',
                            updateTime: ''
                        }, {
                            progress: 'OFFER',
                            updateTime: ''
                        }],
                        stepInfo = {
                            active: 1,
                            status: 'process',
                            stepDatas: []
                        };
                    /* 设置当前是否为进行中状态 */
                    stepInfo.active = history.length;
                    if (history.length < 1) {
                        step[0].updateTime = data[k].submitTime;
                        l = ws.indexOf(progress);
                        stepInfo.stepDatas = history.concat(step.slice(l));
                        if (progress === '被拒') {
                            stepInfo.stepDatas = [{
                                progress: '被拒',
                                updateTime: data[k].updateTime
                            }];
                            stepInfo.status = 'error';
                        }
                    } else {
                        if (progress !== '被拒') {
                            l = is.indexOf(history[history.length - 1].progress);
                            stepInfo.stepDatas = history.concat(step.slice(l + 1));
                            stepInfo.status = 'process';
                        } else {
                            l = isf.indexOf(history[history.length - 1].progress);
                            stepInfo.stepDatas = history.concat(step.slice(l + 1));
                            stepInfo.active = history.length - 1;
                            stepInfo.status = 'error';
                        }
                    }
                    this.jobs[k].step = stepInfo;
                }
            },
        },
        mounted() {
            this.getJobs();
        }
    }

</script>

<style>
    .el-step__head.is-text.is-success {
        background-color: #20a0ff;
        border-color: #20a0ff;
    }

    .el-step__title.is-success {
        color: #20a0ff;
    }

    .el-step__description.is-success {
        color: #20a0ff;
    }

    .el-step__head.is-text.is-process {
        background-color: rgba(155, 155, 155, 1);
        color: rgba(255, 255, 255, 1);
        font-weight: 200;
        border-color: rgba(155, 155, 155, 1);
    }

    .el-step__title.is-process {
        color: rgba(155, 155, 155, 1);
    }

    .el-step__description.is-process {
        color: rgba(155, 155, 155, 1);
    }

    .el-step__line-inner {
        width: 100% !important;
    }

    .el-step__title {
        font-size: 12px;
    }

    .el-step__title.is-finish {
        font-weight: 200;
    }

    .el-step__description {
        font-size: 12px;
    }
</style>