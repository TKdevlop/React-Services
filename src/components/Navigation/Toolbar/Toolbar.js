import React from "react";
import classes from "./Toolbar.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawToggler from "../SideDrawer/DrawerToggler/DrawerToggler"
const toolbar = (props) => (
    <header className={classes.Toolbar}>
      <DrawToggler clicked={props.sideOpen}/>
         <Logo/>
        <nav className={classes.DesktopOnly}>
           <NavigationItems isAuth={props.isAuth}/> 
        </nav>
    </header>
);
export default toolbar;