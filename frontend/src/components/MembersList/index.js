import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import classNames from 'classnames';
import { ClickableText } from 'components';

class Member extends Component {
  render() {
    const { name, vkid, points, chance, prize } = this.props;
    return (
      <div className={classNames(styles.row, prize > 0 && styles.isWinner)}>
        <span className={styles.points}>{points}</span>
        <span className={styles.name} title={name}>
          <ClickableText href={`http://vk.com/id${vkid}`} text={name}/>
          {prize > 0 && <span> ({prize} руб.)</span>}
        </span>
        {<span className={styles.chance}>{Number.isInteger(chance) ? chance : chance.toFixed(1)}%</span>}
      </div>
    );
  }
}

class MembersList extends Component {
  render() {
    const { members } = this.props;
    return (
      <div className={styles.root}>
        <div className={styles.tableHeader}>
          <div className={styles.row}>
            <span className={styles.points}>Баллов</span>
            <span className={styles.name}>Участник</span>
            <span className={styles.chance}>Шанс</span>
          </div>
        </div>
        <div className={styles.tableList}>
          {members.map(({ name, vkid, prize }, idx) => {
            const points = members.find(m => m.vkid === vkid).points;
            const chance = points && 100 * points / members.reduce((acc, { points }) => acc + points, 0);
            return (
              <Member
                key={idx}
                name={name}
                vkid={vkid}
                points={points}
                chance={chance}
                prize={prize}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
    vkid: state.data.vkid,
  })
)(MembersList);
