import ConfigProvider from 'antd/lib/config-provider';
import hrHR from 'antd/lib/locale/hr_HR';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/main/ErrorBoundary';
import { router } from './components/main/Routes';
import reportWebVitals from './reportWebVitals';
import { store, StoreContext } from './store';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(

    <React.StrictMode>
        <ErrorBoundary>
            <StoreContext.Provider value={store}>
                <ConfigProvider locale={hrHR}>
                    <RouterProvider router={router} />
                </ConfigProvider>
            </StoreContext.Provider>
        </ErrorBoundary>
    </React.StrictMode>
    
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();





