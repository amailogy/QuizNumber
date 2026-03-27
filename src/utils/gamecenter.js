// Game Center integration via custom Capacitor plugin

const LEADERBOARD_ID = 'nanmonme_highscore';

function getPlugin() {
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins) {
    return window.Capacitor.Plugins.GameCenter;
  }
  return null;
}

// Check if running in native iOS app
export function isNativeApp() {
  return typeof window !== 'undefined' &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform();
}

// Sign in to Game Center (call on app start)
export async function signInGameCenter() {
  const plugin = getPlugin();
  if (!plugin) return { success: false, error: 'Not native app' };

  try {
    const result = await plugin.signIn();
    console.log('Game Center sign in:', result);
    return result;
  } catch (e) {
    console.warn('Game Center sign in failed:', e);
    return { success: false, error: e.message };
  }
}

// Submit score to leaderboard
export async function submitScore(score) {
  if (score <= 0) return;

  const plugin = getPlugin();
  if (!plugin) return;

  try {
    const result = await plugin.submitScore({
      score,
      leaderboardID: LEADERBOARD_ID,
    });
    console.log('Game Center submit score:', result);
    return result;
  } catch (e) {
    console.warn('Game Center submit score failed:', e);
  }
}

// Show Game Center leaderboard UI
export async function showLeaderboard() {
  const plugin = getPlugin();
  if (!plugin) return;

  try {
    await plugin.showLeaderboard({
      leaderboardID: LEADERBOARD_ID,
    });
  } catch (e) {
    console.warn('Game Center show leaderboard failed:', e);
  }
}
