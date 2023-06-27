/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9662:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ 9670:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(111);

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ 1318:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(5656);
var toAbsoluteIndex = __webpack_require__(1400);
var lengthOfArrayLike = __webpack_require__(6244);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ 3658:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(9781);
var isArray = __webpack_require__(3157);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Safari < 13 does not throw an error in this case
var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS && !function () {
  // makes no sense without proper strict mode support
  if (this !== undefined) return true;
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).length = 1;
  } catch (error) {
    return error instanceof TypeError;
  }
}();

module.exports = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
  if (isArray(O) && !getOwnPropertyDescriptor(O, 'length').writable) {
    throw $TypeError('Cannot set read only .length');
  } return O.length = length;
} : function (O, length) {
  return O.length = length;
};


/***/ }),

/***/ 4326:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ 9920:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var ownKeys = __webpack_require__(3887);
var getOwnPropertyDescriptorModule = __webpack_require__(1236);
var definePropertyModule = __webpack_require__(3070);

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ 8880:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var definePropertyModule = __webpack_require__(3070);
var createPropertyDescriptor = __webpack_require__(9114);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 9114:
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 8052:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var definePropertyModule = __webpack_require__(3070);
var makeBuiltIn = __webpack_require__(6339);
var defineGlobalProperty = __webpack_require__(3072);

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ 3072:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ 9781:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),

/***/ 4154:
/***/ (function(module) {

var documentAll = typeof document == 'object' && document.all;

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

module.exports = {
  all: documentAll,
  IS_HTMLDDA: IS_HTMLDDA
};


/***/ }),

/***/ 317:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ 7207:
/***/ (function(module) {

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ 8113:
/***/ (function(module) {

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ 7392:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var userAgent = __webpack_require__(8113);

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ 748:
/***/ (function(module) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ 2109:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var getOwnPropertyDescriptor = (__webpack_require__(1236).f);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineGlobalProperty = __webpack_require__(3072);
var copyConstructorProperties = __webpack_require__(9920);
var isForced = __webpack_require__(4705);

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ 7293:
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ 4374:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ 6916:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ 6530:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var hasOwn = __webpack_require__(2597);

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ 1702:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_BIND = __webpack_require__(4374);

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ 5005:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ 8173:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var aCallable = __webpack_require__(9662);
var isNullOrUndefined = __webpack_require__(8554);

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ 7854:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ 2597:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var toObject = __webpack_require__(7908);

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ 3501:
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ 4664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);
var createElement = __webpack_require__(317);

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),

/***/ 8361:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var classof = __webpack_require__(4326);

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ 2788:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var isCallable = __webpack_require__(614);
var store = __webpack_require__(5465);

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ 9909:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(4811);
var global = __webpack_require__(7854);
var isObject = __webpack_require__(111);
var createNonEnumerableProperty = __webpack_require__(8880);
var hasOwn = __webpack_require__(2597);
var shared = __webpack_require__(5465);
var sharedKey = __webpack_require__(6200);
var hiddenKeys = __webpack_require__(3501);

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ 3157:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(4326);

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) == 'Array';
};


/***/ }),

/***/ 614:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
module.exports = $documentAll.IS_HTMLDDA ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ 4705:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ 8554:
/***/ (function(module) {

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ 111:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var $documentAll = __webpack_require__(4154);

var documentAll = $documentAll.all;

module.exports = $documentAll.IS_HTMLDDA ? function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll;
} : function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ 1913:
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ 2190:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var isCallable = __webpack_require__(614);
var isPrototypeOf = __webpack_require__(7976);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ 6244:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toLength = __webpack_require__(7466);

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ 6339:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var fails = __webpack_require__(7293);
var isCallable = __webpack_require__(614);
var hasOwn = __webpack_require__(2597);
var DESCRIPTORS = __webpack_require__(9781);
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(6530).CONFIGURABLE);
var inspectSource = __webpack_require__(2788);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ 4758:
/***/ (function(module) {

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ 3070:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var IE8_DOM_DEFINE = __webpack_require__(4664);
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(3353);
var anObject = __webpack_require__(9670);
var toPropertyKey = __webpack_require__(4948);

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 1236:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var call = __webpack_require__(6916);
var propertyIsEnumerableModule = __webpack_require__(5296);
var createPropertyDescriptor = __webpack_require__(9114);
var toIndexedObject = __webpack_require__(5656);
var toPropertyKey = __webpack_require__(4948);
var hasOwn = __webpack_require__(2597);
var IE8_DOM_DEFINE = __webpack_require__(4664);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ 8006:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(6324);
var enumBugKeys = __webpack_require__(748);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ 5181:
/***/ (function(__unused_webpack_module, exports) {

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 7976:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ 6324:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var hasOwn = __webpack_require__(2597);
var toIndexedObject = __webpack_require__(5656);
var indexOf = (__webpack_require__(1318).indexOf);
var hiddenKeys = __webpack_require__(3501);

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ 5296:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ 2140:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 3887:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(5005);
var uncurryThis = __webpack_require__(1702);
var getOwnPropertyNamesModule = __webpack_require__(8006);
var getOwnPropertySymbolsModule = __webpack_require__(5181);
var anObject = __webpack_require__(9670);

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ 4488:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isNullOrUndefined = __webpack_require__(8554);

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ 6200:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(2309);
var uid = __webpack_require__(9711);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ 5465:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var defineGlobalProperty = __webpack_require__(3072);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || defineGlobalProperty(SHARED, {});

module.exports = store;


/***/ }),

/***/ 2309:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var IS_PURE = __webpack_require__(1913);
var store = __webpack_require__(5465);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.29.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.29.1/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ 6293:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(7392);
var fails = __webpack_require__(7293);

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ 1400:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ 5656:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(8361);
var requireObjectCoercible = __webpack_require__(4488);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ 9303:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var trunc = __webpack_require__(4758);

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ 7466:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toIntegerOrInfinity = __webpack_require__(9303);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ 7908:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(4488);

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ 7593:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var call = __webpack_require__(6916);
var isObject = __webpack_require__(111);
var isSymbol = __webpack_require__(2190);
var getMethod = __webpack_require__(8173);
var ordinaryToPrimitive = __webpack_require__(2140);
var wellKnownSymbol = __webpack_require__(5112);

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ 4948:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(7593);
var isSymbol = __webpack_require__(2190);

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ 6330:
/***/ (function(module) {

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ 9711:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ 3307:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(6293);

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ 3353:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(9781);
var fails = __webpack_require__(7293);

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype != 42;
});


/***/ }),

