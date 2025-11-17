const EventEmitter = require('events')

class EventEmitterController extends EventEmitter {
    constructor() {
        super()

        // 事件监听
        this.on('open-control-pewivew', () => {
            this.emit('control-pewivew-change-console', true)
        })
    }
}

export default new EventEmitterController()
