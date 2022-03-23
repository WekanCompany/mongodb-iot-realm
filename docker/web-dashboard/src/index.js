import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import { HomePage, Page404, Edges, Login } from "./pages";
import { BaseLayout } from "./components/BaseLayout";

import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import RealmApolloProvider from "./graphql/RealmApolloProvider";
import { useRealmApp, RealmAppProvider } from "./RealmApp";

const RequireLoggedInUser = ({ children }) => {
  // Only render children if there is a logged in user.
  const app = useRealmApp();
  return app.currentUser ? children : <Login />;
};

export const APP_ID = "application-3-mtdrr";

const Routes = (props) => (
  <Switch>
    <Route path="/" exact>
      <HomePage {...props}/>
    </Route>
    <Route path="/edges" exact>
      <Edges {...props}/>
    </Route>
    <Route path="*">
      <Page404 {...props}/>
    </Route>
  </Switch>
);

ReactDOM.render(
  <RealmAppProvider appId={APP_ID}>
    <RequireLoggedInUser>
      <RealmApolloProvider>
          <Router>
            <BaseLayout>
              <Routes />
            </BaseLayout>
          </Router>
      </RealmApolloProvider>
    </RequireLoggedInUser>
  </RealmAppProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
