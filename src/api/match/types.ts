export interface Body {
  data: Data
}

export interface Data {
  matchDuration: number
  teamA: TeamA
  teamB: TeamB
}

export interface TeamA {
  teamStats: TeamStats
  playerStats: PlayerStat[]
}

export interface TeamStats {
  attack_time: number
  defense_time: number
}

export interface PlayerStat {
  good_serves_percentage: string
  ace_percentage: string
  second_good_serves_percentage: string
  net_points_percentage: string
  average_reaction_time: string
  save_return_efficiency_percentage: string
}

export interface TeamB {
  teamStats: TeamStats2
  playerStats: PlayerStat2[]
}

export interface TeamStats2 {
  attack_time: number
  defense_time: number
}

export interface PlayerStat2 {
  good_serves_percentage: string
  ace_percentage: string
  second_good_serves_percentage: string
  net_points_percentage: string
  average_reaction_time: string
  save_return_efficiency_percentage: string
}
