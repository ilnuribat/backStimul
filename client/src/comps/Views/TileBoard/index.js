import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo';
import Tile from '../../Parts/Tile/index';
import Content from '../../Lays/Content/index';
import TileMaker from '../../Parts/TileMaker/index';
import { QUERY_ROOTID } from '../../../GraphQL/Qur/Query/index';
import Loading from '../../Loading';
import Tiled from '../../Parts/Tiled';
import { SvgBack } from '../../Parts/SVG';


class TileBoard extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      tiles:[],
      rootid:"",
      parentid:"",
    }

    this.query = this.query.bind(this)
  }
  
  static propTypes = {

  }

  query(id, type, name, parentId){
    if(id && type === 'AddressObject'){
      localStorage.setItem('rootId', id)
      localStorage.setItem('parentId', parentId)
      this.setState({
        rootid: id,
        parentid: parentId || "",
      });
    }else{
      localStorage.setItem('rootId', "")
      localStorage.setItem('parentId', "")
      this.setState({
        rootid: "",
        parentid:"",
      });
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
    let { tiles, rootid, parentid } = this.state;

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

export default TileBoard
