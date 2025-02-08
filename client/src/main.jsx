import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weights if needed
import "@fontsource/poppins/700.css"; // Example for bold text
window.Telegram.WebApp.onEvent('init', () => {
  const initParams = window.Telegram.WebApp.initData;
  sessionStorage.setItem('__telegram__initParams', JSON.stringify({ tgWebAppData: initParams }));
});

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  // </StrictMode>,
)
