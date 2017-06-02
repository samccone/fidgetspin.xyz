// TODO(samccone) figure out how to get the real types working.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var VERSION = '8';
this.addEventListener('install', function (e) { return e.waitUntil(swInstall()); });
this.addEventListener('activate', function (e) { return e.waitUntil(swActivate()); });
this.addEventListener('fetch', function (e) { return e.respondWith(swFetch(e)); });
function swInstall() {
    return __awaiter(this, void 0, void 0, function () {
        var rs, body, cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('./bundle.txt')];
                case 1:
                    rs = _a.sent();
                    return [4 /*yield*/, rs.text()];
                case 2:
                    body = _a.sent();
                    return [4 /*yield*/, caches.open(VERSION)];
                case 3:
                    cache = _a.sent();
                    return [2 /*return*/, cache.addAll(body.trim().split('\n'))];
            }
        });
    });
}
function swActivate() {
    return __awaiter(this, void 0, void 0, function () {
        var keys, _i, keys_1, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, caches.keys()];
                case 1:
                    keys = _a.sent();
                    for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                        key = keys_1[_i];
                        if (key !== VERSION)
                            caches.delete(key);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function swFetch(e) {
    return __awaiter(this, void 0, void 0, function () {
        var networkFetch, cache, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    networkFetch = fetchFromNetworkAndCache(e);
                    return [4 /*yield*/, caches.open(VERSION)];
                case 1:
                    cache = _a.sent();
                    return [4 /*yield*/, cache.match(e.request)];
                case 2:
                    response = _a.sent();
                    if (response)
                        return [2 /*return*/, response];
                    return [2 /*return*/, networkFetch];
            }
        });
    });
}
function fetchFromNetworkAndCache(e) {
    return __awaiter(this, void 0, void 0, function () {
        var res, cache;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (new URL(e.request.url).origin !== location.origin) {
                        return [2 /*return*/, new Response(new Blob(), { "status": 404, "statusText": "Not found" })];
                    }
                    return [4 /*yield*/, fetch(e.request)];
                case 1:
                    res = _a.sent();
                    if (!res.url) {
                        // foreign requests will be res.type === 'opaque' and missing a url
                        return [2 /*return*/, res];
                    }
                    return [4 /*yield*/, caches.open(VERSION)];
                case 2:
                    cache = _a.sent();
                    // TODO: figure out if the content is new and therefore the page needs a reload.
                    cache.put(e.request, res.clone());
                    return [2 /*return*/, res];
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwrREFBK0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVEvRCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFFbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLENBQWtCLElBQUssT0FBQSxDQUFDLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQXhCLENBQXdCLENBQUMsQ0FBQztBQUNuRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBa0IsSUFBSyxPQUFBLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0FBQ3JGLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFrQixJQUFLLE9BQUEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0FBRWxGOzs7Ozt3QkFDYSxxQkFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUE7O3lCQUEzQixTQUEyQjtvQkFDekIscUJBQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFBOzsyQkFBZixTQUFlO29CQUNkLHFCQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUE7OzRCQUExQixTQUEwQjtvQkFDeEMsc0JBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUM7Ozs7Q0FDOUM7QUFFRDs7OEJBRVcsR0FBRzs7O3dCQURDLHFCQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBQTs7MkJBQW5CLFNBQW1CO29CQUNoQyxHQUFHLENBQUMsd0JBQVksa0JBQUksRUFBSixJQUFJOzt3QkFDbEIsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQzs0QkFDbEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDdEI7Ozs7O0NBQ0Y7QUFFRCxpQkFBdUIsQ0FBa0I7O1lBQ25DLFlBQVk7Ozs7bUNBQUcsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO29CQUNoQyxxQkFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFBOzs0QkFBMUIsU0FBMEI7b0JBQ3ZCLHFCQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFBOzsrQkFBNUIsU0FBNEI7b0JBQzdDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQzt3QkFDWCxNQUFNLGdCQUFDLFFBQVEsRUFBQztvQkFDbEIsc0JBQU8sWUFBWSxFQUFDOzs7O0NBQ3JCO0FBRUQsa0NBQXdDLENBQWtCOzs7Ozs7b0JBQ3hELEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUN0RCxNQUFNLGdCQUFDLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQ1YsRUFBQyxRQUFRLEVBQUcsR0FBRyxFQUFFLFlBQVksRUFBRyxXQUFXLEVBQUMsQ0FBQyxFQUFDO29CQUNwRSxDQUFDO29CQUVXLHFCQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUE7OzBCQUF0QixTQUFzQjtvQkFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDYixtRUFBbUU7d0JBQ25FLE1BQU0sZ0JBQUMsR0FBRyxFQUFDO29CQUNiLENBQUM7b0JBRWEscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQTs7NEJBQTFCLFNBQTBCO29CQUN4QyxnRkFBZ0Y7b0JBQ2hGLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDbEMsc0JBQU8sR0FBRyxFQUFDOzs7O0NBQ1oifQ==