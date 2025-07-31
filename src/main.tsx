import {render} from 'preact'
import {App} from './App.tsx'
import {store} from "./redux/store.ts";
import {Provider} from "react-redux";


render(
    <Provider store={store}>
        <App/>
    </Provider>
    , document.getElementById('app')!)