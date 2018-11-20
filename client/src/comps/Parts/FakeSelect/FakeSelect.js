import React, { Component } from 'react'
import PropTypes from 'prop-types'


const FakeRow = ({children,name,icon, click})=>{
  return(
    <div className="FakeOption" fakevalue="3" fakename="Option 3" onClick={click}>
      {icon ? (<div className="FakeIcon">{icon}</div>) : null}
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
  }
  
  static propTypes = {

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
  }

  render() {

    const {selected, open} = this.state;
    const {array} = this.props;

    return (
      <div className="FakeSelect">
        
        <div className="FakeSelected" onClick={this.openSelect}>
          <FakeRow icon={selected.icon} id={selected.id}>{selected.name}</FakeRow>
        </div>
        {open ? (
          <div className="FakeOptionsContainer">
            {/* {array} */}
            <FakeRow icon="1" click={()=>this.select("1", "Option 1", "icon")}>Option 1</FakeRow>
            <FakeRow icon="" click={()=>this.select("2", "Option 2", "")}>Option 2</FakeRow>
            <FakeRow icon="1" click={()=>this.select("3", "Option 3", "icon")}>Option 3</FakeRow>
          
          </div>) : null}

      </div>
    )
  }
}

export default FakeSelect
