import { Capacitor } from '@capacitor/core';

let AdMob = null;
let isInitialized = false;

const INTERSTITIAL_ID = 'ca-app-pub-9265563634637287/7997041217';

// AdMob初期化（ネイティブ環境のみ）
export async function initAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const mod = await import('@capacitor-community/admob');
    AdMob = mod.AdMob;
    await AdMob.initialize({
      initializeForTesting: false,
    });
    isInitialized = true;
    // 最初のインタースティシャルを事前読み込み
    prepareInterstitial();
  } catch (e) {
    console.warn('AdMob init failed:', e);
  }
}

// インタースティシャル広告を事前読み込み
async function prepareInterstitial() {
  if (!isInitialized || !AdMob) return;
  try {
    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_ID,
      isTesting: false,
    });
  } catch (e) {
    console.warn('Interstitial prepare failed:', e);
  }
}

// インタースティシャル広告を表示
export async function showInterstitial() {
  if (!isInitialized || !AdMob) return;
  try {
    await AdMob.showInterstitial();
  } catch (e) {
    console.warn('Interstitial show failed:', e);
  }
  // 次の広告を事前読み込み
  prepareInterstitial();
}
