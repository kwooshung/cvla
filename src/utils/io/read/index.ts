import fs from 'fs';
import path from 'path';

/**
 * 读取指定路径的文件内容。
 * @param {string} filePath 要读取的文件路径。
 * @returns {Promise<string>} 返回文件内容。
 */
const read = async (filePath: string): Promise<string> => fs.promises.readFile(path.normalize(filePath), 'utf8');

export default read;
