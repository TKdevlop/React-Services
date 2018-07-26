import React,{Component} from "react";
import Modal from "../../components/UI/Modal/Modal";
const withErrorHandler = (WrappedComponent,axios) => {
  return class extends Component{
      state={
          error:null,
      }
      componentWillMount(){
          this.axiosReq=axios.interceptors.request.use(req=>{
              this.setState({error:null});
              return req;
          })
          this.axiosRes=axios.interceptors.response.use(res=> res,error=>{
                 this.setState({error});
          })
      }
      componentWillUnmount = () =>{
           axios.interceptors.request.eject(this.axiosReq)
           axios.interceptors.response.eject(this.axiosRes)
      }
 errorConfirmHandler = () =>{
this.setState({error:null});
 }     
 render(){

    return(
        <React.Fragment>
            <Modal show={this.state.error} modalClosed={this.errorConfirmHandler}>
               {this.state.error?this.state.error.message:null}
            </Modal>
         <WrappedComponent {...this.props}/>
         </React.Fragment>
     )
 }
      
  }
};

export default withErrorHandler;


