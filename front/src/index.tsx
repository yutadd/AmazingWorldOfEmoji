import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// https://bit.ly/CRA-vitals
reportWebVitals(console.log);
/*最初の1バイトを受信するまでの時間 / Time to First Byte (TTFB)
最初の DOM をレンダリングするまでの時間 / First Contentful Paint (FCP)
表示される最も大きい要素のレンダリング時間 / Largest Contentful Paint (LCP)
ユーザー操作をブラウザが処理を開始するまでの時間 / First Input Delay (FID)
予期しないレイアウトシフトの最大値 / Cumulative Layout Shift (CLS)*/ 