/***/ 4811:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ 5112:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(7854);
var shared = __webpack_require__(2309);
var hasOwn = __webpack_require__(2597);
var uid = __webpack_require__(9711);
var NATIVE_SYMBOL = __webpack_require__(6293);
var USE_SYMBOL_AS_UID = __webpack_require__(3307);

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ 7658:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var setArrayLength = __webpack_require__(3658);
var doesNotExceedSafeInteger = __webpack_require__(7207);
var fails = __webpack_require__(7293);

var INCORRECT_TO_LENGTH = fails(function () {
  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
});

// V8 and Safari <= 15.4, FF < 23 throws InternalError
// https://bugs.chromium.org/p/v8/issues/detail?id=12681
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).push();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_TO_LENGTH || !properErrorOnNonWritableLength();

// `Array.prototype.push` method
// https://tc39.es/ecma262/#sec-array.prototype.push
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  push: function push(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    doesNotExceedSafeInteger(len + argCount);
    for (var i = 0; i < argCount; i++) {
      O[len] = arguments[i];
      len++;
    }
    setArrayLength(O, len);
    return len;
  }
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

;// CONCATENATED MODULE: ../../osh-js/source/core/Constants.js
const DATA_SYNCHRONIZER_TOPIC = 'data-synchronizer-';
const TIME_SYNCHRONIZER_TOPIC = 'data-synchronizer-time-';
const DATASOURCE_DATA_TOPIC = 'datasource-data-';
const DATASOURCE_TIME_TOPIC = 'datasource-time-';
const FFMPEG_VIEW_DECODE_TOPIC = 'ffmpeg-decode-';
const MAGIC_END_PACKET = 'magic-packet';
;// CONCATENATED MODULE: ../../osh-js/source/core/event/EventType.js
const EventType = {
  DATA: 'data',
  LAST_TIME: 'last-time',
  MASTER_TIME: 'master-time',
  STATUS: 'status',
  TIME_CHANGED: 'time-changed',
  CLOSED: 'closed'
};
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(7658);
;// CONCATENATED MODULE: ../../osh-js/source/core/utils/Utils.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2020 Mathieu Dhainaut. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

/** * @module Utils */

/** Maximum value of a long */
const MAX_LONG = Math.pow(2, 53) + 1;

/**
 * Global helper method to test if a letiable or object attribute is defined
 */
function isDefined(v) {
  return typeof v !== 'undefined' && v !== null;
}

/**
 Global helper method to test if a letiable or object attribute has a value,
 that is it is defined and non null
 */
function hasValue(v) {
  return isDefined(v) && v !== null;
}

/**
 Global helper method to transform hex color into RGB
 */
function hex2rgb(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return [r, g, b];
}
function hex2rgba(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), parseInt(hex.slice(7, 9), 16) / 255];
}

/**
 Global helper method to test if a letiable or object attribute is of a particular type
 */
function hasType(v, expectedType) {
  let hasVal = hasValue(v);
  return hasVal && typeof v === expectedType;
}

/**
 Global helper method to test if a letiable or object attribute is an object
 */
function isObject(v, letName) {
  return hasType(v, 'object', letName);
}

/**
 Global helper method to test if a letiable or object attribute is an array
 */
function isArray(v) {
  return isDefined(v) && Array.isArray(v);
}

/**
 Global helper method to test if a letiable or object attribute is a function
 */
function isFunction(v, letName) {
  return hasType(v, 'function', letName);
}

/**
 Assert that a letiable or object attribute is defined
 **/
