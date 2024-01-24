import https from 'https';

/**
 * 检查 Google 翻译是否可用
 * @param {number} [timeout = 20000] 超时时间
 * @returns {Promise<boolean>} 是否可用
 */
const check = async (timeout: number = 20000): Promise<boolean> => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      typeof req.destroy === 'function' ? req.destroy() : req.abort(); // 如果请求存在 destroy 方法，则调用 destroy 方法，否则调用 abort 方法
      resolve(false); // 超时后，返回 false
    }, timeout); // 使用传入的超时时间

    const req = https.get('https://translate.google.com', (res) => {
      clearTimeout(timer); // 清除超时定时器
      resolve(res.statusCode === 200); // 如果状态码为 200，返回 true，否则返回 false
    });

    req.on('error', () => {
      clearTimeout(timer); // 清除超时定时器
      resolve(false); // 出现错误时，返回 false
    });
  });
};

export default check;
