import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

// document.addEventListener('touchend', (e) => {
//     e.preventDefault();
// });

// document.addEventListener("pointermove", function(event) {

//     if (event.target.tagName != "svg") { // Element that you don't want to be prevented default event.
//         event.preventDefault();
//     }
// });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
