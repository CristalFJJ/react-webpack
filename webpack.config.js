const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: { // 入口文件
        index: './src/index.js'
    }, 
    output: { // 出口文件
        filename: '[name].js', // 打包后的文件名称
        path: path.resolve('dist')// 打包后的目录，必须是绝对路径
    }, 
    module: { // 处理对应模块
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: ["css-loader", "postcss-loader"]
                })
            },
            {
                test: /\.less$/,     // 解析less
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
                })
            },
            {
                test: /\.scss$/,     // 解析scss
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'sass-loader'] // 从右向左解析
                })
            },
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    }, 
    resolve: {
        // 别名
        alias: {
          pages:path.join(__dirname,'src/pages'),
          component:path.join(__dirname,'src/component'),
          actions:path.join(__dirname,'src/redux/actions'),
          reducers:path.join(__dirname,'src/redux/reducers'),
        },
        // 省略后缀
        extensions: ['.js', '.jsx', '.json', '.css', '.scss', '.less']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: {
                    // 抽离自己写的公共代码，utils里面是一个公共类库
                    chunks: 'initial',
                    name: 'utils',  //  任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    plugins: [ // 对应的插件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            chunks: ['vendor', 'index', 'utils']  //  引入需要的chunk   
        }),
        new ExtractTextWebpackPlugin("[name].css"),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ], 
    devServer: { //开发服务器配置
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true,               // 开启热更新
        overlay: true, // 浏览器页面上显示错误
        historyApiFallback: true
    }, 
    devtool: 'inline-source-map',
    mode: 'development' // 模式配置
}