export default class ControlPreview {
    constructor(element, options = {}) {
        /* <--- 拖拽拉伸参数 start ---> */
        this.element = element
        this.options = {
            minWidth: options.minWidth || 560,
            minHeight: options.minHeight || 400,
            maxWidth: options.maxWidth || 800,
            maxHeight: options.maxHeight || 607,
            onResize: options.onResize || null,
            handles: options.handles || "all"
        }
        this.isResizing = false
        this.isDragging = false
        this.currentHandle = null
        this.startX = 0
        this.startY = 0
        this.startWidth = 0
        this.startHeight = 0
        this.startLeft = 0
        this.startTop = 0
        /* <--- 拖拽拉伸参数 end ---> */

        this.state = false // 控制台状态
        this.initEvent() // 初始化事件
    }
    initEvent() {
        $('#consolePreviewButton').on('click', () => {
            this.changeConsole(!this.state)
        })
        // 终端清空功能
        $('.control-clear').on('click', () => {
            term.write('\x1bc')
        })
        $('.control-close').on('click', () => {
            this.changeConsole(false)
        })
        // 初始化拖拽拉伸功能
        this.createHandles()
        this.bindEvents()
    }
    // 显示隐藏预览区
    changeConsole(state) {
        let status = state ? 'on' : 'off'
        $('.control-preview').css('visibility', (state ? 'visible' : 'hidden'))
        $('#consolePreviewButton').css('background', `url(../media/new-icon/console-${status}.png) center / cover`)
        this.state = state
    }
    createHandles() {
        const handles = [
            { class: "resize-handle-n", cursor: "n-resize" },
            { class: "resize-handle-s", cursor: "s-resize" },
            { class: "resize-handle-w", cursor: "w-resize" },
            { class: "resize-handle-e", cursor: "e-resize" },
            { class: "resize-handle-nw", cursor: "nw-resize" },
            { class: "resize-handle-ne", cursor: "ne-resize" },
            { class: "resize-handle-sw", cursor: "sw-resize" },
            { class: "resize-handle-se", cursor: "se-resize" },
        ]
        handles.forEach((handle) => {
            const handleEl = document.createElement("div")
            handleEl.className = `resize-handle ${handle.class}`
            this.element.appendChild(handleEl)
        })
    }
    bindEvents() {
        const handles = this.element.querySelectorAll(".resize-handle")

        handles.forEach((handle) => {
            handle.addEventListener("mousedown", this.startResize.bind(this))
        })
        // 标题栏拖拽移动
        const header = this.element.querySelector(".control-header")
        if (header) {
            header.addEventListener("mousedown", this.startDrag.bind(this))
        }
        document.addEventListener("mousemove", this.handleResize.bind(this))
        document.addEventListener("mouseup", this.stopResize.bind(this))
    }
    startResize(e) {
        e.preventDefault()
        this.isResizing = true
        this.currentHandle = e.target
        this.startX = e.clientX
        this.startY = e.clientY

        const styles = window.getComputedStyle(this.element)
        this.startWidth = parseInt(styles.width, 10)
        this.startHeight = parseInt(styles.height, 10)
        this.startLeft = parseInt(styles.left, 10) || 0
        this.startTop = parseInt(styles.top, 10) || 0

        document.body.style.userSelect = "none"
    }
    startDrag(e) {
        e.preventDefault()
        this.isDragging = true
        this.startX = e.clientX
        this.startY = e.clientY

        const styles = window.getComputedStyle(this.element)
        this.startLeft = parseInt(styles.left, 10) || 0
        this.startTop = parseInt(styles.top, 10) || 0

        document.body.style.userSelect = "none"
    }
    handleResize(e) {
        if (!this.isResizing && !this.isDragging) return

        if (this.isResizing) {
            this.doResize(e)
        } else if (this.isDragging) {
            this.doDrag(e)
        }
    }
    doResize(e) {
        const deltaX = e.clientX - this.startX
        const deltaY = e.clientY - this.startY

        let newWidth = this.startWidth
        let newHeight = this.startHeight
        let newLeft = this.startLeft
        let newTop = this.startTop

        // 根据拖拽的控制点调整尺寸和位置
        if (this.currentHandle.classList.contains("resize-handle-e")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth + deltaX)
            )
        } else if (this.currentHandle.classList.contains("resize-handle-w")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth - deltaX)
            )
            newLeft = this.startLeft + deltaX
            if (newLeft > this.startLeft) newLeft = this.startLeft
        } else if (this.currentHandle.classList.contains("resize-handle-s")) {
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight + deltaY)
            )
        } else if (this.currentHandle.classList.contains("resize-handle-n")) {
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight - deltaY)
            )
            newTop = this.startTop + deltaY
            if (newTop > this.startTop) newTop = this.startTop
        } else if (this.currentHandle.classList.contains("resize-handle-se")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth + deltaX)
            )
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight + deltaY)
            )
        } else if (this.currentHandle.classList.contains("resize-handle-sw")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth - deltaX)
            )
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight + deltaY)
            )
            newLeft = this.startLeft + deltaX
            if (newLeft > this.startLeft) newLeft = this.startLeft
        } else if (this.currentHandle.classList.contains("resize-handle-ne")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth + deltaX)
            )
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight - deltaY)
            )
            newTop = this.startTop + deltaY
            if (newTop > this.startTop) newTop = this.startTop
        } else if (this.currentHandle.classList.contains("resize-handle-nw")) {
            newWidth = Math.max(
                this.options.minWidth,
                Math.min(this.options.maxWidth, this.startWidth - deltaX)
            )
            newHeight = Math.max(
                this.options.minHeight,
                Math.min(this.options.maxHeight, this.startHeight - deltaY)
            )
            newLeft = this.startLeft + deltaX
            newTop = this.startTop + deltaY
            if (newLeft > this.startLeft) newLeft = this.startLeft
            if (newTop > this.startTop) newTop = this.startTop
        }

        // 应用新尺寸和位置
        this.element.style.width = `${newWidth}px`
        this.element.style.height = `${newHeight}px`
        this.element.style.left = `${newLeft}px`
        this.element.style.top = `${newTop}px`

        // 调用回调函数
        if (this.options.onResize) {
            this.options.onResize({
                width: newWidth,
                height: newHeight,
                left: newLeft,
                top: newTop
            })
        }

        term.resize()
    }
    doDrag(e) {
        const deltaX = e.clientX - this.startX
        const deltaY = e.clientY - this.startY

        const newLeft = this.startLeft + deltaX
        const newTop = this.startTop + deltaY

        let width = +getComputedStyle(this.element).width.replace('px', '')
        let height = +getComputedStyle(this.element).height.replace('px', '')

        let offWidth = +document.body.offsetWidth
        let offHeight = +document.body.offsetHeight

        if (
            newLeft > 0 &&
            (width + newLeft) < offWidth
        ) this.element.style.left = `${newLeft}px`

        if (
            newTop > 0 &&
            (height + newTop) < offHeight
        ) this.element.style.top = `${newTop}px`
    }
    stopResize() {
        this.isResizing = false
        this.isDragging = false
        this.currentHandle = null
        document.body.style.userSelect = ""
    }
}
