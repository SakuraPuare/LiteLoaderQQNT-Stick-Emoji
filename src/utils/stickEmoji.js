import {getRandomInt} from "./math.js";
import {pluginLog} from "./frontLog.js";
import {qqEmojiList} from "../assests/qq_emoji.js";

const pluginAPI = window.stick_emoji
const msgIdHandlingList = []

//不对应表情的所有ID

export async function stickEmojiSelf(payload) {
    const selfID = app.__vue_app__.config.globalProperties.$store.state.common_Auth.authData.account//用户自己的Q号

    //注：sendStatus是发送状态，2即为发送完毕；有小灰条的不管；表情列表已经有表情了的不管；插件设置没开贴自己表情的不管。私聊是无法贴表情的,chatType为1是私聊
    if (payload.msgList[0].senderUin !== selfID || payload.msgList[0].sendStatus !== 2 || payload.msgList[0].chatType === 1 ||
        payload.msgList[0].elements[0].grayTipElement !== null || payload.msgList[0].emojiLikesList.length !== 0) {
        pluginLog("条件检测失败，不贴表情")
        return
    }

    const msgSeq = payload.msgList[0].msgSeq
    const chatType = payload.msgList[0].chatType
    const peerUid = payload.msgList[0].peerUid
    const config = await pluginAPI.getConfig()
    const msgId = payload.msgList[0].msgId

    let result = undefined
    if (config.useCarousel) {
        //使用走马灯，非常炫酷！
        if (msgIdHandlingList.some(msgID => msgID === payload.msgList[0].msgId)) return//说明这条消息正在处理之中。就不要继续走马灯了
        msgIdHandlingList.push(payload.msgList[0].msgId)
        let carouselCount = 0;
        const executeSticking = async () => {
            if (++carouselCount > config.carouselCircle) {
                for (let i = 0; i < msgIdHandlingList.length; i++)
                    if (msgIdHandlingList[i] === msgId) {
                        msgIdHandlingList.splice(i, 1)
                        return
                    }
            }

            const emojiIdArray = getEmojis(config.stickSelfAmount)
            console.log(emojiIdArray)
            for (let i = 0; i < config.stickSelfAmount; i++) {
                await stick(chatType, peerUid, msgSeq, emojiIdArray[i]);
                await sleep(config.carouselInterval)
            }
            for (let i = 0; i < config.stickSelfAmount; i++) {
                await unStick(chatType, peerUid, msgSeq, emojiIdArray[i]);
                await sleep(config.carouselInterval)
            }
            executeSticking()
        };
        executeSticking();

    } else {
        const emojiIdArray = getEmojis(config.stickSelfAmount)
        console.log(emojiIdArray)
        for (let i = 0; i < config.stickSelfAmount; i++) {
            result = stick(chatType, peerUid, msgSeq, emojiIdArray[i])
        }
        //console.log(await result)
    }
}


export async function stickEmojiOther(chatType, peerUid, msgSeq) {
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
    console.log(await result)
}

/**
 * 粘贴表情
 * @param chatType
 * @param peerUid
 * @param msgSeq
 * @param {String}emojiId
 * @returns {Promise<*>}
 */
async function stick(chatType, peerUid, msgSeq, emojiId) {
    return pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
        "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
        "emojiId": emojiId,
        "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
        "msgSeq": msgSeq,
        "setEmoji": true,
        //isPlugin: true,
    }, null,)
}

async function unStick(chatType, peerUid, msgSeq, emojiId) {
    return pluginAPI.invokeNative("ns-ntApi", "nodeIKernelMsgService/setMsgEmojiLikes", false, {
        "peer": {"chatType": chatType, "peerUid": peerUid, "guildId": ""},
        "emojiId": emojiId,
        "emojiType": "1",//这里如果改成2的话，会出现bug。贴了表情，但是什么都不显示
        "msgSeq": msgSeq,
        "setEmoji": false,
        //isPlugin: true,
    }, null,)
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function getEmojis(amount) {
    const indices = new Set();

    // 生成不重复的随机索引
    while (indices.size < amount) {
        indices.add(Math.floor(Math.random() * qqEmojiList.length));
    }
    return Array.from(indices).map(index => qqEmojiList[index].emojiId)
}