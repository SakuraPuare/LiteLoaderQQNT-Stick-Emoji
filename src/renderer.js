// 运行在 Electron 渲染进程 下的页面脚本

import {pluginLog} from "./utils/frontLog.js";
import {listenMenu} from "./utils/rightClickMenu.js";
import {getRandomInt} from "./utils/math.js";

const pluginAPI = window.stick_emoji
await onLoad();//注入

// 打开设置界面时触发
export const onSettingWindowCreated = view => {
    // view 为 Element 对象，修改将同步到插件设置界面
}

async function onLoad() {
    if (location.hash === "#/blank") {
        navigation.addEventListener("navigatesuccess", onHashUpdate, {once: true});
    } else {
        await onHashUpdate();
    }

    pluginLog('onLoad函数加载完成')
}

async function onHashUpdate() {
    const hash = location.hash;
    if (hash === '#/blank') return
    if (!(hash.includes("#/main/message") || hash.includes("#/chat"))) return;//不符合条件直接返回

    pluginLog('执行onHashUpdate')
    //"nodeIKernelMsgListener/onAddSendMsg"
    //"nodeIKernelMsgListener/onRecvMsg"
    try {
        // const listener1 = pluginAPI.subscribeEvent('nodeIKernelMsgListener/onMsgInfoListUpdate',
        //     async (payload) => {
        //         console.log(payload)
        //     })

        const listener = pluginAPI.subscribeEvent("nodeIKernelMsgListener/onAddSendMsg", async (payload) => {
            //console.log(payload)
            const config = await pluginAPI.getConfig()
            if (!config.isStickSelf) return //没开贴自己表情，就直接返回

            for (let i = 0; i < 10; i++) {
                let sendCount = 0
                const taskID = setInterval(async () => {
                    const msgSeq = String(parseInt(payload.msgRecord.msgSeq) + 1)//发出去后，msgSeq会+1
                    const chatType = payload.msgRecord.chatType
                    const peerUid = payload.msgRecord.peerUid

                    const result = await pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
                        "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
                        "emojiId": String(getRandomInt(1, 500)),
                        "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
                        "msgSeq": msgSeq,
                        "setEmoji": true,
                        isPlugin: true,
                    }, null,)


                    if (result.result !== 0 && sendCount < 5) {
                        sendCount++
                    } else {//说明重试次数超了或者成功发送
                        clearInterval(taskID)
                    }

                    console.log(result)

                    await sleep(100)//来点延迟

                    //pluginLog(msgSeq)
                }, 500)//这里要延时发，不然会报错{"result": 65018,"errMsg": "群消息不存在"}
            }
        })
        listenMenu()
        pluginLog("事件监听成功")

        //尝试获取群列表


    } catch (e) {
        pluginLog(e)
        setInterval((e) => console.log(e), 1000)
    }
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}