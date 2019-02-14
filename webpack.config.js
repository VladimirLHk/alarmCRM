const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
        './src/app.js',
        './src/style.scss'
        ],
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
  //  devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './app.css'//,
//            allChunks: true,
        })
    ]
};



/*
     rules: [
            {
                test: /\.(scss|sass)$/,
                include: path.resolve(__dirname, 'src'),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            minimize: true//,
                            //url: false
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                    ]
                })
            }
        ]
 */


//    "mode": "production",


/*
                "use": [
                    "style-loader",
                    "css-loader",
                    "sass-loader"

 */