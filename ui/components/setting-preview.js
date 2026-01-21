import EventEmitterController from '@/utils/event-emitter-controller'
import Common from "./common";

export default class SettingPreview extends Common {
    constructor() {
        super()
        this.state = false // 设置弹窗是否显示
    }
    initEvent() {
        $('#settingsButton').on('click', () => {
            this.changeSetting(!this.state)
        })
        
        // 添加取消按钮事件监听
        $('#cancel-settings').on('click', () => {
            this.changeSetting(false)
        })
        
        // 添加确认按钮事件监听
        $('#save-settings').on('click', this.saveSettings.bind(this))
    }
    changeSetting(state) {
        let c_vis = $('.control-preview').css('visibility')
        let d_vis =$('.draw-preview').css('visibility')
        if (c_vis === 'visible' || d_vis === 'visible') {
            UI['notify'].send('请关闭预览窗口')
            return false
        }

        let status = state ? 'on' : 'off'
        $('.settings-preview').css('visibility', (state ? 'visible' : 'hidden'))
        $('#settingsButton').css('background', `url(../media/new-icon/setting-${status}.png) center / cover`)
        
        if (state) {
            // 显示时可以加载已保存的设置
            this.loadSettings();
        }

        this.state = state
    }
    
    // 保存设置到本地缓存
    saveSettings() {
        // 获取选中的模式
        let selectedMode = 'hardware'; // 默认值
        const selectedRadio = $('input[name="programMode"]:checked');
        if (selectedRadio.length > 0) {
            selectedMode = selectedRadio.val();
        }
        
        // 创建设置对象并保存到本地缓存
        const settings = {
            mode: selectedMode
        };
        
        try {
            localStorage.setItem('settings', JSON.stringify(settings));
            this.updateView(settings.mode)

            EventEmitterController.emit('on-reset-mode', selectedMode)
        } catch (error) {
            console.error('保存设置失败:', error);
        }

        this.changeSetting(false)
    }
    
    // 从本地缓存加载设置
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                if (settings.mode) {
                    // 设置选中的单选按钮
                    $(`input[name="programMode"][value="${settings.mode}"]`).prop('checked', true);
                }
            }
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    // 更新视图按钮
    updateView(type) {
        $('#channel_connect').css('display', type === 'hardware' ? 'flex' : 'none')
        $('#consolePreviewButton').css('display', type === 'turtle' ? 'none' : 'block')
        $('#skulptPreviewButton').css('display', type === 'turtle' ? 'block' : 'none')
    }
}