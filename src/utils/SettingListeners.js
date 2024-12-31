import {pluginLog} from "./frontLog.js";

const pluginAPI = window.stick_emoji

export class SettingListeners {
    constructor(doc) {//传入一个document对象
        this.document = doc
    }

    async autoStickSwitchListener() {
        const mySwitch = this.document.querySelector('#auto-stick-switch')
        if ((await pluginAPI.getConfig()).autoStick) mySwitch.toggleAttribute('is-active')

        mySwitch.addEventListener('click', async () => {
            const autoStick = (await pluginAPI.getConfig()).autoStick
            mySwitch.toggleAttribute('is-active')
            // 修改状态
            await pluginAPI.setConfig({autoStick: !autoStick})
        })
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

    //跑马灯特效
    async carouselSwitchListener() {
        const mySwitch = this.document.querySelector('#carousel-switch')
        if ((await pluginAPI.getConfig()).useCarousel) mySwitch.toggleAttribute('is-active')

        mySwitch.addEventListener('click', async () => {
            const useCarousel = (await pluginAPI.getConfig()).useCarousel
            mySwitch.toggleAttribute('is-active')
            //修改状态
            await pluginAPI.setConfig({useCarousel: !useCarousel})
        })
    }

    //跑马灯的运行轮数
    async carouselCircleInputListener() {
        const input = this.document.querySelector('#carousel-circle')
        input.value = (await pluginAPI.getConfig()).carouselCircle
        input.addEventListener('change', async event => {
            await pluginAPI.setConfig({carouselCircle: parseInt(event.target.value)})
        })
    }

    //跑马灯每次表情间隔增删时间
    async carouselIntervalInputListener() {
        const input = this.document.querySelector('#carousel-interval')
        input.value = (await pluginAPI.getConfig()).carouselInterval
        input.addEventListener('change', async event => {
            await pluginAPI.setConfig({carouselInterval: parseInt(event.target.value)})
        })
    }

    // 仓库按钮
    async repoButtonListener() {
        this.document.querySelector('#github-button').addEventListener('click', () =>
            LiteLoader.api.openExternal('https://github.com/WJZ-P/LiteLoaderQQNT-Stick-Emoji'));
    }

    //检查更新
    async checkUpdateButtonListener() {
        const button = this.document.querySelector('#check-update-btn')
            .addEventListener('click', async (e) => {
                const req = await fetch(
                    'https://api.github.com/repos/WJZ-P/LiteLoaderQQNT-Stick-Emoji/releases/latest'
                );
                console.log(req)
                const res = await req.json();
                const current = LiteLoader.plugins.stick_emoji.manifest.version.split('.');
                const latest = res.tag_name.replace('v', '').split('.');
                for (let i in current) {
                    if (current[i] < latest[i]) {
                        button.innerHTML = `当前版本 v${current.join('.')} 发现新版本 ${res.tag_name}`;
                        button.innerHTML = '立即更新';
                        button.addEventListener('click', () => LiteLoader.api.openExternal(res.html_url));
                        break;
                    } else button.innerHTML = '暂未发现';
                }
            });
    }

    onLoad() {
        this.autoStickSwitchListener()
        this.stickSelfRangeListener()
        this.stickOtherRangeListener()
        this.repoButtonListener()
        this.carouselSwitchListener()
        this.checkUpdateButtonListener()
        this.carouselCircleInputListener()
        this.carouselIntervalInputListener()
    }
}
