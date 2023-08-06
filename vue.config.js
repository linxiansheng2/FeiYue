const { defineConfig } = require('@vue/cli-service');
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");
const path = require('path');
const { log } = require('console');
const resolve = (dir) => path.join(__dirname, dir);
module.exports = defineConfig({
	transpileDependencies: true,
	publicPath: './', // 署应用包时的基本 URL。 vue-router hash 模式使用
	outputDir: 'dist', //  生产环境构建文件的目录
	// runtimeCompiler:true,
	assetsDir: 'static', //  outputDir的静态资源(js、css、img、fonts)目录
	lintOnSave: false, //eslint 检测
	productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
	devServer: {
		hot: true,
		port: 9527,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('assets', resolve('src/assets'))
			.set('api', resolve('src/api'))
			.set('views', resolve('src/views'))
			.set('components', resolve('src/components'))
	},
	configureWebpack: {
		plugins: [
		  ComponentsPlugin({
			resolvers: [VantResolver()],
		  }),
		],
	  },
});
