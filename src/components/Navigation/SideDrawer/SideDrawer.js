import React from "react";
import Logo from "../../Logo/Logo";
import NagivationItems from "../NavigationItems/NavigationItems";
import classes from "./SideDrawer.css";
import Backdrop from "../../UI/Backdrop/Backdrop";
const sideDrawer = (props) => {
let attachedClasses =[classes.SideDrawer,classes.Close];
if(props.open){
    attachedClasses=[classes.SideDrawer,classes.Open];
}
    return(
        <React.Fragment>
        <Backdrop show={props.open} clicked={props.closed}/>
        <div className={attachedClasses.join(" ")}>

           <Logo margin="43px" mt="-30px"/>
            <nav>
            
                <NagivationItems clicked={props.closed} isAuth={props.isAuth}/>
            </nav>
            </div>
            </React.Fragment>
    )
}

export default sideDrawer 