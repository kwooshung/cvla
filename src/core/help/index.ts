import pc from 'picocolors';

/**
 * 显示帮助信息
 */
const help = () => {
  const code = `
  ${pc.yellow(pc.bold('[简体中文]'))}

  ${pc.cyan('使用方法: clvar [options]')}
  
  ${pc.cyan(pc.bold('选项:'))}
    ${pc.green('-c, --config [value]')}      ${pc.gray('设置配置文件目录路径，')} ${pc.bold(pc.red('不是文件路径'))}
    ${pc.green('-v, --version')}             ${pc.gray('输出版本号')}
    ${pc.green('-i, --init')}                ${pc.gray('初始化配置文件')}
    ${pc.green('-h, --help')}                ${pc.gray('输出帮助信息')}
    ${pc.green('-r, --release')}             ${pc.gray('通过 github actions 发布')}
    ${pc.green('-cd, --config-dir')}         ${pc.gray('配置文件目录路径')}

  ${pc.cyan(pc.bold('示例:'))}
    ${pc.green('clvar')}                     ${pc.gray('运行 clvar')}
    ${pc.green('clvar -c')}                  ${pc.gray('设置配置文件目录路径并运行')}
    ${pc.green('clvar -v')}                  ${pc.gray('显示版本号')}
    ${pc.green('clvar -i')}                  ${pc.gray('初始化配置文件')}
    ${pc.green('clvar -h')}                  ${pc.gray('显示帮助信息')}
    ${pc.green('clvar -r')}                  ${pc.gray('请在 github actions 中执行')}
    ${pc.green('clvar -cd xxx/xx/x')}        ${pc.gray('配置文件目录路径')}

  ${pc.dim('==========================================================================================')}

  ${pc.yellow(pc.bold('[English]'))}

  ${pc.cyan('Usage: clvar [options]')}

  ${pc.cyan(pc.bold('Options:'))}
    ${pc.green('-c, --config [value]')}      ${pc.gray('set the configuration directory path,')} ${pc.bold(pc.red('not the file path.'))}
    ${pc.green('-v, --version')}             ${pc.gray('output the version number')}
    ${pc.green('-i, --init')}                ${pc.gray('init config file')}
    ${pc.green('-h, --help')}                ${pc.gray('output usage information')}
    ${pc.green('-r, --release')}             ${pc.gray('release via github actions')}
    ${pc.green('-cd, --config-dir')}         ${pc.gray('file path of config directory')}

  ${pc.cyan(pc.bold('Example:'))}
    ${pc.green('clvar')}                     ${pc.gray('run clvar')}
    ${pc.green('clvar -c')}                  ${pc.gray('set the config directory path and then run')}
    ${pc.green('clvar -v')}                  ${pc.gray('show version')}
    ${pc.green('clvar -i')}                  ${pc.gray('init config file')}
    ${pc.green('clvar -h')}                  ${pc.gray('show help')}
    ${pc.green('clvar -r')}                  ${pc.gray('please execute in github actions')}
    ${pc.green('clvar -cd xxx/xx/x')}        ${pc.gray('file path of config directory')}
  `;

  console.log(code);
};

export default help;
