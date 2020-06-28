import { Tactic } from '@/store/types'

export interface TreeViewItem {
  id: string;
  name: string;
  icon?: string;
  parent?: string;
  children?: TreeViewItem[];
  tactic?: Tactic;
}

export interface MenuItem {
  action: string;
  title: string;
  titleTwo?: string;
  icon: string;
}

export enum TacticMenuOptions {
  EDIT = 'edit',
  PIN = 'pin',
  DELETE = 'delete',
}

export enum TeamMenuOptions {
  STATS = 'stats',
  CLONE_ENTITY_TEAM = 'cloneEntityTeam',
  CLONE_ENTITY_DIFFERENT_TEAM = 'cloneEntityDifferentTeam',
  DELETE = 'delete',
}
