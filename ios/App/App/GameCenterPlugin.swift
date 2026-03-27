import Foundation
import Capacitor
import GameKit

@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "signIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "submitScore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showLeaderboard", returnType: CAPPluginReturnPromise),
    ]

    private var isAuthenticated = false

    @objc func signIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let localPlayer = GKLocalPlayer.local
            localPlayer.authenticateHandler = { [weak self] viewController, error in
                if let vc = viewController {
                    self?.bridge?.viewController?.present(vc, animated: true, completion: nil)
                    return
                }
                if let error = error {
                    print("Game Center auth error: \(error.localizedDescription)")
                    call.resolve(["success": false, "error": error.localizedDescription])
                    return
                }
                if localPlayer.isAuthenticated {
                    self?.isAuthenticated = true
                    call.resolve([
                        "success": true,
                        "playerID": localPlayer.gamePlayerID,
                        "displayName": localPlayer.displayName
                    ])
                } else {
                    call.resolve(["success": false, "error": "Not authenticated"])
                }
            }
        }
    }

    @objc func submitScore(_ call: CAPPluginCall) {
        guard let score = call.getInt("score") else {
            call.reject("Missing score parameter")
            return
        }
        let leaderboardID = call.getString("leaderboardID") ?? "nanmonme_highscore"

        guard isAuthenticated else {
            call.resolve(["success": false, "error": "Not authenticated"])
            return
        }

        GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local,
                                  leaderboardIDs: [leaderboardID]) { error in
            if let error = error {
                print("Submit score error: \(error.localizedDescription)")
                call.resolve(["success": false, "error": error.localizedDescription])
            } else {
                call.resolve(["success": true])
            }
        }
    }

    @objc func showLeaderboard(_ call: CAPPluginCall) {
        let leaderboardID = call.getString("leaderboardID") ?? "nanmonme_highscore"

        guard isAuthenticated else {
            call.resolve(["success": false, "error": "Not authenticated"])
            return
        }

        DispatchQueue.main.async { [weak self] in
            let gcVC = GKGameCenterViewController(leaderboardID: leaderboardID,
                                                   playerScope: .global,
                                                   timeScope: .allTime)
            gcVC.gameCenterDelegate = self
            self?.bridge?.viewController?.present(gcVC, animated: true, completion: nil)
            call.resolve(["success": true])
        }
    }
}

extension GameCenterPlugin: GKGameCenterControllerDelegate {
    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true, completion: nil)
    }
}
