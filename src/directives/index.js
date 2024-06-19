// 自定义指令

//图片加载失败
export const imageError = {
    // 会在当前指令作用的dom元素 插入之后执行
    // options 里面是指令的表达式
    inserted(dom, options) {
        dom.src = dom.src || options.value
        // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
        dom.onerror = function () {
            // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
            dom.src = options.value
        } 
    },
    componentUpdated(dom, options) {
        dom.src = dom.src || options.value
    }
}