// function makeParticipantsKey(idA: any, idB: any) {
//   const a = idA.toString();
//   const b = idB.toString();
//   return [a, b].sort().join("_"); // "60..._61..."
// }

export const makeParticipantsKey = (idA: any, idB: any) => {
  const a = idA.toString();
  const b = idB.toString();
  return [a, b].sort().join("_");
};
