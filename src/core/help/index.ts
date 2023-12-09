import pc from 'picocolors';

/**
 * 显示帮助信息
 */
const help = () => {
  const code = `${pc.cyan('Usage: clvar [options]')}

  ${pc.cyan(pc.bold('Options:'))}
    ${pc.green('-c, --config [value]')}      ${pc.gray('set the configuration directory path,')} ${pc.bold(pc.red('not the file path.'))}
    ${pc.green('-v, --version')}             ${pc.gray('output the version number')}
    ${pc.green('-i, --init')}                ${pc.gray('init config file')}
    ${pc.green('-h, --help')}                ${pc.gray('output usage information')}

  ${pc.cyan(pc.bold('Example:'))}
    ${pc.green('clvar')}                     ${pc.gray('run clvar')}
    ${pc.green('clvar -c')}                  ${pc.gray('set the config directory path and then run')}
    ${pc.green('clvar -v')}                  ${pc.gray('show version')}
    ${pc.green('clvar -i')}                  ${pc.gray('init config file')}
    ${pc.green('clvar -h')}                  ${pc.gray('show help')}
  `;

  console.log(code);
};

export default help;
