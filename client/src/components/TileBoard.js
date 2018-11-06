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
// import { getCUser, setObjectId, getTemp, setTemp, delInfo, setInfo } from '../graph/querys';
import { setObjectId, setInfo } from '../graph/querys';


export const getDashboard = gql`
  query getDash{
    rootObject @client{
        objects{
          id
          name
        }
        addresses{
          id
          name
        }
      }
    }
`;
export const setDashboard = gql`
  mutation setBar($Dash: String){
    setDash(Dash: $Dash) @client{
      rootObject
    }
  }
`;

const QUERY_ROOTID = gql`
query rootObject($id: ID){
    rootObject(id: $id){
      id
      name
      parentId
      addresses{
        id
        name
        __typename
      }
      objects{
        id
        name
        __typename
      }
    }
}
`;


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
    }
    this.query = this.query.bind(this)
  }

  query(e, type,name){

    localStorage.setItem('back',e)

    if(e){
      this.setState({rootId: e});
    }


    if(type === 'object'){
      console.error({ e, type, name})

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

    this.props.setInfo({variables:{id:"id",message:"Не трогай эту штуку!", type:"error"}})
    const __back = localStorage.getItem('back');

    this.setState({rootId: __back});
    localStorage.setItem('back','')

  }

  componentDidUpdate(){

  }

  backToThePast(id){
    let backid = id || '';

    this.setState({
      rootId: backid,
    })
  }

  render(){

    let {id,name,object,rootId} = this.state;

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
          // if (error) console.log(`Error! ${error.message}`);

          if(data){
            data.rootObject && data.rootObject.parentId ? localStorage.setItem('back', data.rootObject.parentId) : null;

            return(
              <div className="rootWrapper">
                <div className="fullWrapper">
                  <div className="inner">
                    {id ? (<div className="header">{id}</div>) : null }
                    {name ? (<div className="header">{name}</div>) : null }
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
                          <Tile key={e.id} _id={e.id} name={e.name} query={this.query} type={e.__typename||'address'} click={this.query} />
                        )
                      })
                    }
                    {
                      // getDash && getDash.rootObject && getDash.rootObject.objects && getDash.rootObject.objects.map((e)=>{
                      data.rootObject && data.rootObject.objects && data.rootObject.objects.map((e)=>{
                        return(
                          <Tile key={e.id} _id={e.id} name={e.name} query={this.query} type={'object'} click={this.query} />
                        )
                      })
                    }

                    <TileMaker />

                  </div>
                </div>
              </div>
            )
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
  // graphql(delInfo, { name: 'delInfo' }),
)(Top);
