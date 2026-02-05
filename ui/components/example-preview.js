import ExamplesList from '@/config/examples-config.js'

export default class ExamplePreview {
    constructor(props) {
        this.state = false
        this.getLocalSettings = props.getLocalSettings
        this.tree = null
        this.mode = undefined

        $('.footer-box').append(this.render())
        this.initEvent()
        this.renderTree()
    }
    initEvent() {
        $('.example-box').on('click', this.changeConsole.bind(this))
        $('.example-h-c').on('click', this.changeConsole.bind(this))
    }
    // 显示隐藏案例
    changeConsole() {
        this.state = !this.state
        $('.example-container').css('display', this.state ? 'block' : 'none')
    }
    // 渲染案例内容
    async renderTree() {
        let { mode } = await this.getLocalSettings()

        let list = this.getList(mode)
        this.mode = mode
        let that = this
        layui.use(function() {
            that.tree = layui.tree

            that.tree.render({
                elem: '#example-content',
                id: 'my-tree',
                data: list,
                showCheckbox: false,
                showLine: true,
                click: function(obj) {
                    let { title } = obj.data
                    loadExampleFromURL(`/${that.mode}/${title}`)
                }
            })
        })
    }
    // 重置案例内容
    reload(mode) {
        this.mode = mode
        if (this.state) {
            $('.example-container').css('display', 'none')
        }
        let list = this.getList(mode)

        this.tree.reload('my-tree', {
            data: list
        })
    }
    // 获取文件列表
    getList(mode) {
        let list = ExamplesList.map(item => {
            if (mode === 'turtle' && item.title === 'turtle') {
                return item.children
            } else if (['hardware', 'offline'].includes(mode) && item.title === 'hardware') {
                return item.children
            }
        }).filter(item => item !== null && item !== undefined)[0]
        return list
    }

    render() {
        return `
            <div class="example-container">
                <div class="example-h">
                    <img class="example-h-c" src="./media/new-icon/close1.png" alt="">
                </div>
                <div id="example-content"></div>
                <div class="triangle-down"></div>
            </div>
        `
    }
}
