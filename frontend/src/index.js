import React from 'react';
import ReactDOM from 'react-dom';
import { Global, css } from '@emotion/core';

import App from './App';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');
  body {
    margin: 0;
    font-family: 'Muli', sans-serif;
  }
`;

ReactDOM.render(
  <div>
    <Global styles={globalStyles} />
    <App />
  </div>,
  document.getElementById('root')
);
