// 重置扩展按钮位置
export function resetPostion() {
    let dom = document.getElementsByClassName('blocklyToolboxContents')
    if (dom.length > 0) {
        let h = document.body.offsetHeight - 52 - 54 // 页面高度 - 顶部高度 - 按钮高度

        let b_h = 0
        let len = dom[0].children.length
        b_h = len * 60
        
        let top = 0
        if (h > b_h) top = b_h
        else top = h

        $('#extensions-btn').css({
            top: top + 'px'
        })
    }
}
