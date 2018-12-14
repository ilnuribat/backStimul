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
      },
      array: [],
    }

    this.openSelect = this.openSelect.bind(this)
    this.select = this.select.bind(this)
    this.runAfter = this.runAfter.bind(this)
    this.cancAfter = this.cancAfter.bind(this)
    this.findElements = this.findElements.bind(this)
    this.containerRef = React.createRef();
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
    this.setState({
      open: !this.state.open,
    })
  }
  select(id, name, icon){
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
    if(array && typeof array === 'object' && defaultid && defaultid !== this.state.selected.id){
      let selected = array.find(o => o && o.id && o.id.toString() === defaultid.toString());
      
      if(selected){
        this.setState({
          selected: {
            id: selected.id || '',
            name: selected.name || selected.username || '',
            icon: selected.icon || '',
          }
        })
      }
    }
  }
  
  findElements(el){
    const { array } = this.state;

    if (el && el.target && el.target.value && array){
      console.log(el.target.value);
      console.log(array);

      var res = array.filter((e) => {
        if(e.name){
          return e.name.includes(el.target.value);
        }
        if (e.username){
          return e.username.includes(el.target.value);
        }
        if (e.text){
          return e.text.includes(el.target.value);
        }
        
      });

      if (el.target.value && res) {
        this.setState({
          array: res,
        })
      } else {
        this.setState({
          array: this.props.array,
        })
      }
    } else {
      this.setState({
        array: this.props.array,
      })
    }

  }

  componentWillUpdate(){
  }

  componentDidMount(){
    const { array } = this.props;

    if (array){
      this.setState({
        array: array
      })
    }
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

    const { selected, open, array} = this.state;
    const { view, defaultid, inside, filter } = this.props;

    let filt = false;
    
    
    if(defaultid && !selected || defaultid && !selected.id ){
      this.setDefault(array, defaultid);
    }

    const arr = array || [
      {id:'1', name:'Option 1', icon:'1'},
      {id:'2', name:'Option 2'},
      {id:'3', name:'Option 3', icon:'1'},
    ];

    return (
      <div className={!view ? "FakeSelect" : "FakeSelect "+view} >
        
        
        <div className="FakeSelected" onClick={this.openSelect}>
          {selected ? (<FakeRow icon={selected.icon} id={selected.id}>{selected.name}</FakeRow>) : null }
        </div>
        {!open ? (<Svg svg="expose" />):(<Svg svg="inpose" />)}
        {open ? (

          <div className={"FakeOptionsContainer animated fadeIn" + " Out" } onMouseLeave={this.openSelect}>
            <div className="ContainerOuter">

            {
                filter || this.props.array && this.props.array.length > 5 ? (
              <label htmlFor="lister">
                <input type="text" id="lister" name="lister" placeholder="Поиск" onChange={e=>{ this.findElements(e) }}></input>
              </label> ): null
            }

              <div className="ContainerInner" ref={this.containerRef}>
            {
              arr && typeof arr === 'object' && arr.map((e,i)=>{
                if(!e || !e.id) return true;

                let id = e.id || '';
                let icon = e.icon || '';
                let name = e.name || e.username || '';

                return(
                  <FakeRow key={e.id || e.name + i} icon={icon} click={()=>this.select(id, name, icon)}>{name}</FakeRow>
                )
              })
            }
            </div>
            </div>
          </div>
        ) : null}

      </div>
    )
  }
}

export default FakeSelect
