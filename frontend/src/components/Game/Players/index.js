import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import classNames from 'classnames';
import { ClickableText } from 'components';

const timeouts = [];

class Players extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: props.players,
    };
  }

  componentWillReceiveProps({ vkid, turn, added_player, removed_player }) {
    if (turn && turn !== this.props.turn && turn.vkid !== vkid) {
      this.turnAnimate(turn);
    }
    const { players } = this.state;
    if (added_player && players.every(p => p.vkid !== added_player.vkid)) {
      this.setState({ players: [...players, added_player] });
      this.props.dispatch({ type: 'SET_DATA', added_player: null });
    }
    if (removed_player && players.some(p => p.vkid === removed_player.vkid)) {
      const removePlayerIdx = players.findIndex(p => p.vkid === removed_player.vkid);
      this.setState({
        players: [
          ...players.slice(0, removePlayerIdx),
          ...players.slice(removePlayerIdx + 1),
        ],
      });
      this.props.dispatch({ type: 'SET_DATA', removed_player: null });
    }
  }

  turnAnimate = ({ vkid, res, bet }) => {
    const status = res === 0 ? 'draw' : res > 0 ? 'win' : 'lose';
    const node = this.refs[`${res ? 'gain' : 'draw'}${vkid}`];
    const className = styles[status];
    if (res !== 0) node.innerHTML = (res > 0 ? '+' : '-') + bet;
    node.classList.remove(...['win', 'lose', 'draw'].map(s => styles[s]));
    node.classList.add(className);
    timeouts[vkid] = timeouts[vkid] || {};
    clearTimeout(timeouts[vkid][status]);
    timeouts[vkid][status] = setTimeout(() => {
      node.classList.remove(className);
    }, 1000);
  };

  render() {
    const { players } = this.state;
    return (
      <div className={styles.root}>
          <div className={styles.header}>
            Сейчас на сайте:
          </div>
          <div className={styles.list}>
            {players.map((p, idx) => {
              return (
                <div className={styles.player} key={idx}>
                  <div className={styles.name} ref={`draw${p.vkid}`}>
                    <ClickableText text={p.name} href={`https://vk.com/id${p.vkid}`}/>
                    <div className={styles.gain} ref={`gain${p.vkid}`}/>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    vkid: state.data.vkid,
    players: state.data.players,
    added_player: state.data.added_player,
    removed_player: state.data.removed_player,
    turn: state.data.turn,
  })
)(Players);
