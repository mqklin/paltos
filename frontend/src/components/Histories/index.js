import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import moment from 'moment';
import classNames from 'classnames';
import { ClickableText, MembersList } from 'components';

class History extends Component {
  render() {
    let { history: { number, members } } = this.props;
    members = members.sort((a, b) => b.points - a.points);
    return (
      <div className={styles.history}>
        <div className={styles.lotteryNumber}>Игра №{number}</div>
        <div className={styles.membersList}>
          <MembersList members={members} />
        </div>
      </div>
    );
  }
}

class Histories extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    if (props.histories.length === 0) return;
    const sortedHistories = props.histories.sort((a, b) => a.number - b.number);
    this.state.displayHistory = sortedHistories[sortedHistories.length - 1];
  }

  componentWillReceiveProps({ histories }) {
    if (this.state.displayHistory === undefined && histories.length > 0) {
      const sortedHistories = histories.sort((a, b) => a.number - b.number);
      this.setState({ displayHistory: sortedHistories[sortedHistories.length - 1] });
    };
  }

  render() {
    const { histories } = this.props;
    const { displayHistory } = this.state;
    const sortedHistories = histories.sort((a, b) => a.number - b.number);
    return !histories.length ? null : (
      <div className={styles.root}>
        <div className={styles.histories}>
          <div className={styles.historiesHeader}>
            <div className={styles.row}>
              <span className={styles.num}>№</span>
              <span className={styles.members}>Участников</span>
              <span className={styles.sum}>Сумма&nbsp;(руб.)</span>
            </div>
          </div>
          <div className={styles.historiesList}>
            {sortedHistories.reverse().map(({ number, members }) => (
              <div
                className={classNames(styles.row, number === displayHistory.number && styles.selected)}
                key={number}
                onClick={() => this.setState({ displayHistory: sortedHistories.find(h => h.number === number) })}
              >
                <span className={styles.num}>{number}</span>
                <span className={styles.members}>{members.length}</span>
                <span className={styles.sum}>{members.reduce((acc, { prize }) => acc + prize, 0)}</span>
              </div>
            ))}
          </div>
        </div>
        {displayHistory && <History history={displayHistory}/>}
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
    histories: state.data.histories,
  })
)(Histories);
