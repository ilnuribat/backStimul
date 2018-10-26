import React from 'react';


class Top extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isHidden: true,
        objects: [],
      }



    }

    query(e){
      alert(e)

    }

    componentDidMount(){

    }
    componentDidUpdate(){

    }

  render(){
    let {objects} = this.state;

    if(objects && objects.length > 0){
      objects.map((e)=>{
        return(
          <div onClick={()=>this.query(e.id)}>
            {e.name ? (<div>{e.name}</div>) : null }
            {e.id ? (<div>{e.id}</div>) : null }
          </div>
        )
      })
    }else{
      return("нет данных")
    }


  }
}

export default Top;