# 使用したバージョン

- webpack 4.43.0
- webpack-cli 3.3.11
- yarn 1.22.4

# webpackの始め方

- webpackの[Getting Started](https://webpack.js.org/guides/getting-started/)を参考に。
- 以下のコマンドを打ってwebpackプロジェクトを始める。

```
$ mkdir webpack-demo
$ cd webpack-demo
$ yarn init -y
$ yarn add webpack webpack-cli --dev
```

JavaScriptは`src`以下に格納し、最初に読まれるJavaScriptファイル（エントリーポイント）を`src/index.js`とする。内容は以下のようなもの。

```javascript
import _ from 'lodash';

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

上記の`src/index.js`にて[lodash](https://lodash.com/)というライブラリを使っているので、これをインストールしておく。

```
yarn add lodash
```

実行するHTMLファイルを作る。webpackでJavaScriptをまとめたものは`dist`以下に`main.js`という名前で格納するので、`dist/index.html`に作ることにする。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack sample</title>
</head>
<body>
    <script src="main.js"></script>
</body>
</html>
```

webpackの実行を簡単にするために、`package.json`に`scripts`を定義する。具体的には以下のものを`package.json`に追加する。

```json
  "scripts": {
    "build": "webpack"
  },
```

webpackの設定ファイルである`webpack.config.js`を作成する。設定内容は以下の通り。

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

ここまでで準備は終了。webpackを実行すると`dist`以下に`main.js`が生成される。

```
$ yarn run build
yarn run v1.22.4
$ webpack
Hash: 54477d4081095e0fd28b
Version: webpack 4.43.0
Time: 1309ms
Built at: 2020/05/05 18:54:33
  Asset      Size  Chunks             Chunk Names
main.js  72.1 KiB       0  [emitted]  main
Entrypoint main = main.js
[1] ./src/index.js 217 bytes {0} [built]
[2] (webpack)/buildin/global.js 472 bytes {0} [built]
[3] (webpack)/buildin/module.js 497 bytes {0} [built]
    + 1 hidden module

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
✨  Done in 2.19s.
```

一旦これでwebpackを使うことはできた。

# modeの設定

上記の例で`mode`オプションを指定していないことにWARNINGが出た。`mode`の説明は[webpackの説明ページ](https://webpack.js.org/configuration/mode/)を参照。

実際に`mode`を設定してやってみる。`package.json`の`scripts`を以下のように編集して実行してみる。

```json
  "scripts": {
    "build": "webpack --mode=production",
    "build_dev": "webpack --mode=development"
  },
```

production modeの場合

```
$ yarn run build
yarn run v1.22.4
$ webpack --mode=production
Hash: 2517d392433c2a6138c1
Version: webpack 4.43.0
Time: 221ms
Built at: 2020/05/06 13:18:10
  Asset      Size  Chunks             Chunk Names
main.js  72.1 KiB       0  [emitted]  main
Entrypoint main = main.js
[1] ./src/index.js 217 bytes {0} [built]
[2] (webpack)/buildin/global.js 472 bytes {0} [built]
[3] (webpack)/buildin/module.js 497 bytes {0} [built]
    + 1 hidden module
✨  Done in 0.73s.

$ ls -l dist
total 160
-rw-r--r--@ 1 miyohide  staff    243  5  5 18:47 index.html
-rw-r--r--  1 miyohide  staff  73865  5  6 13:18 main.js
$
```

`main.js`のサイズが73,865になっている。

developmentの場合

```
$ yarn run build_dev
yarn run v1.22.4
$ webpack --mode=development
Hash: f554fff7462bda707afe
Version: webpack 4.43.0
Time: 218ms
Built at: 2020/05/06 13:18:25
  Asset     Size  Chunks             Chunk Names
main.js  552 KiB    main  [emitted]  main
Entrypoint main = main.js
[./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {main} [built]
[./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {main} [built]
[./src/index.js] 217 bytes {main} [built]
    + 1 hidden module
✨  Done in 0.65s.

$ ls -l dist
total 1112
-rw-r--r--@ 1 miyohide  staff     243  5  5 18:47 index.html
-rw-r--r--  1 miyohide  staff  565052  5  6 13:18 main.js
$
```

`main.js`のサイズが565,052になっている。productionのときよりだいぶ大きい。

# webpack-dev-serverの導入

開発時にはソースを直すたびにいちいちwebpackのコマンドを打っていられないので、`webpack-dev-server`を導入するのがいいらしい。[公式による解説はこちら](https://webpack.js.org/guides/development/)。

まずは`webpack-dev-server`をインストールする。

```
$ yarn add webpack-dev-server --dev
```

`webpack.config.js`を編集して`devServer`の設定を追加する。全体像は以下の通り。

```javascript
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: outputPath,
  },
  devServer: {
    contentBase: outputPath
  }
};
```

設定の細かい情報は、[公式ページのマニュアルを参照](https://webpack.js.org/configuration/dev-server/#devserver)。

`package.json`を編集して`scripts`に`start`コマンドを追加する。

```json
  "scripts": {
    "build": "webpack --mode=production",
    "start": "webpack-dev-server --open"
  },
```

これで`yarn run start`を実行するとデフォルトブラウザにて`localhost:8080`が開く。

この状態で`index.js`を編集すると自動的にコンパイルが行われてブラウザで変更内容が確認できる。

# トランスパイラの導入

JavaScriptは年々新しい言語仕様が追加されたりして、どんどん書きやすくなっている。しかしながらInternet Explorer 11などの古いブラウザは新しいJavaScriptの言語仕様に対応していないことが多い。

そこで、新しい言語仕様を使って書かれているJavaScriptを古いブラウザでも動くように変換するツールであるトランスパイラを導入する。これで、ブラウザの互換性を逐一確認しなくても新しい言語仕様でJavaScriptを書くことができる。

トランスパイラには[Babel](https://babeljs.io/)が有名。

導入には以下のコマンドを実行する。

```
$ yarn add babel-loader @babel/core @babel/preset-env --dev
```

[Babelの公式ページ](https://babeljs.io/setup#)にある`webpack`をクリックすると`babel-loader`と`@babel/core`をインストールすることが示されているが、追加で[@babel/preset-env](https://babeljs.io/docs/en/next/babel-preset-env)をインストールすると良いらしい。

webpackで使えるように`webpack.config.js`に設定を追加する。以下の`module`の部分が追加したところ。

```javascript
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: outputPath,
  },
  devServer: {
    contentBase: outputPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  }
};
```

これで新しい言語仕様を変換できる。

# Polyfill

ただこれでカバーできるのは言語仕様だけであってInternet Explorer 11では実装されていない関数を使いたい場合などは変換されない。それらを変換するのはPolyfillと呼ばれるものを使う。

まずは、`core-js`をyarnを使ってインストールする。

```
$ yarn add core-js@3 --dev
```

webpackの設定を行う。`module`の部分を下記のものに置き換える。

```javascript
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  }
```

とはいえ、`core-js@3`もすべてのものをpolyfill対応できるわけではない。core-jsのリポジトリにある[core-js@3, babel and a look into the future](https://github.com/zloirock/core-js/blob/v3.6.5/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)によれば、

```
- It is a polyfill of the JavaScript standard library, which supports:
    - The latest ECMAScript standard.
    - ECMAScript standard library proposals.
    - Some WHATWG / W3C standards (cross-platform or closely related ECMAScript).
```

とある。例えばここで試している`core-js v3.6.5`においては[ChildNode.replaceWith()](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith)はpolyfill対応できない。

現時点（2020年5月7日）で`core-js`に頼るのは危険かもしれない。

# 参考

- webpackの[Getting Started](https://webpack.js.org/guides/getting-started/)
- [npmコマンドとyarnコマンドの比較（Migrating from npm）](https://classic.yarnpkg.com/en/docs/migrating-from-npm)
- [webpackの開発ドキュメント](https://webpack.js.org/guides/development/)
- [webpack-dev-serverの設定](https://webpack.js.org/configuration/dev-server/#devserver)
- [core-js@3, babel and a look into the future](https://github.com/zloirock/core-js/blob/v3.6.5/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)
