import { Tactic } from '@/store/types'

export interface TreeViewItem {
  id: string;
  name: string;
  icon?: string;
  parent?: string;
  children?: TreeViewItem[];
  tactic?: Tactic;
}

export interface TacticMenuItem {
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
