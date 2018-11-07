import React from 'react';
import { compose, graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
// import { qauf } from '../constants';
import Tile from './TileBoard/Tile'
import TileMaker from './TileBoard/TileMaker'
// import Info from './Info';
import { SvgBack } from './Svg';
// import { getCUser, setObjectId, getTemp, setTemp, delInfo, setInfo, getPlace } from '../graph/querys';
import { setObjectId, setInfo, getDashboard, setDashboard, QUERY_ROOTID, getPlace } from '../graph/querys';




class Top extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      __back:'',
      isHidden: true,
      id:'',
      name:'',
      objects: [],
      childs: [],
      object: false,
      rootId:"",
      paretnId:"",
    }
    this.query = this.query.bind(this)
  }

  query(e, type, name, paretnId){

    localStorage.setItem('back',e);
    localStorage.setItem('placeParent', paretnId );

    if(e){
      this.setState({rootId: e,
        paretnId: paretnId,
      });
    }


    if(type === 'object'){
      // console.error({ e, type, name})

      this.props.setObjectId({
        variables:{
          id: e,
          name: name,
          priv: false,
          unr: 0,
        }
      });
      this.setState({
        object: true,
      })

    }else if(type === 'task'){

    }else{

    }

  }
  componentDidMount(){

    // this.props.setInfo({variables:{id:"id",message:"Не трогай эту штуку!", type:"error"}})
    const placeId = this.props.getPlace.place.id;
    const __back = localStorage.getItem('back');
    const place = localStorage.getItem('place');
    const placeParent = localStorage.getItem('placeParent');

    let placeid = placeParent || __back;
    this.setState({rootId: placeid});
    // localStorage.setItem('back','');

  }

  componentDidUpdate(){
    
  }

  shouldComponentUpdate(prevProps, prevState){

    if(prevState.rootId !== this.state.rootId)
    {
      return true
    }

  }

  backToThePast(id){
    let backid = id || '';

    this.setState({
      rootId: backid,
    })
  }

  render(){

    let {id,name,object,rootId} = this.state;
    let mess = 0;

    // let {getDash} = this.props;

    if(object){
      return(
        <Redirect to='/board'/>
      )
    }

    let ROOTID="";

    if(rootId){
      ROOTID = rootId
    }

    return(

      <Query query={QUERY_ROOTID} variables={{id: ROOTID}}>
        {({ loading, error, data, refetch }) => {
          if (loading) return "Loading...";
          if (error){ console.log(`Error! ${error.message}`) ;
          if(mess === 0){
            this.props.setInfo({variables:{id:"id",message:`Данные не получены! ${error.message}`, type:"error"}});
            this.setState({
              rootId: "",
            });
            mess = 1;
          }
         }
          
          if(data){
            
            data.rootObject && data.rootObject.id ? localStorage.setItem('placeParent', data.rootObject.id) : null;
            data.rootObject && data.rootObject.parentId ? localStorage.setItem('back', data.rootObject.parentId) : null;

            return(
              <div className="rootWrapper">
                <div className="fullWrapper">
                  <div className="inner">
                    {data.rootObject.id ? (<div className="header">{data.rootObject.id}</div>) : null }
                    {data.rootObject.name ? (<div className="header">{data.rootObject.name}</div>) : null }
                    {data.rootObject ? (
                      <div className="makeTile" onClick={()=>this.backToThePast(data.rootObject.parentId)}>
                        <div className="inner" >
                          <SvgBack />
                        </div>
                      </div>
                    ) : null}
                    {

                      // getDash && getDash.rootObject && getDash.rootObject.addresses && getDash.rootObject.addresses.map((e)=>{
                      data.rootObject && data.rootObject.addresses && data.rootObject.addresses.map((e)=>{
                        return(
                          <Tile key={e.id} _id={e.id} name={e.name} query={this.query} type={e.__typename||'address'} parentId={data.rootObject.id} click={this.query} />
                        )
                      })
                    }
                    {
                      // getDash && getDash.rootObject && getDash.rootObject.objects && getDash.rootObject.objects.map((e)=>{
                      data.rootObject && data.rootObject.objects && data.rootObject.objects.map((e)=>{
                        return(
                          <Tile key={e.id} _id={e.id} name={e.name} query={this.query} type={'object'} parentId={data.rootObject.id} click={this.query} />
                        )
                      })
                    }

                    <TileMaker />

                  </div>
                </div>
              </div>
            )
          }else{
            if(mess === 0){
              this.props.setInfo({variables:{id:"id",message:"Данные не получены", type:"error"}});
              this.setState({
                rootId: "",
              })
              mess = 1;
            }
            return true;
          }


        }}
      </Query>
    )
  }
}

Top.propTypes = {
  setObjectId: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
};


export default compose(
  graphql(setObjectId, { name: 'setObjectId' }),
  // graphql(getCUser, { name: 'getCUser' }),
  // graphql(setTemp, { name: 'setTemp' }),
  // graphql(getTemp, { name: 'getTemp' }),
  // graphql(getDashboard, { name: 'getDash' }),
  // graphql(setDashboard, { name: 'setDash' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(getPlace, { name: 'getPlace' }),
  // graphql(delInfo, { name: 'delInfo' }),
)(Top);