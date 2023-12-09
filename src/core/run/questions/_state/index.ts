import { TMenuType } from '@/interface';

// 菜单状态，避免递归调用的问题。
let menuState: TMenuType = 'main';

/**
 * 设置状态
 * @param {string} state 状态
 */
const set = (state: TMenuType) => {
  menuState = state;
};

/**
 * 获取状态
 */
const get = (): TMenuType => menuState;

export default { set, get };
