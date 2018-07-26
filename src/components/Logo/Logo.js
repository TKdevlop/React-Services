import React from "react";
import burgerLogo from "../../assets/images/food.png";
import classes from "./Logo.css";
import {Link} from "react-router-dom"
const logo = (props) => (
    <Link to="/" className={classes.Logo} style={{margin:props.margin,marginTop:props.mt}}>
<img style={{borderRadius:"50%"}} src={burgerLogo}  alt="Burger King"/>
    </Link>
);

export default logo;