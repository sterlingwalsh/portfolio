import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TreeMaker } from './components/tree/widgetpicker';
import './styles/index.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfirmProvider } from './components/confirmation/confirmprovider';
import { Home } from './pages/home.page';

type TreeItem = {
    title: string;
    children: TreeItem[];
};
const options: TreeItem[] = new Array(10).fill(null).map((n, i) => ({
    title: i + '',
    children: [],
}));

function App() {
    return (
        <ConfirmProvider>
            <BrowserRouter>
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
        // <div className='App'>
        //     <TreeMaker
        //         options={options}
        //         getItemlabel={(o) => o.title}
        //         getChildren={(o) => o.children}
        //         setChildren={(o, c) => ({
        //             ...o,
        //             children: c,
        //         })}
        //         optionIsContainer={(o) => !(parseInt(o.title) % 3)}
        //     />
        // </div>
    );
}

export default App;
