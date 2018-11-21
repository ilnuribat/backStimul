import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'animate.css'
import _ from 'lodash';

import Svg from '../SVG/svg';


const FakeRow = ({children, name, icon, click})=>{
  return(
    <div className="FakeOption" fakevalue="3" fakename="Option 3" onClick={click}>
      {icon ? (<div className="FakeIcon"><img src={icon} alt={'no'}></img></div>) : null}
      {children || name ? (<div className="FakeContent">{children || name}</div>) : null}
    </div>
  )
}

export class FakeSelect extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      open: false,
      selected:{
        id: "",
        name: "",
        icon: "",
      }
    }

    this.openSelect = this.openSelect.bind(this)
    this.select = this.select.bind(this)
    this.runAfter = this.runAfter.bind(this)
    this.cancAfter = this.cancAfter.bind(this)
  }
  
  static propTypes = {

  }

  runAfter(id, name, icon){
    let {run, onselect} = this.props;

    if(typeof onselect === 'function'){
      onselect(id, name, icon)
    }else{
      return false;
    }
  }

  cancAfter(){

  }

  openSelect(){
    console.log("Select Faker")
    this.setState({
      open: !this.state.open,
    })
  }
  select(id, name, icon){
    console.log("Select Faker2")
    this.setState({
      open: !this.state.open,
      selected: {
        id: id || '',
        name: name || '',
        icon: icon || '',
      }
    })
    this.runAfter(id, name, icon)
  }

  setDefault(array, defaultid){
    if(array && defaultid && defaultid !== this.state.selected.id){
      let selected = array.find(o => o.id === defaultid);
      
      if(selected){
        this.setState({
          selected: {
            id: selected.id || '',
            name: selected.name || '',
            icon: selected.icon || '',
          }
        })
      }
    }
  }

  componentWillUpdate(){
  }

  componentDidMount(){
  }

  componentWillReceiveProps(){
  }

  shouldComponentUpdate(prevProp, prevState){
    if(prevState.selected.id !== this.state.selected.id && prevState.selected.name !== this.state.selected.name){
      return true
    }
    if(_.isEqual(prevProp, this.props) && _.isEqual(prevState, this.state)){
      return false
    }
    return true
  }

  componentWillMount(){
  }

  render() {

    const {selected, open} = this.state;
    const {array, view, defaultid} = this.props;
    
    if(defaultid && !selected || defaultid && !selected.id ){
      this.setDefault(array, defaultid);
    }

    const arr = array || [
      {id:'1', name:'Option 1', icon:'1'},
      {id:'2', name:'Option 2'},
      {id:'3', name:'Option 3', icon:'1'},
    ];

    return (
      <div className={!view ? "FakeSelect" : "FakeSelect "+view} onClick={this.openSelect}>
        
        
        <div className="FakeSelected">
          {selected ? (<FakeRow icon={selected.icon} id={selected.id}>{selected.name}</FakeRow>) : null }
        </div>
        {!open ? (<Svg svg="expose" />):(<Svg svg="inpose" />)}
        {open ? (

          <div className="FakeOptionsContainer animated fadeIn" onMouseLeave={this.openSelect}>
            {
              arr ? arr.map((e,i)=>{

                let id = e.id || '';
                let icon = e.icon || '';
                let name = e.name || e.username || '';

                return(
                  <FakeRow key={e.id || e.name + i} icon={icon} click={()=>this.select(id, name, icon)}>{name}</FakeRow>
                )
              }) : null
            }
          </div>
        ) : null}

      </div>
    )
  }
}

export default FakeSelect
