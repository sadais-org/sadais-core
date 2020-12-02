import { getConsts } from "../consts"

export function getPlatform() {
  const PLATFORM = getConsts("PLATFORM")

  let platform

  // #ifdef H5
  platform = PLATFORM.H5
  // #endif

  // #ifdef APP-PLUS
  platform = PLATFORM.APP
  // #endif

  // #ifdef APP-PLUS-NVUE
  platform = PLATFORM.APP
  // #endif

  // #ifdef MP
  platform = PLATFORM.MP
  // #endif

  return platform;
}
