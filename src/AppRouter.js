import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import App from './App';

class AppRouter extends React.Component {
    render() {
        return(
          <Router basename={'/cdrive'}>
                <Switch>
                  <Route path='/home/' component={App} />
                  <Redirect from='*' to='/home/' />
                </Switch>
            </Router>
        );
    }
}

export default AppRouter;
