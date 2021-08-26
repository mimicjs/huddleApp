import { App } from './App';
import { ApolloClient, InMemoryCache, createHttpLink, /*concat, ApolloLink*/ } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { MAIN_SERVER } from './API/API'

const httpLink = createHttpLink({
  uri: MAIN_SERVER + window.location.pathname, //'http://localhost:5000/' or PROD=window.location.href
  credentials: 'include' //accepts the cookies from server
})

/*const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: localStorage.getItem('token') || null,
      }
    }));
  
    return forward(operation);
  })*/

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const client = new ApolloClient({
  /*link: concat(authMiddleware, httpLink),*/
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
})

export default (
  <ApolloProvider client={client}>
    <App client={client} />
  </ApolloProvider>
)