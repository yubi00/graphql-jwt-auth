import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { getAccessToken, setAccessToken } from './accessToken';
import App from './App';

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials:"include"
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const accessToken = getAccessToken()
  operation.setContext({
    headers: {
      authorization: accessToken ? `Bearer ${accessToken}` : "" ,
    }
  });

  return forward(operation);
})

const tokenRefreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
      const token = getAccessToken()
      if( !token ) return true 

      try {
        const { exp } = jwtDecode(token)
        if(Date.now() >= exp * 1000) {
          return false
        } else {
          return true
        }
      }catch(err) { 
        return false
      }
    },

    fetchAccessToken: () => {
      return  fetch("http://localhost:4000/refresh_token", { 
       method: "POST",
       credentials: "include" 
      });
    },

    handleFetch: accessToken => {
      setAccessToken(accessToken)
    },
    
    handleError: err => {
    	console.warn('Your refresh token is invalid. Try to relogin');
    	console.error(err);
    }
 })



const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([tokenRefreshLink, authMiddleware, httpLink])
})

ReactDOM.render(
    <ApolloProvider client={client}>
      <App />
      </ApolloProvider>, 
  document.getElementById('root')
);