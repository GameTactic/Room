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
  icon: string;
  titleTwo?: string;
  iconTwo?: string;
}

export enum TacticMenuOptions {
  LOCK = 'lock',
  EDIT = 'edit',
  PIN = 'pin',
  DUPLICATE = 'duplicate',
  DELETE = 'delete',
}

export enum TeamMenuOptions {
  STATS = 'stats',
  DUPLICATE_ENTITY_TEAM = 'duplicateEntityTeam',
  DUPLICATE_ENTITY_DIFFERENT_TEAM = 'duplicateEntityDifferentTeam',
  DELETE = 'delete'
}
