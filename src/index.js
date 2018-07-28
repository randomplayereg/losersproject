import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import "react-image-gallery/styles/css/image-gallery.css";

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
