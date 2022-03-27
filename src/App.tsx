import React from 'react';
import './App.css';
import './styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from './components/confirmation/confirmprovider';
import { Home } from './pages/home.page';

function App() {
    return (
        <ConfirmProvider>
            <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/portfolio' : '/'}>
                <Routes>
                    <Route path='/'>
                        <Route index element={<Home />} />
                        <Route path='snippets'>
                            <Route path='modal' />
                            <Route path='autocomplete' />
                            <Route path='treebuilder' />
                            <Route path='datagrid' />
                            <Route path='menu' />
                            <Route path='alerts' />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ConfirmProvider>
    );
}

export default App;
