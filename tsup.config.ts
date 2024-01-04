import { package as _pack } from '@/utils';
const packageJson = _pack.read();
let dependencies = [];
!packageJson.data && (dependencies = Object.keys(packageJson.data['dependencies']));

export default {
  clean: true,
  entry: ['src/index.ts', 'src/bin.ts'],
  external: dependencies,
  format: ['esm', 'cjs'],
  dts: true,
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.js'
  })
};
