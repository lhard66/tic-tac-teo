/**
 * Square 组件代表一个单独的 <button>。
 * Board 组件包含了9个squares，也就是棋盘的9个格子。
 * Game 组件则为我们即将要编写的代码预留了一些位置。
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import calculateWinner from './rule';

// class Square extends React.Component {
//   // constructor() {
//   //   // 在使用 JavaScript classes 时，你必须调用 super(); 方法才能在继承父类的子类中正确获取到类型的 this 。
//   //   super();
//   //   this.state = {
//   //     value: null,
//   //   }
//   // }
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }
// 若只有render函数，则可以写成如下部分
function Square(props) {
  return (
    <button 
      className={props.highlight ? "square emphasize" : "square"}
      onClick={() => props.onClick()}
      // style={{color: "red"}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        key = {i}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)}
        highlight = {this.props.winnerLine.includes(i)}
      />
      // 此行上面不能加；号，而下面圆括号后需要加；号。
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 3 * i; j < 3 * i + 3; j++) {
        row.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{row}</div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      sort: false,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // 常量对于引用类型，只是指向其内存地址，地址所对应的内存内容可以改变。
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  toggleSort() {
    this.setState({
      sort: !this.state.sort,
    });
  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;
    const winnerLine = calculateWinner(current.squares).line;

    if (this.state.sort) {
      history = this.state.history.slice(0);
      console.log(history);
      history.reverse();
      console.log(history);
    }
    const moves = history.map((step, move) => {
      const desc = move ?
        `Move # ${move}` :
        'Game start';
      return (
        <li key={move} className={this.state.stepNumber === move ? "current-step" : null}>
          <a href="#move" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      )
    });

    let status;
    if (winner) {
      status = `Winner : ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.toggleSort()}>Sort</button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
