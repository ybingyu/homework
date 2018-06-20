import React from 'react';
import {
  Router,
  Route,
  hashHistory,
  browserHistory,
  Link,
  useRouterHistory
} from 'react-router';

import {
  createHashHistory
} from 'history';

const history = useRouterHistory(createHashHistory)({
  queryKey: false
});

const Home = ({ children }) => (
  <div>home
  <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/list">path/to/list</Link>
      </li>
      <li>
        <Link to="/a" query={{ j: 1 }} hash="#test">
          path/to/p
        </Link>
      </li>
    </ul>
    {children}
    </div>
)
const P = () => (
  <div>
    <p>pppp</p>
  </div>
)
const Ul = () => (
  <div>
    <ul>
      <li>6/5 @ Evergreens</li>
      <li>6/8 vs Kickers</li>
      <li>6/14 @ United</li>
    </ul>
  </div>
)


export default class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/" component={Home}>
            <Route path="/list" component={Ul} />
            <Route path="a*" component={P} />
          </Route>
        </Router>
        <Router history={browserHistory}>
          <Route path="/" component={Home}>
            <Route path="/list" component={Ul} />
            <Route path="a*" component={P} />
          </Route>
        </Router>
      </div>
    );
  }
}