<template>
    <section>
        <div class="bk-panel mb20">
            <div class="bk-panel-body p25">
                <form class="bk-form" :model="form" @submit="onSubmit">
                    <div class="row more-query-cont">
                        <div class="col-md-4 col-lg-4 col-xs-4">
                            <div class="bk-form-item">
                                <label class="bk-label pr15" style="width:100px;">新闻标题：</label>
                                <div class="bk-form-content" style="margin-left:100px;">
                                    <input type="text" v-model="form.title" class="bk-form-input" placeholder="请输入新闻标题" style="width:100%;">
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
                    <div class="panel-title">新闻管理</div>
                    <!-- <div class="panel-subtitle">(最高权限)</div> -->
                </div>
                <div class="bk-panel-action fr">
                    <div class="bk-form bk-inline-form bk-form-small">
                        <div class="bk-form-item is-required">
                            <div class="bk-form-content">
                                <button class="bk-button bk-primary bk-button-small" @click="$router.push('/news/add')" title="添加News">添加</button>
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
                                <th>标题</th>
                                <th>简介</th>
                                <th>类别</th>
                                <th>创建时间</th>
                                <th style="width:325px">操作</th>
                            </tr>
                        </thead>
                        <tbody v-if="table.dataList.length>0">
                            <tr v-for="(item,index) in table.dataList">
                                <td><div style="width:200px; height:40px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">{{item.title}}</div></td>
                                <td><div style="width:200px; height:40px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">{{item.brief}}</div></td> 
                                <td>{{item.category==1?'仁良业绩':'业内资讯'}}</td>
                                <td>{{dateTime(item.createTime)}}</td>
                                <td>
                                    <router-link :to="{path:'/news/info/'+item.newsId}" class="bk-text-button" title="基本信息">
                                        基本信息
                                    </router-link>
                                    <a class="bk-text-button" @click="handleDel(item)" title="删除">
                                        删除
                                    </a>
                                     
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" align="center">没数据</td>
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
            urlPath: {
                pathsec: '',
                pathsec: ''
            },
            topTime: '最近一年',
            form: {
                title: '', //身份证
                telephone: '', //手机号  

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
        handleCurrentChange(val) {
            this.table.pageNum = val;
            this.getDataList();
        },
        //删除
        handleDel: function(row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                let para = {
                    bid: row.bid
                };
                this.$http.ajaxPost({
                    url: 'banner/delete',
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
        getDataList() {
            let params = {};
            params = {
                pageSize: this.table.pageSize,
                pageNum: this.table.pageNum,
                title: this.form.title, //企业名称 
            }
            this.listLoading = true;
            this.$http.ajaxPost({
                url: 'news/query',
                params: params
            }, (res) => {
                this.$http.aop(res, () => {
                    this.table.total = res.body.data.total;
                    this.table.dataList = res.body.data.newsInfoList || [];
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