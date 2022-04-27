//
//  XCUIElement+setColumnToValue.swift (DetoxTesterApp)
//  Created by Asaf Korem (Wix.com) on 2022.
//

import Foundation
import XCTest

extension XCUIElement {
  ///
  func setColumnToValue(_ value: String, atIndex index: UInt) {
    let columnPicker = pickerWheels.element(boundBy: Int(index))
    columnPicker.adjust(toPickerWheelValue: value)
  }
}
