import React from "react";
import NavgationItem from "./NavigationItem/NavigationItem";
import classes from "./NavigationItems.css";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom"
const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
       <NavgationItem clickedDrop={props.clicked} link="/">SERVICES</NavgationItem>
      {props.isAuth? <NavgationItem clickedDrop={props.clicked} link="/orders">ORDERS</NavgationItem>:null}
       <NavgationItem clickedDrop={props.clicked} link="/cart"><i className="fas fa-shopping-cart"></i>

<span className="badge badge-pill badge-dark">{props.cart.length}</span></NavgationItem>
      {!props.isAuth?<NavgationItem clickedDrop={props.clicked} link="/auth">AUTH</NavgationItem>:<NavgationItem link="/logout">LOGOUT</NavgationItem>} 
     {props.isAdmin?<NavgationItem clickedDrop={props.clicked} link="/admin">ADMIN</NavgationItem>:null} 
    </ul>
);
 
const mapStateToprops = (state) => {
return {
    cart:state.cart,
    isAdmin:state.userId === "zvI1sx3czgMft1H14k63Frf9wyr2"
}
}
export default withRouter(connect(mapStateToprops)(navigationItems)); 