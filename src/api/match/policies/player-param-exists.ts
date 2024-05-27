export default async (policyContext) => {

  const { playerMatchPosition } = policyContext.params;

  const playerMatchPositions = ['player-1', 'player-2', 'player-3', 'player-4']

  if(!playerMatchPosition){
    console.warn('player position not sent.')
    return false
  }

  if(!playerMatchPositions.some((p)=>p === playerMatchPosition)){
    console.warn('player match position not valid')
    return false
  }

  return true;
};
