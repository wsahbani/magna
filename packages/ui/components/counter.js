import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
export var Counter = function () {
    var _a = useState(0), count = _a[0], setCount = _a[1];
    return (_jsx("button", { id: "counter", type: "button", onClick: function () { return setCount(count + 1); }, children: count }));
};
