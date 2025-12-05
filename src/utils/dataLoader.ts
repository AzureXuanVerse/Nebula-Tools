import type { Character, Disc, Item, Potential } from '../types';

/**
 * 加载角色数据
 */
export async function loadCharacters(): Promise<Character[]> {
  try {
    const response = await fetch('/data/Characters.json');
    const data = await response.json();
    return data.characters || [];
  } catch (error) {
    console.error('Failed to load characters:', error);
    return [];
  }
}

/**
 * 加载唱片数据
 */
export async function loadDiscs(): Promise<Disc[]> {
  try {
    const response = await fetch('/data/Discs.json');
    const data = await response.json();
    return data.discs || [];
  } catch (error) {
    console.error('Failed to load discs:', error);
    return [];
  }
}

/**
 * 加载物品数据
 */
export async function loadItems(): Promise<Item[]> {
  try {
    const response = await fetch('/data/Items.json');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to load items:', error);
    return [];
  }
}

/**
 * 加载潜能数据
 */
export async function loadPotentials(): Promise<Potential[]> {
  try {
    const response = await fetch('/data/Potential.json');
    const data = await response.json();
    return data.potentials || [];
  } catch (error) {
    console.error('Failed to load potentials:', error);
    return [];
  }
}

/**
 * 获取元素对应的图标
 */
export function getElementIcon(element: string): string {
  const icons: Record<string, string> = {
    FIRE: '🔥',
    AQUA: '💧',
    WIND: '🌪️',
    EARTH: '🗿',
    LIGHT: '✨',
    DARK: '🌑',
    NONE: '⚪',
  };
  return icons[element] || '⚪';
}

/**
 * 获取元素对应的颜色类
 */
export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    FIRE: 'bg-red-100 text-red-600 border-red-300',
    AQUA: 'bg-blue-100 text-blue-600 border-blue-300',
    WIND: 'bg-green-100 text-green-600 border-green-300',
    EARTH: 'bg-orange-100 text-orange-600 border-orange-300',
    LIGHT: 'bg-yellow-100 text-yellow-600 border-yellow-300',
    DARK: 'bg-purple-100 text-purple-600 border-purple-300',
    NONE: 'bg-gray-100 text-gray-600 border-gray-300',
  };
  return colors[element] || colors.NONE;
}
