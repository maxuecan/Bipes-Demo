import Common from "./common";
import EventEmitterController from '@/utils/event-emitter-controller'
import DragController from '@/utils/drag-controller'

export default class DrawPreview extends Common {
    constructor() {
        super()
        // 创建拖拽容器
        this.element = new DragController(
            document.getElementsByClassName('draw-preview')[0],
            {
                minWidth: 400,
                minHeight: 400,
                maxWidth: 600,
                maxHeight: 600
            },
            'draw',
            (params) => {
                let { newWidth, newHeight } = params
                $('#draw-canvas').css({
                    width: newWidth + 'px',
                    height: newHeight - 52 + 'px'
                })
                window.Sk.TurtleGraphics.width = newWidth
                window.Sk.TurtleGraphics.height = newHeight - 52
            }
        )

        this.state = false

        EventEmitterController.on('draw-preview-change', (state) => {
            this.changeCode(state)
        })
    }
    initEvent() {
        $('.draw-close').on('click', () => {
            this.changeCode(false)
        })

        $('#skulptPreviewButton').on('click', () => {
            this.changeCode(!this.state)
        })
    }
    // 显示隐藏预览区
    changeCode(state) {
        $('.draw-preview').css('visibility', (state ? 'visible' : 'hidden'))
        this.state = state
    }
}
