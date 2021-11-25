$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss

    }

    // 定义一个补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数，将来请求数据对象的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值默认请求第一页的数据
        pagesize: 2,// 每页显示几条数据，默认显示两条
        cate_id: '',//文章分类的Id
        state:'' //文章发布的状态        
    }

    // 一进入页面就调用获取文章列表的方法，才能看到页面
    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template("tpl-table", res)
                $('tbody').html(htmlStr)

                // 调用渲染页面的方法
                renderPage(res.total)
            }
        })
    }

    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res)
                $('[name=cate_id]').html(htmlStr)
                // 通过layui 重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q 中对应的值赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件进行筛选,重新渲染表格的数据
        initTable()
    })

    // 渲染分页的方法
    function renderPage(total) {
        // 调用此方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数
            limit: q.pagesize, //每页的条数
            curr: q.pagenum, //默认选中的分页
            // 自定义排版  prev-上一页区域 page-分页区域 next-下一页区域  count-总条目输出区域 limit-条目选择区域 skip-跳转
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调 first是布尔类型
            // 两种方式可以触发jump
            // 1.点击页码的时候
            // 2.只调用laypage.render()方法的时候，就会触发
            // 可以通过first的值来判断哪种方式来触发的jump回调函数
            // first为true 是方式二，反之方式一触发
            // 切换每页条数的时候也会触发jump回调
            jump: function (obj, first) {
                // 把最新的页码值 赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数赋值到q的pagesize属性中
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })

    }

    // 通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('#btn-delete').length
        // 获取文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后 需要判断当前这一页的还剩多少数据
                    // 如果当前页的数据被全部删除 则需要将页码值减一
                    // 然后再调用initTable方法
                    if (len === 1) {
                        // 如果len的值为1 那删除成功后页面上就没有数据了  然后让页码值减一
                        // 页码值最小必须为一  三元表达式 如果页码值已经等于一了,就不需要再页码值减一了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index)
        })
    })

    // 通过代理的方式为编辑按钮绑定点击事件
    // $('tbody').on('click', '#btn-edit', function () {
    //     // location.href = '/article/art_edit.html'
    //     var id = $(this).attr('data-id')
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/' + id,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('获取文章失败！')
    //             }
    //             // console.log(res)
    //             form.val("formEditInfo", res.data)
    //             location.href = '/article/art_edit.html'
    //         }
    //     })
    //         // articleContent()
    // })

    // 获取文章详情
    // function articleContent() {
    //     var id = $(this).attr('data-id')
    //     $.ajax({
    //         method: 'GET',
    //         url: '/my/article/' + id,
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg('获取文章失败！')
    //             }
    //             // console.log(res)
    //             form.val("formEditInfo", res.data)
    //         }
    //     })
    // }
})