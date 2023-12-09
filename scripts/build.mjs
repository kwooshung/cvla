import { writeFile, readFile } from 'fs/promises';

(async () => {
  const packageJson = JSON.parse(await readFile('./package.json'));

  const content = `const get = () => '${packageJson.version}';\nexport default get;`;
  writeFile('./src/utils/version/get/index.ts', content);
})();
