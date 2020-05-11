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

# 複数のファイルを纏める

webpackは複数のJavaScriptファイルを一つにまとめることができる。

`src/libs/calc.js`として以下の内容を実装する。

```javascript
export function add(a, b) {
  return a + b
}
```

`export`は[MDNを参照](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)のこと。

これを`src/index.js`にて以下のように書き換えて`add`関数を使うようにする。

```javascript
import * as lib from "./libs/calc";

const e = document.getElementById('app')
e.innerText = `1 + 2 = ${lib.add(1, 2)}`
```

`import`は[MDNを参照](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)のこと。

`dist/index.html`も以下のように書き換える。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack sample</title>
</head>
<body>
    <div id="app"></div>
    <script src="main.js"></script>
</body>
</html>
```

これで、`1 + 2 = 3`という感じで表示される。

# ページごとに固有のJavaScriptを用意する

webpackは複数のJavaScriptをまとめるが、時にはページごとに固有のJavaScriptを用意したいことがある。

当該ページの`body`タグに固有の`id`属性を振っておいて、ページごとの処理をその`id`ごとに実装するというのも手ではあるが、なんとなくイケていない。

webpackはentrypointを複数個もたせることができ、これを用いてページごとに固有のJavaScriptを用意することができる。[webpackの解説ページ](https://webpack.js.org/concepts/entry-points/#multi-page-application)も併せて参照のこと。

`src/libs/logger.js`を下記の内容で作成する。

```javascript
export function debug(msg, from) {
  console.log(`${msg} from ${from}`)
}
```

pageA用のJavaScriptを`src/pageA.js`として作成する。

```javascript
import * as logger from './libs/logger'
import * as calc from './libs/calc'

logger.debug('Message', 'pageA')
let e = document.getElementById('app')
e.innerText = `2 + 3 = ${calc.add(2, 3)}`
```

pageA用のWebページを`dist/pageA.html`として作成する。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>page A</title>
</head>
<body>
    <h1>page A</h1>
    <div id="app"></div>
    <script src="pageA.js"></script>
</body>
</html>
```

`webpack.config.js`も修正する。`entry`の部分をDictionaryにし、`output`の`filename`を`[name].js`にするのがポイント。これで`yarn run build`をすると`main.js`と`pageA.js`が出力される。

```javascript
const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    main: './src/index.js',
    pageA: './src/pageA.js'
  },
  output: {
    filename: '[name].js',
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
};
```

このままだとページが追加するたびに`webpack.config.js`を編集する必要がある。これを簡略化する。`webpack.config.js`の`entry`をDictionaryとして与えればいいので、例えば以下のようなコードを`webpack.config.js`に書けばよい。

```javascript
const outputPath = path.resolve(__dirname, 'dist');
// 以下を追加
const glob = require('glob');
var entries = {};

glob.sync('./src/*.js').forEach(v => {
  let key = v.replace('./src/', '');
  entries[key] = v;
});
// module.exports内はentryとoutputの中身を修正
module.exports = {
  entry: entries,
  output: {
    filename: '[name]',
    path: outputPath,
  },
// 以下省略
```

`src`直下にあるJavaScriptのファイル名をDictionaryのキーに、相対パスをDictionaryの値にして`entries`に格納して、`entry`に設定しています。
`output`の`filename`は拡張子`js`がだぶるので、`.js`を削除しています。

この対応に伴い`index.html`で読み込むJavaScriptが`main.js`から`index.js`に変更になるので併せて修正する。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack sample</title>
</head>
<body>
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>
```

# 複数のエントリーポイント感で利用している共通モジュールをまとめる

例えば、次のようなJavaScriptを用意する。

```javascript
// src/pageA.js
import * as logger from './libs/logger'
import * as calc from './libs/calc'
import $ from 'jquery'

const e = $('#app')
e.text(`2 + 3 = ${calc.add(2, 3)}`)
logger.debug('Message', 'pageA')
for (let i = 0; i < 100; i++) {
 e.fadeToggle(1000)
}
```

```javascript
// src/pageB.js
import * as calc from "./libs/calc"
import $ from 'jquery'

