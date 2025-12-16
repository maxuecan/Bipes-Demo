export default class DragController {
    constructor(element, options = {}, type = '', callback = null) {
        this.element = element
        this.options = {
            minWidth: options.minWidth || 300,
            minHeight: options.minHeight || 300,
            maxWidth: options.maxWidth || 800,
            maxHeight: options.maxHeight || 800,
            onResize: options.onResize || null,
            handles: options.handles || 'all'
        }
        this.type = type
        this.callback = callback

        this.isResizing = false;
        this.isDragging = false;
        this.currentHandle = null;
        this.startX = 0;
        this.startY = 0;
        this.startWidth = 0;
        this.startHeight = 0;
        this.startLeft = 0;
        this.startTop = 0;
        this.boundary = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this.initEvent()

        window.addEventListener("resize", (e) => {
            this.boundary = {
                width: e.currentTarget.innerWidth,
                height: e.currentTarget.innerHeight
            }
        })
    }
    initEvent() {
        // 初始化拖拽拉伸功能
        this.createHandles()
        this.bindEvents()
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

        handles.forEach(handle => {
            const handleEl = document.createElement('div');
            handleEl.className = `resize-handle ${handle.class}`;
            this.element.appendChild(handleEl);
        });
    }
    bindEvents() {
        const handles = this.element.querySelectorAll(".resize-handle")

        handles.forEach((handle) => {
            handle.addEventListener("mousedown", this.startResize.bind(this))
            handle.addEventListener("mouseup", this.stopResize.bind(this))
        })
        // 标题栏拖拽移动
        const header = this.element.querySelector(`.${this.type}-header`)
        if (header) {
            header.addEventListener("mousedown", this.startDrag.bind(this))
        }
        document.addEventListener("mousemove", this.handleResize.bind(this))
        document.addEventListener("mouseup", this.stopResize.bind(this))
    }
    startResize(e) {
        if (this.isDragging) return
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
        if (this.isResizing) return
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
        let _deltaX = 0
        let _deltaY = 0

        // 根据拖拽的控制点调整尺寸和位置
        if (this.currentHandle.classList.contains("resize-handle-e")) {
            newWidth = this.getSize('max-width', this.startWidth + deltaX)
            if (
                newWidth === this.options.minWidth ||
                this.boundary.width - (newWidth + this.startLeft) < 10 ||
                (Number.isFinite(this.options.maxWidth) && (this.boundary.width - (newWidth + this.startLeft) <= 10))
            ) return
        } else if (this.currentHandle.classList.contains("resize-handle-w")) {
            newLeft = this.startLeft + deltaX
            if (newLeft <= 2) return

            newWidth = Math.max(
                this.options.minWidth,
                deltaX < 0 ? this.startWidth - deltaX : Math.max(this.options.minWidth, this.startWidth - deltaX)
            )

            if (
                newWidth === this.options.minWidth ||
                (Number.isFinite(this.options.maxWidth) && (newWidth > this.options.maxWidth))
            ) return
        } else if (this.currentHandle.classList.contains("resize-handle-s")) {
            newHeight = this.getSize('max-height', this.startHeight + deltaY)
            
            if (
                this.boundary.height - (newHeight + newTop) <= 10 ||
                (Number.isFinite(this.options.maxHeight) && (newHeight > this.options.maxHeight))
            ) return
        } else if (this.currentHandle.classList.contains("resize-handle-n")) {
            newTop = this.startTop + deltaY
            if (newTop <= 2) return 

            newHeight = Math.max(
                this.options.minHeight,
                deltaY < 0 ? this.startHeight - deltaY : Math.max(this.options.minHeight, this.startHeight - deltaY)
            )

            if (
                newHeight === this.options.minHeight || 
                (Number.isFinite(this.options.maxHeight) && (newHeight > this.options.maxHeight))
            ) return
        } else if (this.currentHandle.classList.contains("resize-handle-se")) {
            newWidth = this.getSize('max-width', this.startWidth + deltaX)
            newHeight = this.getSize('max-height', this.startHeight + deltaY)
            
            if (this.boundary.width - (newWidth + this.startLeft) < 10) {
                newWidth = this.boundary.width - this.startLeft - 10
            }
            if (this.boundary.height - (newHeight + this.startTop) < 10) {
                newHeight = this.boundary.height - this.startTop - 10
            }
        } else if (this.currentHandle.classList.contains("resize-handle-sw")) {
            newWidth = this.getSize('max-width', this.startWidth - deltaX)
            newHeight = this.getSize('max-height', this.startHeight + deltaY)

            newLeft = this.startLeft + deltaX
            if (newLeft <= 2) {
                newLeft = 2
                _deltaX = newLeft - this.startLeft
                newWidth = Math.min(this.options.maxWidth, this.startWidth - _deltaX)
            }
            if (newWidth === this.options.minWidth) {
                _deltaX = this.startWidth - this.options.minWidth
                newLeft = this.startLeft + _deltaX
            } else if (newWidth === this.options.maxWidth) {
                _deltaX = this.options.maxWidth - this.startWidth
                newLeft = this.startLeft - _deltaX
            }
            if (this.boundary.height - (newHeight + this.startTop) < 10) {
                newHeight = this.boundary.height - this.startTop - 10
            }
        } else if (this.currentHandle.classList.contains("resize-handle-ne")) {
            newWidth = this.getSize('max-width', this.startWidth + deltaX)
            newHeight = this.getSize('max-height', this.startHeight - deltaY)

            newTop = this.startTop + deltaY 
            if (newTop <= 2) {
                newTop = 2
                _deltaY = newTop - this.startTop
                newHeight = Math.min(this.options.maxHeight, this.startHeight - _deltaY)
            }
            if (newHeight === this.options.minHeight) {
                _deltaY = this.startHeight - this.options.minHeight
                newTop = this.startTop + _deltaY 
            } else if (newHeight === this.options.maxHeight) {
                _deltaY = this.options.maxHeight - this.startHeight
                newTop = this.startTop - _deltaY
            }
            if (this.boundary.width - (newWidth + this.startLeft) < 10) {
                newWidth = this.boundary.width - this.startLeft - 10
            }
        } else if (this.currentHandle.classList.contains("resize-handle-nw")) {
            newWidth = this.getSize('max-width', this.startWidth - deltaX)
            newHeight = this.getSize('max-height', this.startHeight - deltaY)

            newLeft = this.startLeft + deltaX
            if (newLeft <= 2) {
                newLeft = 2
                _deltaX = newLeft - this.startLeft
                newWidth = Math.min(this.options.maxWidth, this.startWidth - _deltaX)
            }
            if (newWidth === this.options.minWidth) {
                _deltaX = this.startWidth - this.options.minWidth
                newLeft = this.startLeft + _deltaX
            } else if (newWidth === this.options.maxWidth) {
                _deltaX = this.options.maxWidth - this.startWidth
                newLeft = this.startLeft - _deltaX
            }

            newTop = this.startTop + deltaY
            if (newTop <= 2) {
                newTop = 2
                _deltaY = newTop - this.startTop
                newHeight = Math.min(this.options.maxHeight, this.startHeight - _deltaY)
            }
            if (newHeight === this.options.minHeight) {
                _deltaY = this.startHeight - this.options.minHeight
                newTop = this.startTop + _deltaY 
            } else if (newHeight === this.options.maxHeight) {
                _deltaY = this.options.maxHeight - this.startHeight
                newTop = this.startTop - _deltaY
            }
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


        if (this.callback) {
            let params = null
            switch (this.type) {
                case 'draw':
                    params = {
                        newWidth,
                        newHeight
                    }
                    break;
                default:
                    break;
            }
            this.callback(params)
        }
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
    getSize(type, value) {
        switch (type) {
            case 'max-width':
                return Math.max(
                    this.options.minWidth,
                    Math.min(this.options.maxWidth, value)
                )
            case 'max-height':
                return Math.max(
                    this.options.minHeight,
                    Math.min(this.options.maxHeight, value)
                )
            default: 
                return false
        }
    }
}
