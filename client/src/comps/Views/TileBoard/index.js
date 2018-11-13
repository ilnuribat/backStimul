import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo';
import Tile from '../../Parts/Tile';
import Content from '../../Lays/Content';
import TileMaker from '../../Parts/TileMaker';
import { QUERY_ROOTID } from '../../../GraphQL/Qur/Query';
import Loading from '../../Loading';
import Tiled from '../../Parts/Tiled';
import { SvgBack } from '../../Parts/SVG';
import { setPlace, getPlace, getChat, setChat, setObjectId, getObjectId } from '../../../GraphQL/Cache';
import { compose, graphql } from 'react-apollo';
import { Redirect } from 'react-router';


class TileBoard extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      tiles:[],
      rootid:"",
      parentid:"",
      object: false,
    }

    this.query = this.query.bind(this)
  }
  
  static propTypes = {

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
      this.props.setObjectId({
        variables:{
          id: id,
          name: name,
        }
      });
      this.setState({
        object: true,
      })

    }
    else{
      localStorage.setItem('rootId', "")
      localStorage.setItem('parentId', "")
      this.setState({
        rootid: "",
        parentid:"",
      });
      // this.props.setBoard({

      // })
    }
  }

  componentDidMount(){
    
    if(localStorage.getItem('rootId') != 'undefined' || localStorage.getItem('parentId') != 'undefined' ){
      this.setState({
        rootid: localStorage.getItem('rootId') || "",
        parentid: localStorage.getItem('parentId') || "",
      });
    }
  }

  render() {
    let { tiles, rootid, parentid, object } = this.state;
    if(object && this.props.getObjectId.id) return <Redirect to="/board"/>
    return(
      <Content>
        <div className="TileBoard">
          <Query query={QUERY_ROOTID} variables={{id:rootid}}>
            {
              ({data, loading, refetch, error})=>{
              
              if (error){ console.log(error); return <Loading />};
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
                            <Tile key={'tile'+e.id} id={e.id} name={e.name} type={e.__typename||'object'} click={this.query} refetch={this.refetch1} addr={e.address.value} parentId={data.rootObject.id} updateObject={this.updateObject} />
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