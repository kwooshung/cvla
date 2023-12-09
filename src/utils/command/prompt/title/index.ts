import pc from 'picocolors';

/**
 * 输出标题
 * @param {string} title 标题
 * @param {boolean} isFirst 是否是第一个标题
 * @returns {void}
 */
const title = (title: string, isFirst: boolean = false): void => {
  if (isFirst) {
    console.clear();
  } else {
    console.log('\n');
  }

  console.log(`${pc.bold(pc.cyan(`----- [ ${title} ] -----`))}\n`);
};

export default title;
