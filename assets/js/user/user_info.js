$(function () {
    // 导入layui的form对象
    var form = layui.form
    var layer =layui.layer

    // 自定义验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称的长度必须在1-6个字符之间！'
            }
        }
    })

    // 调用 初始化用户信息的 函数 initUserInfo()
    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用form.val() 快速为表单赋值
                // console.log(res)
                form.val("formUserInfo", res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置事件
        e.preventDefault()
        // 重新调用此方法 重新获取表单的数据
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})