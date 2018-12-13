import React, { Component, Fragment } from 'react'
// import PropTypes from 'prop-types'
import { Query,compose, graphql  } from 'react-apollo';
import { Redirect } from 'react-router';
import Tile from '../../Parts/Tile';
import Content from '../../Lays/Content';
import TileMaker from '../../Parts/TileMaker';
import { QUERY_ROOTID } from '../../../GraphQL/Qur/Query';
import Loading from '../../Loading';
// import Tiled from '../../Parts/Tiled';
// import { SvgBack } from '../../Parts/SVG';
import { setPlaceName, getPlaceName, getChat, setChat } from '../../../GraphQL/Cache';
import { qauf, _url } from '../../../constants';
import { deleteObject } from '../../../GraphQL/Qur/Mutation';
import { ButtonTo, ButtonRow } from '../../Parts/Rows/Rows';
import Svg from '../../Parts/SVG';

let ref;

class TileBoard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tiles:[],
      rootid:"",
      parentid:"",
      objectId:"",
      objectname:"",
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
    localStorage.setItem('placeParent', "")
    localStorage.setItem('parentId', "")

    if(this.state.rootid){
      this.setState({
        rootid: "",
        parentid: "",
      });
    }

  }

  query(args){
    let {id, type, name, parentId} = args;
    if(id && type === 'AddressObject'){
      localStorage.setItem('rootId', id)
      localStorage.setItem('parentId', parentId)
      this.setState({
        rootid: id,
        parentid: parentId || "",
      });
    }
    else if(id && type === 'Object'){
      localStorage.setItem('ObjectId',id);
      localStorage.setItem('ObjectName',name);
      this.setState({
        objectId: id,
        objectname: name,
        object: true,
      })
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
    const { location } = this.props
    // console.warn("LOCATIION!", location.state)

    if(localStorage.getItem('rootId') || localStorage.getItem('parentId')){
      this.setState({
        rootid: localStorage.getItem('rootId') || "",
        parentid: localStorage.getItem('parentId') || "",
      });
    }else{
      this.cleanStorage();
    }
  }



  render() {
    let { tiles, rootid, parentid, object, objectId, objectname } = this.state;

    if(object && objectId){
      console.log(objectId)
      return <Redirect to={{
        pathname: '/board',
        state: { objectId: this.state.objectId }
      }} />
    }

    return(
      <Content>
        <div className="TileBoard">
          <Query query={QUERY_ROOTID} variables={{id:rootid || ""}}>
            {
              ({data, loading, refetch, error})=>{
                ref = refetch
                if (error){
                  rootid ? this.cleanStorage() : true;
                  console.log("ERROR",error.message);
                  let message = 'Неизвестная ошибка';

                  switch (error.message) {
                    case "Network error: Failed to fetch":
                        message = "Не удается подключиться"
                      break;
                  
                    default:
                      break;
                  }

                  return(
                    <div className="errorMessage">
                      {message}
                    </div>
                  );
                  // return <Redirect to={{ pathname: '/error', state: { error: error } }} />
                }
                if (loading) return <Loading />;

                if (data && data.rootObject){
                  return(
                    <Fragment>
                      <div className="TileBoardTop">
                        {
                          data.rootObject.parentId || rootid ? (
                            <ButtonTo click={this.query} id={data.rootObject.parentId || parentid}  type="AddressObject" icon="back">Назад</ButtonTo>
                          ) : null
                        }
                        <div className="TileBoardTopCenter">
                          <span className="crumbs">
                          {data.rootObject && data.rootObject.crumbs && data.rootObject.crumbs.map(
                            (e, i, arr)=>{
                              let parent = arr[i - 1];
                                return(
                                  <span className="crumbWrap" onClick={() => { this.query({ id: e.id, type: "AddressObject", name: e.name, parentId: parent ? parent.id : '' })}}><span className="crumb" key={e.id}>{e.name}</span><Svg view="InlBl" svg="toright" size="28" /></span>  
                                )
                              }
                          ) }
                          {
                            data.rootObject && data.rootObject.name ? (
                                <span>{data.rootObject.name}</span>
                              ) : (<span>Россия</span>)
                          }
                          </span>
                          <TileMaker>
                            <ButtonRow icon="plus" iconright="" click={this.state.SOMECLICKFUNCTION}>Создать Объект</ButtonRow>
                          </TileMaker>
                          
                        </div>
                      </div>
                      <div className="TileBoardContent">
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
                      </div>
                    </Fragment>
                  )
                }else{
                  return <Loading />
                }


              }
            }
          </Query>
          
        </div>
      </Content>
    )
  }
}

export default compose(
  graphql(getChat, { name: 'getChat' }),
  graphql(setChat, { name: 'setChat' }),
  graphql(getPlaceName, { name: 'getPlaceName' }),
  graphql(setPlaceName, { name: 'setPlaceName' }),
)(TileBoard);
