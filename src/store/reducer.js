import * as actionTypes from "./actions/actionTypes";
let ITEM_PRICE = {
    // "Veg-Burger":3.99,
    // "Non-Veg Burger":5.99
}

const initalState = {
    cart:[],
    token:null,
    userId:null,
    error:null,
    loading:false,
   }
   export default (state=initalState,action) => {
       switch(action.type){
           case(actionTypes.ADD_ITEM): 
         
           if(state.cart.find(item => item.name === action.item.name)){
               
                     return {
                         ...state
                     }
           }
           return {
               ...state,
               cart:state.cart.concat({...action.item,value:action.item.value + 1}),
              
           }
           case(actionTypes.INIT_PRICE):
         
           ITEM_PRICE ={
               ...action.items
           }

           return{
              ...state 
           }
           case(actionTypes.INC_QUANTITY):
                   
           return {
               ...state,
                cart:state.cart.map(item => {
                   if(item.name === action.item.name){
                      return {
                          ...action.item,
                          value:item.value + 1,
                          price:action.item.price + ITEM_PRICE[action.item.name],
                      }
                   }
                   return item
                })
           }
           case(actionTypes.DEC_QUANTITY):
           if(action.item.value<=1){
               return {
                   ...state,
                   cart:state.cart.filter(item => item !==  action.item)
                //    ...state,
                //    cart:state.cart.map(item => {
                //       if(item.name === action.item.name){
                //          return {
                //              ...action.item,
                //               price:0
                //          }
                //       }
                //       return item
                //    })
               }
           }
               return {
                   ...state,
                   cart:state.cart.map(item => {
                      if(item.name === action.item.name){
                         return {
                             ...action.item,
                             value:item.value - 1,
                             price:action.item.price -  ITEM_PRICE[action.item.name]
                         }
                      }
                      return item
                   })
               }
            case(actionTypes.AUTH_START):
            return {
                ...state,
                error:null,
                loading:true
            }
            case(actionTypes.AUTH_SUCCESS):
            return {
                ...state,
                token:action.token,
                loading:false,
                error:null,
                userId:action.userId
            }
            case(actionTypes.AUTH_FAILED):
            return {
                ...state,
                error:action.error,
                loading:false
            }
            case(actionTypes.AUTH_LOGOUT):
            return {
                ...state,
                token:null,
                userId:null
            }
            case(actionTypes.ORDER_SUCCESS):
            return{
                ...state,
                cart:[]
            }
        default:
       return state;
       }
    
       
   }