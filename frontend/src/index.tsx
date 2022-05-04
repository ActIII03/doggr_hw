import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const test_fetch = async () => {
  let testres = await fetch("http://0.0.0.0:9000/api/v1/about");
  let bodyres = await testres.text();
  console.log("Should equal about:GET  =>", bodyres);
}

// Quick test for retrieving info from our backend
test_fetch();

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <App />
);

