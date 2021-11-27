$(function () {
    var layer = layui.layer
    var form = layui.form
    
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }

                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 给选择封面绑定按钮事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return 
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        //  先销毁旧的裁剪区域  再重新设置图片路径 然后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布'

    // 给存为草稿 按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 给表单绑定submit事件
    $('#form-pub').on('submit', function (e) { 
        // 1.清除表单默认的提交事件
        e.preventDefault()
        // 2.基于form表单快速创建formData对象
        var fd = new FormData($(this)[0])

        // 3.将文章的发布状态存到fd中
        fd.append('state', art_state)
        
        // fd.forEach(function (v, k) {})

        // 4.将裁剪后的文件输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function(blob) {       
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到fd中
                fd.append('cover_img',blob)
                // 6.发起ajax请求
                editArticle(fd)
            })        
    })

    

    // 发起ajax请求
    function editArticle(fd) {
        $.ajax({
            method: 'GET',
            url: '/my/article/edit',
            data: fd,
            // 向服务器提交的是formData数格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false, 
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！')
                }
                layer.msg('修改文章成功！')
                // 重新获取文章列表数据
                initCate()
                // 发布文章成功后跳转到发布列表页面       
                location.href = '/大事件项目/code/article/article/art_list.html'
            }
        }) 
    }
})