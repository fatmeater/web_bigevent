// 注意：每次调用$.get() $.post() $.ajax()的时候
// 会先调用ajaxPrefilter 这个函数
// 在这个函数中，可以拿到Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 再发起真正的Ajax请求之前，统一拼接请求的根目录
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口(url地址里面包含/my 的接口) 设置headers请求头
    if (options.url.indexOf('/my/' !== -1)) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function (res) {
        // 在complete回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token的值
            localStorage.removeItem('token')
            // 2.强制跳转到登录页
            location.href = '/大事件项目/code/login.html'
        }
    }
})