import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import Home from "./Home";
import Route from "react-router/es/Route";
import Login from "./Login";
import Chat from "./Chat";

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }


  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory}>
            <Route path="/login" component={Login} />
            <Route path="/chat" component={Chat} />
            <Route path="/" component={Home} />
          </Router>
        </div>
      </Provider>
    )
  }
}

export default App
