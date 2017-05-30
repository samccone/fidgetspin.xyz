import typescript from 'rollup-plugin-typescript';

export default {
	entry: './index.ts',
	dest: './index.js',
	format: 'es',
	sourceMap: 'inline',
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ],
  onwarn: function(warning) {
    // Suppress known error message caused by TypeScript compiled code with Rollup
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    if (warning.code === 'THIS_IS_UNDEFINED') {
    	return;
    }
		var warnSymbol = process.stderr.isTTY ? "⚠️   " : "Warning: ";
    console.error(warnSymbol + 'Rollup warning: ', warning.message);
    if (warning.url) console.error(warning.url);
    if (warning.loc) console.error(`${warning.loc.file} (${warning.loc.line}:${warning.loc.column})`);
    else if (warning.id) console.error(warning.id);
    if (warning.frame)  console.error(warning.frame);
  }
};
