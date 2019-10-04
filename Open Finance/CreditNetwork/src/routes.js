import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Main from './components/Main'
import Signup from './components/Signup'
import ScrollToTop from './components/ScrollTop'
//<Route exact path='/dashboard' component={ Dashboard } />
export default props => (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/signup' component={ Signup } />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )
