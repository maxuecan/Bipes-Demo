import ExtensionsList from '@/config/extensions-blocks.js'
import { resetPostion } from '@/utils/utils'

export default class extensionsDialog {
    constructor() {
        this._xml = undefined
        this._show = false
        this.list = ExtensionsList
        this.use = []
        this.after_extensions = [] // 记录已经添加过的扩展积木
    }
    // 初始化事件
    initEvent() {
        $('.extensions-modal-close').on('click', this.close.bind(this))
        $('.extensions-modal-confirm').on('click', this.confirm.bind(this))
        $('.extensions-modal-list').on('click', this.select.bind(this))
    }
    // 销毁事件
    removeEvent() {
        $('.extensions-modal-close').off('click', this.close.bind(this))
        $('.extensions-modal-confirm').off('click', this.confirm.bind(this))
        $('.extensions-modal-list').off('click', this.select.bind(this))
    }
    // 显示隐藏弹窗
    show() {
        if (this._show) {
            $('.extensions-dialog').remove()
            this.removeEvent()
        } else {
            $('body').append(this.render())
            this.initEvent()
            this.createList()
        }

        this._show = !this._show
    }
    // 创建扩展列表
    createList() {
        $('.extensions-list').empty()
        for (let i in this.list) {
            let li = $('<li>')
                    .attr('key', this.list[i]['type'])
                    .css({
                        background: `url(${this.list[i]['image']}) center/cover no-repeat`,
                    })
            let box = $('<div>')
                    .addClass('extensions-list-image')
                    .attr('key', this.list[i]['type'])
            let detail = $('<div>')
                .addClass('extensions-list-detail')
                .attr('key', this.list[i]['type'])

            let name = $('<h4>').text(this.list[i]['name']).attr('key', this.list[i]['type'])
            let remark = $('<span>').text(this.list[i]['remark']).attr('key', this.list[i]['type'])
            detail.append(name).append(remark)
            $('.extensions-modal-list').append(li.append(box).append(detail))
        }
    }
    // 选择列表
    select(e) {
        let key = e.target.getAttribute('key')
        if (key !== null) {
            let index = this.use.indexOf(key)
            let type = undefined
            if (index !== -1) {
                this.use.splice(index, 1)
                type = 'delete'
            } else {
                this.use.push(key)
                type = 'add'
            }
            this.highlightList(type, key)
            this.showConfirm()
        }
    }
    // 高亮列表项
    highlightList(action, key) {
        $('.extensions-modal-list li').each(function(index) {
            let c_key = $(this).attr('key')
            if (key === c_key) {
                if (action === 'add') {
                    $(this).addClass('extensions-modal-list-act')
                } else if (action === 'delete') {
                    $(this).removeClass('extensions-modal-list-act')
                }
            }
        })
    }
    // 显示确认按钮
    showConfirm() {
        if (this.use.length > 0) {
            $('.extensions-modal-footer').css('display', 'block')
        } else {
            $('.extensions-modal-footer').css('display', 'none')
        }
    }
    // 关闭
    close() {
        this.show()
    }
    // 确认操作
    confirm() {
        let str = ''
        this.use.forEach(item => {
            let index = this.after_extensions.indexOf(item)
            if (index === -1) {
                this.after_extensions.push(item)
                str += this.getExtendsionsXML(item)
            }
        })

        if (str) {
            if (!this._xml) this._xml = window._xml.cloneNode(true)
            let toolbox = this._xml
            toolbox.children[0].innerHTML += str
            Code.reloadToolbox(toolbox)
        }

        this.show()
        resetPostion()
    }
    /* 获取扩展积木的XML */
    getExtendsionsXML(type) {
        let item = ExtensionsList.filter(itm => itm.type === type)
        return item[0].xml
    }
    // 重置toolbox
    resetToolbox() {
        return new Promise((resolve) => {
            this._xml = window._xml.cloneNode(true)
            Code.reloadToolbox(this._xml)
            this.use = []
            this.after_extensions = []
            setTimeout(resolve(true), 200)
        })
    }

    render() {
        return `
            <div class="extensions-dialog">
                <div class="extensions-modal">
                    <div class="extensions-modal-header">
                        <h4></h4>
                        <ul class="extensions-modal-nav">
                            <li class="extensions-modal-nav-act" key="basic">
                                <span key="basic">扩展积木</span>
                            </li>
                        </ul>
                        <div class="extensions-modal-close"></div>
                    </div>

                    <div class="extensions-modal-content">
                        <ul class="extensions-modal-list"></ul>
                    </div>

                    <div class="extensions-modal-footer">
                        <button class="extensions-modal-confirm">确认添加</button>
                    </div>
                </div>
            </div>
        `
    }
}