import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Content from '../../Lays/Content';
import TopBar from '../../Parts/Bars/TopBar';
import './area.css';
import { Query } from 'react-apollo';
import Loading from '../../Loading';
import { QUERY_AREA } from '../../../GraphQL/Qur/Query';





const tabsArr = [
  { id: '1', name: 'Объекты', do: 'ObjectsTab' },
  { id: '2', name: 'Справка-доклад', do: 'Comp2' },
  { id: '3', name: 'График работ', do: 'None' },
  { id: '4', name: 'Генеральный план', do: 'None' },
];

const Button = ({children, size}) => {
  return (
    <div className="button" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
      <div className='cover'></div>
    </div>
  )
}

const Tab = ({ children, size, view, doit, click }) => {
  return (
    <div className={view && "Tab " + view || 'Tab'} style={{ width: size && size + "px" || "", minWidth: size && size + "px" || "" }} onClick={(e) => { doit && click && typeof click === 'function' ? click(doit) : click && typeof click === 'function' ? click() : console.log('tab', e.target) }}>
      <div className="text">
        {children}
      </div>
      <div className='cover'></div>
    </div>
  )
}

const Tabs = ({ children, size, view }) => {
  return (
    <div className="Tabs" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
    </div>
  )
}

const ObjectsTab = ({ children, size, view, id }) => {
  return (

    
    <div className="ObjectsTab" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children && children}
      <Query query={QUERY_AREA} variables={{ id: id}}>
      {
        ({loading, error, data})=>{
          if(loading){
            return <Loading></Loading>
          }
          if (error){
            return <Err text={error.message}></Err>
          }

          console.warn('data', data)
          console.warn('error', error)

          if (data && data.area && data.area.objects){
            return <DataRender data={data.area.objects} type="MiniTile"></DataRender>
          }else{
            return <Err text={'No data'}></Err>
          }
        }
      }
      </Query>
    </div>
  )
}

const DataRender = ({ children, size, view = '', data, type }) => {
  return (
    <div className="DataRender" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
      {data && data.map((e,i)=>{
        return <div className={type + ' ' + view} key={"datakey" + i}>{e.name && e.name || 'no name'}</div>
      })}
    </div>
  )
}

const Comp1 = ({ children, size, view }) => {
  return (
    <div className="Comp1" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
      Comp1
    </div>
  )
}
const Comp2 = ({ children, size, view }) => {
  return (
    <div className="Comp2" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
      Comp2
    </div>
  )
}
const Comp3 = ({ children, size, view }) => {
  return (
    <div className="Comp3" style={{ width: size && size + "px" || "", minWidth: size && size+"px" || ""}}>
      {children}
      Comp3
    </div>
  )
}
const comps = ({id,name}) => ({
  ObjectsTab: <ObjectsTab id={id} />,
  Comp1: <Comp1 id={id} />,
  Comp2: <Comp2 id={id} />,
  Comp3: <Comp3 id={id} />,
});

const Err = ({ children, id, text, color, click, size}) => {
  return (
    <div className="Err" style={{ width: size && size + "px" || "", minWidth: size && size + "px" || "" }}>
      {children}
      {text}
      Err
    </div>
  )
}
const Warn = ({ children, id, text, color, click, size}) => {
  return (
    <div className="Warn" style={{ width: size && size + "px" || "", minWidth: size && size + "px" || "" }}>
      {children}
      {text}
      Warn
    </div>
  )
}
const Mess = ({ children, id, text, color, click, size}) => {
  return (
    <div className="Mess" style={{ width: size && size + "px" || "", minWidth: size && size + "px" || "" }}>
      {children}
      {text}
      Mess
    </div>
  )
}

const Event = ({id, text, color, size}) => ({
  Err: <Err id={id} text={text} color={color} size={size}  />,
  Warn: <Warn id={id} text={text} color={color} size={size}  />,
  Mess: <Mess id={id} text={text} color={color} size={size}  />,
});

export class Area extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      comp: '',
      selidx: '',
    }

    this.doClick = this.doClick.bind(this);
  }
  
  static propTypes = {

  }

  doClick(what, idx){
    const { comp, selidx } = this.state;
    if (what && what !== 'None'){
      what = what.replace(/![a-zA-Z][a-zA-Z0-9]{3,32}/gi, '');
      
      if (idx){
        idx = idx.toString();
        idx = idx.replace(/![a-zA-Z][a-zA-Z0-9]{1,32}/gi, '');
      }

    switch (what) {
      case comp:
          this.setState({
            comp: '',
            selidx: idx || '',
          });
        break;
    
      default:
        console.log(what);
        this.setState({
          comp: what,
          selidx: idx || '',
        });
        break;
    }
    }else{
      console.log('tab')
    }
  }

  render() {
    const { comp, selidx} = this.state;
    const { location } = this.props;
    
    return (
      
      <Content view="Area">
        <TopBar>
          <Button size="200">1</Button>
          <Button size="200">2</Button>
          <Button>3</Button>

          <Tabs>
            {
              tabsArr && tabsArr.map((e,i)=>{
                
                return(
                  <Tab key={'tab' + e.id} view={i == selidx ? 'a' : null} click={() => { e.do && this.doClick(e.do,i)}}>{e.name}</Tab>
                )
              })
            }
          </Tabs>
        </TopBar>
        {
          comp ? comps({ id: selidx })[comp] : <ObjectsTab id={location.state.id} />
        }
      </Content>
    )
  }
}

export default Area
