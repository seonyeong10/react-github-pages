import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

class Square extends React.Component {

  render() {
    return(
      <button 
        className={this.props.names}
        onClick = {this.props.onClick}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    return(
      <Square 
        names={this.props.names[i]}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    // 상자 반복문으로 출력
    const arr = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    let res = arr.map((i, idx) => {
      return (
        <div className="board-row" key={idx}>
          {this.renderSquare(i[0])}
          {this.renderSquare(i[1])}
          {this.renderSquare(i[2])}
        </div>
      );
    });

    return(
      <div>
        {res}
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history : [{
        squares : Array(9).fill(null),
        names : Array(9).fill('square'),
      }],
      stepNumber : 0,
      xIsNext : true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const names = Array(9).fill('square');

    if(calculateWinner(squares, names) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext? 'X' : 'O';
    names[i] = 'square-selected';
    this.setState({
      history : history.concat([{
        squares : squares,
        names : names,
      }]),
      stepNumber : history.length,
      xIsNext : !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber : step,
      xIsNext : (step % 2) === 0,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, current.names);

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let isDraw = calculateDraw(current.squares);
    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else if(isDraw) {
      status = isDraw;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext? 'X' : 'O');
    }
    
    return(
      <div className="game">
        <div className="game-board">
          <Board 
            names={current.names}
            squares={current.squares}
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function calculateWinner(squares, names) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for(let i=0 ; i < lines.length ; i++) {
    const[a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // console.log(a, b, c);
      names[a] = 'square-selected';
      names[b] = 'square-selected';
      names[c] = 'square-selected';
      return squares[a];
    } 
  }

  return null;
}

function calculateDraw(squares) {
  let msg = 'Draw!';

  for(let i=0; i < 9 ; i++) {
    // console.log('squares[' + i + ']: ' + squares[i]);
    if(squares[i] == null) {
      msg = null;
      break;
    }
  }

  return msg;
}