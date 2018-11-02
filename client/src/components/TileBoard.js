import React from 'react';
import { qauf } from '../constants';
import Tile from '../components/TileBoard/Tile'
import TileMaker from '../components/TileBoard/TileMaker'
import Info from './Info';
import { compose, graphql, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SvgBack } from './Svg';
import { getCUser, setPrivateChat, getPrivateChat, getTemp, setTemp, getInfo, delInfo, setInfo } from '../graph/querys';
// import Board from './board';
// import { Route, Switch } from 'react-router-dom';
// import { Redirect } from 'react-router'




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

const QUERY_ROOT = gql`
{
    rootObject{
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

      let rootId;
      if(e){
        this.setState({rootId: e});
        console.log("E-------------")
        console.log(e)
      }
      

      if(type === 'object'){
        let object = (id) => `
        {
            object(id:${id}){
                id
                name
                tasks{
                  id
                  name
                }
              }
            }
        `;

        console.log("type,e,name")
        console.log(type,e,name)

        this.props.setChat({
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
      //   rootId = (id) =>{
      //     let params = '';
      //     if(!!id){
      //       params = `(id:"${id}")`;
      //     }
      //   return(`
      //   {
      //       rootObject${params}{
      //         id
      //         name
      //         addresses{
      //           id
      //           name
      //         }
      //         objects{
      //           id
      //           name
      //         }
      //       }
      //   }
      //   `)};
      //   console.log(rootId(e));
      //         qauf(rootId(e), url, localStorage.getItem('auth-token')).then(a=>{
      //   console.log("a")
      //   console.log(a)
      //   if(a && a.data && a.data.rootObject){
      //     this.setState({
      //       id: a.data.rootObject._id,
      //       name: a.data.rootObject.name,
      //       childs: [...a.data.rootObject.objects]
      //     });
      //   }else{
      //     console.log("Загрузка")
      //   }
      // })
      //   .catch((e)=>{
      //     console.warn(e);
      //   });
      }
      let url = "localhost:4000";



      // alert(e)
      
      console.log(e);


    }

    componentDidMount(){

      this.props.setInfo({variables:{id:"id",message:"Не трогай эту штуку!", type:"error"}})
      const __back = localStorage.getItem('back'); 
      
      this.setState({rootId: __back});
      localStorage.setItem('back','')

      let url = "localhost:4000";

      let id;
      if(__back){
        id = __back;
      }
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



    let {id,name,childs,__back,object,rootId} = this.state;
    let {Dash, getDash, setDash} = this.props;


    console.log("getDash");
    console.log(getDash);

    if(object){
      const {Redirect} = require('react-router');
      return(
        <Redirect to='/board'/>
      )
    }

    let QUERY;
    let ROOTID="";
    if(rootId){
      ROOTID == rootId
      QUERY = QUERY_ROOTID
    }else{
      QUERY = QUERY_ROOT
    }

    console.log("QUERY")
    console.log(QUERY)
    console.log("ROOTID")
    console.log(ROOTID)
      return(

        <Query query={QUERY} variables={{id: rootId}}>
          {({ loading, error, data, refetch }) => {
            if (loading) return "Loading...";
            // if (error) console.log(`Error! ${error.message}`);

            if(data){
              console.log("data-------------------------");
              console.log(data);
              console.log("getDash2");
              console.log(getDash);


              data.rootObject && data.rootObject.parentId ? localStorage.setItem('back', data.rootObject.parentId) : null;

              if(getDash){

              }

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

      console.log("getDash3")
      console.log(getDash)

      return "----------------------------"

        return(
          <div className="rootWrapper">
            <div className="fullWrapper">
            <div className="inner">
              {id ? (<div className="header">{id}</div>) : null }
              {name ? (<div className="header">{name}</div>) : null }
              
              {
                      getDash && getDash.rootObject && getDash.rootObject.objects.map((e)=>{
                        let props;
                        return(
                          <Tile _id={e._id} name={e.name} query={this.query} />
                        )
                      })
              }
  
  
              <TileMaker ref={this.query} />
              <Info type={"error"} message={"Ошибка"} />
            </div> 
            </div> 
          </div> 
        )








    

    // if(childs && childs.length > 0){
    //   return(
    //     <div className="rootWrapper">
    //       <div className="fullWrapper">
    //       <div className="inner">
    //         {id ? (<div className="header">{id}</div>) : null }
    //         {name ? (<div className="header">{name}</div>) : null }
            
    //         {
    //                 childs.map((e)=>{
    //                   let props;
    //                   return(
    //                     <Tile _id={e._id} name={e.name} query={this.query} />
    //                   )
    //                 })
    //         }


    //         <TileMaker ref={this.query} />
    //         <Info type={"error"} message={"Ошибка"} />
    //       </div> 
    //       </div> 
    //     </div> 
    //   )
    // }else{
    //   return(
    //     <div className="rootWrapper">
    //       <Info />
    //     </div> 
    //   )
      
    // }
  }
}

export default compose(
  graphql(getPrivateChat, { name: 'getChat' }),
  graphql(setPrivateChat, { name: 'setChat' }),
  graphql(getCUser, { name: 'getCUser' }),
  graphql(setTemp, { name: 'setTemp' }),
  graphql(getTemp, { name: 'getTemp' }),
  graphql(getDashboard, { name: 'getDash' }),
  graphql(setDashboard, { name: 'setDash' }),
  graphql(setInfo, { name: 'setInfo' }),
  graphql(delInfo, { name: 'delInfo' }),
)(Top);