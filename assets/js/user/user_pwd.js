$(function () {

    var form = layui.form
    var layer = layui.layer

    // 自定义表单验证规则
    form.verify({
        pwd: [  
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 发起ajax请求充值密码
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！')
                } else {
                    layer.msg('更新密码成功！')
                    // 重置密码 要使用原生的dom对象  $('.layui-form')[0]  不能使用jQuery对象  调reset()方法(form元素自带的reset()方法 )
                    $('.layui-form')[0].reset()
                }

            }
        })
    })
})