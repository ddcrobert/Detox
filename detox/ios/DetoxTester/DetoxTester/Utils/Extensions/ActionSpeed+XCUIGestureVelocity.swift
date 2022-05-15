//
//  ActionSpeed+XCUIGestureVelocity.swift (DetoxTesterApp)
//  Created by Asaf Korem (Wix.com) on 2022.
//

import Foundation
import DetoxInvokeHandler

extension Action.ActionSpeed {
  var gestureVelocity: XCUIGestureVelocity {
    switch self {
      case .slow:
        return .slow

      case .fast:
        return .fast
    }
  }
}