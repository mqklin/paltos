import moment from 'moment';

const short = {
  lottery: lottery => lottery && {
    lottery: {
      members: lottery.members.map(({ name, vkid, points }) => ({ name, vkid, points })),
      botTurns: lottery.botTurns,
      post_id: lottery.post_id,
      post_hash: lottery.post_hash,
    },
  },

  histories: histories => ({ histories: histories.map(({ number, members }) => ({
    number,
    members: members.map(({ name, vkid, points, prize }) => ({ name, vkid, points, prize })),
  }))}),
};

const remove = (arr, el) => {
  const removeIdx = arr.findIndex(a => a === el);
  if (removeIdx === -1) return arr;
  return [...arr.slice(0, removeIdx), ...arr.slice(removeIdx + 1)];
};


const vkCalls = [];
let lock = false;
let cursor = 0;
setInterval(async () => {
  if (lock) return;
  const call = vkCalls[cursor];
  if (!call) return cursor = vkCalls.length = 0;
  lock = true;
  try {
    const res = await call.f();
    call.resolve(res);
  } catch(e) {
    console.log(e);
    call.reject(e);
  } finally {
    cursor++;
    lock = false;
  }
}, 500);
const callVk = (f) => new Promise((resolve, reject) => vkCalls.push({ f, resolve, reject }));

export {
  short,
  remove,
  callVk,
};



