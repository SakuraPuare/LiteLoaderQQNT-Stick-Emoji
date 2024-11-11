import {pluginLog} from "./frontLog.js";

const pluginAPI = window.stick_emoji

export class SettingListeners {
    constructor(doc) {//传入一个document对象
        this.document = doc
    }

    //贴自己表情
    async stickSelfRangeListener() {
        const range = this.document.querySelector('#stick-self-range')
        const showNumP = this.document.querySelector('#show-number')
        const stickSelfAmount = (await pluginAPI.getConfig()).stickSelfAmount
        range.value = stickSelfAmount
        showNumP.innerText = stickSelfAmount

        range.addEventListener('input', async () => {
            showNumP.innerText = range.value

            //修改状态
            await pluginAPI.setConfig({stickSelfAmount: parseInt(range.value)})
        })
    }

    //贴他人表情
    async stickOtherRangeListener() {
        const range = this.document.querySelector('#stick-other-range')
        const showNumP = this.document.querySelector('#show-number-other')
        const stickOtherAmount = (await pluginAPI.getConfig()).stickOtherAmount
        range.value = stickOtherAmount
        showNumP.innerText = stickOtherAmount

        range.addEventListener('input', async () => {
            showNumP.innerText = range.value

            //修改状态
            await pluginAPI.setConfig({stickOtherAmount: parseInt(range.value)})
        })
    }

    // 仓库按钮
    async repoButtonListener() {
        this.document.querySelector('#github-buttn').addEventListener('click', () =>
            LiteLoader.api.openExternal('https://github.com/WJZ-P/LiteLoaderQQNT-Stick-Emoji'));
    }

    onLoad() {
        this.stickSelfRangeListener()
        this.stickOtherRangeListener()
        this.repoButtonListener()
    }
}
