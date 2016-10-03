import { User, Lottery, History } from 'models';
import { short, remove, callVk } from './utils';
import sample from 'lodash/sample';
import fetch from 'node-fetch';
import access_token from 'data/vk_group_access_token';

// (async () => {
//   try {
//     let smallInterval;
//     let pins = [];
//     let histories  = await History.find().exec();
//     let currentLotteryNum = histories.length + 1;

//     runPinRound();

//     setInterval(async () => {
//       try {
//         clearInterval(smallInterval);
//         await checkPinRound();
//         pins = [];
//         histories  = await History.find().exec();
//         currentLotteryNum = histories.length + 1;
//         await runPinRound();
//       } catch(e) { console.log(e) }
//     }, 15 * 60 * 1000);

//     async function runPinRound() {
//       try {
//         let idx = 0;
//         let lottery = await Lottery.findOne().exec();
//         if (!lottery) return;
//         smallInterval = setInterval(async () => {
//           try {
//             if (idx >= lottery.members.length) {
//               idx = 0;
//               lottery = await Lottery.findOne().exec();
//               return;
//             }
//             pins[idx] = pins[idx] || 0;
//             if (pins[idx] >= 3 || pins[idx] <= -3) {
//               return idx++;
//             }
//             const res = await callVk(() => fetch(encodeURI(`https://api.vk.com/method/wall.get?owner_id=${lottery.members[idx].vkid}&query=Игра №${currentLotteryNum} на сайте paltos.org&count=1&access_token=${access_token}&v=4.104`)));
//             const json = await res.json();
//             const post = json.response && json.response[1];
//             const isPinned = post && post.post_type === 'copy' && post.is_pinned === 1 && post.copy_history.some(c => c.owner_id == -115656486 && c.id == lottery.post_id);
//             pins[idx] += isPinned ? 1 : -1;
//             idx++;
//           } catch(e) { console.log(e) }
//         }, 1000);
//       } catch(e) { console.log(e) }
//     }

//     async function checkPinRound() {
//       try {
//         const lottery = await Lottery.findOne().exec();
//         const { members } = lottery;
//         pins.forEach((p, idx) => (p > 0) && (members[idx].points += 1));
//         pins.forEach((p, idx) => console.log(members[idx].name, p > 0));
//         await lottery.save();
//         global.clients[0] && global.clients[0].sendMessage(short.lottery(lottery), { broadcast: true });
//       } catch(e) { console.log(e) }
//     }
//   } catch(e) { console.log(e) }
// })();

const turnRes = ({ bot, member }) => {
  if (bot === member) return 0;
  if (member === '⌚') return -1;
  if (bot === '✊') {
    if (member === '✌') return -1;
    if (member === '✋') return 1;
  }
  if (bot === '✌') {
    if (member === '✊') return 1;
    if (member === '✋') return -1;
  }
  if (bot === '✋') {
    if (member === '✊') return -1;
    if (member === '✌') return 1;
  }
};

async function turn(ws, { selection, bet }) {
  try {
    if (ws.lockTurn) return;
    ws.lockTurn = true;
    setTimeout(() => ws.lockTurn = false, 1000);
    if (!['✊', '✌', '✋'].includes(selection)) return;
    bet = +bet;
    const lottery = await Lottery.findOne().exec();
    const member = lottery.members.find(m => m.vkid === ws.vkid);
    const trueBet = (bet > 0 && bet <= member.points) ? bet : 1;
    const botTurn = sample(['✊', '✌', '✋']);
    const res = turnRes({ member: selection, bot: botTurn });
    ws.sendMessage({ turn: { vkid: ws.vkid, member: selection, bot: botTurn, res, bet: trueBet } }, { broadcast: true });
    if (res !== 0) {
      member.points += res > 0 ? trueBet : -trueBet;
      if (member.points < 1) member.points = 1;
      await lottery.save();
      ws.sendMessage(short.lottery(lottery), { broadcast: true });
    }
  } catch(e) { console.log(e) }
}

const handlers = {
  turn,
};

export default function GAME(ws, { method, ...data }) {
  try {
    handlers[method](ws, data);
  } catch(e) { console.log(e) }
}
