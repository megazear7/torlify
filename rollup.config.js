import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: {
    'bundle': 'src/client/app.ts',
    'cli': 'src/cli/index.ts',
  },
  output: {
    dir: 'dist/client',
    format: 'esm',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({preventAssignment: false, 'Reflect.decorate': 'undefined'}),
    typescript({
      declaration: false,
      declarationMap: false,
      outDir: 'dist/client',
    }),
    commonjs(),
    resolve(),
  ],
};
