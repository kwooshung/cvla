import pc from 'picocolors';
import { version } from '@/utils';

/**
 * 公共头部
 */
const header = (isVersion: boolean = false) => {
  console.clear();

  const frameWidth = 55; // 框架的总宽度
  const versionString = `version: ${version.get}`;
  const versionLength = versionString.length;
  const padding = (frameWidth - versionLength - 4) / 2; // 计算两边的空格数
  const leftPadding = ' '.repeat(Math.floor(padding)); // 左边的空格
  const rightPadding = ' '.repeat(Math.ceil(padding)); // 右边的空格

  const code = [
    '┌───────────────────────────────────────────────────┐',
    '│                                                   │',
    '│      ██████╗██╗   ██╗██╗      █████╗ ██████╗      │',
    '│     ██╔════╝██║   ██║██║     ██╔══██╗██╔══██╗     │',
    '│     ██║     ██║   ██║██║     ███████║██████╔╝     │',
    '│     ██║     ╚██╗ ██╔╝██║     ██╔══██║██╔══██╗     │',
    '│     ╚██████╗ ╚████╔╝ ███████╗██║  ██║██║  ██║     │',
    '│      ╚═════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝     │',
    '│                                                   │'
  ];

  if (isVersion) {
    code.push(`│${leftPadding}${versionString}${rightPadding}│`);
    code.push('│                                                   │');
  }

  code.push('└───────────────────────────────────────────────────┘\n');

  console.log(pc.green(code.join('\n')));
};

export default header;
