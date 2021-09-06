const path = require("path");
const port = process.env.port || 9528;
function resolve(dir) {
  return path.join(__dirname, dir);
}
const createPage = (name, title, chunk = "") => {
  return {
    entry: `src/pages/${name}/main.js`,
    template: `public/${name}.html`,
    filename: `${name}.html`,
    title,
    // faviconPath: `${name}.ico`,
    chunks: ["chunk-vendors", "chunk-common", chunk || name]
  };
};

console.log(process.env);

module.exports = {
  publicPath: './',
  outputDir: process.env.outputDir,
  devServer: {
    port: port,
    open: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  pages: {
    index: createPage("index", "Walllive"),
    wallpaper: createPage("wallpaper", "Free Wallpapers"),
  },
  chainWebpack(config) {
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

   
  }
};