function assertDefined(v, letName = 'letiable') {
  if (!isDefined(v)) {
    throw letName + " must be defined";
  }
  return v;
}
function assertTrue(v, letName = 'letiable') {
  if (!isDefined(v) || !v) {
    throw letName;
  }
  return v;
}
/**
 Assert that a letiable or object attribute is defined and non-null
 **/
function assertType(v, expectedType, letName = 'letiable') {
  assertDefined(v, letName);
  if (typeof v !== expectedType) {
    throw letName + " must be of type " + expectedType;
  }
  return v;
}

/**
 Assert that a letiable or object attribute is a string
 **/
function assertBoolean(v, letName) {
  return assertType(v, 'boolean', letName);
}

/**
 Assert that a letiable or object attribute is a string
 **/
function assertString(v, letName) {
  return assertType(v, 'string', letName);
}

/**
 Assert that a letiable or object attribute is a number
 **/
function assertNumber(v, letName) {
  return assertType(v, 'number', letName);
}

/**
 Assert that a letiable or object attribute is a number
 **/
function assertPositive(v, letName) {
  assertNumber(v, letName);
  if (v <= 0) {
    throw letName + " must be a positive number";
  }
}

/**
 Assert that a letiable or object attribute is an object
 **/
function assertObject(v, letName) {
  return assertType(v, 'object', letName);
}

/**
 Assert that a letiable or object attribute is an object
 **/
function assertArray(v, letName = 'letiable') {
  assertDefined(v, letName);
  if (!Array.isArray(v)) {
    throw letName + " must be an array";
  }
  return v;
}

/**
 Assert that a letiable or object attribute is a function
 **/
function assertFunction(v, letName) {
  return assertType(v, 'function', letName);
}

/**
 Assert that a letiable or object attribute is defined and non-null
 **/
function assertHasValue(v, letName = 'letiable') {
  assertDefined(v, letName);
  if (!hasValue(v)) {
    throw letName + " must not be null";
  }
  return v;
}

/**
 *
 * @return {String}
 */
