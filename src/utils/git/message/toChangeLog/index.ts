import command from '../../../command';
import tag from '../../tag';
import { TGitMessageToChangeLog } from '@/interface';

const sep = '|$GITSPE$|';

const toChangeLog = async (tags: string[] = []): Promise<TGitMessageToChangeLog[]> => {
  const result: TGitMessageToChangeLog[] = [];

  // 获取所有标签
  const allTags: string[] = await tag.get.all();

  // 如果未提供标签，则使用所有标签，否则使用提供的标签
  const filteredTags = tags.length > 0 ? tags : allTags;

  for (let i = 0, j = filteredTags.length; i < j; i++) {
    const currentTag = filteredTags[i];
    const previousTag = i < j ? allTags[allTags.indexOf(currentTag) + 1] : '';
    console.log(`allTags: ${allTags}`);
    console.log(`previousTag: ${previousTag}`);
    console.log(`currentTag: ${currentTag}`);

    // 定义标签范围
    const tagRange = previousTag ? `${previousTag}..${currentTag}` : `${currentTag}`;

    // 执行 git log 命令获取特定范围的提交
    const cmd = `git --no-pager log ${tagRange} --pretty=format:"%h${sep}%ad${sep}%s" --date=format:"%Y-%m-%d %H:%M:%S"`;

    const { stdout, stderr } = await command.execute(cmd, 'utf-8');

    if (!stderr && stdout) {
      // 解析 git log 输出
      const gitMessages = stdout
        .split('\n')
        .map((line) => {
          const [id, dateTime, message] = line.split(sep);
          const [date, time] = dateTime.split(' ');
          return { id, date, time, message };
        })
        .filter((msg) => msg.id); // 过滤空行

      // 添加到结果数组
      if (gitMessages.length > 0) {
        result.push({
          name: currentTag,
          date: gitMessages[0].date,
          time: gitMessages[0].time,
          list: gitMessages
        });
      }
    }
  }

  return result.reverse();
};

export default toChangeLog;
