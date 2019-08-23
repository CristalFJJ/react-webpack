import './less/style.less';
import './css/style.css';
import 'babel-polyfill';

console.log('hellow world');


// 还需要在主要的js文件里写入下面这段代码
// if (module.hot) {
//     // 实现热更新
//     module.hot.accept();
//   }

import React from 'react';
import ReactDom from 'react-dom';

import getRouter from './router/router';

let root = document.getElementById('root');
console.log(getRouter())
ReactDom.hydrate(getRouter(), root);