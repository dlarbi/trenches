module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js', //this is the default name, so you can skip it
        //at this directory our bundle file will be available
    },
    module: {
        loaders: [
            {
                //tell webpack to use jsx-loader for all *.jsx files
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            { test: /.css$/,  loader: "style-loader!css-loader" },
            { test: /.less$/, loader: "style-loader!css-loader!less-loader" },
            { test: /.gif$/, loader: "url-loader?mimetype=image/gif" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    externals: {

    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
