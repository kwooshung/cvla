import { TCommitCategory } from '@/interface';

/**
 * 解析 git commit message
 * @param {string} commitMessage git commit message
 * @returns {object} 解析结果
 */
const parse = (commitMessage: string): TCommitCategory => {
  const result: TCommitCategory = {
    full: '',
    emojiOrType: '',
    emoji: '',
    type: '',
    scope: '',
    message: ''
  };

  // 匹配是否包含 type 和 scope
  const typeScopeMatch = commitMessage.match(/^(.*?)(\(.+?\))?:\s*(.*)/);

  if (typeScopeMatch) {
    result.full = commitMessage;
    result.emojiOrType = typeScopeMatch[1].trim();
    result.message = typeScopeMatch[3].trim();

    // 从 emojiOrType 中单独提取 emoji
    const emojiMatch = result.emojiOrType.match(/^(\p{Emoji}*)/u);
    if (emojiMatch) {
      result.emoji = emojiMatch[1];
    }

    // 从 emojiOrType 中提取 type
    result.type = result.emojiOrType.replace(/^(\p{Emoji}*\s*)?/u, '').trim();

    // 提取 scope（小括号里面的）
    if (typeScopeMatch[2]) {
      result.scope = typeScopeMatch[2].replace(/[()]/g, '').trim();
    }
  } else {
    // 如果不包含 type 和 scope，则整个消息都是 message
    result.message = commitMessage.trim();
  }

  return result;
};

export default parse;
