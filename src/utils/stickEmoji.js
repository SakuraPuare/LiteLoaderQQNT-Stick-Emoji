import {getRandomInt} from "./math.js";
import {pluginLog} from "./frontLog.js";

const pluginAPI = window.stick_emoji

export async function stickEmoji(payload) {
    const selfID = app.__vue_app__.config.globalProperties.$store.state.common_Auth.authData.account//用户自己的Q号

    //注：sendStatus是发送状态，2即为发送完毕；有小灰条的不管；表情列表已经有表情了的不管；插件设置没开贴自己表情的不管。
    if (payload.msgList[0].senderUin !== selfID || payload.msgList[0].sendStatus !== 2 ||
        payload.msgList[0].elements[0].grayTipElement !== null || payload.msgList[0].emojiLikesList.length !== 0 ||
        !(await pluginAPI.getConfig()).isStickSelf) {
        //pluginLog("条件检测失败，不贴表情")
        return
    }

    const msgSeq = payload.msgList[0].msgSeq
    const chatType = payload.msgList[0].chatType
    const peerUid = payload.msgList[0].peerUid
    const config = await pluginAPI.getConfig()

    let result = undefined
    for (let i = 0; i < config.stickSelfAmount; i++) {
        result = pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
            "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
            "emojiId": String(getRandomInt(1, 500)),
            "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
            "msgSeq": msgSeq,
            "setEmoji": true,
            isPlugin: true,
        }, null,)
    }

    // let count = 0
    // setInterval(async () => {
    //     if (count >= config.stickSelfAmount) return
    //
    //     result = await pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
    //         "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
    //         "emojiId": String(getRandomInt(1, 500)),
    //         "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
    //         "msgSeq": msgSeq,
    //         "setEmoji": true,
    //         isPlugin: true,
    //     }, null,)
    //
    //     console.log(count++)
    // }, 50)
    console.log(await result)
}


export async function stickEmojiOther(chatType,peerUid,msgSeq) {
    const config = await pluginAPI.getConfig()

    let result = undefined
    for (let i = 0; i < config.stickOtherAmount; i++) {
        result = pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
            "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
            "emojiId": String(getRandomInt(1, 500)),
            "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
            "msgSeq": msgSeq,
            "setEmoji": true,
            isPlugin: true,
        }, null,)
    }

    // let count = 0
    // setInterval(async () => {
    //     if (count >= config.stickSelfAmount) return
    //
    //     result = await pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
    //         "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
    //         "emojiId": String(getRandomInt(1, 500)),
    //         "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
    //         "msgSeq": msgSeq,
    //         "setEmoji": true,
    //         isPlugin: true,
    //     }, null,)
    //
    //     console.log(count++)
    // }, 50)
    console.log(await result)
}

