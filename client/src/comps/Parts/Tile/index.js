import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import { SvgEdit, SvgRem } from '../SVG';
import TileMaker from '../TileMaker/index';

/** Tile container */

class Tile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false,
    }
    this.edit = this.edit.bind(this);
  }

  edit(){

  }

  static propTypes = {
  }

  render() {
    let {edit} = this.state;
    let {children, name, descr, id, click, parentId, type, refetch, fulltile} = this.props;

    if(edit){
      return(
        <TileMaker edit={true} setEdit={()=>{this.setState({edit: !edit})}} />
      )
    }else{
      let zcount = '';
      let counters = {
        all:0,
        new: 0,
        new2:0,
        inwork:0,
        onvote:0,
        end:0,
        fail:0,
        prefail:0,
      };

      counters.all = fulltile && fulltile.tasks && fulltile.tasks.length;

      fulltile && fulltile.tasks && fulltile.tasks.length > 0 && fulltile.tasks.map((e)=>{
        switch (e.status) {
        case 1 :
          counters.new = ++counters.new
          break;
        case 2 :
          counters.new2 = ++counters.new2
          break;
        case 3 :
          counters.inwork = ++counters.inwork
          break;
        case 4 :
          counters.onvote = ++counters.onvote
          break;
        case 5 :
          counters.end = ++counters.end
          break;

        default:
          counters.new = ++counters.new
          break;
        }

        let highlight = '';

        if (e.endDate){
          let ym = moment(e.endDate).format("YYYY MM");
          let y = moment(e.endDate).format("YYYY");
          let m = moment(e.endDate).format("M");
          let d = moment(e.endDate).format("D");
          let h = moment(e.endDate).format("HH");

          let ymN = moment().format("YYYY MM");
          let yN = moment().format("YYYY");
          let mN = moment().format("M");
          let dN = moment().format("D");
          let hN = moment().format("HH");

          if (e.status == 5 || e.status == "5") {
            // console.log("NONE", y, m, d)
          }
          else if ((ym === ymN && Number(d) < Number(dN)) || (Number(yN) > Number(y)) || (Number(mN) > Number(m) && Number(y) <= Number(yN) )) {
            counters.fail = ++counters.fail
          }
          else if ((ym === ymN && Number(d) > Number(dN) && Number(d) - Number(dN) <= 3)) {
            counters.prefail = ++counters.prefail
          } else {

          }
        }

      });

      return (
        <div className={`Tile ${ type ? type : 'none' }`}>
          {type === "Area" ? (<div className="Edit" onClick={()=>{this.setState({edit:!edit})}}><SvgEdit /></div>) : null}
          {type === "Area" ? (<div className="Rem" onClick={()=>refetch(id, parentId)}><SvgRem /></div>) : null}
          <div className="name" onClick={()=>click({id:id,type:type,name:name, parentId:parentId})}>{name}</div>

          {
            type ? <div className="descr">{type}</div> : null
          }
          {
            id ? <div className="descr">{id}</div> : null
          }
          {
            type === "Area" && fulltile.address && fulltile.address.value && <div className="descr">{ fulltile.address.value }</div>
          }
          {
            type === "Area" && fulltile && fulltile.tasks && fulltile.tasks.length > 0 && <div className="descr">Задач: {fulltile.tasks.length}</div>
          }

          {type === "Area" && fulltile && fulltile.tasks && fulltile.tasks.length > 0 &&
            <div className="TileHighliter">
              <span>{counters.all}</span>
              <span className={counters.prefail && 'orgf'}>{counters.prefail}</span>
              <span className={counters.fail && 'redf'}>{counters.fail}</span>
            </div>
          }
          {
            type === "Area" && fulltile && fulltile.tasks && fulltile.tasks.length > 0 && <div className="descr">
              {counters.new > 0 && <span>Новых <span>{counters.new}</span></span> }
              {counters.inwork > 0 && <span>В работе <span>{counters.inwork}</span></span> }
              {counters.inwork > 0 && <span>Завершены <span>{counters.end}</span></span> }
            </div>
          }

          {/* <div className="id">{id}</div> */}
          {/* <div className="type">{type}</div> */}
        </div>
      )
    }
  }
}
export default Tile
