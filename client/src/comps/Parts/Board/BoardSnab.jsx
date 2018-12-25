import React, { Component } from 'react'
import PropTypes from 'prop-types';
import '../../../css/lays/faketable.css';


let SnabsArray = [
  {id: "0", name: " "},
  {id: "1", name: "Заявка на материалы"},
  {id: "2", name: "Обработка данных"},
  {id: "3", name: "Заключение договора"},
  {id: "4", name: "Заявка на оплату"},
  {id: "5", name: "Согласование"},
  {id: "6", name: "Контроль исполнения"},
];

let ZArray = [
  {id: "1", name:"Купить 100 листов гипсокартона"},
  {id: "2", name:"Купить 10 мешков цемента"}
];

export class BoardSnab extends Component {
  static propTypes = {

  }

  render() {
    return (
      <div className="BoardSnab FakeTable">
        <div className="FakeTable-Row">
        {
          SnabsArray.map((e,i)=>{
            return(
              <div className="FakeTable-Col">{e.name}</div>
            )
              })
            }
        </div>

        <div className="FakeTable-Row">

          <div className="FakeTable-Col">text</div>

          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
        </div>
        <div className="FakeTable-Row">

          <div className="FakeTable-Col">text</div>

          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
        </div>
        <div className="FakeTable-Row">

          <div className="FakeTable-Col">text</div>

          <div className="ArrowRow">
            <div className="skews active">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
        </div>
        <div className="FakeTable-Row">

          <div className="FakeTable-Col">text</div>

          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
        </div>
        <div className="FakeTable-Row">

          <div className="FakeTable-Col">text</div>

          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
          <div className="ArrowRow">
            <div className="skews">
              <div className="skewTop"></div>
              <div className="skewBot"></div>
            </div>
            <div className="text">
              <p>text</p>
            </div>
          </div>
        </div>


      </div>
    )
  }
}

export default BoardSnab;
