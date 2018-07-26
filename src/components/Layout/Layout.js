import React,{Component} from "react";
import classes from "./Layout.css"; 
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom"
class Layout extends Component{
  state={
    showSideDrawer:false
  }
  sideDrawerClosed = () => {
   this.setState({showSideDrawer:false})
  }
  sideDrawerOpen = (prevState) =>{
    this.setState({showSideDrawer:!prevState.showSideDrawer})
  }
       render(){
        return(<React.Fragment> 
        <Toolbar isAuth={this.props.isAuth} sideOpen={this.sideDrawerOpen}/>
        <SideDrawer isAuth={this.props.isAuth}  open={this.state.showSideDrawer} closed={this.sideDrawerClosed}/>  
        <main  className={classes.Content}>
        {this.props.children}
        </main>
        </React.Fragment>)
};
}

const mapStateToProps = (state) => {
  return {
    isAuth:state.token !== null
  }
}

export default withRouter(connect(mapStateToProps)(Layout));