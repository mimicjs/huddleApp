import ReactDOM from 'react-dom';

import reportWebVitals from './reportWebVitals';
import ApolloProvider from './ApolloProvider';

console.log = process.env.NODE_ENV === 'production' ? function(){} : console.log;

ReactDOM.render(ApolloProvider, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(consoles.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
