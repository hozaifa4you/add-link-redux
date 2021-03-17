// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script/createStore.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var createStore = function createStore(reducer, init) {
  var store = {};
  store.state = init;
  store.listeners = [];

  store.getState = function () {
    return store.state;
  };

  store.subscribe = function (listener) {
    return store.listeners.push(listener);
  };

  store.dispatch = function (action) {
    store.state = reducer(store.state, action);
    store.listeners.forEach(function (listener) {
      return listener();
    });
  };

  return store;
};

var _default = createStore;
exports.default = _default;
},{}],"script/reducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var init = [{
  url: "https://facebook.com/yousuf4you",
  name: "facebook.com",
  isFav: false,
  id: "ids"
}];

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : init;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case "ADD_BOOKMARK":
      {
        return state.concat(action.payload);
      }

    case "REMOVE_BOOKMARK":
      {
        return state.filter(function (bookmark) {
          return bookmark.id !== action.payload;
        });
      }

    case "TOGGLE_FAVORITE":
      {
        return state.map(function (bookmark) {
          if (bookmark.id === action.payload) {
            bookmark.isFav = !bookmark.isFav;
          }

          return bookmark;
        });
      }

    default:
      return state;
  }
};

var _default = reducer;
exports.default = _default;
},{}],"script/createListItem.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = require("./app");

var createListItem = function createListItem(bookmark) {
  var li = document.createElement("li");
  li.className = "list-group-item d-flex"; // li.style.justifyContent = "space-between";

  var img = document.createElement("img");
  img.src = "//logo.clearbit.com/".concat(bookmark.name);
  img.alt = bookmark.name;
  img.className = "avatar";
  var text = document.createElement("p");
  text.className = "lead ml-4";
  text.innerHTML = bookmark.name;
  text.style.cursor = "pointer";

  text.onclick = function () {
    window.open(bookmark.url, "_blank");
  };

  var icons = document.createElement("div"); // icons.className = "ml-auto";

  icons.style.marginLeft = "auto";
  var fav = document.createElement("span");
  var i = document.createElement("i");
  i.className = "".concat(bookmark.isFav ? "fas" : "far", " fa-heart");
  fav.appendChild(i);

  fav.onclick = function () {
    _app.store.dispatch({
      type: "TOGGLE_FAVORITE",
      payload: bookmark.id
    });
  };

  var remove = document.createElement("span");
  remove.innerHTML = "<i class=\"fas fa-trash\"></i>";
  remove.className = "mx-3";

  remove.onclick = function () {
    _app.store.dispatch({
      type: "REMOVE_BOOKMARK",
      payload: bookmark.id
    });
  };

  icons.append(fav, remove);
  li.append(img, text, icons);
  return li;
};

var _default = createListItem;
exports.default = _default;
},{"./app":"script/app.js"}],"script/app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;

var _createStore = _interopRequireDefault(require("./createStore"));

var _reducer = _interopRequireDefault(require("./reducer"));

var _createListItem = _interopRequireDefault(require("./createListItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _createStore.default)(_reducer.default);
exports.store = store;
store.subscribe(function () {
  return console.log(store.getState());
});

window.onload = function () {
  var urlInput = document.getElementById("url-input");
  var favoriteList = document.getElementById("favorite-list");
  var bookmarkList = document.getElementById("bookmark-list");

  urlInput.onkeypress = function (eeee) {
    if (eeee.key === "Enter") {
      var url = eeee.target.value;
      var name = nameFromUrl(url)[1];
      var isFav = false;
      var id = UUID();
      store.dispatch({
        type: "ADD_BOOKMARK",
        payload: {
          url: url,
          name: name,
          isFav: isFav,
          id: id
        }
      });
      eeee.target.value = "";
    }
  }; // subscribe for all bookmark list


  store.subscribe(function () {
    bookmarkList.innerHTML = null;
    store.getState().forEach(function (bookmark) {
      var li = (0, _createListItem.default)(bookmark);
      bookmarkList.appendChild(li);
    });
  }); // subscribe for all favorite list

  store.subscribe(function () {
    favoriteList.innerHTML = null;
    store.getState().forEach(function (bookmark) {
      if (bookmark.isFav) {
        var li = (0, _createListItem.default)(bookmark);
        favoriteList.appendChild(li);
      }
    });
  });
};

function nameFromUrl(url) {
  return url.match(/:\/\/(.[^/]+)/);
}

function UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}
},{"./createStore":"script/createStore.js","./reducer":"script/reducer.js","./createListItem":"script/createListItem.js"}],"../../../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64378" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Local/Yarn/Data/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script/app.js"], null)
//# sourceMappingURL=/app.25d4b319.js.map