const e = $('#app')
e.text(`1 + 2 = ${calc.add(1, 2)}`)
for (let i = 0; i < 100; i++) {
 e.fadeToggle(500)
}
```

この2つのJavaScriptはjQueryを使っている。これをwebpackでbuildするとそれぞれ大きなファイルが生成される。

```
$ yarn run build
yarn run v1.22.4
$ webpack --mode=production
Hash: 6cca60ccfcda7a1a174e
Version: webpack 4.43.0
Time: 535ms
Built at: 2020/05/11 20:20:16
   Asset      Size  Chunks             Chunk Names
pageA.js  89.1 KiB       0  [emitted]  pageA.js
pageB.js    89 KiB       1  [emitted]  pageB.js
Entrypoint pageA.js = pageA.js
Entrypoint pageB.js = pageB.js
[0] ./src/libs/calc.js 45 bytes {0} {1} [built]
[2] ./src/pageB.js 178 bytes {1} [built]
[3] ./src/pageA.js + 1 modules 354 bytes {0} [built]
    | ./src/pageA.js 254 bytes [built]
    | ./src/libs/logger.js 90 bytes [built]
    + 1 hidden module
✨  Done in 1.05s.

$ ls -l dist/*.js
-rw-r--r--  1 miyohide  staff  91213  5 11 20:20 dist/pageA.js
-rw-r--r--  1 miyohide  staff  91141  5 11 20:20 dist/pageB.js
$
```

`dist/pageA.js`と`dist/pageB.js`それぞれにおいてjQueryが含まれているためファイルサイズが大きくなってしまう。これを解消するのが`optimization.splitChunks`。

`optimization.splitChunks`を使うには`webpack.config.js`に以下の設定を追加する。

```javascript
  optimization: {
    splitChunks: {
      name: 'vendor.js',
      chunks: 'initial'
    }
  }
```

これだけでpageA.jsとpageB.jsで共通のものを自動判別して`vendor.js`にまとめてくれる。実際に試してみる。

```
$ yarn run build
yarn run v1.22.4
$ webpack --mode=production
Hash: c6fb854519d894a16855
Version: webpack 4.43.0
Time: 515ms
Built at: 2020/05/11 20:27:31
    Asset      Size  Chunks             Chunk Names
 pageA.js  1.78 KiB       1  [emitted]  pageA.js
 pageB.js  1.71 KiB       2  [emitted]  pageB.js
vendor.js  87.9 KiB       0  [emitted]  vendor.js
Entrypoint pageA.js = vendor.js pageA.js
Entrypoint pageB.js = vendor.js pageB.js
[0] ./src/libs/calc.js 45 bytes {1} {2} [built]
[2] ./src/pageB.js 178 bytes {2} [built]
[3] ./src/pageA.js + 1 modules 354 bytes {1} [built]
    | ./src/pageA.js 254 bytes [built]
    | ./src/libs/logger.js 90 bytes [built]
    + 1 hidden module
✨  Done in 1.01s.

$ ls -l dist/*.js
-rw-r--r--  1 miyohide  staff   1819  5 11 20:27 dist/pageA.js
-rw-r--r--  1 miyohide  staff   1747  5 11 20:27 dist/pageB.js
-rw-r--r--  1 miyohide  staff  90047  5 11 20:27 dist/vendor.js
$
```

`dist/pageA.js`と`dist/pageB.js`のファイルサイズが小さくなっているとともに`dist/vendor.js`が追加されている。`dist/vendor.js`はjQueryやその他共通的な処理が含まれている。後はこれをHTMLで読み込ませればよい。読み込むのは`pageA.js`や`pageB.js`の前にする。

```html
<body>
    <h1>page A</h1>
    <div id="app"></div>
    <script src="vendor.js"></script>
    <script src="pageA.js"></script>
</body>
```

細かい設定は[webpackのドキュメント](https://webpack.js.org/plugins/split-chunks-plugin/)を参照のこと。

# 参考

- webpackの[Getting Started](https://webpack.js.org/guides/getting-started/)
- [npmコマンドとyarnコマンドの比較（Migrating from npm）](https://classic.yarnpkg.com/en/docs/migrating-from-npm)
- [webpackの開発ドキュメント](https://webpack.js.org/guides/development/)
- [webpack-dev-serverの設定](https://webpack.js.org/configuration/dev-server/#devserver)
- [core-js@3, babel and a look into the future](https://github.com/zloirock/core-js/blob/v3.6.5/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md)
- [JavaScriptのexport](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)
- [JavaScriptのimport](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)
- [SplitChunksPluginのドキュメント](https://webpack.js.org/plugins/split-chunks-plugin/)
