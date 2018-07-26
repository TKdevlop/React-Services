import React,{Component} from "react";
import classes from "./Modal.css";

import Backdrop from "../Backdrop/Backdrop";
class Modal extends Component {
    shouldComponentUpdate(nextProps,nextState){
   if(nextProps.show !== this.props.show || nextProps.spinner!== this.props.spinner)
   {  return true;   
        }
 return false;
    }
    render(){
        return(
            <React.Fragment>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
        <div style={{
            transform:this.props.show ? "translateY(0)":"translateY(-100vh)",
            opacity:this.props.show ? "1":"0"
        }}
         className={classes.Modal}>
              {this.props.children}
          </div>
          </React.Fragment>
      )
    }
  };


export default Modal;