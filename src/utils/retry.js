/**
 *  重试函数
 * @param {function} callable
 * @param {number} retryTimes
 * @param {number} retryInterval
 * @returns {Promise<function>}
 */
export async function retry(callable, retryTimes, retryInterval) {
    try {
        return await callable();  // 返回结果
    } catch (e) {
        if (retryTimes <= 0) throw e //执行失败，抛出错误
        console.log(`尝试失败,剩余${--retryTimes}次机会：${e}`);
        await sleep(retryInterval)
        return await retry(callable, retryTimes, retryInterval)
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
}