import * as actionTypes from "./actionTypes";
import axios from "axios";
import {authSocial,googleProvider,twitterProvider} from "./firebase";
export const authStart = () => {
    return {
        type:actionTypes.AUTH_START
    } 
}
export const authSuccess = (authData) => {

    return {
        type:actionTypes.AUTH_SUCCESS,
         token:authData.idToken,
         userId:authData.localId
    }
}
export const authFailed = (error) => {
    return {
        type:actionTypes.AUTH_FAILED,
        error
    }
}
export const authLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("expirationTime")
    // localStorage.clear()
    return {
        type:actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
   return dispatch => {
       setTimeout(()=>{
       dispatch(authLogout())
       },expirationTime * 1000)
   }
}
 export const auth = (email,password,isSignUp) => {
     return (dispatch) =>{
         dispatch(authStart())
         const authData = {
             email,
             password,
             returnSecureToken:true
         }
         let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDI-BRZ_hyXcyw_gRfJAr-JlIKIZpwX6sE'
         if(!isSignUp){
             url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDI-BRZ_hyXcyw_gRfJAr-JlIKIZpwX6sE"
         }
         axios.post(url,authData)
         .then(res => {
             const expirationTime = new Date(new Date().getTime() + res.data.expiresIn * 1000)
           localStorage.setItem('token',res.data.idToken)
           localStorage.setItem('expirationTime',expirationTime)
           localStorage.setItem('userId',res.data.localId)
             dispatch(authSuccess(res.data))
             dispatch(checkAuthTimeout(res.data.expiresIn))
         })
         .catch(error => {
             dispatch(authFailed(error))
         })
     }
 }
 export const authCheckState = () => {
     return dispatch => {
const token = localStorage.getItem("token");
if(!token){
    dispatch(authLogout())
}
else {
    const expirationTime = new Date(localStorage.getItem("expirationTime"));
    if(expirationTime > new Date()){
        const userId=localStorage.getItem("userId")
        dispatch(authSuccess({idToken:token,localId:userId}))
        dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime())/1000))
    }
}

     }
 }

 export function googleLogin() {
    return dispatch => {
        dispatch(authStart())
        authSocial.signInWithPopup(googleProvider)
        .then(result => {
       
            const expirationTime = new Date(new Date().getTime() + 3600 * 1000)
           localStorage.setItem('token',result.user.qa)
           localStorage.setItem('expirationTime',expirationTime)
           localStorage.setItem('userId',result.user.uid)
            dispatch(authSuccess({idToken:result.user.qa,localId:result.user.uid}))
            dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime())/1000))
        }).catch(e => {
             dispatch(authFailed(e))
        })
    } ;
  }
  
  export function twitterLogin() {
 
    return dispatch => {
        dispatch(authStart())
        authSocial.signInWithPopup(twitterProvider)
        .then(result => {
            const expirationTime = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token',result.user.qa)
            localStorage.setItem('expirationTime',expirationTime)
            localStorage.setItem('userId',result.user.uid)
             dispatch(authSuccess({idToken:result.user.qa,localId:result.user.uid}))
             dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime())/1000))
        }).catch(e => {
             dispatch(authFailed(e))
        })
    }
  }
function initData(items){
    return{
        type:actionTypes.INIT_PRICE,
        items
    }
}
  export const initItems = () => {
      let prices=[];
      return dispatch => {
axios.get("https://food-ordering-6ccba.firebaseio.com/Items.json").then(
    res => {

     for(let services in res.data){
       prices.push(res.data[services])
     }
let price =[]
for(let services of prices){
for(let i in services){
    for(let j in services[i]){
        price.push(services[i][j])
    }
    
}
}
let data ={};
for(let item in price){
   
    data[price[item].name] = Number(price[item].price);
   
}
dispatch(initData(data))

    }
    
)
      }
  }