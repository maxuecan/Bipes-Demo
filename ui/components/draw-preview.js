import EventEmitterController from '../utils/event-emitter-controller'
import DragController from '../utils/drag-controller'

export default class DrawPreview {
    constructor() {
        this.element = new DragController(
            document.getElementsByClassName('draw-preview')[0],
            {
                minWidth: 300,
                minHeight: 300,
                maxWidth: 600,
                maxHeight: 600
            }
        )

        this.state = false

        EventEmitterController.on('draw-preview-change', (state) => {
            this.changeCode(state)
        })
    }
    // 显示隐藏预览区
    changeCode(state) {
        $('.draw-preview').css('visibility', (state ? 'visible' : 'hidden'))
        this.state = state
    }
}
