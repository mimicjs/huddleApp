import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { URL } from './AppLinks';
import AuthRoute from './util/AuthRoute';
import { ErrorBoundary } from 'react-error-boundary'

import "assets/scss/mkr.scss?v=1.10.0"; //Required mkr.scss

// pages for this product
import LandingPage from "views/LandingPage/LandingPage";
import AccessSession from "views/LoginPage/AccessSession";
import Logout from './views/Logout.js';
import ProfilePage from "views/ProfilePage/ProfilePage";
import RegisterPage from "views/LoginPage/RegisterPage";
import LoginPage from "views/LoginPage/LoginPage";
import Dashboard from "views/HuddleApp/dashboard/DashboardPage";
import NotFound from "views/NotFound";

function App(props) {
    const [stopRender, setStopRender] = useState(false);

    function ErrorFallback(errorObject) {
        let error, resetErrorBoundary;
        if (errorObject) {
            ({ error, resetErrorBoundary } = errorObject)
        }
        //Log the failures as tickets.. standardise them
        if (error) {
            resetErrorBoundary();
        }
        return null;
    };

    return (
        <ErrorBoundary //FIXME: TODO: throw new("...") are not being caught here
            FallbackComponent={ErrorFallback}
            onReset={() => {
                setStopRender(true);
            }}>
            {stopRender ?
                null
                :
                <BrowserRouter> {/*Usable: let history = useHistory();*/}
                    <AuthProvider client={props.client}>
                        <Switch>
                            <AuthRoute exact path={URL.login} component={LoginPage} publicAccessible={true} />
                            <AuthRoute exact path={URL.register} component={RegisterPage} publicAccessible={true} />

                            <AuthRoute exact path={URL.auth} component={AccessSession} publicAccessible={true} /> {/* URL must align with Auth Cookie path */}
                            <Route exact path={URL.logout} component={Logout} />

                            <AuthRoute exact path={URL.dashboard} component={Dashboard} />

                            <Route exact path={URL.profile} component={ProfilePage} />
                            <Route exact path={[URL.home, URL.index]} component={LandingPage} />
                            <NotFound /> {/* URL doesn't exist so URL change back to Home*/}
                        </Switch>
                    </AuthProvider>
                </BrowserRouter>
            }
        </ErrorBoundary >
    );
};

export { App, URL };
