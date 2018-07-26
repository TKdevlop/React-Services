import React from 'react'
import classes from "./input.css"
export default (props) => {
    let inputElement = null;
    let validation = null;
 const inputClasses = [classes.InputElement];
 if(props.invalid && props.shouldValidate && props.touched){
   inputClasses.push(classes.Invalid)
 }
 if(props.invalid && props.touched ){
  validation = <p className={classes.ValidationError}>Please enter a valid {props.elementType}</p>
 }
    switch(props.elementType){
        case("input"):
        inputElement = <input  onChange={props.changed}  className ={inputClasses.join(" ")} 
        {...props.elementConfig} value={props.value} />
        break;
        case("textarea"):
     
        inputElement = <textarea onChange={props.changed} className ={inputClasses.join(" ")} 
        {...props.elementConfig}value={props.value} ></textarea>
        break;
        case("select"):
      inputElement = (<React.Fragment> <p>{props.title}</p><select onChange={props.changed} className ={inputClasses.join(" ")} 
   value={props.value}> 
   {props.elementConfig.options.map(option => {
     return (<option value={option.displayValue} key={option.displayValue}>{option.displayValue}</option>)
   })}
 
      </select></React.Fragment>)
      break;
        default:
        inputElement = <input onChange={props.changed} className ={inputClasses.join(" ")} 
        {...props.elementConfig}value={props.value} />
    }
  return (
    <div className={classes.Input}>
      <label className={classes.Label} htmlFor="">{props.label}</label>
      {inputElement}
      {validation}
    </div>
  )
}
