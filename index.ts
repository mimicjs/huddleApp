/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Configure and Startup server
 *              Assign typeDefs with resolvers unto a schema 
 *                  to be executed by ApolloServer
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/
//Typescript won't check this file when code states: //@ts-nocheck
//@ts-nocheck

import { ApolloServer, /*PubSub*/ } from 'apollo-server-express';
//TODO: import { SubscriptionServer } from 'subscriptions-transport-ws';
import express from 'express';
//import { ApolloServerPluginUsageReporting } from "apollo-server-core";
import mongoose from 'mongoose';

import { typeDefs } from './graphql/typeDefs';
import { index as Imp_resolvers } from './graphql/resolvers';
import { config } from './config';
import apolloserver_plugins from "./util/apolloserver_plugins";
import { ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";


(async function () {

    const isProduction = process.env.NODE_ENV?.trim() === 'production'.trim().toLowerCase();
    if (isProduction) {
        console.log = function () { };
    };

    //FIXME: The PubSub class is not recommended for production environments, because it's an in-memory 
    //event system that only supports a single server instance
    //https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries
    //const pubsub = new PubSub();
    //Refer to here when using subscriptions for subscription server
    //https://www.apollographql.com/docs/apollo-server/migration/
    console.log('isProduction: ' + isProduction);
    const apolloServer = new ApolloServer({
        typeDefs,
        ...Imp_resolvers,
        playground: {
            settings: {
                'editor.theme': 'dark',
            },
        },
        playground: !isProduction,
        introspection: !isProduction,
        cors: {
            origin: process.env.NODE_ENV !== 'production' ? config.URL_CORS_ORIGIN : null, //look at request header: "origin"
            credentials: true
        },
        //TODO: FIXME: plugins: ApolloServerPluginUsageReporting not working 
        /*ApolloServerPluginUsageReporting(
            {
                rewriteError(err) {        // Return `null` to avoid reporting `AuthenticationError`s        
                    if (err instanceof InternalServerError) {
                        return null;
                    }        // All other errors will be reported.        
                    return err;
                }
            }),
        */
        plugins:
            [apolloserver_plugins.http_cookies_headers,
            // Install a landing page plugin based on NODE_ENV
            !isProduction
                ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
                : ApolloServerPluginLandingPageDisabled()
            ],
        context: ({ req, connection }) => {
            if (connection) { // Operation is a Subscription
                // Obtain connectionParams-provided token from connection.context
                //const token = connection.context.authorization || "";
                //return { token };
            } else { // Operation is a Query/Mutation
                // Obtain header-provided token from req.headers
                //const token = req.headers.authorization || "";
                //return { token };
            };
            return {
                req,
                setCookies: new Array(),
                setHeaders: new Array()
            }
        },
        /*formatResponse: (response, requestContext) => {
            if (response.data?.login) {
                
            }
            console.log(requestContext);
            return {response, requestContext};
        },*/
    });

    const corsOptions = {
        origin: config.URL_CORS_ORIGIN, //look at request header: "origin"
        credentials: true
    }

    await apolloServer.start();

    const appExpress = express();

    //You no longer need to import body-parser to set up apollo-server-express
    /*appExpress.use(express.urlencoded({ extended: true }));
    appExpress.use(express.json());
    const httpServer = createServer(appExpress);*/

    //
    //Routing from ExpressJS to Middleware
    //
    appExpress.use(express.static("client/build/"));
    appExpress.use((req, res, next) => {
        if (req.method === 'GET') { //GET for pages since for now only using Graphql meaning POST only
            res.sendFile(`${__dirname}/client/build/index.html`);
        }
        else {
            next(); //passes control to the next matching route
            //i.e. Apolloserver Middleware
        }
    });
    
    apolloServer.applyMiddleware({
        app: appExpress, //apply itself to Express app
        path: '/',
        cors: corsOptions,
        bodyParserConfig: { limit: '50mb', parameterLimit: 500000000 },
    });

    mongoose.connect(config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
        //PROD: , { autoIndex: false }); //Mongoose recommends as it significantly affects performance. By default createIndex is called
        .then(() => {
            console.log(`MongoDB connected`);
            console.log(process.env.NODE_ENV);
            return appExpress.listen({ port: process.env.PORT || config.SERVER_PORT });
        }).then(() => {
            console.log(`Server running at :${config.SERVER_PORT}`);
        });

})();