// 注意：每次调用$.get() $.post() $.ajax()的时候
// 会先调用ajaxPrefilter 这个函数
// 在这个函数中，可以拿到Ajax提供的配置对象
$.ajaxProfilter(function (options) {
    // 再发起真正的Ajax请求之前，统一拼接请求的根目录
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})