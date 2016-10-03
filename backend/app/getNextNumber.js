import NextNumber from 'models/NextNumber';

export default async function getNextNumber(model) {
  let nextNumber = await NextNumber.findOne().exec();
  if (nextNumber === null) {
    nextNumber = new NextNumber();
    await nextNumber.save();
  }

  const res = nextNumber[model]++;
  await nextNumber.save();
  return res;
};
