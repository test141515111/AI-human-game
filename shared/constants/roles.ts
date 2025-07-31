import { Role, RoleName } from '../types';

export const ROLES: Record<RoleName, Role> = {
  engineer: {
    name: 'engineer',
    faction: 'human',
    abilities: ['夜に1人を調査し、AIかどうかを判定できる'],
    winCondition: 'すべてのAI陣営と第三陣営を排除する'
  },
  cyber_guard: {
    name: 'cyber_guard',
    faction: 'human',
    abilities: ['夜に1人を護衛し、AIの攻撃から守る'],
    winCondition: 'すべてのAI陣営と第三陣営を排除する'
  },
  citizen: {
    name: 'citizen',
    faction: 'human',
    abilities: [],
    winCondition: 'すべてのAI陣営と第三陣営を排除する'
  },
  ai: {
    name: 'ai',
    faction: 'ai',
    abilities: ['夜に1人を襲撃する', 'AI同士は互いを認識できる'],
    winCondition: '人間陣営の数をAI陣営以下にする'
  },
  fake_ai: {
    name: 'fake_ai',
    faction: 'ai',
    abilities: ['AI同士は互いを認識できる'],
    winCondition: '人間陣営の数をAI陣営以下にする'
  },
  trickster: {
    name: 'trickster',
    faction: 'third',
    abilities: ['特殊な勝利条件を持つ'],
    winCondition: '自分が追放されるか、最後まで生き残る'
  }
};

export const GAME_CONFIG = {
  phases: {
    night: { duration: 180 },
    day_report: { duration: 60 },
    day_discussion: { duration: 300 },
    day_vote: { duration: 90 }
  },
  minPlayers: 5,
  maxPlayers: 15,
  roleDistribution: {
    5: { engineer: 1, ai: 1, citizen: 3 },
    6: { engineer: 1, ai: 1, citizen: 4 },
    7: { engineer: 1, cyber_guard: 1, ai: 1, fake_ai: 1, citizen: 3 },
    8: { engineer: 1, cyber_guard: 1, ai: 2, citizen: 4 },
    9: { engineer: 1, cyber_guard: 1, ai: 2, trickster: 1, citizen: 4 },
    10: { engineer: 1, cyber_guard: 1, ai: 2, fake_ai: 1, citizen: 5 }
  }
};