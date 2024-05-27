export default () => {
  return async (ctx, next) => {
    const [match] = await strapi.entityService.findMany('api::match.match',{
      filters:{
        match_token: ctx.request.params.matchToken
      },
      populate: {
        teams:{
          populate:{
            users:{
              fields: ['id','player_match_position'],
            }
          }
        }
      }
    })
    let userAlreadyInTeam
    for (const team of match.teams){
      if (team.users.some(us=>us.id === ctx.state.user.id)){
        userAlreadyInTeam = team.id
      }
    }
    if(userAlreadyInTeam){
      ctx.status= 400
      ctx.message= `User already assigned to team ${userAlreadyInTeam}`
      return false;
    }
    if(match){
      ctx.state.match = match
      return next()
    }else{
      ctx.status = 400
      ctx.message = 'No user instance found. The user may already be assigned.'
    } 
  };
};