function randomUUID() {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0,
      v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

/**
 * This function stamps/embeds a UUID into an object and returns the UUID generated for it
 * @return {String}
 */
function stampUUID(obj) {
  obj._osh_id = obj._osh_id || randomUUID();
  return obj._osh_id;
}

//buffer is an ArrayBuffer object, the offset if specified in bytes, and the type is a string
//corresponding to an OGC data type.
//See http://def.seegrid.csiro.au/sissvoc/ogc-def/resource?uri=http://www.opengis.net/def/dataType/OGC/0/
/**
 *
 * @param buffer
 * @param offset
 * @param type
 * @return {*}
 */
function ParseBytes(buffer, offset, type) {
  let view = new DataView(buffer);

  //Note: There exist types not listed in the map below that have OGC definitions, but no appropriate
  //methods or corresponding types available for parsing in javascript. They are float128, float16, signedLong,
  //and unsignedLong
  let typeMap = {
    double: function (offset) {
      return {
        val: view.getFloat64(offset),
        bytes: 8
      };
    },
    float64: function (offset) {
      return {
        val: view.getFloat64(offset),
        bytes: 8
      };
    },
    float32: function (offset) {
      return {
        val: view.getFloat32(offset),
        bytes: 4
      };
    },
    signedByte: function (offset) {
      return {
        val: view.getInt8(offset),
        bytes: 1
      };
    },
    signedInt: function (offset) {
      return {
        val: view.getInt32(offset),
        bytes: 4
      };
    },
    signedShort: function (offset) {
      return {
        val: view.getInt16(offset),
        bytes: 2
      };
    },
    unsignedByte: function (offset) {
      return {
        val: view.getUint8(offset),
        bytes: 1
      };
    },
    unsignedInt: function (offset) {
      return {
        val: view.getUint32(offset),
        bytes: 4
      };
    },
    unsignedShort: function (offset) {
      return {
        val: view.getUint16(offset),
        bytes: 2
      };
    }
    //TODO: string-utf-8:
  };

  return typeMap[type](offset);
}

//This function recursivley iterates over the resultStructure to fill in
//values read from data which should be an ArrayBuffer containing the payload from a websocket
/**
 *
 * @param struct
 * @param data
 * @param offsetBytes
 * @return {*}
 */
function ReadData(struct, data, offsetBytes) {
  let offset = offsetBytes;
  for (let i = 0; i < struct.fields.length; i++) {
    let currFieldStruct = struct.fields[i];
    if (isDefined(currFieldStruct.type) && currFieldStruct.type !== null) {
      let ret = ParseBytes(data, offset, currFieldStruct.type);
      currFieldStruct.val = ret.val;
      offset += ret.bytes;
    } else if (isDefined(currFieldStruct.count) && currFieldStruct.count !== null) {
      //check if count is a reference to another letiable
      if (isNaN(currFieldStruct.count)) {
        let id = currFieldStruct.count;
        let fieldName = struct.id2FieldMap[id];
        currFieldStruct.count = struct.findFieldByName(fieldName).val;
      }
      for (let c = 0; c < currFieldStruct.count; c++) {
        for (let j = 0; j < currFieldStruct.fields.length; j++) {
          let field = JSON.parse(JSON.stringify(currFieldStruct.fields[j]));
          offset = ReadData(field, data, offset);
          currFieldStruct.val.push(field);
        }
      }
    }
  }
  return offset;
}

/**
 *
 * @param resultStructure
 * @return {{}}
 */
function GetResultObject(resultStructure) {
  //TODO: handle cases for nested arrays / matrix data types
  let result = {};
  for (let i = 0; i < resultStructure.fields.length; i++) {
    if (isDefined(resultStructure.fields[i].count)) {
      result[resultStructure.fields[i].name] = [];
      for (let c = 0; c < resultStructure.fields[i].count; c++) {
        let item = {};
        for (let k = 0; k < resultStructure.fields[i].val[c].fields.length; k++) {
          item[resultStructure.fields[i].val[c].fields[k].name] = resultStructure.fields[i].val[c].fields[k].val;
        }
        result[resultStructure.fields[i].name].push(item);
      }
    } else {
      result[resultStructure.fields[i].name] = resultStructure.fields[i].val;
    }
  }
  return result;
}

/**
 *
 * @return {boolean}
 */
function isOpera() {
  return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
}

/**
 *
 * @return {boolean}
 */
function isFirefox() {
  return typeof InstallTrigger !== 'undefined';
}

/**
 *
 * @return {boolean}
 */
function isSafari() {
  return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
}

/**
 *
 * @return {boolean}
 */
function isChrome() {
  return !!window.chrome && !!window.chrome.webstore;
}

/**
 *
 * @return {*|boolean}
 */
function isBlink() {
  return (isChrome || isOpera) && !!window.CSS;
}

/**
 *
 * @param a
 * @param b
 * @return {boolean}
 */
function isArrayIntersect(a, b) {
  return a.filter(function (element) {
    return b.indexOf(element) > -1;
  }).length > 0;
}

/**
 *
 * @param o
 * @return {boolean}
 */
function isElement(o) {
  return typeof HTMLElement === "object" ? o instanceof HTMLElement :
  //DOM2
  o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string";
}

/**
 *
 * @return {*}
 */
function isWebWorker() {
  return isDefined(Worker);
}

/**
 *
 * @param div
 */
function takeScreenShot(div) {}

/**
 * Remove a css class from a the div given as argument.
 * @param div the div to remove the class from
 * @param css the css class to remove
 */
function removeCss(div, css) {
  let divCss = div.className;
  css = divCss.replace(css, "");
  div.className = css;
}

/**
 * Add a css class to a the div given as argument.
 * @param div the div to add the class to
 * @param css the css class to add
 */
function addCss(div, css) {
  div.setAttribute("class", div.className + " " + css);
}

/**
 * Removes the last character of a {string} object.
 * @param {string} value - The input {string}
 * @return {string} The value without the last character
 */
function removeLastCharIfExist(value) {
  if (!isDefined(undefined) || value === null || value.length === 0 || !value.endsWith("/")) {
    return value;
  }
  return value.substring(0, value.length - 1);
}

/**
 * Capitalize the first letter of a given string
 * @param {String} str - the input string
 * @returns {String} the result
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Round off number to nearest 0.5
 * @param {Number} num - The number to round off
 * @return {number} The rounded number
 */
function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

/**
 * Returns a function that, as long as it continues to be invoked,
 * will not be executed. The function will only be executed when
 * it will stop being called for more than N milliseconds.
 * If the `immediate` parameter is true, then the function
 * will be executed at the first call instead of the last.
 * Parameters :
 * - func: the function to `debouncer`.
 * - wait: the number of milliseconds (N) to wait before
 * call func()
 * - immediate (optional): Call func() at the first invocation
 * instead of the last one (Default false)
 * - context (optional): the context in which to call func()
 * (this by default)
 */

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  var later = function () {
    var now = new Date().getTime(),
      last = now - timestamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  };
}
;
function throttle(func, wait, leading, trailing, context) {
  var ctx, args, result;
  var timeout = null;
  var previous = 0;
  var later = function () {
    previous = new Date();
    timeout = null;
    result = func.apply(ctx, args);
  };
  return function () {
    var now = new Date();
    if (!previous && !leading) previous = now;
    var remaining = wait - (now - previous);
    ctx = context || this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(ctx, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}
;
function merge(target, source) {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) Object.assign(source[key], merge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
}
;
function rgbaToArray(str) {
  let startIdxValue = str.indexOf('(') + 1;
  let endIdxValue = str.indexOf(')');
  let values = str.substr(startIdxValue, endIdxValue - startIdxValue);
  return values.split(',').map(Number);
}
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/Status.js
/**
 * Enum for connection status.
 * @readonly
 * @enum {{name: string}}
 */
const Status = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  FETCH_STARTED: 'fetch-start',
  FETCH_ENDED: 'fetch-end',
  CLOSED: "closed",
  CLOSED_ERROR: "closed-error"
};
;// CONCATENATED MODULE: ../../osh-js/source/core/timesync/DataSynchronizerAlgo.js


class DataSynchronizerAlgo {
  constructor(dataSources, timerResolution = 5) {
    this.dataSourceMap = {};
    this.tsRun = undefined;
    this.timerResolution = timerResolution;
    this.interval = null;
    this.datasources = [];
    for (let ds of dataSources) {
      this.addDataSource(ds);
    }
  }
  removeDataSource(dataSourceId) {
    this.datasources = this.datasources.filter(elt => elt.id !== dataSourceId);
    delete this.dataSourceMap[dataSourceId];
  }
  push(dataSourceId, dataBlocks) {}
  getCurrentTimestamp() {
    return this.tsRun;
  }
  processData() {
    let tsRef = -1;
    let clockTimeRef = performance.now();

    // get reference start timestamp
    // the reference start timestamp should the oldest one
    let currentDs;
    for (let currentDsId in this.dataSourceMap) {
      currentDs = this.dataSourceMap[currentDsId];
      if (currentDs.dataBuffer.length > 0) {
        tsRef = tsRef === -1 || currentDs.dataBuffer[0].data.timestamp < tsRef ? currentDs.dataBuffer[0].data.timestamp : tsRef;
      }
    }
    this.interval = setInterval(() => {
      // 1) return the oldest data if any
      while (this.computeNextData(tsRef, clockTimeRef));
    }, this.timerResolution);
    console.warn(`Started Algorithm ${this.constructor.name} with  tsRef=${new Date(tsRef).toISOString()}`);
  }

  /**
   * Compute the next data if any. We return only 1 value for this iteration. If there are multiple values to return,
   * we return only the oldest one.
   * @param tsRef - the timestamp of the first data
   * @param refClockTime - the absolute diff time really spent
   */
  computeNextData(tsRef, refClockTime) {
    throw Error('Should be overridden');
  }

  /**
   * Add dataSource to be synchronized
   * @param {Datasource} dataSource - the dataSource to synchronize
   */
  addDataSource(dataSource) {
    throw Error('Should be overridden');
  }
  checkVersion(datasource, dataBlock) {
    throw Error('Should be overridden');
  }
  onData(dataSourceId, dataBlock) {}
  checkStart() {}

  /**
   * Change the dataSource status
   * @param {Status} status - the new status
   * @param {String} dataSourceId - the corresponding dataSource id
   */
  setStatus(dataSourceId, status) {
    throw Error('Should be overridden');
  }
  close() {
    if (isDefined(this.interval)) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    console.log("Data synchronizer terminated successfully");
    this.onClose();
  }
  onStart() {}
  onClose() {}
}
/* harmony default export */ var timesync_DataSynchronizerAlgo = (DataSynchronizerAlgo);
;// CONCATENATED MODULE: ../../osh-js/source/core/timesync/replay/DataSynchronizerAlgo.replay.js




class DataSynchronizerAlgoReplay extends timesync_DataSynchronizerAlgo {
  constructor(dataSources, replaySpeed = 1, startTimestamp, endTimestamp, timerResolution = 5, version) {
    super(dataSources, replaySpeed, timerResolution);
    this.replaySpeed = replaySpeed;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
    this.version = version;
  }
  push(dataSourceId, dataBlocks) {
    if (dataBlocks.length === 0) {
      return;
    }
    if (dataSourceId in this.dataSourceMap) {
      const ds = this.dataSourceMap[dataSourceId];
      const lastData = dataBlocks[dataBlocks.length - 1];
      if (!this.checkVersion(lastData)) {
        console.warn(`[DataSynchronizer] incompatible version ${lastData.version} ~ ${this.version}, skipping data`);
        return;
      }
      ds.dataBuffer.push(...dataBlocks);
    }
  }
  processData() {
    this.clockTimeRef = performance.now();
    this.interval = setInterval(() => {
      // 1) return the oldest data if any
      while (this.computeNextData(this.startTimestamp, this.clockTimeRef)) {
        this.checkEnd();
      }
      this.checkEnd();
    }, this.timerResolution);
    console.warn(`Started Replay Algorithm with tsRef=${new Date(this.startTimestamp).toISOString()}`);
  }

  /**
   * Compute the next data if any. We return only 1 value for this iteration. If there are multiple values to return,
   * we return only the oldest one.
   * @param tsRef - the timestamp of the first data
   * @param refClockTime - the absolute diff time really spent
   */
  computeNextData(tsRef, refClockTime) {
    try {
      let currentDs;
      let currentDsToShift = null;
      const dClock = (performance.now() - refClockTime) * this.replaySpeed;
      let tsRun = tsRef + dClock;
      let computeNext = false;
      // compute next data to return
      for (let currentDsId in this.dataSourceMap) {
        currentDs = this.dataSourceMap[currentDsId];
        if (currentDs.skip) {
          // if datasource is in current range
          if (tsRun > currentDs.minTimestamp && tsRun < currentDs.maxTimestamp) {
            currentDs.skip = false;
          }
        }
        // skip DatSource if out of time range
        if (currentDs.skip) continue;
        if (currentDs.dataBuffer.length > 0) {
          const dTs = currentDs.dataBuffer[0].data.timestamp - tsRef;
          // we use an intermediate object to store the data to shift because we want to return the oldest one
          // only
          if (dTs <= dClock) {
            // no other one to compare
            if (currentDsToShift === null) {
              currentDsToShift = currentDs;
            } else {
              // take the oldest data
              currentDsToShift = currentDsToShift.dataBuffer[0].data.timestamp < currentDs.dataBuffer[0].data.timestamp ? currentDsToShift : currentDs;
            }
          }
        }
      }

      // finally pop the data from DS queue
      if (currentDsToShift !== null) {
        if (currentDsToShift.id in this.dataSourceMap) {
          this.onData(currentDsToShift.id, currentDsToShift.dataBuffer.shift());
        }
        computeNext = true;
      }
      this.tsRun = tsRun;
      return computeNext;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  }

  /**
   * Add dataSource to be synchronized
   * @param {Datasource} dataSource - the dataSource to synchronize
   */
  addDataSource(dataSource) {
    this.dataSourceMap[dataSource.id] = {
      dataBuffer: [],
      id: dataSource.id,
      name: dataSource.name || dataSource.id,
      status: Status.DISCONNECTED,
      //MEANING Enabled, 0 = Disabled
      minTimestamp: dataSource.minTimestamp,
      maxTimestamp: dataSource.maxTimestamp,
      skip: false
    };
    if (dataSource.maxTimestamp < this.getCurrentTimestamp() || dataSource.minTimestamp > this.getCurrentTimestamp()) {
      this.dataSourceMap[dataSource.id].skip = true;
      console.warn(`Skipping new added dataSource ${dataSource.id} because timeRange of the dataSource is not intersecting the synchronizer one`);
    }
    this.datasources.push(dataSource);
  }
  checkVersion(dataBlock) {
    return dataBlock.version === this.version;
  }

  /**
   * Change the dataSource status
   * @param {Status} status - the new status
   * @param {String} dataSourceId - the corresponding dataSource id
   */
  setStatus(dataSourceId, status) {
    if (dataSourceId in this.dataSourceMap) {
      this.dataSourceMap[dataSourceId].status = status;
      console.warn(status + ' DataSource ' + dataSourceId + ' from the synchronizer ');
    }
    this.checkStart();
  }
  checkStart() {
    if (!isDefined(this.interval)) {
      let nbSkip = 0;
      let nbFetch = 0;
      let totalDataSources = Object.keys(this.dataSourceMap).length;
      if (totalDataSources === 0) {
        return;
      }
      let dataSource;
      for (let dataSourceID in this.dataSourceMap) {
        dataSource = this.dataSourceMap[dataSourceID];
        dataSource.skip = this.startTimestamp < dataSource.minTimestamp || this.startTimestamp > dataSource.maxTimestamp;
        if (dataSource.status === Status.FETCH_STARTED) {
          nbFetch++;
        } else if (dataSource.skip) {
          nbSkip++;
        }
      }
      console.warn(`[Synchronizer] Fetched ${nbFetch}/${totalDataSources} datasources`);
      console.warn(`[Synchronizer] Skipped ${nbSkip}/${totalDataSources} datasources`);
      if (nbFetch + nbSkip === totalDataSources) {
        console.warn('Starting Replay Algorithm...');
        this.processData();
        this.onStart();
      }
    }
  }
  checkEnd() {
    if (this.getCurrentTimestamp() > this.endTimestamp) {
      this.onEnd();
      this.reset();
    }
  }
  reset() {
    console.log('reset synchronizer algo');
    this.close();
    for (let currentDsId in this.dataSourceMap) {
      this.resetDataSource(currentDsId);
    }
    this.tsRun = undefined;
  }
  resetDataSource(datasourceId) {
    const currentDs = this.dataSourceMap[datasourceId];
    currentDs.dataBuffer = [];
    currentDs.status = Status.DISCONNECTED;
    currentDs.version = undefined;
    currentDs.skip = false;
  }
  removeDataSource(dataSourceId) {
    super.removeDataSource(dataSourceId);
    // looking for next start Timestamp
    let currentTimestamp = this.getCurrentTimestamp();
    let min, ds;
    for (let dsKey in this.dataSourceMap) {
      ds = this.dataSourceMap[dsKey];
      if (currentTimestamp >= ds.minTimestamp && currentTimestamp <= ds.maxTimestamp) {
        // continue because this datasource is in the current range
        return;
      } else {
        // otherwise
        // looking for next range and reset algo
        if (!min) {
          min = ds.minTimestamp;
        } else if (ds.minTimestamp < min) {
          min = ds.minTimestamp;
        }
      }
    }
  }
  setEndTimestamp(maxTimestamp) {
    this.endTimestamp = maxTimestamp;
  }
  setTimeRange(startTimestamp, endTimestamp, replaySped) {
    this.replaySpeed = replaySped;
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;
    this.clockTimeRef = performance.now();
    this.reset();
    this.checkStart();
  }
  onEnd() {}
  onStart() {}
}
/* harmony default export */ var DataSynchronizerAlgo_replay = (DataSynchronizerAlgoReplay);
;// CONCATENATED MODULE: ../../osh-js/source/core/timesync/replay/DataSynchronizer.replay.worker.js





const bcChannels = {};
let dataSynchronizerAlgo;

let init = false;
let dataSynchronizerBroadCastChannel = null;
let lastData = undefined;
const dataSources = {};
let timeBroadcastChannel = null;
let topicTime;
let topicData;
let replaySpeed;
let masterTimeInterval = undefined;
let cTime;
let cId;
let lastTime = -1;
let version = -1;
let promise;
let masterTimeRefreshRate;
let startTimestamp;
let endTimestamp;
let timerResolution;

self.onmessage = async (event) => {
    handleMessage(event);
}

async function handleMessage(event) {
    let resp = {};
    if (event.data.ackId) {
        resp.ackId = event.data.ackId;
    }

    let data = undefined;
    try {
        if (event.data.message === 'init') {
            replaySpeed = event.data.replaySpeed;
            startTimestamp = event.data.startTimestamp;
            endTimestamp = event.data.endTimestamp;
            version = event.data.version;
            timerResolution = event.data.timerResolution;

            dataSynchronizerAlgo = new DataSynchronizerAlgo_replay(
                event.data.dataSources,
                replaySpeed,
                startTimestamp,
                endTimestamp,
                event.data.timerResolution,
                version
            );
            dataSynchronizerAlgo.onClose = onClose;
            dataSynchronizerAlgo.onData = onData;
            init = true;
            addDataSources(event.data.dataSources);
            topicData = event.data.topics.data;
            topicTime = event.data.topics.time;
            initBroadcastChannel(topicData, topicTime);
            masterTimeRefreshRate = event.data.masterTimeRefreshRate;
        } else if (event.data.message === 'add' && event.data.dataSources) {
            console.log('Add datasource to synchronizer..')
            addDataSources(event.data.dataSources);
        } else if (event.data.message === 'connect') {
            startMasterTimeInterval(masterTimeRefreshRate);
            dataSynchronizerAlgo.checkStart();
            version = event.data.version;
        } else if (event.data.message === 'is-connected') {
            data = isDefined(masterTimeInterval) && isDefined(dataSynchronizerAlgo) && isDefined(dataSynchronizerAlgo.interval);
        } else if (event.data.message === 'remove') {
            console.log('Remove datasource from synchronizer algorithm..')
            await removeDataSources(event.data.dataSourceIds);
            if (dataSynchronizerAlgo instanceof DataSynchronizerAlgo_replay) {
                dataSynchronizerAlgo.endTimestamp = event.data.endTimestamp;
            }
        } else if (event.data.message === 'current-time') {
            data = dataSynchronizerAlgo.getCurrentTimestamp();
        } else if (event.data.message === 'reset') {
            DataSynchronizer_replay_worker_reset();
        } else if (event.data.message === 'replay-speed') {
            if (dataSynchronizerAlgo !== null) {
                DataSynchronizer_replay_worker_reset();
                dataSynchronizerAlgo.replaySpeed = event.data.replaySpeed;
            }
        } else if (event.data.message === 'set-max-time') {
            dataSynchronizerAlgo.setEndTimestamp(event.data.maxTimestamp);
        } else if (event.data.message === 'time-range') {
            setTimeRange(
                event.data.startTimestamp,
                event.data.endTimestamp,
                event.data.mode,
                event.data.replaySpeed,
                event.data.version,
                event.data.dataSources
            )
        } else if (event.data.message === 'data') {
            checkMasterTime();
            if (dataSynchronizerAlgo !== null) {
                dataSynchronizerAlgo.push(event.data.dataSourceId, event.data.data);
            }
        }
    } catch (ex) {
        console.error(ex);
        resp.error = ex;
    } finally {
        resp.data = data;
        self.postMessage(resp);
    }
}
function setTimeRange(startTimestamp, endTimestamp, mode, replaySpeed, newVersion, dsArray) {
    DataSynchronizer_replay_worker_reset();
    version = newVersion;

    dataSynchronizerAlgo = new DataSynchronizerAlgo_replay(
        dsArray,
        replaySpeed,
        startTimestamp,
        endTimestamp,
        timerResolution,
        version
    );
    dataSynchronizerAlgo.onEnd = onEnd;
    dataSynchronizerAlgo.onStart = onStart;
    dataSynchronizerAlgo.onClose = onClose;
    dataSynchronizerAlgo.onData = onData;
}
function DataSynchronizer_replay_worker_reset() {
    clearInterval(masterTimeInterval);
    masterTimeInterval = undefined;
    if(dataSynchronizerAlgo !== null) {
        dataSynchronizerAlgo.reset();
    }
    timeBroadcastChannel.postMessage({
        type: EventType.TIME_CHANGED
    });
    timeBroadcastChannel.postMessage({
        type: EventType.CLOSED
    });

    dataSynchronizerBroadCastChannel.postMessage({
        type: EventType.STATUS,
        status: 'not_running',
    });
}
function initBroadcastChannel(dataTopic, timeTopic) {
    console.log('listen on topic ',dataTopic)

    dataSynchronizerBroadCastChannel = new BroadcastChannel(dataTopic);
    dataSynchronizerBroadCastChannel.onmessage = async (event) => {
        if(event.data.type === EventType.DATA) {
            checkMasterTime();
            dataSynchronizerAlgo.push(event.data.dataSourceId,event.data.values);
        } else if(event.data.type === EventType.STATUS) {
            const dataSourceId = event.data.dataSourceId;
            dataSynchronizerAlgo.setStatus(dataSourceId, event.data.status);
            // bubble the message
            if(dataSourceId in bcChannels) {
                console.log(dataSources[dataSourceId].name + ": status=" + event.data.status);
                bcChannels[dataSourceId].postMessage(event.data);
            }
        }
    }

    timeBroadcastChannel = new BroadcastChannel(timeTopic);

}

/**
 *
 * @param dataSources
 */
function addDataSources(dataSources) {
    for(let dataSource of dataSources) {
        addDataSource(dataSource);
    }
}

function addDataSource(dataSource) {
    dataSynchronizerAlgo.addDataSource(dataSource);
    // create a BC to push back the synchronized data into the DATA Stream.
    bcChannels[dataSource.id] = new BroadcastChannel(DATASOURCE_DATA_TOPIC + dataSource.id);

    if(!(dataSource.id in dataSources)) {
        dataSources[dataSource.id] = dataSource;
    }
}

/**
 *
 * @param dataSourceIds
 */
async function removeDataSources(dataSourceIds) {
    for(let dataSourceId of dataSourceIds) {
        await removeDataSource(dataSourceId);
    }
}

async function removeDataSource(dataSourceId) {
    await dataSynchronizerAlgo.removeDataSource(dataSourceId);
    // create a BC to push back the synchronized data into the DATA Stream.
    console.log('deleting BC for datasource '+dataSourceId);
    delete bcChannels[dataSourceId];
    delete dataSources[dataSourceId];
}

function checkMasterTime() {
    if(!isDefined(masterTimeInterval)) {
        startMasterTimeInterval(masterTimeRefreshRate);
    }
}
async function onEnd() {
    const masterTime = dataSynchronizerAlgo.getCurrentTimestamp();
    clearInterval(masterTimeInterval);
    masterTimeInterval = undefined;
    // end at this time
    timeBroadcastChannel.postMessage({
        timestamp: masterTime,
        type: EventType.MASTER_TIME
    });
    dataSynchronizerBroadCastChannel.postMessage({
        type: EventType.STATUS,
        status: 'not_running',
    });
}

async function onStart() {
    checkMasterTime();
}

function onClose() {
    timeBroadcastChannel.postMessage({
        type: EventType.CLOSED
    });
    dataSynchronizerBroadCastChannel.postMessage({
        type: EventType.STATUS,
        status: 'not_running',
    });
}

async function onData(dataSourceId, dataBlock) {
    if(dataBlock.version !== version) {
        console.error('version are different:',dataBlock.version,version);
        return;
    }
    lastData = {
        dataSourceId: dataSourceId,
        dataBlock: dataBlock,
    };
    bcChannels[dataSourceId].postMessage({
            values: [dataBlock],
            dataSourceId:dataSourceId,
            type: EventType.DATA
        }
    );
}
self.onclose = function() {
    dataSynchronizerAlgo.close();
    console.log("Data Synchronizer has been terminated successfully");
    dataSynchronizerBroadCastChannel.postMessage({
        type: EventType.STATUS,
        status: 'not_running',
    });
}

let masterTime;
function startMasterTimeInterval(masterTimeRefreshRate) {
    if (!isDefined(masterTimeInterval)) {
        masterTimeInterval = setInterval(() => {
            masterTime = dataSynchronizerAlgo.getCurrentTimestamp();
            if (isDefined(masterTime)) {
                timeBroadcastChannel.postMessage({
                    timestamp: masterTime,
                    type: EventType.MASTER_TIME
                });
            }

            if(isDefined(lastData)) {
                cTime = lastData.dataBlock.data.timestamp;
                cId = lastData.dataSourceId;

                if ((cTime !== -1 && lastTime === -1) || (lastTime !== -1 && cTime !== lastTime)) { // does not send the same data twice
                    timeBroadcastChannel.postMessage({
                        timestamp: cTime,
                        dataSourceId: cId,
                        type: EventType.LAST_TIME
                    });
                }
                lastTime = cTime;
            }
        }, masterTimeRefreshRate);
        dataSynchronizerBroadCastChannel.postMessage({
            type: EventType.STATUS,
            status: 'running',
        });
    }
}

}();
/******/ })()
;
//# sourceMappingURL=DataSynchronizer.replay.worker.955bfb74.worker.js.map