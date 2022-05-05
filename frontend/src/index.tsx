import env from "react-dotenv";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const test_fetch = async () => {
  let fetchpath = `${env.BACKEND_API}/about`;
  let testres = await fetch(fetchpath);
  let bodyres = await testres.text();
  console.log("Backend test: Should equal about:GET  =>", bodyres);
}


async function test_fetch_async() {


  // Quick test for retrieving info from our backend
  await test_fetch();


}

test_fetch_async();
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <App />
);