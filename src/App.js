import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './scss/style.scss';
import * as routesUrl from "./routesUrl";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./pages/login/Login'));
const Register = React.lazy(() => import('./pages/register/Register'));
const Page404 = React.lazy(() => import('./pages/page404/Page404'));
const Page500 = React.lazy(() => import('./pages/page500/Page500'));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('login_status')),
    };
  }

  render() {
    return ( 
      <BrowserRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path={routesUrl.LOGIN} name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path={routesUrl.REGISTER} name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path={routesUrl.PAGE404} name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path={routesUrl.PAGE500} name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path={routesUrl.HOME} name="Home" render={props => this.state.user === true ? 
                  <TheLayout {...props}/>
                :
                <Redirect to={{ pathname: "/login" }} />} 
                />
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
