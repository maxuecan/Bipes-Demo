import EventEmitterController from '@/utils/event-emitter-controller'
import { resetPostion } from '@/utils/utils'

export default class extensionsBtn {
    constructor(props) {
        this.settings = props.settings
        this.resetPostion = resetPostion
        if (document.getElementById('content_blocks')) {
            $('#content_blocks').append(this.render())
            this.initEvent()
        }

        // 根据模式，控制扩展按钮的显示
        setTimeout(() => {
            let { mode } = this.settings
            resetPostion()
            $('#extensions-btn').css('display', mode === 'turtle' ? 'block' : 'none')
        }, 1000);
    }
    // 初始化事件
    initEvent() {
        window.addEventListener('resize', (e) => {
            this.resetPostion()
        })

        $('#extensions-btn').on('click', () => {
            EventEmitterController.emit('open-extensions-dialog')
        })
    }

    render() {
        return `
            <div id="extensions-btn">
                <div class="extensions-add"></div>
            </div>
        `
    }
}
