import React from "react";
import classes from "./DrawerToggler.css";
const drawToggler = (props) => (
<div className={classes.DrawerToggle} onClick={props.clicked}>
<div><br/></div>
<div><br/></div>
<div><br/></div>
</div>
);

export default drawToggler;