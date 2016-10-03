import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import classNames from 'classnames';
import Bet from './Bet';
import Players from './Players';
import { Icons } from 'components';

const options = ['✊', '✌', '✋'];

let lockTurn = false;

class Game extends Component {
  state = {
    selection: '',
    bot: '',
    bet: 1,
    res: null,
    myTurn: null,
  };

  componentWillReceiveProps({ turn, vkid }) {
    if (!turn || turn.vkid !== vkid)
      return this.setState({ res: null, selection: '', bot: '' });
    this.setState({ res: turn.res, selection: turn.member, bot: turn.bot, myTurn: turn });
    lockTurn = setTimeout(() => {
      lockTurn = false;
      this.props.dispatch({ type: 'SET_DATA', turn: null });
      this.setState({ myTurn: null });
    }, 1000);
  }

  handleSelect = selection => {
    if (lockTurn) return;
    lockTurn = true;
    const { bet } = this.state;
    this.setState({ selection });
    this.props.ws.sendMessage({ type: 'GAME', method: 'turn', selection, bet });
  };

  render() {
    const { vkid, turn } = this.props;
    const { bet, selection, bot, myTurn } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.block}>
          <Bet value={bet} onChange={bet => this.setState({ bet })}/>
        </div>
        <div className={classNames(styles.block, styles.turns)}>
          <div>
            <div className={classNames(styles.hint)}>ваш ход</div>
            <div className={styles.el}>
              {(() => options.map((option, idx) => {
                const Icon = Icons[option];
                return (
                  <span
                    key={idx}
                    className={classNames(styles.option, styles.selectable, selection === option && styles.isActive)}
                    onClick={() => this.handleSelect(option)}
                  >
                    <Icon />
                  </span>
                );
                }))()}
            </div>
          </div>
          {myTurn && <div className={classNames(styles.gain, styles[myTurn && myTurn.vkid === vkid && (myTurn.res === 0 ? 'draw' : (myTurn.res > 0 ? 'win' : 'lose'))])}>
              {myTurn.res === 0 ? 'ничья' : (myTurn.res > 0 ? '+' : '-') + myTurn.bet}
          </div>}
          <div>
            <div className={classNames(styles.hint)}>ход бота</div>
            <div className={styles.el}>
              {(() => options.map((option, idx) => {
                const Icon = Icons[option];
                return (
                  <span
                    key={idx}
                    className={classNames(styles.option, bot === option && styles.isActive)}
                  >
                    <Icon />
                  </span>
                );
                }))()}
            </div>
          </div>
        </div>
        <div className={styles.block}>
          <Players />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
    vkid: state.data.vkid,
    turn: state.data.turn,
    players: state.data.players,
  })
)(Game);
