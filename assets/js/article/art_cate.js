$(function () {
    var layer = layui.layer
    var form = layui.form

    var indexAdd = null
    // 给添加分类按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px','250px'],
            title: '添加文章分类',
            // 如何获取某个标签的元素
            content: $('#dialog-add').html()
        });  
    })

    initArtCateList()

    // 获取文章分类列表
    function initArtCateList() {
        // 发起ajax请求，
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res)
                // 调用模板引擎 第一个参数是模板的id 第二个是数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 通过代理的形式(因为表单是通过后期的拼接获得的 而不是一开始就存在于页面中)，为表单绑定提交事件
    $('body').on('submit', '#form-add',function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                initArtCateList()
                layer.msg('新增文章分类成功！')
                // 根据索引 关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    // 给修改按钮绑定点击事件 但是修改按钮也是通过模板引擎的方式渲染出来的 所以无法直接为其绑定事件 需要通过代理的方式
    $('tbody').on('click', '#btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px','250px'],
            title: '修改文章分类',
            // 如何获取某个标签的元素
            content: $('#dialog-edit').html()
        })
        
        var id = $(this).attr('data-id')
        // 发起ajax请求 获取对应id的分类数据 method 是jQuery1.8之后有的 语义化比type更强一点
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 快速为表单填充数据 第一个参数是表单的id 第二个参数是填充的数据 
                form.val('form-edit',res.data)
            }
        })
    })
 
    // 用代理的方式 为表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        // 发起ajax请求 
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                // console.log(res)
                layer.msg('更新分类信息成功！')
                // 关闭弹出层
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 用代理的形式给 删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }

            })  
            
        })
    })  

})