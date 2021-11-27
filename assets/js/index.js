// 入口函数
$(function () {
    // 调用获取用户基本信息的函数getUserInfo
    getUserInfo()


    // 从layui中获取layer对象
    var layer = layui.layer

    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 弹出提示框：提示用户是否退出登录
        layer.confirm('确定是否退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1.清空本地存储中的token
            localStorage.removeItem('token')
            // 2。跳转到登录页面
            location.href = '/大事件项目/code/login.html'
            // 3.关闭 confirm询问框 (layui提供的官方语句)
            layer.close(index);
          });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 是请求头的配置对象,在baseAPI.js文件统一设置
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 反之  调用 渲染用户头像的函数renderAvatar()
            renderAvatar(res.data)
        },
        // 无论成功或者失败 都会执行complete回调函数,在baseAPI.js文件中统一挂载此回调函数
        // complete: function (res) {
        //     // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token的值
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录页
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 3.渲染头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        // attr()设置属性
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文字头像
        $('.layui-nav-img').hide()
        // name[0] 获取名字的第一个字符  toUpperCase 转成大写的形式
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}