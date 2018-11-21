import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'animate.css'
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
    let {run} = this.props;

    if(typeof run === 'function'){
      run(id, name, icon)
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
        id: id,
        name: name,
        icon: icon,
      }
    })
    this.runAfter(id, name, icon)
  }

  render() {

    const {selected, open} = this.state;
    const {array, view} = this.props;

    return (
      <div className={!view ? "FakeSelect" : "FakeSelect "+view}>
        {!open ? (<Svg svg="expose" />):(<Svg svg="inpose" />)}
        
        <div className="FakeSelected" onClick={this.openSelect}>
          <FakeRow icon={selected.icon} id={selected.id}>{selected.name}</FakeRow>
        </div>
        {open ? (

          <div className="FakeOptionsContainer animated fadeIn">
            

            {
              array ? array.map((e,i)=>{

                let id = e.id || '';
                let icon = e.icon || '';
                let name = e.username || e.username || '';

                return(
                  <FakeRow icon={icon} click={()=>this.select(id, name, icon)}>{name}</FakeRow>
                )
              }) : null
            }

            <FakeRow icon="1" click={()=>this.select("1", "Option 1", "icon")}>Option 1</FakeRow>
            <FakeRow icon="" click={()=>this.select("2", "Option 2", "")}>Option 2</FakeRow>
            <FakeRow icon="1" click={()=>this.select("3", "Option 3", "icon")}>Option 3</FakeRow>
          
          </div>
          ) : null}

      </div>
    )
  }
}

export default FakeSelect
