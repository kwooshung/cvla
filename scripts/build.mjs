import { writeFile, readFile } from 'fs/promises';

(async () => {
  const packageJson = JSON.parse(await readFile('./package.json'));

  const content = `export default '${packageJson.version}';`;
  writeFile('./src/utils/version/get/index.ts', content);
})();
