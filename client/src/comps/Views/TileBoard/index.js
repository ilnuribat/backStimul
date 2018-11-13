import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Query,compose, graphql  } from 'react-apollo';
import { Redirect } from 'react-router';
import Tile from '../../Parts/Tile';
import Content from '../../Lays/Content';
import TileMaker from '../../Parts/TileMaker';
import { QUERY_ROOTID } from '../../../GraphQL/Qur/Query';
import Loading from '../../Loading';
import Tiled from '../../Parts/Tiled';
import { SvgBack } from '../../Parts/SVG';
import { setPlace, getPlace, getChat, setChat, setObjectId, getObjectId } from '../../../GraphQL/Cache';
import { qauf, _url } from '../../../constants';
import { deleteObject } from '../../../GraphQL/Qur/Mutation';


let ref;

class TileBoard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tiles:[],
      rootid:"",
      parentid:"",
      object: false,
      editObject: false,
    }

    this.query = this.query.bind(this)
    this.refetch1 = this.refetch1.bind(this)
    this.updateObject = this.updateObject.bind(this)
    this.cleanStorage = this.cleanStorage.bind(this)
  }

  static propTypes = {

  }


  refetch1(id, parentId) {
    console.warn("REFETCH!!", parentId)
    qauf(deleteObject(id), _url, localStorage.getItem('auth-token')).then(()=>{
      this.cleanStorage()
      ref()
    }).catch((e)=>{
      console.warn(e);
    });
  }

  updateObject(id,name){
    console.warn(id,name)
    this.setState({editObject: true});
  }

  cleanStorage(){
    localStorage.setItem('rootId', "")
    localStorage.setItem('parentId', "")
    this.setState({
      rootid: "",
      parentid: "",
    });
  }

  query(id, type, name, parentId){

    console.log("-------------")
    console.log(id, type, name, parentId)
    console.log(this.props.getObjectId)



    if(id && type === 'AddressObject'){
      localStorage.setItem('rootId', id)
      localStorage.setItem('parentId', parentId)
      this.setState({
        rootid: id,
        parentid: parentId || "",
      });
    }
    else if(id && type === 'Object'){
      this.setState({
        object: true,
      })
      this.props.setObjectId({
        variables:{
          id: id,
          name: name,
        }
      });


    }
    else{
      this.cleanStorage()
    }
  }

  shouldComponentUpdate (nextState) {
    if (nextState.rootid === this.state.rootid && nextState.parentid === this.state.parentid ) {
      return false
    }

    return true
  }

  componentDidMount(){
    if(localStorage.getItem('rootId') != 'undefined' || localStorage.getItem('parentId') != 'undefined' ){
      this.setState({
        rootid: localStorage.getItem('rootId') || "",
        parentid: localStorage.getItem('parentId') || "",
      });
    }else{
      this.cleanStorage();
    }
  }

  render() {
    let { tiles, rootid, parentid, object } = this.state;

    if(object || this.props.getObjectId.id) return <Redirect to="/board"/>

    return(
      <Content>
        <div className="TileBoard">
          <Query query={QUERY_ROOTID} variables={{id:rootid}}>
            {
              ({data, loading, refetch, error})=>{
                ref = refetch
                if (error){
                  console.log(error) ;
                  this.cleanStorage();
                  return <Loading />}
                if (loading) return <Loading />;

                if(data){
                  return(
                    <Fragment>
                      {
                        data.rootObject && data.rootObject.parentId || rootid ? ( <Tiled click={this.query} type="AddressObject" id={data.rootObject.parentId || parentid}>
                          <SvgBack />
                        </Tiled> ) : null
                      }
                      {
                        data.rootObject && data.rootObject.addresses && data.rootObject.addresses.map((e)=>{
                          return(
                            <Tile key={'tile'+e.id} id={e.id} name={e.name} type={e.__typename||'address'} parentId={data.rootObject.id} click={this.query} />
                          )
                        })
                      }
                      {
                        data.rootObject && data.rootObject.objects && data.rootObject.objects.map((e)=>{
                          return(
                            <Tile key={'tile'+e.id} id={e.id} name={e.name} type={e.__typename||'object'} click={this.query} refetch={this.refetch1} remove={this.remove} addr={e.address.value} parentId={data.rootObject.id} updateObject={this.updateObject} />
                          )
                        })
                      }
                    </Fragment>
                  )
                }else{
                  return <Loading />
                }


              }
            }
          </Query>
          <TileMaker />
        </div>
      </Content>
    )
  }
}

export default compose(
  graphql(setObjectId, { name: 'setObjectId' }),
  graphql(getObjectId, { name: 'getObjectId' }),
  graphql(getChat, { name: 'getChat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(getPlace, { name: 'getPlace' }),
  graphql(setPlace, { name: 'setPlace' }),
)(TileBoard);
