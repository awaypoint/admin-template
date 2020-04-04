/**
 * 权限验证
 * @param {string} per 
 * @param {array} all 
 */
export default function parsePermission(per, all) {
  return Object.values(all).includes(per)
}