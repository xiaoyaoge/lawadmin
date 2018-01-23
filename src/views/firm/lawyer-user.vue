<template>
    <section>
        <div class="bk-panel mb20">
            <div class="bk-panel-body p25">
                <form class="bk-form" :model="form" @submit="onSubmit">
                    <div class="row more-query-cont">
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item">
                                <label class="bk-label pr15" style="width:100px;">律师名称：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.lname" class="bk-form-input" placeholder="请输入律师名称" style="width:100%;">
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <button class="bk-button bk-success">查询</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- 主要表格 -->
        <div class="bk-panel bk-demo" v-loading="listLoading">
            <div class="bk-panel-header" role="tab">
                <div class="bk-panel-info fl">
                    <div class="panel-title">仁良律师</div>
                    <!-- <div class="panel-subtitle">(最高权限)</div> -->
                </div>
                <div class="bk-panel-action fr">
                    <div class="bk-form bk-inline-form bk-form-small">
                        <div class="bk-form-item is-required">
                            <div class="bk-form-content">
                                <button class="bk-button bk-primary bk-button-small" @click="$router.push('/lawyer/add')" title="添加律师">添加</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bk-panel-body p0">
                <form>
                    <table class="bk-table has-thead-bordered">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>Title</th>
                                <th>时间</th>
                                <th style="width:325px">操作</th>
                            </tr>
                        </thead>
                        <tbody v-if="table.dataList.length>0">
                            <tr v-for="(item,index) in table.dataList" :key="index">
                                <td>{{item.name}}</td>
                                <td>{{item.title}}</td>
                                <td>{{dateTime(item.createTime)}}</td>
                                <td>
                                    <a v-if="item.top===0" class="bk-text-button" @click="setTop(item,'top')">置顶</a>
                                    <a v-else class="bk-text-button" @click="setTop(item,'noTop')">取消置顶</a>
                                    <router-link :to="{path:'/lawyer/edit/'+item.lid}" class="bk-text-button" title="律师信息">
                                        律师信息
                                    </router-link>
                                    <a class="bk-text-button" @click="handleDel(item)" title="删除">
                                        删除
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4" align="center">没数据</td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                <div class="bk-panel-footer p10">
                    <button v-show="false" class="bk-button bk-default bk-button-small fl" title="下载搜索结果">
                        下载搜索结果
                    </button>
                    <el-pagination v-show="table.total>10" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="table.pageSize" :total="table.total" style="float:right;">
                    </el-pagination>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import {
    regionDataPlus,
    CodeToText,
    TextToCode
} from '../../area'
import moment from 'moment'
export default {
    data() {
        return {
            topTime: '最近一年',
            form: {
                lname: '', //律师名称 
            },
            table: {
                dataList: [],
                total: 0,
                pageSize: 10,
                pageNum: 1
            },
            listLoading: false,
        }
    },
    methods: {
        dateTime(val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        },
        queryCreateTime(val) {
            switch (val) {
                case '最近一年':
                    return 1;
                case '最近半年时':
                    return 2;
                case '最近一个月':
                    return 2;
                default:
                    return '';
            }
        },
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        handleDel: function(row) {
            this.$confirm('确认删除该律师吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let para = {
                    lid: row.lid
                };
                this.$http.ajaxPost({
                    url: 'lawyer/delete',
                    params: para
                }, (res) => {
                    this.$http.aop(res, () => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDataList();
                    });
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        setTop(opts, str) { // str top:置顶  noTop: 取消置顶
            let temp = Object.assign({}, JSON.parse(JSON.stringify(opts))); // copy obj
            let txtStr = '';
            if (str === 'top') {
                temp.top = 1;
                txtStr = '确认把这条数据置顶吗？'
            } else {
                temp.top = 0;
                txtStr = '确认取消这条数据置顶吗'
            }
            this.$confirm(txtStr, '提示', {}).then(() => {
                this.listLoading = true;
                this.$http.ajaxPost({
                    url: 'lawyer/modify',
                    params: temp
                }, (res) => {
                    this.$http.aop(res, () => {
                        if (res.body.ret == '0') {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                        }
                        this.getDataList();
                    });
                    this.listLoading = false;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        getDataList() {
            let params = {};
            params = {
                pageSize: this.table.pageSize,
                pageNum: this.table.pageNum,
                name: this.form.lname, //律师名称 
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'lawyer/query',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.table.total = res.body.data.total;
                    this.table.dataList = res.body.data.lawyerInfoList || [];
                    this.listLoading = false;
                });
            });
        },
        onSubmit() {
            this.getDataList();
        }
    },
    mounted() {
        this.getDataList();
    }
}
</script>