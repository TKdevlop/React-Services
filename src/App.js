import React, { Component } from 'react';
import Layout from "./components/Layout/Layout";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Food from "./containers/Food/food";
import Cart from "./containers/cart/cart";
import Services from "./components/Services/Services";
import Auth from "./containers/Auth/Auth";
import Orders from "./containers/orders/orders";
import Checkout from "./containers/checkout/checkout";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from 'react-redux';
import * as actions from "./store/actions/index";
import Admin from "./containers/admin/admin";
class App extends Component {
  componentDidMount = () => {
    this.props.initItems()
    this.props.autoSignIn()
  }
  render() {
    let dynamicUrl = `${this.props.history.location.pathname}`

    let dynamicRoute = null;
    // let reg = new RegExp(dynamic,"gi");
    if (dynamicUrl.includes("/catagories")) {

      dynamicRoute = <Route path={dynamicUrl} component={Food} />
    }

    let route = (
      <Switch>

        {dynamicRoute}
        <Route path="/cart" component={Cart} />
        <Route path="/auth" component={Auth} />
        {dynamicRoute}
        <Route path="/" component={Services} />
        <Redirect to="/" />
      </Switch>
    )
    if (this.props.isAuth) {
      route = (<Switch>
        <Route path="/auth" component={Auth} />
        {dynamicRoute}
        <Route path="/cart" component={Cart} />
        <Route path="/Logout" component={Logout} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/" component={Services} />
        <Redirect to="/" />

      </Switch>)
    }
    if (this.props.isAdmin) {
      route = (<Switch>
        <Route path="/auth" component={Auth} />


        {dynamicRoute}
        <Route path="/cart" component={Cart} />
        <Route path="/Logout" component={Logout} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={Services} />


      </Switch>)
    }
    return (
      <div>
        <Layout />
        {route}

      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isAuth: state.token !== null,
    isAdmin: state.userId === "zvI1sx3czgMft1H14k63Frf9wyr2"
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    autoSignIn: () => dispatch(actions.authCheckState()),
    initItems: () => dispatch(actions.initItems())
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
