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

/***/ 6077:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (typeof argument == 'object' || isCallable(argument)) return argument;
  throw $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ 5787:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isPrototypeOf = __webpack_require__(7976);

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw $TypeError('Incorrect invocation');
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

/***/ 3013:
/***/ (function(module) {

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ 260:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(3013);
var DESCRIPTORS = __webpack_require__(9781);
var global = __webpack_require__(7854);
var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var hasOwn = __webpack_require__(2597);
var classof = __webpack_require__(648);
var tryToString = __webpack_require__(6330);
var createNonEnumerableProperty = __webpack_require__(8880);
var defineBuiltIn = __webpack_require__(8052);
var defineBuiltInAccessor = __webpack_require__(7045);
var isPrototypeOf = __webpack_require__(7976);
var getPrototypeOf = __webpack_require__(9518);
var setPrototypeOf = __webpack_require__(7674);
var wellKnownSymbol = __webpack_require__(5112);
var uid = __webpack_require__(9711);
var InternalStateModule = __webpack_require__(9909);

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ 7745:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(6244);

module.exports = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
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

/***/ 1843:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(6244);

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
module.exports = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};


/***/ }),

/***/ 1572:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var lengthOfArrayLike = __webpack_require__(6244);
var toIntegerOrInfinity = __webpack_require__(9303);

var $RangeError = RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
module.exports = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw $RangeError('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
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

/***/ 648:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(1694);
var isCallable = __webpack_require__(614);
var classofRaw = __webpack_require__(4326);
var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
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

/***/ 8544:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var fails = __webpack_require__(7293);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


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

/***/ 7045:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var makeBuiltIn = __webpack_require__(6339);
var defineProperty = __webpack_require__(3070);

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
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

/***/ 5117:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var tryToString = __webpack_require__(6330);

var $TypeError = TypeError;

module.exports = function (O, P) {
  if (!delete O[P]) throw $TypeError('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
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

/***/ 3678:
/***/ (function(module) {

module.exports = {
  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
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

/***/ 1060:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);

var $Error = Error;
var replace = uncurryThis(''.replace);

var TEST = (function (arg) { return String($Error(arg).stack); })('zxcasd');
// eslint-disable-next-line redos/no-vulnerable -- safe
var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

module.exports = function (stack, dropEntries) {
  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error.prepareStackTrace) {
    while (dropEntries--) stack = replace(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
  } return stack;
};


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

/***/ 5668:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
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

/***/ 9587:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isCallable = __webpack_require__(614);
var isObject = __webpack_require__(111);
var setPrototypeOf = __webpack_require__(7674);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


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

/***/ 4067:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(648);

module.exports = function (it) {
  var klass = classof(it);
  return klass == 'BigInt64Array' || klass == 'BigUint64Array';
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

/***/ 6277:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toString = __webpack_require__(1340);

module.exports = function (argument, $default) {
  return argument === undefined ? arguments.length < 2 ? '' : $default : toString(argument);
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

/***/ 9518:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var hasOwn = __webpack_require__(2597);
var isCallable = __webpack_require__(614);
var toObject = __webpack_require__(7908);
var sharedKey = __webpack_require__(6200);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(8544);

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


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

/***/ 7674:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(5668);
var anObject = __webpack_require__(9670);
var aPossiblePrototype = __webpack_require__(6077);

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


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

/***/ 4599:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toPrimitive = __webpack_require__(7593);

var $TypeError = TypeError;

// `ToBigInt` abstract operation
// https://tc39.es/ecma262/#sec-tobigint
module.exports = function (argument) {
  var prim = toPrimitive(argument, 'number');
  if (typeof prim == 'number') throw $TypeError("Can't convert number to bigint");
  // eslint-disable-next-line es/no-bigint -- safe
  return BigInt(prim);
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

/***/ 1694:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(5112);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ 1340:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(648);

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
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


/***/ }),

/***/ 541:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var toObject = __webpack_require__(7908);
var lengthOfArrayLike = __webpack_require__(6244);
var setArrayLength = __webpack_require__(3658);
var deletePropertyOrThrow = __webpack_require__(5117);
var doesNotExceedSafeInteger = __webpack_require__(7207);

// IE8-
var INCORRECT_RESULT = [].unshift(0) !== 1;

// V8 ~ Chrome < 71 and Safari <= 15.4, FF < 23 throws InternalError
var properErrorOnNonWritableLength = function () {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty([], 'length', { writable: false }).unshift();
  } catch (error) {
    return error instanceof TypeError;
  }
};

var FORCED = INCORRECT_RESULT || !properErrorOnNonWritableLength();

// `Array.prototype.unshift` method
// https://tc39.es/ecma262/#sec-array.prototype.unshift
$({ target: 'Array', proto: true, arity: 1, forced: FORCED }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  unshift: function unshift(item) {
    var O = toObject(this);
    var len = lengthOfArrayLike(O);
    var argCount = arguments.length;
    if (argCount) {
      doesNotExceedSafeInteger(len + argCount);
      var k = len;
      while (k--) {
        var to = k + argCount;
        if (k in O) O[to] = O[k];
        else deletePropertyOrThrow(O, to);
      }
      for (var j = 0; j < argCount; j++) {
        O[j] = arguments[j];
      }
    } return setArrayLength(O, len + argCount);
  }
});


/***/ }),

/***/ 1439:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arrayToReversed = __webpack_require__(1843);
var ArrayBufferViewCore = __webpack_require__(260);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray(this), getTypedArrayConstructor(this));
});


/***/ }),

/***/ 7585:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var ArrayBufferViewCore = __webpack_require__(260);
var uncurryThis = __webpack_require__(1702);
var aCallable = __webpack_require__(9662);
var arrayFromConstructorAndList = __webpack_require__(7745);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;
var sort = uncurryThis(ArrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray(this);
  var A = arrayFromConstructorAndList(getTypedArrayConstructor(O), O);
  return sort(A, compareFn);
});


/***/ }),

/***/ 5315:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var arrayWith = __webpack_require__(1572);
var ArrayBufferViewCore = __webpack_require__(260);
var isBigIntArray = __webpack_require__(4067);
var toIntegerOrInfinity = __webpack_require__(9303);
var toBigInt = __webpack_require__(4599);

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

var PROPER_ORDER = !!function () {
  try {
    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays, es/no-array-prototype-with -- required for testing
    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
  } catch (error) {
    // some early implementations, like WebKit, does not follow the final semantic
    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
    return error === 8;
  }
}();

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod('with', { 'with': function (index, value) {
  var O = aTypedArray(this);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
} }['with'], !PROPER_ORDER);


/***/ }),

/***/ 3767:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__(1439);


/***/ }),

/***/ 8585:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__(7585);


/***/ }),

/***/ 8696:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

// TODO: Remove from `core-js@4`
__webpack_require__(5315);


/***/ }),

/***/ 2801:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(2109);
var global = __webpack_require__(7854);
var getBuiltIn = __webpack_require__(5005);
var createPropertyDescriptor = __webpack_require__(9114);
var defineProperty = (__webpack_require__(3070).f);
var hasOwn = __webpack_require__(2597);
var anInstance = __webpack_require__(5787);
var inheritIfRequired = __webpack_require__(9587);
var normalizeStringArgument = __webpack_require__(6277);
var DOMExceptionConstants = __webpack_require__(3678);
var clearErrorStack = __webpack_require__(1060);
var DESCRIPTORS = __webpack_require__(9781);
var IS_PURE = __webpack_require__(1913);

var DOM_EXCEPTION = 'DOMException';
var Error = getBuiltIn('Error');
var NativeDOMException = getBuiltIn(DOM_EXCEPTION);

var $DOMException = function DOMException() {
  anInstance(this, DOMExceptionPrototype);
  var argumentsLength = arguments.length;
  var message = normalizeStringArgument(argumentsLength < 1 ? undefined : arguments[0]);
  var name = normalizeStringArgument(argumentsLength < 2 ? undefined : arguments[1], 'Error');
  var that = new NativeDOMException(message, name);
  var error = Error(message);
  error.name = DOM_EXCEPTION;
  defineProperty(that, 'stack', createPropertyDescriptor(1, clearErrorStack(error.stack, 1)));
  inheritIfRequired(that, this, $DOMException);
  return that;
};

var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

var ERROR_HAS_STACK = 'stack' in Error(DOM_EXCEPTION);
var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var descriptor = NativeDOMException && DESCRIPTORS && Object.getOwnPropertyDescriptor(global, DOM_EXCEPTION);

// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
// https://github.com/Jarred-Sumner/bun/issues/399
var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

// `DOMException` constructor patch for `.stack` where it's required
// https://webidl.spec.whatwg.org/#es-DOMException-specialness
$({ global: true, constructor: true, forced: IS_PURE || FORCED_CONSTRUCTOR }, { // TODO: fix export logic
  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
});

var PolyfilledDOMException = getBuiltIn(DOM_EXCEPTION);
var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
  if (!IS_PURE) {
    defineProperty(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor(1, PolyfilledDOMException));
  }

  for (var key in DOMExceptionConstants) if (hasOwn(DOMExceptionConstants, key)) {
    var constant = DOMExceptionConstants[key];
    var constantName = constant.s;
    if (!hasOwn(PolyfilledDOMException, constantName)) {
      defineProperty(PolyfilledDOMException, constantName, createPropertyDescriptor(6, constant.c));
    }
  }
}


/***/ }),

/***/ 8475:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(7658);
__webpack_require__(3767);
__webpack_require__(8585);
__webpack_require__(8696);
__webpack_require__(541);
!function (e) {
  if (true) module.exports = e();else {}
}(function () {
  return function () {
    return function e(t, r, n) {
      function i(s, a) {
        if (!r[s]) {
          if (!t[s]) {
            var l = undefined;
            if (!a && l) return require(s, !0);
            if (o) return o(s, !0);
            var u = new Error("Cannot find module '" + s + "'");
            throw u.code = "MODULE_NOT_FOUND", u;
          }
          var c = r[s] = {
            exports: {}
          };
          t[s][0].call(c.exports, function (e) {
            return i(t[s][1][e] || e);
          }, c, c.exports, e, t, r, n);
        }
        return r[s].exports;
      }
      for (var o = undefined, s = 0; s < n.length; s++) i(n[s]);
      return i;
    };
  }()({
    1: [function (e, t, r) {
      (function (r, n) {
        (function () {
          "use strict";

          const i = e("events").EventEmitter,
            o = e("./store"),
            s = e("./topic-alias-recv"),
            a = e("./topic-alias-send"),
            l = e("mqtt-packet"),
            u = e("./default-message-id-provider"),
            c = e("readable-stream").Writable,
            h = e("inherits"),
            f = e("reinterval"),
            p = e("rfdc/default"),
            d = e("./validations"),
            g = e("xtend"),
            y = e("debug")("mqttjs:client"),
            b = r ? r.nextTick : function (e) {
              setTimeout(e, 0);
            },
            m = n.setImmediate || function (e) {
              b(e);
            },
            v = {
              keepalive: 60,
              reschedulePings: !0,
              protocolId: "MQTT",
              protocolVersion: 4,
              reconnectPeriod: 1e3,
              connectTimeout: 3e4,
              clean: !0,
              resubscribe: !0
            },
            w = ["ECONNREFUSED", "EADDRINUSE", "ECONNRESET", "ENOTFOUND"],
            _ = {
              0: "",
              1: "Unacceptable protocol version",
              2: "Identifier rejected",
              3: "Server unavailable",
              4: "Bad username or password",
              5: "Not authorized",
              16: "No matching subscribers",
              17: "No subscription existed",
              128: "Unspecified error",
              129: "Malformed Packet",
              130: "Protocol Error",
              131: "Implementation specific error",
              132: "Unsupported Protocol Version",
              133: "Client Identifier not valid",
              134: "Bad User Name or Password",
              135: "Not authorized",
              136: "Server unavailable",
              137: "Server busy",
              138: "Banned",
              139: "Server shutting down",
              140: "Bad authentication method",
              141: "Keep Alive timeout",
              142: "Session taken over",
              143: "Topic Filter invalid",
              144: "Topic Name invalid",
              145: "Packet identifier in use",
              146: "Packet Identifier not found",
              147: "Receive Maximum exceeded",
              148: "Topic Alias invalid",
              149: "Packet too large",
              150: "Message rate too high",
              151: "Quota exceeded",
              152: "Administrative action",
              153: "Payload format invalid",
              154: "Retain not supported",
              155: "QoS not supported",
              156: "Use another server",
              157: "Server moved",
              158: "Shared Subscriptions not supported",
              159: "Connection rate exceeded",
              160: "Maximum connect time",
              161: "Subscription Identifiers not supported",
              162: "Wildcard Subscriptions not supported"
            };
          function k(e, t) {
            let r;
            t.properties && (r = t.properties.topicAlias);
            let n = t.topic.toString();
            if (0 === n.length) {
              if (void 0 === r) return new Error("Unregistered Topic Alias");
              if (void 0 === (n = e.topicAliasSend.getTopicByAlias(r))) return new Error("Unregistered Topic Alias");
              t.topic = n;
            }
            r && delete t.properties.topicAlias;
          }
          function S(e, t, r) {
            y("sendPacket :: packet: %O", t), y("sendPacket :: emitting `packetsend`"), e.emit("packetsend", t), y("sendPacket :: writing to stream");
            const n = l.writeToStream(t, e.stream, e.options);
            y("sendPacket :: writeToStream result %s", n), !n && r ? (y("sendPacket :: handle events on `drain` once through callback."), e.stream.once("drain", r)) : r && (y("sendPacket :: invoking cb"), r());
          }
          function E(e, t, r, n) {
            y("storeAndSend :: store packet with cmd %s to outgoingStore", t.cmd);
            let i,
              o = t;
            if ("publish" === o.cmd && (o = p(t), i = k(e, o))) return r && r(i);
            e.outgoingStore.put(o, function (i) {
              if (i) return r && r(i);
              n(), S(e, t, r);
            });
          }
          function C(e) {
            y("nop ::", e);
          }
          function T(e, t) {
            let r;
            const n = this;
            if (!(this instanceof T)) return new T(e, t);
            for (r in this.options = t || {}, v) void 0 === this.options[r] ? this.options[r] = v[r] : this.options[r] = t[r];
            y("MqttClient :: options.protocol", t.protocol), y("MqttClient :: options.protocolVersion", t.protocolVersion), y("MqttClient :: options.username", t.username), y("MqttClient :: options.keepalive", t.keepalive), y("MqttClient :: options.reconnectPeriod", t.reconnectPeriod), y("MqttClient :: options.rejectUnauthorized", t.rejectUnauthorized), y("MqttClient :: options.topicAliasMaximum", t.topicAliasMaximum), this.options.clientId = "string" == typeof t.clientId ? t.clientId : "mqttjs_" + Math.random().toString(16).substr(2, 8), y("MqttClient :: clientId", this.options.clientId), this.options.customHandleAcks = 5 === t.protocolVersion && t.customHandleAcks ? t.customHandleAcks : function () {
              arguments[3](0);
            }, this.streamBuilder = e, this.messageIdProvider = void 0 === this.options.messageIdProvider ? new u() : this.options.messageIdProvider, this.outgoingStore = t.outgoingStore || new o(), this.incomingStore = t.incomingStore || new o(), this.queueQoSZero = void 0 === t.queueQoSZero || t.queueQoSZero, this._resubscribeTopics = {}, this.messageIdToTopic = {}, this.pingTimer = null, this.connected = !1, this.disconnecting = !1, this.queue = [], this.connackTimer = null, this.reconnectTimer = null, this._storeProcessing = !1, this._packetIdsDuringStoreProcessing = {}, this._storeProcessingQueue = [], this.outgoing = {}, this._firstConnection = !0, t.topicAliasMaximum > 0 && (t.topicAliasMaximum > 65535 ? y("MqttClient :: options.topicAliasMaximum is out of range") : this.topicAliasRecv = new s(t.topicAliasMaximum)), this.on("connect", function () {
              const e = this.queue;
              y("connect :: sending queued packets"), function t() {
                const r = e.shift();
                y("deliver :: entry %o", r);
                let i = null;
                if (!r) return void n._resubscribe();
                i = r.packet, y("deliver :: call _sendPacket for %o", i);
                let o = !0;
                i.messageId && 0 !== i.messageId && (n.messageIdProvider.register(i.messageId) || (o = !1)), o ? n._sendPacket(i, function (e) {
                  r.cb && r.cb(e), t();
                }) : (y("messageId: %d has already used. The message is skipped and removed.", i.messageId), t());
              }();
            }), this.on("close", function () {
              y("close :: connected set to `false`"), this.connected = !1, y("close :: clearing connackTimer"), clearTimeout(this.connackTimer), y("close :: clearing ping timer"), null !== n.pingTimer && (n.pingTimer.clear(), n.pingTimer = null), this.topicAliasRecv && this.topicAliasRecv.clear(), y("close :: calling _setupReconnect"), this._setupReconnect();
            }), i.call(this), y("MqttClient :: setting up stream"), this._setupStream();
          }
          h(T, i), T.prototype._setupStream = function () {
            const e = this,
              t = new c(),
              r = l.parser(this.options);
            let n = null;
            const i = [];
            function o() {
              if (i.length) b(s);else {
                const e = n;
                n = null, e();
              }
            }
            function s() {
              y("work :: getting next packet in queue");
              const t = i.shift();
              if (t) y("work :: packet pulled from queue"), e._handlePacket(t, o);else {
                y("work :: no packets in queue");
                const e = n;
                n = null, y("work :: done flag is %s", !!e), e && e();
              }
            }
            y("_setupStream :: calling method to clear reconnect"), this._clearReconnect(), y("_setupStream :: using streamBuilder provided to client to create stream"), this.stream = this.streamBuilder(this), r.on("packet", function (e) {
              y("parser :: on packet push to packets array."), i.push(e);
            }), t._write = function (e, t, i) {
              n = i, y("writable stream :: parsing buffer"), r.parse(e), s();
            }, y("_setupStream :: pipe stream to writable stream"), this.stream.pipe(t), this.stream.on("error", function (t) {
              y("streamErrorHandler :: error", t.message), w.includes(t.code) ? (y("streamErrorHandler :: emitting error"), e.emit("error", t)) : C(t);
            }), this.stream.on("close", function () {
              var t;
              y("(%s)stream :: on close", e.options.clientId), (t = e.outgoing) && (y("flushVolatile :: deleting volatile messages from the queue and setting their callbacks as error function"), Object.keys(t).forEach(function (e) {
                t[e].volatile && "function" == typeof t[e].cb && (t[e].cb(new Error("Connection closed")), delete t[e]);
              })), y("stream: emit close to MqttClient"), e.emit("close");
            }), y("_setupStream: sending packet `connect`");
            const a = Object.create(this.options);
            if (a.cmd = "connect", this.topicAliasRecv && (a.properties || (a.properties = {}), this.topicAliasRecv && (a.properties.topicAliasMaximum = this.topicAliasRecv.max)), S(this, a), r.on("error", this.emit.bind(this, "error")), this.options.properties) {
              if (!this.options.properties.authenticationMethod && this.options.properties.authenticationData) return e.end(() => this.emit("error", new Error("Packet has no Authentication Method"))), this;
              if (this.options.properties.authenticationMethod && this.options.authPacket && "object" == typeof this.options.authPacket) {
                S(this, g({
                  cmd: "auth",
                  reasonCode: 0
                }, this.options.authPacket));
              }
            }
            this.stream.setMaxListeners(1e3), clearTimeout(this.connackTimer), this.connackTimer = setTimeout(function () {
              y("!!connectTimeout hit!! Calling _cleanUp with force `true`"), e._cleanUp(!0);
            }, this.options.connectTimeout);
          }, T.prototype._handlePacket = function (e, t) {
            const r = this.options;
            if (5 === r.protocolVersion && r.properties && r.properties.maximumPacketSize && r.properties.maximumPacketSize < e.length) return this.emit("error", new Error("exceeding packets size " + e.cmd)), this.end({
              reasonCode: 149,
              properties: {
                reasonString: "Maximum packet size was exceeded"
              }
            }), this;
            switch (y("_handlePacket :: emitting packetreceive"), this.emit("packetreceive", e), e.cmd) {
              case "publish":
                this._handlePublish(e, t);
                break;
              case "puback":
              case "pubrec":
              case "pubcomp":
              case "suback":
              case "unsuback":
                this._handleAck(e), t();
                break;
              case "pubrel":
                this._handlePubrel(e, t);
                break;
              case "connack":
                this._handleConnack(e), t();
                break;
              case "auth":
                this._handleAuth(e), t();
                break;
              case "pingresp":
                this._handlePingresp(e), t();
                break;
              case "disconnect":
                this._handleDisconnect(e), t();
            }
          }, T.prototype._checkDisconnecting = function (e) {
            return this.disconnecting && (e ? e(new Error("client disconnecting")) : this.emit("error", new Error("client disconnecting"))), this.disconnecting;
          }, T.prototype.publish = function (e, t, r, n) {
            y("publish :: message `%s` to topic `%s`", t, e);
            const i = this.options;
            "function" == typeof r && (n = r, r = null);
            if (r = g({
              qos: 0,
              retain: !1,
              dup: !1
            }, r), this._checkDisconnecting(n)) return this;
            const o = this,
              s = function () {
                let s = 0;
                if ((1 === r.qos || 2 === r.qos) && null === (s = o._nextId())) return y("No messageId left"), !1;
                const a = {
                  cmd: "publish",
                  topic: e,
                  payload: t,
                  qos: r.qos,
                  retain: r.retain,
                  messageId: s,
                  dup: r.dup
                };
                switch (5 === i.protocolVersion && (a.properties = r.properties), y("publish :: qos", r.qos), r.qos) {
                  case 1:
                  case 2:
                    o.outgoing[a.messageId] = {
                      volatile: !1,
                      cb: n || C
                    }, y("MqttClient:publish: packet cmd: %s", a.cmd), o._sendPacket(a, void 0, r.cbStorePut);
                    break;
                  default:
                    y("MqttClient:publish: packet cmd: %s", a.cmd), o._sendPacket(a, n, r.cbStorePut);
                }
                return !0;
              };
            return (this._storeProcessing || this._storeProcessingQueue.length > 0 || !s()) && this._storeProcessingQueue.push({
              invoke: s,
              cbStorePut: r.cbStorePut,
              callback: n
            }), this;
          }, T.prototype.subscribe = function () {
            const e = this,
              t = new Array(arguments.length);
            for (let e = 0; e < arguments.length; e++) t[e] = arguments[e];
            const r = [];
            let n = t.shift();
            const i = n.resubscribe;
            let o = t.pop() || C,
              s = t.pop();
            const a = this.options.protocolVersion;
            delete n.resubscribe, "string" == typeof n && (n = [n]), "function" != typeof o && (s = o, o = C);
            const l = d.validateTopics(n);
            if (null !== l) return m(o, new Error("Invalid topic " + l)), this;
            if (this._checkDisconnecting(o)) return y("subscribe: discconecting true"), this;
            const u = {
              qos: 0
            };
            if (5 === a && (u.nl = !1, u.rap = !1, u.rh = 0), s = g(u, s), Array.isArray(n) ? n.forEach(function (t) {
              if (y("subscribe: array topic %s", t), !Object.prototype.hasOwnProperty.call(e._resubscribeTopics, t) || e._resubscribeTopics[t].qos < s.qos || i) {
                const e = {
                  topic: t,
                  qos: s.qos
                };
                5 === a && (e.nl = s.nl, e.rap = s.rap, e.rh = s.rh, e.properties = s.properties), y("subscribe: pushing topic `%s` and qos `%s` to subs list", e.topic, e.qos), r.push(e);
              }
            }) : Object.keys(n).forEach(function (t) {
              if (y("subscribe: object topic %s", t), !Object.prototype.hasOwnProperty.call(e._resubscribeTopics, t) || e._resubscribeTopics[t].qos < n[t].qos || i) {
                const e = {
                  topic: t,
                  qos: n[t].qos
                };
                5 === a && (e.nl = n[t].nl, e.rap = n[t].rap, e.rh = n[t].rh, e.properties = s.properties), y("subscribe: pushing `%s` to subs list", e), r.push(e);
              }
            }), !r.length) return o(null, []), this;
            const c = function () {
              const t = e._nextId();
              if (null === t) return y("No messageId left"), !1;
              const n = {
                cmd: "subscribe",
                subscriptions: r,
                qos: 1,
                retain: !1,
                dup: !1,
                messageId: t
              };
              if (s.properties && (n.properties = s.properties), e.options.resubscribe) {
                y("subscribe :: resubscribe true");
                const t = [];
                r.forEach(function (r) {
                  if (e.options.reconnectPeriod > 0) {
                    const n = {
                      qos: r.qos
                    };
                    5 === a && (n.nl = r.nl || !1, n.rap = r.rap || !1, n.rh = r.rh || 0, n.properties = r.properties), e._resubscribeTopics[r.topic] = n, t.push(r.topic);
                  }
                }), e.messageIdToTopic[n.messageId] = t;
              }
              return e.outgoing[n.messageId] = {
                volatile: !0,
                cb: function (e, t) {
                  if (!e) {
                    const e = t.granted;
                    for (let t = 0; t < e.length; t += 1) r[t].qos = e[t];
                  }
                  o(e, r);
                }
              }, y("subscribe :: call _sendPacket"), e._sendPacket(n), !0;
            };
            return (this._storeProcessing || this._storeProcessingQueue.length > 0 || !c()) && this._storeProcessingQueue.push({
              invoke: c,
              callback: o
            }), this;
          }, T.prototype.unsubscribe = function () {
            const e = this,
              t = new Array(arguments.length);
            for (let e = 0; e < arguments.length; e++) t[e] = arguments[e];
            let r = t.shift(),
              n = t.pop() || C,
              i = t.pop();
            "string" == typeof r && (r = [r]), "function" != typeof n && (i = n, n = C);
            const o = d.validateTopics(r);
            if (null !== o) return m(n, new Error("Invalid topic " + o)), this;
            if (e._checkDisconnecting(n)) return this;
            const s = function () {
              const t = e._nextId();
              if (null === t) return y("No messageId left"), !1;
              const o = {
                cmd: "unsubscribe",
                qos: 1,
                messageId: t
              };
              return "string" == typeof r ? o.unsubscriptions = [r] : Array.isArray(r) && (o.unsubscriptions = r), e.options.resubscribe && o.unsubscriptions.forEach(function (t) {
                delete e._resubscribeTopics[t];
              }), "object" == typeof i && i.properties && (o.properties = i.properties), e.outgoing[o.messageId] = {
                volatile: !0,
                cb: n
              }, y("unsubscribe: call _sendPacket"), e._sendPacket(o), !0;
            };
            return (this._storeProcessing || this._storeProcessingQueue.length > 0 || !s()) && this._storeProcessingQueue.push({
              invoke: s,
              callback: n
            }), this;
          }, T.prototype.end = function (e, t, r) {
            const n = this;
            function i() {
              y("end :: (%s) :: finish :: calling _cleanUp with force %s", n.options.clientId, e), n._cleanUp(e, () => {
                y("end :: finish :: calling process.nextTick on closeStores"), b(function () {
                  y("end :: closeStores: closing incoming and outgoing stores"), n.disconnected = !0, n.incomingStore.close(function (e) {
                    n.outgoingStore.close(function (t) {
                      if (y("end :: closeStores: emitting end"), n.emit("end"), r) {
                        const n = e || t;
                        y("end :: closeStores: invoking callback with args"), r(n);
                      }
                    });
                  }), n._deferredReconnect && n._deferredReconnect();
                }.bind(n));
              }, t);
            }
            return y("end :: (%s)", this.options.clientId), null != e && "boolean" == typeof e || (r = t || C, t = e, e = !1, "object" != typeof t && (r = t, t = null, "function" != typeof r && (r = C))), "object" != typeof t && (r = t, t = null), y("end :: cb? %s", !!r), r = r || C, this.disconnecting ? (r(), this) : (this._clearReconnect(), this.disconnecting = !0, !e && Object.keys(this.outgoing).length > 0 ? (y("end :: (%s) :: calling finish in 10ms once outgoing is empty", n.options.clientId), this.once("outgoingEmpty", setTimeout.bind(null, i, 10))) : (y("end :: (%s) :: immediately calling finish", n.options.clientId), i()), this);
          }, T.prototype.removeOutgoingMessage = function (e) {
            const t = this.outgoing[e] ? this.outgoing[e].cb : null;
            return delete this.outgoing[e], this.outgoingStore.del({
              messageId: e
            }, function () {
              t(new Error("Message removed"));
            }), this;
          }, T.prototype.reconnect = function (e) {
            y("client reconnect");
            const t = this,
              r = function () {
                e ? (t.options.incomingStore = e.incomingStore, t.options.outgoingStore = e.outgoingStore) : (t.options.incomingStore = null, t.options.outgoingStore = null), t.incomingStore = t.options.incomingStore || new o(), t.outgoingStore = t.options.outgoingStore || new o(), t.disconnecting = !1, t.disconnected = !1, t._deferredReconnect = null, t._reconnect();
              };
            return this.disconnecting && !this.disconnected ? this._deferredReconnect = r : r(), this;
          }, T.prototype._reconnect = function () {
            y("_reconnect: emitting reconnect to client"), this.emit("reconnect"), this.connected ? (this.end(() => {
              this._setupStream();
            }), y("client already connected. disconnecting first.")) : (y("_reconnect: calling _setupStream"), this._setupStream());
          }, T.prototype._setupReconnect = function () {
            const e = this;
            !e.disconnecting && !e.reconnectTimer && e.options.reconnectPeriod > 0 ? (this.reconnecting || (y("_setupReconnect :: emit `offline` state"), this.emit("offline"), y("_setupReconnect :: set `reconnecting` to `true`"), this.reconnecting = !0), y("_setupReconnect :: setting reconnectTimer for %d ms", e.options.reconnectPeriod), e.reconnectTimer = setInterval(function () {
              y("reconnectTimer :: reconnect triggered!"), e._reconnect();
            }, e.options.reconnectPeriod)) : y("_setupReconnect :: doing nothing...");
          }, T.prototype._clearReconnect = function () {
            y("_clearReconnect : clearing reconnect timer"), this.reconnectTimer && (clearInterval(this.reconnectTimer), this.reconnectTimer = null);
          }, T.prototype._cleanUp = function (e, t) {
            const r = arguments[2];
            if (t && (y("_cleanUp :: done callback provided for on stream close"), this.stream.on("close", t)), y("_cleanUp :: forced? %s", e), e) 0 === this.options.reconnectPeriod && this.options.clean && (n = this.outgoing) && (y("flush: queue exists? %b", !!n), Object.keys(n).forEach(function (e) {
              "function" == typeof n[e].cb && (n[e].cb(new Error("Connection closed")), delete n[e]);
            })), y("_cleanUp :: (%s) :: destroying stream", this.options.clientId), this.stream.destroy();else {
              const e = g({
                cmd: "disconnect"
              }, r);
              y("_cleanUp :: (%s) :: call _sendPacket with disconnect packet", this.options.clientId), this._sendPacket(e, m.bind(null, this.stream.end.bind(this.stream)));
            }
            var n;
            this.disconnecting || (y("_cleanUp :: client not disconnecting. Clearing and resetting reconnect."), this._clearReconnect(), this._setupReconnect()), null !== this.pingTimer && (y("_cleanUp :: clearing pingTimer"), this.pingTimer.clear(), this.pingTimer = null), t && !this.connected && (y("_cleanUp :: (%s) :: removing stream `done` callback `close` listener", this.options.clientId), this.stream.removeListener("close", t), t());
          }, T.prototype._sendPacket = function (e, t, r) {
            y("_sendPacket :: (%s) ::  start", this.options.clientId), r = r || C, t = t || C;
            const n = function (e, t) {
              if (5 === e.options.protocolVersion && "publish" === t.cmd) {
                let r;
                t.properties && (r = t.properties.topicAlias);
                const n = t.topic.toString();
                if (e.topicAliasSend) {
                  if (r) {
                    if (0 !== n.length && (y("applyTopicAlias :: register topic: %s - alias: %d", n, r), !e.topicAliasSend.put(n, r))) return y("applyTopicAlias :: error out of range. topic: %s - alias: %d", n, r), new Error("Sending Topic Alias out of range");
                  } else 0 !== n.length && (e.options.autoAssignTopicAlias ? (r = e.topicAliasSend.getAliasByTopic(n)) ? (t.topic = "", t.properties = {
                    ...t.properties,
                    topicAlias: r
                  }, y("applyTopicAlias :: auto assign(use) topic: %s - alias: %d", n, r)) : (r = e.topicAliasSend.getLruAlias(), e.topicAliasSend.put(n, r), t.properties = {
                    ...t.properties,
                    topicAlias: r
                  }, y("applyTopicAlias :: auto assign topic: %s - alias: %d", n, r)) : e.options.autoUseTopicAlias && (r = e.topicAliasSend.getAliasByTopic(n)) && (t.topic = "", t.properties = {
                    ...t.properties,
                    topicAlias: r
                  }, y("applyTopicAlias :: auto use topic: %s - alias: %d", n, r)));
                } else if (r) return y("applyTopicAlias :: error out of range. topic: %s - alias: %d", n, r), new Error("Sending Topic Alias out of range");
              }
            }(this, e);
            if (n) t(n);else {
              if (!this.connected) return "auth" === e.cmd ? (this._shiftPingInterval(), void S(this, e, t)) : (y("_sendPacket :: client not connected. Storing packet offline."), void this._storePacket(e, t, r));
              switch (this._shiftPingInterval(), e.cmd) {
                case "publish":
                  break;
                case "pubrel":
                  return void E(this, e, t, r);
                default:
                  return void S(this, e, t);
              }
              switch (e.qos) {
                case 2:
                case 1:
                  E(this, e, t, r);
                  break;
                case 0:
                default:
                  S(this, e, t);
              }
              y("_sendPacket :: (%s) ::  end", this.options.clientId);
            }
          }, T.prototype._storePacket = function (e, t, r) {
            y("_storePacket :: packet: %o", e), y("_storePacket :: cb? %s", !!t), r = r || C;
            let n = e;
            if ("publish" === n.cmd) {
              const r = k(this, n = p(e));
              if (r) return t && t(r);
            }
            0 === (n.qos || 0) && this.queueQoSZero || "publish" !== n.cmd ? this.queue.push({
              packet: n,
              cb: t
            }) : n.qos > 0 ? (t = this.outgoing[n.messageId] ? this.outgoing[n.messageId].cb : null, this.outgoingStore.put(n, function (e) {
              if (e) return t && t(e);
              r();
            })) : t && t(new Error("No connection to broker"));
          }, T.prototype._setupPingTimer = function () {
            y("_setupPingTimer :: keepalive %d (seconds)", this.options.keepalive);
            const e = this;
            !this.pingTimer && this.options.keepalive && (this.pingResp = !0, this.pingTimer = f(function () {
              e._checkPing();
            }, 1e3 * this.options.keepalive));
          }, T.prototype._shiftPingInterval = function () {
            this.pingTimer && this.options.keepalive && this.options.reschedulePings && this.pingTimer.reschedule(1e3 * this.options.keepalive);
          }, T.prototype._checkPing = function () {
            y("_checkPing :: checking ping..."), this.pingResp ? (y("_checkPing :: ping response received. Clearing flag and sending `pingreq`"), this.pingResp = !1, this._sendPacket({
              cmd: "pingreq"
            })) : (y("_checkPing :: calling _cleanUp with force true"), this._cleanUp(!0));
          }, T.prototype._handlePingresp = function () {
            this.pingResp = !0;
          }, T.prototype._handleConnack = function (e) {
            y("_handleConnack");
            const t = this.options,
              r = 5 === t.protocolVersion ? e.reasonCode : e.returnCode;
            if (clearTimeout(this.connackTimer), delete this.topicAliasSend, e.properties) {
              if (e.properties.topicAliasMaximum) {
                if (e.properties.topicAliasMaximum > 65535) return void this.emit("error", new Error("topicAliasMaximum from broker is out of range"));
                e.properties.topicAliasMaximum > 0 && (this.topicAliasSend = new a(e.properties.topicAliasMaximum));
              }
              e.properties.serverKeepAlive && t.keepalive && (t.keepalive = e.properties.serverKeepAlive, this._shiftPingInterval()), e.properties.maximumPacketSize && (t.properties || (t.properties = {}), t.properties.maximumPacketSize = e.properties.maximumPacketSize);
            }
            if (0 === r) this.reconnecting = !1, this._onConnect(e);else if (r > 0) {
              const e = new Error("Connection refused: " + _[r]);
              e.code = r, this.emit("error", e);
            }
          }, T.prototype._handleAuth = function (e) {
            const t = this.options.protocolVersion,
              r = 5 === t ? e.reasonCode : e.returnCode;
            if (5 !== t) {
              const e = new Error("Protocol error: Auth packets are only supported in MQTT 5. Your version:" + t);
              return e.code = r, void this.emit("error", e);
            }
            const n = this;
            this.handleAuth(e, function (e, t) {
              if (e) n.emit("error", e);else if (24 === r) n.reconnecting = !1, n._sendPacket(t);else {
                const t = new Error("Connection refused: " + _[r]);
                e.code = r, n.emit("error", t);
              }
            });
          }, T.prototype.handleAuth = function (e, t) {
            t();
          }, T.prototype._handlePublish = function (e, t) {
            y("_handlePublish: packet %o", e), t = void 0 !== t ? t : C;
            let r = e.topic.toString();
            const n = e.payload,
              i = e.qos,
              o = e.messageId,
              s = this,
              a = this.options,
              l = [0, 16, 128, 131, 135, 144, 145, 151, 153];
            if (5 === this.options.protocolVersion) {
              let t;
              if (e.properties && (t = e.properties.topicAlias), void 0 !== t) if (0 === r.length) {
                if (!(t > 0 && t <= 65535)) return y("_handlePublish :: topic alias out of range. alias: %d", t), void this.emit("error", new Error("Received Topic Alias is out of range"));
                {
                  const e = this.topicAliasRecv.getTopicByAlias(t);
                  if (!e) return y("_handlePublish :: unregistered topic alias. alias: %d", t), void this.emit("error", new Error("Received unregistered Topic Alias"));
                  y("_handlePublish :: topic complemented by alias. topic: %s - alias: %d", r = e, t);
                }
              } else {
                if (!this.topicAliasRecv.put(r, t)) return y("_handlePublish :: topic alias out of range. alias: %d", t), void this.emit("error", new Error("Received Topic Alias is out of range"));
                y("_handlePublish :: registered topic: %s - alias: %d", r, t);
              }
            }
            switch (y("_handlePublish: qos %d", i), i) {
              case 2:
                a.customHandleAcks(r, n, e, function (r, n) {
                  return r instanceof Error || (n = r, r = null), r ? s.emit("error", r) : -1 === l.indexOf(n) ? s.emit("error", new Error("Wrong reason code for pubrec")) : void (n ? s._sendPacket({
                    cmd: "pubrec",
                    messageId: o,
                    reasonCode: n
                  }, t) : s.incomingStore.put(e, function () {
                    s._sendPacket({
                      cmd: "pubrec",
                      messageId: o
                    }, t);
                  }));
                });
                break;
              case 1:
                a.customHandleAcks(r, n, e, function (i, a) {
                  return i instanceof Error || (a = i, i = null), i ? s.emit("error", i) : -1 === l.indexOf(a) ? s.emit("error", new Error("Wrong reason code for puback")) : (a || s.emit("message", r, n, e), void s.handleMessage(e, function (e) {
                    if (e) return t && t(e);
                    s._sendPacket({
                      cmd: "puback",
                      messageId: o,
                      reasonCode: a
                    }, t);
                  }));
                });
                break;
              case 0:
                this.emit("message", r, n, e), this.handleMessage(e, t);
                break;
              default:
                y("_handlePublish: unknown QoS. Doing nothing.");
            }
          }, T.prototype.handleMessage = function (e, t) {
            t();
          }, T.prototype._handleAck = function (e) {
            const t = e.messageId,
              r = e.cmd;
            let n = null;
            const i = this.outgoing[t] ? this.outgoing[t].cb : null,
              o = this;
            let s;
            if (i) {
              switch (y("_handleAck :: packet type", r), r) {
                case "pubcomp":
                case "puback":
                  {
                    const r = e.reasonCode;
                    r && r > 0 && 16 !== r && ((s = new Error("Publish error: " + _[r])).code = r, i(s, e)), delete this.outgoing[t], this.outgoingStore.del(e, i), this.messageIdProvider.deallocate(t), this._invokeStoreProcessingQueue();
                    break;
                  }
                case "pubrec":
                  {
                    n = {
                      cmd: "pubrel",
                      qos: 2,
                      messageId: t
                    };
                    const r = e.reasonCode;
                    r && r > 0 && 16 !== r ? ((s = new Error("Publish error: " + _[r])).code = r, i(s, e)) : this._sendPacket(n);
                    break;
                  }
                case "suback":
                  delete this.outgoing[t], this.messageIdProvider.deallocate(t);
                  for (let r = 0; r < e.granted.length; r++) if (0 != (128 & e.granted[r])) {
                    const e = this.messageIdToTopic[t];
                    e && e.forEach(function (e) {
                      delete o._resubscribeTopics[e];
                    });
                  }
                  this._invokeStoreProcessingQueue(), i(null, e);
                  break;
                case "unsuback":
                  delete this.outgoing[t], this.messageIdProvider.deallocate(t), this._invokeStoreProcessingQueue(), i(null);
                  break;
                default:
                  o.emit("error", new Error("unrecognized packet type"));
              }
              this.disconnecting && 0 === Object.keys(this.outgoing).length && this.emit("outgoingEmpty");
            } else y("_handleAck :: Server sent an ack in error. Ignoring.");
          }, T.prototype._handlePubrel = function (e, t) {
            y("handling pubrel packet"), t = void 0 !== t ? t : C;
            const r = this,
              n = {
                cmd: "pubcomp",
                messageId: e.messageId
              };
            r.incomingStore.get(e, function (e, i) {
              e ? r._sendPacket(n, t) : (r.emit("message", i.topic, i.payload, i), r.handleMessage(i, function (e) {
                if (e) return t(e);
                r.incomingStore.del(i, C), r._sendPacket(n, t);
              }));
            });
          }, T.prototype._handleDisconnect = function (e) {
            this.emit("disconnect", e);
          }, T.prototype._nextId = function () {
            return this.messageIdProvider.allocate();
          }, T.prototype.getLastMessageId = function () {
            return this.messageIdProvider.getLastAllocated();
          }, T.prototype._resubscribe = function () {
            y("_resubscribe");
            const e = Object.keys(this._resubscribeTopics);
            if (!this._firstConnection && (this.options.clean || 5 === this.options.protocolVersion && !this.connackPacket.sessionPresent) && e.length > 0) if (this.options.resubscribe) {
              if (5 === this.options.protocolVersion) {
                y("_resubscribe: protocolVersion 5");
                for (let t = 0; t < e.length; t++) {
                  const r = {};
                  r[e[t]] = this._resubscribeTopics[e[t]], r.resubscribe = !0, this.subscribe(r, {
                    properties: r[e[t]].properties
                  });
                }
              } else this._resubscribeTopics.resubscribe = !0, this.subscribe(this._resubscribeTopics);
            } else this._resubscribeTopics = {};
            this._firstConnection = !1;
          }, T.prototype._onConnect = function (e) {
            if (this.disconnected) return void this.emit("connect", e);
            const t = this;
            this.connackPacket = e, this.messageIdProvider.clear(), this._setupPingTimer(), this.connected = !0, function r() {
              let n = t.outgoingStore.createStream();
              function i() {
                t._storeProcessing = !1, t._packetIdsDuringStoreProcessing = {};
              }
              function o() {
                n.destroy(), n = null, t._flushStoreProcessingQueue(), i();
              }
              t.once("close", o), n.on("error", function (e) {
                i(), t._flushStoreProcessingQueue(), t.removeListener("close", o), t.emit("error", e);
              }), n.on("end", function () {
                let n = !0;
                for (const e in t._packetIdsDuringStoreProcessing) if (!t._packetIdsDuringStoreProcessing[e]) {
                  n = !1;
                  break;
                }
                n ? (i(), t.removeListener("close", o), t._invokeAllStoreProcessingQueue(), t.emit("connect", e)) : r();
              }), function e() {
                if (!n) return;
                t._storeProcessing = !0;
                const r = n.read(1);
                let i;
                r ? t._packetIdsDuringStoreProcessing[r.messageId] ? e() : t.disconnecting || t.reconnectTimer ? n.destroy && n.destroy() : (i = t.outgoing[r.messageId] ? t.outgoing[r.messageId].cb : null, t.outgoing[r.messageId] = {
                  volatile: !1,
                  cb: function (t, r) {
                    i && i(t, r), e();
                  }
                }, t._packetIdsDuringStoreProcessing[r.messageId] = !0, t.messageIdProvider.register(r.messageId) ? t._sendPacket(r) : y("messageId: %d has already used.", r.messageId)) : n.once("readable", e);
              }();
            }();
          }, T.prototype._invokeStoreProcessingQueue = function () {
            if (this._storeProcessingQueue.length > 0) {
              const e = this._storeProcessingQueue[0];
              if (e && e.invoke()) return this._storeProcessingQueue.shift(), !0;
            }
            return !1;
          }, T.prototype._invokeAllStoreProcessingQueue = function () {
            for (; this._invokeStoreProcessingQueue(););
          }, T.prototype._flushStoreProcessingQueue = function () {
            for (const e of this._storeProcessingQueue) e.cbStorePut && e.cbStorePut(new Error("Connection closed")), e.callback && e.callback(new Error("Connection closed"));
            this._storeProcessingQueue.splice(0);
          }, t.exports = T;
        }).call(this);
      }).call(this, e("_process"), "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "./default-message-id-provider": 7,
      "./store": 8,
      "./topic-alias-recv": 9,
      "./topic-alias-send": 10,
      "./validations": 11,
      _process: 50,
      debug: 18,
      events: 22,
      inherits: 24,
      "mqtt-packet": 40,
      "readable-stream": 69,
      reinterval: 70,
      "rfdc/default": 71,
      xtend: 81
    }],
    2: [function (e, t, r) {
      (function (r) {
        (function () {
          "use strict";

          const n = e("readable-stream").Transform,
            i = e("duplexify");
          let o,
            s,
            a,
            l = !1;
          t.exports = function (e, t) {
            if (t.hostname = t.hostname || t.host, !t.hostname) throw new Error("Could not determine host. Specify host manually.");
            const u = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt";
            !function (e) {
              e.hostname || (e.hostname = "localhost"), e.path || (e.path = "/"), e.wsOptions || (e.wsOptions = {});
            }(t);
            const c = function (e, t) {
              const r = "alis" === e.protocol ? "wss" : "ws";
              let n = r + "://" + e.hostname + e.path;
              return e.port && 80 !== e.port && 443 !== e.port && (n = r + "://" + e.hostname + ":" + e.port + e.path), "function" == typeof e.transformWsUrl && (n = e.transformWsUrl(n, e, t)), n;
            }(t, e);
            return (o = t.my).connectSocket({
              url: c,
              protocols: u
            }), s = function () {
              const e = new n();
              return e._write = function (e, t, r) {
                o.sendSocketMessage({
                  data: e.buffer,
                  success: function () {
                    r();
                  },
                  fail: function () {
                    r(new Error());
                  }
                });
              }, e._flush = function (e) {
                o.closeSocket({
                  success: function () {
                    e();
                  }
                });
              }, e;
            }(), a = i.obj(), l || (l = !0, o.onSocketOpen(function () {
              a.setReadable(s), a.setWritable(s), a.emit("connect");
            }), o.onSocketMessage(function (e) {
              if ("string" == typeof e.data) {
                const t = r.from(e.data, "base64");
                s.push(t);
              } else {
                const t = new FileReader();
                t.addEventListener("load", function () {
                  let e = t.result;
                  e = e instanceof ArrayBuffer ? r.from(e) : r.from(e, "utf8"), s.push(e);
                }), t.readAsArrayBuffer(e.data);
              }
            }), o.onSocketClose(function () {
              a.end(), a.destroy();
            }), o.onSocketError(function (e) {
              a.destroy(e);
            })), a;
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      buffer: 17,
      duplexify: 20,
      "readable-stream": 69
    }],
    3: [function (e, t, r) {
      "use strict";

      const n = e("net"),
        i = e("debug")("mqttjs:tcp");
      t.exports = function (e, t) {
        t.port = t.port || 1883, t.hostname = t.hostname || t.host || "localhost";
        const r = t.port,
          o = t.hostname;
        return i("port %d and host %s", r, o), n.createConnection(r, o);
      };
    }, {
      debug: 18,
      net: 16
    }],
    4: [function (e, t, r) {
      "use strict";

      const n = e("tls"),
        i = e("net"),
        o = e("debug")("mqttjs:tls");
      t.exports = function (e, t) {
        t.port = t.port || 8883, t.host = t.hostname || t.host || "localhost", 0 === i.isIP(t.host) && (t.servername = t.host), t.rejectUnauthorized = !1 !== t.rejectUnauthorized, delete t.path, o("port %d host %s rejectUnauthorized %b", t.port, t.host, t.rejectUnauthorized);
        const r = n.connect(t);
        function s(n) {
          t.rejectUnauthorized && e.emit("error", n), r.end();
        }
        return r.on("secureConnect", function () {
          t.rejectUnauthorized && !r.authorized ? r.emit("error", new Error("TLS not authorized")) : r.removeListener("error", s);
        }), r.on("error", s), r;
      };
    }, {
      debug: 18,
      net: 16,
      tls: 16
    }],
    5: [function (e, t, r) {
      (function (r, n) {
        (function () {
          "use strict";

          const i = e("ws"),
            o = e("debug")("mqttjs:ws"),
            s = e("duplexify"),
            a = e("readable-stream").Transform,
            l = ["rejectUnauthorized", "ca", "cert", "key", "pfx", "passphrase"],
            u = void 0 !== r && "browser" === r.title || "function" == typeof __webpack_require__;
          function c(e, t) {
            let r = e.protocol + "://" + e.hostname + ":" + e.port + e.path;
            return "function" == typeof e.transformWsUrl && (r = e.transformWsUrl(r, e, t)), r;
          }
          function h(e) {
            const t = e;
            return e.hostname || (t.hostname = "localhost"), e.port || ("wss" === e.protocol ? t.port = 443 : t.port = 80), e.path || (t.path = "/"), e.wsOptions || (t.wsOptions = {}), u || "wss" !== e.protocol || l.forEach(function (r) {
              Object.prototype.hasOwnProperty.call(e, r) && !Object.prototype.hasOwnProperty.call(e.wsOptions, r) && (t.wsOptions[r] = e[r]);
            }), t;
          }
          t.exports = u ? function (e, t) {
            let r;
            o("browserStreamBuilder");
            const i = function (e) {
                const t = h(e);
                if (t.hostname || (t.hostname = t.host), !t.hostname) {
                  if ("undefined" == typeof document) throw new Error("Could not determine host. Specify host manually.");
                  const e = new URL(document.URL);
                  t.hostname = e.hostname, t.port || (t.port = e.port);
                }
                return void 0 === t.objectMode && (t.objectMode = !(!0 === t.binary || void 0 === t.binary)), t;
              }(t).browserBufferSize || 524288,
              l = t.browserBufferTimeout || 1e3,
              u = !t.objectMode,
              f = function (e, t) {
                const r = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt",
                  n = c(t, e),
                  i = new WebSocket(n, [r]);
                return i.binaryType = "arraybuffer", i;
              }(e, t),
              p = function (e, t, r) {
                const n = new a({
                  objectModeMode: e.objectMode
                });
                return n._write = t, n._flush = r, n;
              }(t, function e(t, r, o) {
                f.bufferedAmount > i && setTimeout(e, l, t, r, o), u && "string" == typeof t && (t = n.from(t, "utf8"));
                try {
                  f.send(t);
                } catch (e) {
                  return o(e);
                }
                o();
              }, function (e) {
                f.close(), e();
              });
            t.objectMode || (p._writev = v), p.on("close", () => {
              f.close();
            });
            const d = void 0 !== f.addEventListener;
            function g() {
              r.setReadable(p), r.setWritable(p), r.emit("connect");
            }
            function y() {
              r.end(), r.destroy();
            }
            function b(e) {
              r.destroy(e);
            }
            function m(e) {
              let t = e.data;
              t = t instanceof ArrayBuffer ? n.from(t) : n.from(t, "utf8"), p.push(t);
            }
            function v(e, t) {
              const r = new Array(e.length);
              for (let t = 0; t < e.length; t++) "string" == typeof e[t].chunk ? r[t] = n.from(e[t], "utf8") : r[t] = e[t].chunk;
              this._write(n.concat(r), "binary", t);
            }
            return f.readyState === f.OPEN ? r = p : (r = r = s(void 0, void 0, t), t.objectMode || (r._writev = v), d ? f.addEventListener("open", g) : f.onopen = g), r.socket = f, d ? (f.addEventListener("close", y), f.addEventListener("error", b), f.addEventListener("message", m)) : (f.onclose = y, f.onerror = b, f.onmessage = m), r;
          } : function (e, t) {
            o("streamBuilder");
            const r = h(t),
              n = c(r, e),
              s = function (e, t, r) {
                o("createWebSocket"), o("protocol: " + r.protocolId + " " + r.protocolVersion);
                const n = "MQIsdp" === r.protocolId && 3 === r.protocolVersion ? "mqttv3.1" : "mqtt";
                return o("creating new Websocket for url: " + t + " and protocol: " + n), new i(t, [n], r.wsOptions);
              }(0, n, r),
              a = i.createWebSocketStream(s, r.wsOptions);
            return a.url = n, s.on("close", () => {
              a.destroy();
            }), a;
          };
        }).call(this);
      }).call(this, e("_process"), e("buffer").Buffer);
    }, {
      _process: 50,
      buffer: 17,
      debug: 18,
      duplexify: 20,
      "readable-stream": 69,
      ws: 80
    }],
    6: [function (e, t, r) {
      (function (r) {
        (function () {
          "use strict";

          const n = e("readable-stream").Transform,
            i = e("duplexify");
          let o, s, a;
          t.exports = function (e, t) {
            if (t.hostname = t.hostname || t.host, !t.hostname) throw new Error("Could not determine host. Specify host manually.");
            const l = "MQIsdp" === t.protocolId && 3 === t.protocolVersion ? "mqttv3.1" : "mqtt";
            !function (e) {
              e.hostname || (e.hostname = "localhost"), e.path || (e.path = "/"), e.wsOptions || (e.wsOptions = {});
            }(t);
            const u = function (e, t) {
              const r = "wxs" === e.protocol ? "wss" : "ws";
              let n = r + "://" + e.hostname + e.path;
              return e.port && 80 !== e.port && 443 !== e.port && (n = r + "://" + e.hostname + ":" + e.port + e.path), "function" == typeof e.transformWsUrl && (n = e.transformWsUrl(n, e, t)), n;
            }(t, e);
            o = wx.connectSocket({
              url: u,
              protocols: [l]
            }), s = function () {
              const e = new n();
              return e._write = function (e, t, r) {
                o.send({
                  data: e.buffer,
                  success: function () {
                    r();
                  },
                  fail: function (e) {
                    r(new Error(e));
                  }
                });
              }, e._flush = function (e) {
                o.close({
                  success: function () {
                    e();
                  }
                });
              }, e;
            }(), (a = i.obj())._destroy = function (e, t) {
              o.close({
                success: function () {
                  t && t(e);
                }
              });
            };
            const c = a.destroy;
            return a.destroy = function () {
              a.destroy = c;
              const e = this;
              setTimeout(function () {
                o.close({
                  fail: function () {
                    e._destroy(new Error());
                  }
                });
              }, 0);
            }.bind(a), o.onOpen(function () {
              a.setReadable(s), a.setWritable(s), a.emit("connect");
            }), o.onMessage(function (e) {
              let t = e.data;
              t = t instanceof ArrayBuffer ? r.from(t) : r.from(t, "utf8"), s.push(t);
            }), o.onClose(function () {
              a.end(), a.destroy();
            }), o.onError(function (e) {
              a.destroy(new Error(e.errMsg));
            }), a;
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      buffer: 17,
      duplexify: 20,
      "readable-stream": 69
    }],
    7: [function (e, t, r) {
      "use strict";

      function n() {
        if (!(this instanceof n)) return new n();
        this.nextId = Math.max(1, Math.floor(65535 * Math.random()));
      }
      n.prototype.allocate = function () {
        const e = this.nextId++;
        return 65536 === this.nextId && (this.nextId = 1), e;
      }, n.prototype.getLastAllocated = function () {
        return 1 === this.nextId ? 65535 : this.nextId - 1;
      }, n.prototype.register = function (e) {
        return !0;
      }, n.prototype.deallocate = function (e) {}, n.prototype.clear = function () {}, t.exports = n;
    }, {}],
    8: [function (e, t, r) {
      "use strict";

      const n = e("xtend"),
        i = e("readable-stream").Readable,
        o = {
          objectMode: !0
        },
        s = {
          clean: !0
        };
      function a(e) {
        if (!(this instanceof a)) return new a(e);
        this.options = e || {}, this.options = n(s, e), this._inflights = new Map();
      }
      a.prototype.put = function (e, t) {
        return this._inflights.set(e.messageId, e), t && t(), this;
      }, a.prototype.createStream = function () {
        const e = new i(o),
          t = [];
        let r = !1,
          n = 0;
        return this._inflights.forEach(function (e, r) {
          t.push(e);
        }), e._read = function () {
          !r && n < t.length ? this.push(t[n++]) : this.push(null);
        }, e.destroy = function () {
          if (r) return;
          const e = this;
          r = !0, setTimeout(function () {
            e.emit("close");
          }, 0);
        }, e;
      }, a.prototype.del = function (e, t) {
        return (e = this._inflights.get(e.messageId)) ? (this._inflights.delete(e.messageId), t(null, e)) : t && t(new Error("missing packet")), this;
      }, a.prototype.get = function (e, t) {
        return (e = this._inflights.get(e.messageId)) ? t(null, e) : t && t(new Error("missing packet")), this;
      }, a.prototype.close = function (e) {
        this.options.clean && (this._inflights = null), e && e();
      }, t.exports = a;
    }, {
      "readable-stream": 69,
      xtend: 81
    }],
    9: [function (e, t, r) {
      "use strict";

      function n(e) {
        if (!(this instanceof n)) return new n(e);
        this.aliasToTopic = {}, this.max = e;
      }
      n.prototype.put = function (e, t) {
        return !(0 === t || t > this.max) && (this.aliasToTopic[t] = e, this.length = Object.keys(this.aliasToTopic).length, !0);
      }, n.prototype.getTopicByAlias = function (e) {
        return this.aliasToTopic[e];
      }, n.prototype.clear = function () {
        this.aliasToTopic = {};
      }, t.exports = n;
    }, {}],
    10: [function (e, t, r) {
      "use strict";

      const n = e("lru-cache"),
        i = e("number-allocator").NumberAllocator;
      function o(e) {
        if (!(this instanceof o)) return new o(e);
        e > 0 && (this.aliasToTopic = new n({
          max: e
        }), this.topicToAlias = {}, this.numberAllocator = new i(1, e), this.max = e, this.length = 0);
      }
      o.prototype.put = function (e, t) {
        if (0 === t || t > this.max) return !1;
        const r = this.aliasToTopic.get(t);
        return r && delete this.topicToAlias[r], this.aliasToTopic.set(t, e), this.topicToAlias[e] = t, this.numberAllocator.use(t), this.length = this.aliasToTopic.length, !0;
      }, o.prototype.getTopicByAlias = function (e) {
        return this.aliasToTopic.get(e);
      }, o.prototype.getAliasByTopic = function (e) {
        const t = this.topicToAlias[e];
        return void 0 !== t && this.aliasToTopic.get(t), t;
      }, o.prototype.clear = function () {
        this.aliasToTopic.reset(), this.topicToAlias = {}, this.numberAllocator.clear(), this.length = 0;
      }, o.prototype.getLruAlias = function () {
        const e = this.numberAllocator.firstVacant();
        return e || this.aliasToTopic.keys()[this.aliasToTopic.length - 1];
      }, t.exports = o;
    }, {
      "lru-cache": 37,
      "number-allocator": 46
    }],
    11: [function (e, t, r) {
      "use strict";

      function n(e) {
        const t = e.split("/");
        for (let e = 0; e < t.length; e++) if ("+" !== t[e]) {
          if ("#" === t[e]) return e === t.length - 1;
          if (-1 !== t[e].indexOf("+") || -1 !== t[e].indexOf("#")) return !1;
        }
        return !0;
      }
      t.exports = {
        validateTopics: function (e) {
          if (0 === e.length) return "empty_topic_list";
          for (let t = 0; t < e.length; t++) if (!n(e[t])) return e[t];
          return null;
        }
      };
    }, {}],
    12: [function (e, t, r) {
      (function (r) {
        (function () {
          "use strict";

          const n = e("../client"),
            i = e("../store"),
            o = e("url"),
            s = e("xtend"),
            a = e("debug")("mqttjs"),
            l = {};
          function u(e, t) {
            if (a("connecting to an MQTT broker..."), "object" != typeof e || t || (t = e, e = null), t = t || {}, e) {
              const r = o.parse(e, !0);
              if (null != r.port && (r.port = Number(r.port)), null === (t = s(r, t)).protocol) throw new Error("Missing protocol");
              t.protocol = t.protocol.replace(/:$/, "");
            }
            if (function (e) {
              let t;
              e.auth && ((t = e.auth.match(/^(.+):(.+)$/)) ? (e.username = t[1], e.password = t[2]) : e.username = e.auth);
            }(t), t.query && "string" == typeof t.query.clientId && (t.clientId = t.query.clientId), t.cert && t.key) {
              if (!t.protocol) throw new Error("Missing secure protocol key");
              if (-1 === ["mqtts", "wss", "wxs", "alis"].indexOf(t.protocol)) switch (t.protocol) {
                case "mqtt":
                  t.protocol = "mqtts";
                  break;
                case "ws":
                  t.protocol = "wss";
                  break;
                case "wx":
                  t.protocol = "wxs";
                  break;
                case "ali":
                  t.protocol = "alis";
                  break;
                default:
                  throw new Error('Unknown protocol for secure connection: "' + t.protocol + '"!');
              }
            }
            if (!l[t.protocol]) {
              const e = -1 !== ["mqtts", "wss"].indexOf(t.protocol);
              t.protocol = ["mqtt", "mqtts", "ws", "wss", "wx", "wxs", "ali", "alis"].filter(function (t, r) {
                return (!e || r % 2 != 0) && "function" == typeof l[t];
              })[0];
            }
            if (!1 === t.clean && !t.clientId) throw new Error("Missing clientId for unclean clients");
            t.protocol && (t.defaultProtocol = t.protocol);
            const r = new n(function (e) {
              return t.servers && (e._reconnectCount && e._reconnectCount !== t.servers.length || (e._reconnectCount = 0), t.host = t.servers[e._reconnectCount].host, t.port = t.servers[e._reconnectCount].port, t.protocol = t.servers[e._reconnectCount].protocol ? t.servers[e._reconnectCount].protocol : t.defaultProtocol, t.hostname = t.host, e._reconnectCount++), a("calling streambuilder for", t.protocol), l[t.protocol](e, t);
            }, t);
            return r.on("error", function () {}), r;
          }
          void 0 !== r && "browser" !== r.title || "function" != typeof __webpack_require__ ? (l.mqtt = e("./tcp"), l.tcp = e("./tcp"), l.ssl = e("./tls"), l.tls = e("./tls"), l.mqtts = e("./tls")) : (l.wx = e("./wx"), l.wxs = e("./wx"), l.ali = e("./ali"), l.alis = e("./ali")), l.ws = e("./ws"), l.wss = e("./ws"), t.exports = u, t.exports.connect = u, t.exports.MqttClient = n, t.exports.Store = i;
        }).call(this);
      }).call(this, e("_process"));
    }, {
      "../client": 1,
      "../store": 8,
      "./ali": 2,
      "./tcp": 3,
      "./tls": 4,
      "./ws": 5,
      "./wx": 6,
      _process: 50,
      debug: 18,
      url: 76,
      xtend: 81
    }],
    13: [function (e, t, r) {
      "use strict";

      r.byteLength = function (e) {
        var t = u(e),
          r = t[0],
          n = t[1];
        return 3 * (r + n) / 4 - n;
      }, r.toByteArray = function (e) {
        var t,
          r,
          n = u(e),
          s = n[0],
          a = n[1],
          l = new o(function (e, t, r) {
            return 3 * (t + r) / 4 - r;
          }(0, s, a)),
          c = 0,
          h = a > 0 ? s - 4 : s;
        for (r = 0; r < h; r += 4) t = i[e.charCodeAt(r)] << 18 | i[e.charCodeAt(r + 1)] << 12 | i[e.charCodeAt(r + 2)] << 6 | i[e.charCodeAt(r + 3)], l[c++] = t >> 16 & 255, l[c++] = t >> 8 & 255, l[c++] = 255 & t;
        2 === a && (t = i[e.charCodeAt(r)] << 2 | i[e.charCodeAt(r + 1)] >> 4, l[c++] = 255 & t);
        1 === a && (t = i[e.charCodeAt(r)] << 10 | i[e.charCodeAt(r + 1)] << 4 | i[e.charCodeAt(r + 2)] >> 2, l[c++] = t >> 8 & 255, l[c++] = 255 & t);
        return l;
      }, r.fromByteArray = function (e) {
        for (var t, r = e.length, i = r % 3, o = [], s = 0, a = r - i; s < a; s += 16383) o.push(c(e, s, s + 16383 > a ? a : s + 16383));
        1 === i ? (t = e[r - 1], o.push(n[t >> 2] + n[t << 4 & 63] + "==")) : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], o.push(n[t >> 10] + n[t >> 4 & 63] + n[t << 2 & 63] + "="));
        return o.join("");
      };
      for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, l = s.length; a < l; ++a) n[a] = s[a], i[s.charCodeAt(a)] = a;
      function u(e) {
        var t = e.length;
        if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
        var r = e.indexOf("=");
        return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4];
      }
      function c(e, t, r) {
        for (var i, o, s = [], a = t; a < r; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), s.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
        return s.join("");
      }
      i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
    }, {}],
    14: [function (e, t, r) {
      "use strict";

      const {
          Buffer: n
        } = e("buffer"),
        i = Symbol.for("BufferList");
      function o(e) {
        if (!(this instanceof o)) return new o(e);
        o._init.call(this, e);
      }
      o._init = function (e) {
        Object.defineProperty(this, i, {
          value: !0
        }), this._bufs = [], this.length = 0, e && this.append(e);
      }, o.prototype._new = function (e) {
        return new o(e);
      }, o.prototype._offset = function (e) {
        if (0 === e) return [0, 0];
        let t = 0;
        for (let r = 0; r < this._bufs.length; r++) {
          const n = t + this._bufs[r].length;
          if (e < n || r === this._bufs.length - 1) return [r, e - t];
          t = n;
        }
      }, o.prototype._reverseOffset = function (e) {
        const t = e[0];
        let r = e[1];
        for (let e = 0; e < t; e++) r += this._bufs[e].length;
        return r;
      }, o.prototype.get = function (e) {
        if (e > this.length || e < 0) return;
        const t = this._offset(e);
        return this._bufs[t[0]][t[1]];
      }, o.prototype.slice = function (e, t) {
        return "number" == typeof e && e < 0 && (e += this.length), "number" == typeof t && t < 0 && (t += this.length), this.copy(null, 0, e, t);
      }, o.prototype.copy = function (e, t, r, i) {
        if (("number" != typeof r || r < 0) && (r = 0), ("number" != typeof i || i > this.length) && (i = this.length), r >= this.length) return e || n.alloc(0);
        if (i <= 0) return e || n.alloc(0);
        const o = !!e,
          s = this._offset(r),
          a = i - r;
        let l = a,
          u = o && t || 0,
          c = s[1];
        if (0 === r && i === this.length) {
          if (!o) return 1 === this._bufs.length ? this._bufs[0] : n.concat(this._bufs, this.length);
          for (let t = 0; t < this._bufs.length; t++) this._bufs[t].copy(e, u), u += this._bufs[t].length;
          return e;
        }
        if (l <= this._bufs[s[0]].length - c) return o ? this._bufs[s[0]].copy(e, t, c, c + l) : this._bufs[s[0]].slice(c, c + l);
        o || (e = n.allocUnsafe(a));
        for (let t = s[0]; t < this._bufs.length; t++) {
          const r = this._bufs[t].length - c;
          if (!(l > r)) {
            this._bufs[t].copy(e, u, c, c + l), u += r;
            break;
          }
          this._bufs[t].copy(e, u, c), u += r, l -= r, c && (c = 0);
        }
        return e.length > u ? e.slice(0, u) : e;
      }, o.prototype.shallowSlice = function (e, t) {
        if (e = e || 0, t = "number" != typeof t ? this.length : t, e < 0 && (e += this.length), t < 0 && (t += this.length), e === t) return this._new();
        const r = this._offset(e),
          n = this._offset(t),
          i = this._bufs.slice(r[0], n[0] + 1);
        return 0 === n[1] ? i.pop() : i[i.length - 1] = i[i.length - 1].slice(0, n[1]), 0 !== r[1] && (i[0] = i[0].slice(r[1])), this._new(i);
      }, o.prototype.toString = function (e, t, r) {
        return this.slice(t, r).toString(e);
      }, o.prototype.consume = function (e) {
        if (e = Math.trunc(e), Number.isNaN(e) || e <= 0) return this;
        for (; this._bufs.length;) {
          if (!(e >= this._bufs[0].length)) {
            this._bufs[0] = this._bufs[0].slice(e), this.length -= e;
            break;
          }
          e -= this._bufs[0].length, this.length -= this._bufs[0].length, this._bufs.shift();
        }
        return this;
      }, o.prototype.duplicate = function () {
        const e = this._new();
        for (let t = 0; t < this._bufs.length; t++) e.append(this._bufs[t]);
        return e;
      }, o.prototype.append = function (e) {
        if (null == e) return this;
        if (e.buffer) this._appendBuffer(n.from(e.buffer, e.byteOffset, e.byteLength));else if (Array.isArray(e)) for (let t = 0; t < e.length; t++) this.append(e[t]);else if (this._isBufferList(e)) for (let t = 0; t < e._bufs.length; t++) this.append(e._bufs[t]);else "number" == typeof e && (e = e.toString()), this._appendBuffer(n.from(e));
        return this;
      }, o.prototype._appendBuffer = function (e) {
        this._bufs.push(e), this.length += e.length;
      }, o.prototype.indexOf = function (e, t, r) {
        if (void 0 === r && "string" == typeof t && (r = t, t = void 0), "function" == typeof e || Array.isArray(e)) throw new TypeError('The "value" argument must be one of type string, Buffer, BufferList, or Uint8Array.');
        if ("number" == typeof e ? e = n.from([e]) : "string" == typeof e ? e = n.from(e, r) : this._isBufferList(e) ? e = e.slice() : Array.isArray(e.buffer) ? e = n.from(e.buffer, e.byteOffset, e.byteLength) : n.isBuffer(e) || (e = n.from(e)), t = Number(t || 0), isNaN(t) && (t = 0), t < 0 && (t = this.length + t), t < 0 && (t = 0), 0 === e.length) return t > this.length ? this.length : t;
        const i = this._offset(t);
        let o = i[0],
          s = i[1];
        for (; o < this._bufs.length; o++) {
          const t = this._bufs[o];
          for (; s < t.length;) {
            if (t.length - s >= e.length) {
              const r = t.indexOf(e, s);
              if (-1 !== r) return this._reverseOffset([o, r]);
              s = t.length - e.length + 1;
            } else {
              const t = this._reverseOffset([o, s]);
              if (this._match(t, e)) return t;
              s++;
            }
          }
          s = 0;
        }
        return -1;
      }, o.prototype._match = function (e, t) {
        if (this.length - e < t.length) return !1;
        for (let r = 0; r < t.length; r++) if (this.get(e + r) !== t[r]) return !1;
        return !0;
      }, function () {
        const e = {
          readDoubleBE: 8,
          readDoubleLE: 8,
          readFloatBE: 4,
          readFloatLE: 4,
          readInt32BE: 4,
          readInt32LE: 4,
          readUInt32BE: 4,
          readUInt32LE: 4,
          readInt16BE: 2,
          readInt16LE: 2,
          readUInt16BE: 2,
          readUInt16LE: 2,
          readInt8: 1,
          readUInt8: 1,
          readIntBE: null,
          readIntLE: null,
          readUIntBE: null,
          readUIntLE: null
        };
        for (const t in e) !function (t) {
          o.prototype[t] = null === e[t] ? function (e, r) {
            return this.slice(e, e + r)[t](0, r);
          } : function (r = 0) {
            return this.slice(r, r + e[t])[t](0);
          };
        }(t);
      }(), o.prototype._isBufferList = function (e) {
        return e instanceof o || o.isBufferList(e);
      }, o.isBufferList = function (e) {
        return null != e && e[i];
      }, t.exports = o;
    }, {
      buffer: 17
    }],
    15: [function (e, t, r) {
      "use strict";

      const n = e("readable-stream").Duplex,
        i = e("inherits"),
        o = e("./BufferList");
      function s(e) {
        if (!(this instanceof s)) return new s(e);
        if ("function" == typeof e) {
          this._callback = e;
          const t = function (e) {
            this._callback && (this._callback(e), this._callback = null);
          }.bind(this);
          this.on("pipe", function (e) {
            e.on("error", t);
          }), this.on("unpipe", function (e) {
            e.removeListener("error", t);
          }), e = null;
        }
        o._init.call(this, e), n.call(this);
      }
      i(s, n), Object.assign(s.prototype, o.prototype), s.prototype._new = function (e) {
        return new s(e);
      }, s.prototype._write = function (e, t, r) {
        this._appendBuffer(e), "function" == typeof r && r();
      }, s.prototype._read = function (e) {
        if (!this.length) return this.push(null);
        e = Math.min(e, this.length), this.push(this.slice(0, e)), this.consume(e);
      }, s.prototype.end = function (e) {
        n.prototype.end.call(this, e), this._callback && (this._callback(null, this.slice()), this._callback = null);
      }, s.prototype._destroy = function (e, t) {
        this._bufs.length = 0, this.length = 0, t(e);
      }, s.prototype._isBufferList = function (e) {
        return e instanceof s || e instanceof o || s.isBufferList(e);
      }, s.isBufferList = o.isBufferList, t.exports = s, t.exports.BufferListStream = s, t.exports.BufferList = o;
    }, {
      "./BufferList": 14,
      inherits: 24,
      "readable-stream": 69
    }],
    16: [function (e, t, r) {}, {}],
    17: [function (e, t, r) {
      (function (t) {
        (function () {
          "use strict";

          var t = e("base64-js"),
            n = e("ieee754");
          r.Buffer = s, r.SlowBuffer = function (e) {
            +e != e && (e = 0);
            return s.alloc(+e);
          }, r.INSPECT_MAX_BYTES = 50;
          var i = 2147483647;
          function o(e) {
            if (e > i) throw new RangeError('The value "' + e + '" is invalid for option "size"');
            var t = new Uint8Array(e);
            return t.__proto__ = s.prototype, t;
          }
          function s(e, t, r) {
            if ("number" == typeof e) {
              if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
              return u(e);
            }
            return a(e, t, r);
          }
          function a(e, t, r) {
            if ("string" == typeof e) return function (e, t) {
              "string" == typeof t && "" !== t || (t = "utf8");
              if (!s.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
              var r = 0 | f(e, t),
                n = o(r),
                i = n.write(e, t);
              i !== r && (n = n.slice(0, i));
              return n;
            }(e, t);
            if (ArrayBuffer.isView(e)) return c(e);
            if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
            if (q(e, ArrayBuffer) || e && q(e.buffer, ArrayBuffer)) return function (e, t, r) {
              if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
              if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
              var n;
              n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
              return n.__proto__ = s.prototype, n;
            }(e, t, r);
            if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
            var n = e.valueOf && e.valueOf();
            if (null != n && n !== e) return s.from(n, t, r);
            var i = function (e) {
              if (s.isBuffer(e)) {
                var t = 0 | h(e.length),
                  r = o(t);
                return 0 === r.length ? r : (e.copy(r, 0, 0, t), r);
              }
              if (void 0 !== e.length) return "number" != typeof e.length || D(e.length) ? o(0) : c(e);
              if ("Buffer" === e.type && Array.isArray(e.data)) return c(e.data);
            }(e);
            if (i) return i;
            if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return s.from(e[Symbol.toPrimitive]("string"), t, r);
            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
          }
          function l(e) {
            if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
            if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"');
          }
          function u(e) {
            return l(e), o(e < 0 ? 0 : 0 | h(e));
          }
          function c(e) {
            for (var t = e.length < 0 ? 0 : 0 | h(e.length), r = o(t), n = 0; n < t; n += 1) r[n] = 255 & e[n];
            return r;
          }
          function h(e) {
            if (e >= i) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
            return 0 | e;
          }
          function f(e, t) {
            if (s.isBuffer(e)) return e.length;
            if (ArrayBuffer.isView(e) || q(e, ArrayBuffer)) return e.byteLength;
            if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
            var r = e.length,
              n = arguments.length > 2 && !0 === arguments[2];
            if (!n && 0 === r) return 0;
            for (var i = !1;;) switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;
              case "utf8":
              case "utf-8":
                return L(e).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * r;
              case "hex":
                return r >>> 1;
              case "base64":
                return j(e).length;
              default:
                if (i) return n ? -1 : L(e).length;
                t = ("" + t).toLowerCase(), i = !0;
            }
          }
          function p(e, t, r) {
            var n = e[t];
            e[t] = e[r], e[r] = n;
          }
          function d(e, t, r, n, i) {
            if (0 === e.length) return -1;
            if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), D(r = +r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
              if (i) return -1;
              r = e.length - 1;
            } else if (r < 0) {
              if (!i) return -1;
              r = 0;
            }
            if ("string" == typeof t && (t = s.from(t, n)), s.isBuffer(t)) return 0 === t.length ? -1 : g(e, t, r, n, i);
            if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : g(e, [t], r, n, i);
            throw new TypeError("val must be string, number or Buffer");
          }
          function g(e, t, r, n, i) {
            var o,
              s = 1,
              a = e.length,
              l = t.length;
            if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
              if (e.length < 2 || t.length < 2) return -1;
              s = 2, a /= 2, l /= 2, r /= 2;
            }
            function u(e, t) {
              return 1 === s ? e[t] : e.readUInt16BE(t * s);
            }
            if (i) {
              var c = -1;
              for (o = r; o < a; o++) if (u(e, o) === u(t, -1 === c ? 0 : o - c)) {
                if (-1 === c && (c = o), o - c + 1 === l) return c * s;
              } else -1 !== c && (o -= o - c), c = -1;
            } else for (r + l > a && (r = a - l), o = r; o >= 0; o--) {
              for (var h = !0, f = 0; f < l; f++) if (u(e, o + f) !== u(t, f)) {
                h = !1;
                break;
              }
              if (h) return o;
            }
            return -1;
          }
          function y(e, t, r, n) {
            r = Number(r) || 0;
            var i = e.length - r;
            n ? (n = Number(n)) > i && (n = i) : n = i;
            var o = t.length;
            n > o / 2 && (n = o / 2);
            for (var s = 0; s < n; ++s) {
              var a = parseInt(t.substr(2 * s, 2), 16);
              if (D(a)) return s;
              e[r + s] = a;
            }
            return s;
          }
          function b(e, t, r, n) {
            return U(L(t, e.length - r), e, r, n);
          }
          function m(e, t, r, n) {
            return U(function (e) {
              for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
              return t;
            }(t), e, r, n);
          }
          function v(e, t, r, n) {
            return m(e, t, r, n);
          }
          function w(e, t, r, n) {
            return U(j(t), e, r, n);
          }
          function _(e, t, r, n) {
            return U(function (e, t) {
              for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
              return o;
            }(t, e.length - r), e, r, n);
          }
          function k(e, r, n) {
            return 0 === r && n === e.length ? t.fromByteArray(e) : t.fromByteArray(e.slice(r, n));
          }
          function S(e, t, r) {
            r = Math.min(e.length, r);
            for (var n = [], i = t; i < r;) {
              var o,
                s,
                a,
                l,
                u = e[i],
                c = null,
                h = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
              if (i + h <= r) switch (h) {
                case 1:
                  u < 128 && (c = u);
                  break;
                case 2:
                  128 == (192 & (o = e[i + 1])) && (l = (31 & u) << 6 | 63 & o) > 127 && (c = l);
                  break;
                case 3:
                  o = e[i + 1], s = e[i + 2], 128 == (192 & o) && 128 == (192 & s) && (l = (15 & u) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (l < 55296 || l > 57343) && (c = l);
                  break;
                case 4:
                  o = e[i + 1], s = e[i + 2], a = e[i + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (l = (15 & u) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && l < 1114112 && (c = l);
              }
              null === c ? (c = 65533, h = 1) : c > 65535 && (c -= 65536, n.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), n.push(c), i += h;
            }
            return function (e) {
              var t = e.length;
              if (t <= E) return String.fromCharCode.apply(String, e);
              var r = "",
                n = 0;
              for (; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += E));
              return r;
            }(n);
          }
          r.kMaxLength = i, s.TYPED_ARRAY_SUPPORT = function () {
            try {
              var e = new Uint8Array(1);
              return e.__proto__ = {
                __proto__: Uint8Array.prototype,
                foo: function () {
                  return 42;
                }
              }, 42 === e.foo();
            } catch (e) {
              return !1;
            }
          }(), s.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(s.prototype, "parent", {
            enumerable: !0,
            get: function () {
              if (s.isBuffer(this)) return this.buffer;
            }
          }), Object.defineProperty(s.prototype, "offset", {
            enumerable: !0,
            get: function () {
              if (s.isBuffer(this)) return this.byteOffset;
            }
          }), "undefined" != typeof Symbol && null != Symbol.species && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, {
            value: null,
            configurable: !0,
            enumerable: !1,
            writable: !1
          }), s.poolSize = 8192, s.from = function (e, t, r) {
            return a(e, t, r);
          }, s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, s.alloc = function (e, t, r) {
            return function (e, t, r) {
              return l(e), e <= 0 ? o(e) : void 0 !== t ? "string" == typeof r ? o(e).fill(t, r) : o(e).fill(t) : o(e);
            }(e, t, r);
          }, s.allocUnsafe = function (e) {
            return u(e);
          }, s.allocUnsafeSlow = function (e) {
            return u(e);
          }, s.isBuffer = function (e) {
            return null != e && !0 === e._isBuffer && e !== s.prototype;
          }, s.compare = function (e, t) {
            if (q(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), q(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), !s.isBuffer(e) || !s.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
            if (e === t) return 0;
            for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i) if (e[i] !== t[i]) {
              r = e[i], n = t[i];
              break;
            }
            return r < n ? -1 : n < r ? 1 : 0;
          }, s.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return !0;
              default:
                return !1;
            }
          }, s.concat = function (e, t) {
            if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
            if (0 === e.length) return s.alloc(0);
            var r;
            if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            var n = s.allocUnsafe(t),
              i = 0;
            for (r = 0; r < e.length; ++r) {
              var o = e[r];
              if (q(o, Uint8Array) && (o = s.from(o)), !s.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
              o.copy(n, i), i += o.length;
            }
            return n;
          }, s.byteLength = f, s.prototype._isBuffer = !0, s.prototype.swap16 = function () {
            var e = this.length;
            if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (var t = 0; t < e; t += 2) p(this, t, t + 1);
            return this;
          }, s.prototype.swap32 = function () {
            var e = this.length;
            if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (var t = 0; t < e; t += 4) p(this, t, t + 3), p(this, t + 1, t + 2);
            return this;
          }, s.prototype.swap64 = function () {
            var e = this.length;
            if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (var t = 0; t < e; t += 8) p(this, t, t + 7), p(this, t + 1, t + 6), p(this, t + 2, t + 5), p(this, t + 3, t + 4);
            return this;
          }, s.prototype.toString = function () {
            var e = this.length;
            return 0 === e ? "" : 0 === arguments.length ? S(this, 0, e) : function (e, t, r) {
              var n = !1;
              if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
              if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
              if ((r >>>= 0) <= (t >>>= 0)) return "";
              for (e || (e = "utf8");;) switch (e) {
                case "hex":
                  return x(this, t, r);
                case "utf8":
                case "utf-8":
                  return S(this, t, r);
                case "ascii":
                  return C(this, t, r);
                case "latin1":
                case "binary":
                  return T(this, t, r);
                case "base64":
                  return k(this, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return A(this, t, r);
                default:
                  if (n) throw new TypeError("Unknown encoding: " + e);
                  e = (e + "").toLowerCase(), n = !0;
              }
            }.apply(this, arguments);
          }, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function (e) {
            if (!s.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === s.compare(this, e);
          }, s.prototype.inspect = function () {
            var e = "",
              t = r.INSPECT_MAX_BYTES;
            return e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
          }, s.prototype.compare = function (e, t, r, n, i) {
            if (q(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), !s.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
            if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
            if (n >= i && t >= r) return 0;
            if (n >= i) return -1;
            if (t >= r) return 1;
            if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e) return 0;
            for (var o = i - n, a = r - t, l = Math.min(o, a), u = this.slice(n, i), c = e.slice(t, r), h = 0; h < l; ++h) if (u[h] !== c[h]) {
              o = u[h], a = c[h];
              break;
            }
            return o < a ? -1 : a < o ? 1 : 0;
          }, s.prototype.includes = function (e, t, r) {
            return -1 !== this.indexOf(e, t, r);
          }, s.prototype.indexOf = function (e, t, r) {
            return d(this, e, t, r, !0);
          }, s.prototype.lastIndexOf = function (e, t, r) {
            return d(this, e, t, r, !1);
          }, s.prototype.write = function (e, t, r, n) {
            if (void 0 === t) n = "utf8", r = this.length, t = 0;else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;else {
              if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
              t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
            }
            var i = this.length - t;
            if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            for (var o = !1;;) switch (n) {
              case "hex":
                return y(this, e, t, r);
              case "utf8":
              case "utf-8":
                return b(this, e, t, r);
              case "ascii":
                return m(this, e, t, r);
              case "latin1":
              case "binary":
                return v(this, e, t, r);
              case "base64":
                return w(this, e, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return _(this, e, t, r);
              default:
                if (o) throw new TypeError("Unknown encoding: " + n);
                n = ("" + n).toLowerCase(), o = !0;
            }
          }, s.prototype.toJSON = function () {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0)
            };
          };
          var E = 4096;
          function C(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
            return n;
          }
          function T(e, t, r) {
            var n = "";
            r = Math.min(e.length, r);
            for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
            return n;
          }
          function x(e, t, r) {
            var n = e.length;
            (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
            for (var i = "", o = t; o < r; ++o) i += N(e[o]);
            return i;
          }
          function A(e, t, r) {
            for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
            return i;
          }
          function I(e, t, r) {
            if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
          }
          function P(e, t, r, n, i, o) {
            if (!s.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
            if (r + n > e.length) throw new RangeError("Index out of range");
          }
          function O(e, t, r, n, i, o) {
            if (r + n > e.length) throw new RangeError("Index out of range");
            if (r < 0) throw new RangeError("Index out of range");
          }
          function B(e, t, r, i, o) {
            return t = +t, r >>>= 0, o || O(e, 0, r, 4), n.write(e, t, r, i, 23, 4), r + 4;
          }
          function R(e, t, r, i, o) {
            return t = +t, r >>>= 0, o || O(e, 0, r, 8), n.write(e, t, r, i, 52, 8), r + 8;
          }
          s.prototype.slice = function (e, t) {
            var r = this.length;
            e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
            var n = this.subarray(e, t);
            return n.__proto__ = s.prototype, n;
          }, s.prototype.readUIntLE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || I(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
            return n;
          }, s.prototype.readUIntBE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || I(e, t, this.length);
            for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
            return n;
          }, s.prototype.readUInt8 = function (e, t) {
            return e >>>= 0, t || I(e, 1, this.length), this[e];
          }, s.prototype.readUInt16LE = function (e, t) {
            return e >>>= 0, t || I(e, 2, this.length), this[e] | this[e + 1] << 8;
          }, s.prototype.readUInt16BE = function (e, t) {
            return e >>>= 0, t || I(e, 2, this.length), this[e] << 8 | this[e + 1];
          }, s.prototype.readUInt32LE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
          }, s.prototype.readUInt32BE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
          }, s.prototype.readIntLE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || I(e, t, this.length);
            for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
            return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n;
          }, s.prototype.readIntBE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || I(e, t, this.length);
            for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) o += this[e + --n] * i;
            return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
          }, s.prototype.readInt8 = function (e, t) {
            return e >>>= 0, t || I(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
          }, s.prototype.readInt16LE = function (e, t) {
            e >>>= 0, t || I(e, 2, this.length);
            var r = this[e] | this[e + 1] << 8;
            return 32768 & r ? 4294901760 | r : r;
          }, s.prototype.readInt16BE = function (e, t) {
            e >>>= 0, t || I(e, 2, this.length);
            var r = this[e + 1] | this[e] << 8;
            return 32768 & r ? 4294901760 | r : r;
          }, s.prototype.readInt32LE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
          }, s.prototype.readInt32BE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
          }, s.prototype.readFloatLE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), n.read(this, e, !0, 23, 4);
          }, s.prototype.readFloatBE = function (e, t) {
            return e >>>= 0, t || I(e, 4, this.length), n.read(this, e, !1, 23, 4);
          }, s.prototype.readDoubleLE = function (e, t) {
            return e >>>= 0, t || I(e, 8, this.length), n.read(this, e, !0, 52, 8);
          }, s.prototype.readDoubleBE = function (e, t) {
            return e >>>= 0, t || I(e, 8, this.length), n.read(this, e, !1, 52, 8);
          }, s.prototype.writeUIntLE = function (e, t, r, n) {
            (e = +e, t >>>= 0, r >>>= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = 1,
              o = 0;
            for (this[t] = 255 & e; ++o < r && (i *= 256);) this[t + o] = e / i & 255;
            return t + r;
          }, s.prototype.writeUIntBE = function (e, t, r, n) {
            (e = +e, t >>>= 0, r >>>= 0, n) || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
            var i = r - 1,
              o = 1;
            for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
            return t + r;
          }, s.prototype.writeUInt8 = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1;
          }, s.prototype.writeUInt16LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
          }, s.prototype.writeUInt16BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
          }, s.prototype.writeUInt32LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4;
          }, s.prototype.writeUInt32BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
          }, s.prototype.writeIntLE = function (e, t, r, n) {
            if (e = +e, t >>>= 0, !n) {
              var i = Math.pow(2, 8 * r - 1);
              P(this, e, t, r, i - 1, -i);
            }
            var o = 0,
              s = 1,
              a = 0;
            for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
            return t + r;
          }, s.prototype.writeIntBE = function (e, t, r, n) {
            if (e = +e, t >>>= 0, !n) {
              var i = Math.pow(2, 8 * r - 1);
              P(this, e, t, r, i - 1, -i);
            }
            var o = r - 1,
              s = 1,
              a = 0;
            for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
            return t + r;
          }, s.prototype.writeInt8 = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
          }, s.prototype.writeInt16LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2;
          }, s.prototype.writeInt16BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2;
          }, s.prototype.writeInt32LE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
          }, s.prototype.writeInt32BE = function (e, t, r) {
            return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4;
          }, s.prototype.writeFloatLE = function (e, t, r) {
            return B(this, e, t, !0, r);
          }, s.prototype.writeFloatBE = function (e, t, r) {
            return B(this, e, t, !1, r);
          }, s.prototype.writeDoubleLE = function (e, t, r) {
            return R(this, e, t, !0, r);
          }, s.prototype.writeDoubleBE = function (e, t, r) {
            return R(this, e, t, !1, r);
          }, s.prototype.copy = function (e, t, r, n) {
            if (!s.isBuffer(e)) throw new TypeError("argument should be a Buffer");
            if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
            var i = n - r;
            if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, n);else if (this === e && r < t && t < n) for (var o = i - 1; o >= 0; --o) e[o + t] = this[o + r];else Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
            return i;
          }, s.prototype.fill = function (e, t, r, n) {
            if ("string" == typeof e) {
              if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
              if ("string" == typeof n && !s.isEncoding(n)) throw new TypeError("Unknown encoding: " + n);
              if (1 === e.length) {
                var i = e.charCodeAt(0);
                ("utf8" === n && i < 128 || "latin1" === n) && (e = i);
              }
            } else "number" == typeof e && (e &= 255);
            if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
            if (r <= t) return this;
            var o;
            if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < r; ++o) this[o] = e;else {
              var a = s.isBuffer(e) ? e : s.from(e, n),
                l = a.length;
              if (0 === l) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
              for (o = 0; o < r - t; ++o) this[o + t] = a[o % l];
            }
            return this;
          };
          var M = /[^+/0-9A-Za-z-_]/g;
          function N(e) {
            return e < 16 ? "0" + e.toString(16) : e.toString(16);
          }
          function L(e, t) {
            var r;
            t = t || 1 / 0;
            for (var n = e.length, i = null, o = [], s = 0; s < n; ++s) {
              if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                if (!i) {
                  if (r > 56319) {
                    (t -= 3) > -1 && o.push(239, 191, 189);
                    continue;
                  }
                  if (s + 1 === n) {
                    (t -= 3) > -1 && o.push(239, 191, 189);
                    continue;
                  }
                  i = r;
                  continue;
                }
                if (r < 56320) {
                  (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                  continue;
                }
                r = 65536 + (i - 55296 << 10 | r - 56320);
              } else i && (t -= 3) > -1 && o.push(239, 191, 189);
              if (i = null, r < 128) {
                if ((t -= 1) < 0) break;
                o.push(r);
              } else if (r < 2048) {
                if ((t -= 2) < 0) break;
                o.push(r >> 6 | 192, 63 & r | 128);
              } else if (r < 65536) {
                if ((t -= 3) < 0) break;
                o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
              } else {
                if (!(r < 1114112)) throw new Error("Invalid code point");
                if ((t -= 4) < 0) break;
                o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
              }
            }
            return o;
          }
          function j(e) {
            return t.toByteArray(function (e) {
              if ((e = (e = e.split("=")[0]).trim().replace(M, "")).length < 2) return "";
              for (; e.length % 4 != 0;) e += "=";
              return e;
            }(e));
          }
          function U(e, t, r, n) {
            for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
            return i;
          }
          function q(e, t) {
            return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name;
          }
          function D(e) {
            return e != e;
          }
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      "base64-js": 13,
      buffer: 17,
      ieee754: 23
    }],
    18: [function (e, t, r) {
      (function (n) {
        (function () {
          r.formatArgs = function (e) {
            if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors) return;
            const r = "color: " + this.color;
            e.splice(1, 0, r, "color: inherit");
            let n = 0,
              i = 0;
            e[0].replace(/%[a-zA-Z%]/g, e => {
              "%%" !== e && "%c" === e && (i = ++n);
            }), e.splice(i, 0, r);
          }, r.save = function (e) {
            try {
              e ? r.storage.setItem("debug", e) : r.storage.removeItem("debug");
            } catch (e) {}
          }, r.load = function () {
            let e;
            try {
              e = r.storage.getItem("debug");
            } catch (e) {}
            !e && void 0 !== n && "env" in n && (e = n.env.DEBUG);
            return e;
          }, r.useColors = function () {
            if ("undefined" != typeof window && window.process && ("renderer" === window.process.type || window.process.__nwjs)) return !0;
            if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
            return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
          }, r.storage = function () {
            try {
              return localStorage;
            } catch (e) {}
          }(), r.destroy = (() => {
            let e = !1;
            return () => {
              e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
            };
          })(), r.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], r.log = console.debug || console.log || (() => {}), t.exports = e("./common")(r);
          const {
            formatters: i
          } = t.exports;
          i.j = function (e) {
            try {
              return JSON.stringify(e);
            } catch (e) {
              return "[UnexpectedJSONParseError]: " + e.message;
            }
          };
        }).call(this);
      }).call(this, e("_process"));
    }, {
      "./common": 19,
      _process: 50
    }],
    19: [function (e, t, r) {
      t.exports = function (t) {
        function r(e) {
          let t,
            i,
            o,
            s = null;
          function a(...e) {
            if (!a.enabled) return;
            const n = a,
              i = Number(new Date()),
              o = i - (t || i);
            n.diff = o, n.prev = t, n.curr = i, t = i, e[0] = r.coerce(e[0]), "string" != typeof e[0] && e.unshift("%O");
            let s = 0;
            e[0] = e[0].replace(/%([a-zA-Z%])/g, (t, i) => {
              if ("%%" === t) return "%";
              s++;
              const o = r.formatters[i];
              if ("function" == typeof o) {
                const r = e[s];
                t = o.call(n, r), e.splice(s, 1), s--;
              }
              return t;
            }), r.formatArgs.call(n, e), (n.log || r.log).apply(n, e);
          }
          return a.namespace = e, a.useColors = r.useColors(), a.color = r.selectColor(e), a.extend = n, a.destroy = r.destroy, Object.defineProperty(a, "enabled", {
            enumerable: !0,
            configurable: !1,
            get: () => null !== s ? s : (i !== r.namespaces && (i = r.namespaces, o = r.enabled(e)), o),
            set: e => {
              s = e;
            }
          }), "function" == typeof r.init && r.init(a), a;
        }
        function n(e, t) {
          const n = r(this.namespace + (void 0 === t ? ":" : t) + e);
          return n.log = this.log, n;
        }
        function i(e) {
          return e.toString().substring(2, e.toString().length - 2).replace(/\.\*\?$/, "*");
        }
        return r.debug = r, r.default = r, r.coerce = function (e) {
          return e instanceof Error ? e.stack || e.message : e;
        }, r.disable = function () {
          const e = [...r.names.map(i), ...r.skips.map(i).map(e => "-" + e)].join(",");
          return r.enable(""), e;
        }, r.enable = function (e) {
          let t;
          r.save(e), r.namespaces = e, r.names = [], r.skips = [];
          const n = ("string" == typeof e ? e : "").split(/[\s,]+/),
            i = n.length;
          for (t = 0; t < i; t++) n[t] && ("-" === (e = n[t].replace(/\*/g, ".*?"))[0] ? r.skips.push(new RegExp("^" + e.substr(1) + "$")) : r.names.push(new RegExp("^" + e + "$")));
        }, r.enabled = function (e) {
          if ("*" === e[e.length - 1]) return !0;
          let t, n;
          for (t = 0, n = r.skips.length; t < n; t++) if (r.skips[t].test(e)) return !1;
          for (t = 0, n = r.names.length; t < n; t++) if (r.names[t].test(e)) return !0;
          return !1;
        }, r.humanize = e("ms"), r.destroy = function () {
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }, Object.keys(t).forEach(e => {
          r[e] = t[e];
        }), r.names = [], r.skips = [], r.formatters = {}, r.selectColor = function (e) {
          let t = 0;
          for (let r = 0; r < e.length; r++) t = (t << 5) - t + e.charCodeAt(r), t |= 0;
          return r.colors[Math.abs(t) % r.colors.length];
        }, r.enable(r.load()), r;
      };
    }, {
      ms: 45
    }],
    20: [function (e, t, r) {
      (function (r, n) {
        (function () {
          var i = e("readable-stream"),
            o = e("end-of-stream"),
            s = e("inherits"),
            a = e("stream-shift"),
            l = n.from && n.from !== Uint8Array.from ? n.from([0]) : new n([0]),
            u = function (e, t) {
              e._corked ? e.once("uncork", t) : t();
            },
            c = function (e, t) {
              return function (r) {
                r ? function (e, t) {
                  e._autoDestroy && e.destroy(t);
                }(e, "premature close" === r.message ? null : r) : t && !e._ended && e.end();
              };
            },
            h = function () {},
            f = function (e, t, r) {
              if (!(this instanceof f)) return new f(e, t, r);
              i.Duplex.call(this, r), this._writable = null, this._readable = null, this._readable2 = null, this._autoDestroy = !r || !1 !== r.autoDestroy, this._forwardDestroy = !r || !1 !== r.destroy, this._forwardEnd = !r || !1 !== r.end, this._corked = 1, this._ondrain = null, this._drained = !1, this._forwarding = !1, this._unwrite = null, this._unread = null, this._ended = !1, this.destroyed = !1, e && this.setWritable(e), t && this.setReadable(t);
            };
          s(f, i.Duplex), f.obj = function (e, t, r) {
            return r || (r = {}), r.objectMode = !0, r.highWaterMark = 16, new f(e, t, r);
          }, f.prototype.cork = function () {
            1 == ++this._corked && this.emit("cork");
          }, f.prototype.uncork = function () {
            this._corked && 0 == --this._corked && this.emit("uncork");
          }, f.prototype.setWritable = function (e) {
            if (this._unwrite && this._unwrite(), this.destroyed) e && e.destroy && e.destroy();else if (null !== e && !1 !== e) {
              var t = this,
                n = o(e, {
                  writable: !0,
                  readable: !1
                }, c(this, this._forwardEnd)),
                i = function () {
                  var e = t._ondrain;
                  t._ondrain = null, e && e();
                };
              this._unwrite && r.nextTick(i), this._writable = e, this._writable.on("drain", i), this._unwrite = function () {
                t._writable.removeListener("drain", i), n();
              }, this.uncork();
            } else this.end();
          }, f.prototype.setReadable = function (e) {
            if (this._unread && this._unread(), this.destroyed) e && e.destroy && e.destroy();else {
              if (null === e || !1 === e) return this.push(null), void this.resume();
              var t,
                r = this,
                n = o(e, {
                  writable: !1,
                  readable: !0
                }, c(this)),
                s = function () {
                  r._forward();
                },
                a = function () {
                  r.push(null);
                };
              this._drained = !0, this._readable = e, this._readable2 = e._readableState ? e : (t = e, new i.Readable({
                objectMode: !0,
                highWaterMark: 16
              }).wrap(t)), this._readable2.on("readable", s), this._readable2.on("end", a), this._unread = function () {
                r._readable2.removeListener("readable", s), r._readable2.removeListener("end", a), n();
              }, this._forward();
            }
          }, f.prototype._read = function () {
            this._drained = !0, this._forward();
          }, f.prototype._forward = function () {
            if (!this._forwarding && this._readable2 && this._drained) {
              var e;
              for (this._forwarding = !0; this._drained && null !== (e = a(this._readable2));) this.destroyed || (this._drained = this.push(e));
              this._forwarding = !1;
            }
          }, f.prototype.destroy = function (e, t) {
            if (t || (t = h), this.destroyed) return t(null);
            this.destroyed = !0;
            var n = this;
            r.nextTick(function () {
              n._destroy(e), t(null);
            });
          }, f.prototype._destroy = function (e) {
            if (e) {
              var t = this._ondrain;
              this._ondrain = null, t ? t(e) : this.emit("error", e);
            }
            this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), this._writable && this._writable.destroy && this._writable.destroy()), this.emit("close");
          }, f.prototype._write = function (e, t, r) {
            if (!this.destroyed) return this._corked ? u(this, this._write.bind(this, e, t, r)) : e === l ? this._finish(r) : this._writable ? void (!1 === this._writable.write(e) ? this._ondrain = r : this.destroyed || r()) : r();
          }, f.prototype._finish = function (e) {
            var t = this;
            this.emit("preend"), u(this, function () {
              var r, n;
              r = t._forwardEnd && t._writable, n = function () {
                !1 === t._writableState.prefinished && (t._writableState.prefinished = !0), t.emit("prefinish"), u(t, e);
              }, r ? r._writableState && r._writableState.finished ? n() : r._writableState ? r.end(n) : (r.end(), n()) : n();
            });
          }, f.prototype.end = function (e, t, r) {
            return "function" == typeof e ? this.end(null, null, e) : "function" == typeof t ? this.end(e, null, t) : (this._ended = !0, e && this.write(e), this._writableState.ending || this._writableState.destroyed || this.write(l), i.Writable.prototype.end.call(this, r));
          }, t.exports = f;
        }).call(this);
      }).call(this, e("_process"), e("buffer").Buffer);
    }, {
      _process: 50,
      buffer: 17,
      "end-of-stream": 21,
      inherits: 24,
      "readable-stream": 69,
      "stream-shift": 74
    }],
    21: [function (e, t, r) {
      (function (r) {
        (function () {
          var n = e("once"),
            i = function () {},
            o = function (e, t, s) {
              if ("function" == typeof t) return o(e, null, t);
              t || (t = {}), s = n(s || i);
              var a = e._writableState,
                l = e._readableState,
                u = t.readable || !1 !== t.readable && e.readable,
                c = t.writable || !1 !== t.writable && e.writable,
                h = !1,
                f = function () {
                  e.writable || p();
                },
                p = function () {
                  c = !1, u || s.call(e);
                },
                d = function () {
                  u = !1, c || s.call(e);
                },
                g = function (t) {
                  s.call(e, t ? new Error("exited with error code: " + t) : null);
                },
                y = function (t) {
                  s.call(e, t);
                },
                b = function () {
                  r.nextTick(m);
                },
                m = function () {
                  if (!h) return (!u || l && l.ended && !l.destroyed) && (!c || a && a.ended && !a.destroyed) ? void 0 : s.call(e, new Error("premature close"));
                },
                v = function () {
                  e.req.on("finish", p);
                };
              return !function (e) {
                return e.setHeader && "function" == typeof e.abort;
              }(e) ? c && !a && (e.on("end", f), e.on("close", f)) : (e.on("complete", p), e.on("abort", b), e.req ? v() : e.on("request", v)), function (e) {
                return e.stdio && Array.isArray(e.stdio) && 3 === e.stdio.length;
              }(e) && e.on("exit", g), e.on("end", d), e.on("finish", p), !1 !== t.error && e.on("error", y), e.on("close", b), function () {
                h = !0, e.removeListener("complete", p), e.removeListener("abort", b), e.removeListener("request", v), e.req && e.req.removeListener("finish", p), e.removeListener("end", f), e.removeListener("close", f), e.removeListener("finish", p), e.removeListener("exit", g), e.removeListener("end", d), e.removeListener("error", y), e.removeListener("close", b);
              };
            };
          t.exports = o;
        }).call(this);
      }).call(this, e("_process"));
    }, {
      _process: 50,
      once: 48
    }],
    22: [function (e, t, r) {
      var n = Object.create || function (e) {
          var t = function () {};
          return t.prototype = e, new t();
        },
        i = Object.keys || function (e) {
          var t = [];
          for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
          return r;
        },
        o = Function.prototype.bind || function (e) {
          var t = this;
          return function () {
            return t.apply(e, arguments);
          };
        };
      function s() {
        this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = n(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
      }
      t.exports = s, s.EventEmitter = s, s.prototype._events = void 0, s.prototype._maxListeners = void 0;
      var a,
        l = 10;
      try {
        var u = {};
        Object.defineProperty && Object.defineProperty(u, "x", {
          value: 0
        }), a = 0 === u.x;
      } catch (e) {
        a = !1;
      }
      function c(e) {
        return void 0 === e._maxListeners ? s.defaultMaxListeners : e._maxListeners;
      }
      function h(e, t, r, i) {
        var o, s, a;
        if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');
        if ((s = e._events) ? (s.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), s = e._events), a = s[t]) : (s = e._events = n(null), e._eventsCount = 0), a) {
          if ("function" == typeof a ? a = s[t] = i ? [r, a] : [a, r] : i ? a.unshift(r) : a.push(r), !a.warned && (o = c(e)) && o > 0 && a.length > o) {
            a.warned = !0;
            var l = new Error("Possible EventEmitter memory leak detected. " + a.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.');
            l.name = "MaxListenersExceededWarning", l.emitter = e, l.type = t, l.count = a.length, "object" == typeof console && console.warn && console.warn("%s: %s", l.name, l.message);
          }
        } else a = s[t] = r, ++e._eventsCount;
        return e;
      }
      function f() {
        if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
          case 0:
            return this.listener.call(this.target);
          case 1:
            return this.listener.call(this.target, arguments[0]);
          case 2:
            return this.listener.call(this.target, arguments[0], arguments[1]);
          case 3:
            return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
          default:
            for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
            this.listener.apply(this.target, e);
        }
      }
      function p(e, t, r) {
        var n = {
            fired: !1,
            wrapFn: void 0,
            target: e,
            type: t,
            listener: r
          },
          i = o.call(f, n);
        return i.listener = r, n.wrapFn = i, i;
      }
      function d(e, t, r) {
        var n = e._events;
        if (!n) return [];
        var i = n[t];
        return i ? "function" == typeof i ? r ? [i.listener || i] : [i] : r ? function (e) {
          for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
          return t;
        }(i) : y(i, i.length) : [];
      }
      function g(e) {
        var t = this._events;
        if (t) {
          var r = t[e];
          if ("function" == typeof r) return 1;
          if (r) return r.length;
        }
        return 0;
      }
      function y(e, t) {
        for (var r = new Array(t), n = 0; n < t; ++n) r[n] = e[n];
        return r;
      }
      a ? Object.defineProperty(s, "defaultMaxListeners", {
        enumerable: !0,
        get: function () {
          return l;
        },
        set: function (e) {
          if ("number" != typeof e || e < 0 || e != e) throw new TypeError('"defaultMaxListeners" must be a positive number');
          l = e;
        }
      }) : s.defaultMaxListeners = l, s.prototype.setMaxListeners = function (e) {
        if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
        return this._maxListeners = e, this;
      }, s.prototype.getMaxListeners = function () {
        return c(this);
      }, s.prototype.emit = function (e) {
        var t,
          r,
          n,
          i,
          o,
          s,
          a = "error" === e;
        if (s = this._events) a = a && null == s.error;else if (!a) return !1;
        if (a) {
          if (arguments.length > 1 && (t = arguments[1]), t instanceof Error) throw t;
          var l = new Error('Unhandled "error" event. (' + t + ")");
          throw l.context = t, l;
        }
        if (!(r = s[e])) return !1;
        var u = "function" == typeof r;
        switch (n = arguments.length) {
          case 1:
            !function (e, t, r) {
              if (t) e.call(r);else for (var n = e.length, i = y(e, n), o = 0; o < n; ++o) i[o].call(r);
            }(r, u, this);
            break;
          case 2:
            !function (e, t, r, n) {
              if (t) e.call(r, n);else for (var i = e.length, o = y(e, i), s = 0; s < i; ++s) o[s].call(r, n);
            }(r, u, this, arguments[1]);
            break;
          case 3:
            !function (e, t, r, n, i) {
              if (t) e.call(r, n, i);else for (var o = e.length, s = y(e, o), a = 0; a < o; ++a) s[a].call(r, n, i);
            }(r, u, this, arguments[1], arguments[2]);
            break;
          case 4:
            !function (e, t, r, n, i, o) {
              if (t) e.call(r, n, i, o);else for (var s = e.length, a = y(e, s), l = 0; l < s; ++l) a[l].call(r, n, i, o);
            }(r, u, this, arguments[1], arguments[2], arguments[3]);
            break;
          default:
            for (i = new Array(n - 1), o = 1; o < n; o++) i[o - 1] = arguments[o];
            !function (e, t, r, n) {
              if (t) e.apply(r, n);else for (var i = e.length, o = y(e, i), s = 0; s < i; ++s) o[s].apply(r, n);
            }(r, u, this, i);
        }
        return !0;
      }, s.prototype.addListener = function (e, t) {
        return h(this, e, t, !1);
      }, s.prototype.on = s.prototype.addListener, s.prototype.prependListener = function (e, t) {
        return h(this, e, t, !0);
      }, s.prototype.once = function (e, t) {
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        return this.on(e, p(this, e, t)), this;
      }, s.prototype.prependOnceListener = function (e, t) {
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        return this.prependListener(e, p(this, e, t)), this;
      }, s.prototype.removeListener = function (e, t) {
        var r, i, o, s, a;
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        if (!(i = this._events)) return this;
        if (!(r = i[e])) return this;
        if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = n(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));else if ("function" != typeof r) {
          for (o = -1, s = r.length - 1; s >= 0; s--) if (r[s] === t || r[s].listener === t) {
            a = r[s].listener, o = s;
            break;
          }
          if (o < 0) return this;
          0 === o ? r.shift() : function (e, t) {
            for (var r = t, n = r + 1, i = e.length; n < i; r += 1, n += 1) e[r] = e[n];
            e.pop();
          }(r, o), 1 === r.length && (i[e] = r[0]), i.removeListener && this.emit("removeListener", e, a || t);
        }
        return this;
      }, s.prototype.removeAllListeners = function (e) {
        var t, r, o;
        if (!(r = this._events)) return this;
        if (!r.removeListener) return 0 === arguments.length ? (this._events = n(null), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = n(null) : delete r[e]), this;
        if (0 === arguments.length) {
          var s,
            a = i(r);
          for (o = 0; o < a.length; ++o) "removeListener" !== (s = a[o]) && this.removeAllListeners(s);
          return this.removeAllListeners("removeListener"), this._events = n(null), this._eventsCount = 0, this;
        }
        if ("function" == typeof (t = r[e])) this.removeListener(e, t);else if (t) for (o = t.length - 1; o >= 0; o--) this.removeListener(e, t[o]);
        return this;
      }, s.prototype.listeners = function (e) {
        return d(this, e, !0);
      }, s.prototype.rawListeners = function (e) {
        return d(this, e, !1);
      }, s.listenerCount = function (e, t) {
        return "function" == typeof e.listenerCount ? e.listenerCount(t) : g.call(e, t);
      }, s.prototype.listenerCount = g, s.prototype.eventNames = function () {
        return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
      };
    }, {}],
    23: [function (e, t, r) {
      r.read = function (e, t, r, n, i) {
        var o,
          s,
          a = 8 * i - n - 1,
          l = (1 << a) - 1,
          u = l >> 1,
          c = -7,
          h = r ? i - 1 : 0,
          f = r ? -1 : 1,
          p = e[t + h];
        for (h += f, o = p & (1 << -c) - 1, p >>= -c, c += a; c > 0; o = 256 * o + e[t + h], h += f, c -= 8);
        for (s = o & (1 << -c) - 1, o >>= -c, c += n; c > 0; s = 256 * s + e[t + h], h += f, c -= 8);
        if (0 === o) o = 1 - u;else {
          if (o === l) return s ? NaN : 1 / 0 * (p ? -1 : 1);
          s += Math.pow(2, n), o -= u;
        }
        return (p ? -1 : 1) * s * Math.pow(2, o - n);
      }, r.write = function (e, t, r, n, i, o) {
        var s,
          a,
          l,
          u = 8 * o - i - 1,
          c = (1 << u) - 1,
          h = c >> 1,
          f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
          p = n ? 0 : o - 1,
          d = n ? 1 : -1,
          g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
        for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = c) : (s = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -s)) < 1 && (s--, l *= 2), (t += s + h >= 1 ? f / l : f * Math.pow(2, 1 - h)) * l >= 2 && (s++, l /= 2), s + h >= c ? (a = 0, s = c) : s + h >= 1 ? (a = (t * l - 1) * Math.pow(2, i), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + p] = 255 & a, p += d, a /= 256, i -= 8);
        for (s = s << i | a, u += i; u > 0; e[r + p] = 255 & s, p += d, s /= 256, u -= 8);
        e[r + p - d] |= 128 * g;
      };
    }, {}],
    24: [function (e, t, r) {
      "function" == typeof Object.create ? t.exports = function (e, t) {
        t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
          constructor: {
            value: e,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        }));
      } : t.exports = function (e, t) {
        if (t) {
          e.super_ = t;
          var r = function () {};
          r.prototype = t.prototype, e.prototype = new r(), e.prototype.constructor = e;
        }
      };
    }, {}],
    25: [function (e, t, r) {
      "use strict";

      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var n = function () {
        function e(e, t) {
          this.color = !0, this.key = void 0, this.value = void 0, this.parent = void 0, this.brother = void 0, this.leftChild = void 0, this.rightChild = void 0, this.key = e, this.value = t;
        }
        return e.prototype.rotateLeft = function () {
          var e = this.parent,
            t = this.brother,
            r = this.leftChild,
            n = this.rightChild;
          if (!n) throw new Error("unknown error");
          var i = n.leftChild,
            o = n.rightChild;
          return e && (e.leftChild === this ? e.leftChild = n : e.rightChild === this && (e.rightChild = n)), n.parent = e, n.brother = t, n.leftChild = this, n.rightChild = o, t && (t.brother = n), this.parent = n, this.brother = o, this.leftChild = r, this.rightChild = i, o && (o.parent = n, o.brother = this), r && (r.parent = this, r.brother = i), i && (i.parent = this, i.brother = r), n;
        }, e.prototype.rotateRight = function () {
          var e = this.parent,
            t = this.brother,
            r = this.leftChild;
          if (!r) throw new Error("unknown error");
          var n = this.rightChild,
            i = r.leftChild,
            o = r.rightChild;
          return e && (e.leftChild === this ? e.leftChild = r : e.rightChild === this && (e.rightChild = r)), r.parent = e, r.brother = t, r.leftChild = i, r.rightChild = this, t && (t.brother = r), i && (i.parent = r, i.brother = this), this.parent = r, this.brother = i, this.leftChild = o, this.rightChild = n, o && (o.parent = this, o.brother = n), n && (n.parent = this, n.brother = o), r;
        }, e.prototype.remove = function () {
          if (this.leftChild || this.rightChild) throw new Error("can only remove leaf node");
          this.parent && (this === this.parent.leftChild ? this.parent.leftChild = void 0 : this === this.parent.rightChild && (this.parent.rightChild = void 0)), this.brother && (this.brother.brother = void 0), this.key = void 0, this.value = void 0, this.parent = void 0, this.brother = void 0;
        }, e.TreeNodeColorType = {
          red: !0,
          black: !1
        }, e;
      }();
      Object.freeze(n), r.default = n;
    }, {}],
    26: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
        var r,
          n,
          i,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & i[0]) throw i[1];
              return i[1];
            },
            trys: [],
            ops: []
          };
        return o = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
          return this;
        }), o;
        function a(o) {
          return function (a) {
            return function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s;) try {
                if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                  case 0:
                  case 1:
                    i = o;
                    break;
                  case 4:
                    return s.label++, {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    s.label++, n = o[1], o = [0];
                    continue;
                  case 7:
                    o = s.ops.pop(), s.trys.pop();
                    continue;
                  default:
                    if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                      s = 0;
                      continue;
                    }
                    if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                      s.label = o[1];
                      break;
                    }
                    if (6 === o[0] && s.label < i[1]) {
                      s.label = i[1], i = o;
                      break;
                    }
                    if (i && s.label < i[2]) {
                      s.label = i[2], s.ops.push(o);
                      break;
                    }
                    i[2] && s.ops.pop(), s.trys.pop();
                    continue;
                }
                o = t.call(e, s);
              } catch (e) {
                o = [6, e], n = 0;
              } finally {
                r = i = 0;
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              };
            }([o, a]);
          };
        }
      };
      function i(e) {
        var t = this;
        void 0 === e && (e = []);
        var r = [],
          o = 0,
          s = 0,
          a = 0,
          l = 0,
          u = 0,
          c = 0;
        this.size = function () {
          return c;
        }, this.empty = function () {
          return 0 === c;
        }, this.clear = function () {
          o = a = s = l = u = c = 0, f.call(this, i.bucketSize), c = 0;
        }, this.front = function () {
          return r[o][s];
        }, this.back = function () {
          return r[a][l];
        }, this.forEach = function (e) {
          if (!this.empty()) {
            var t = 0;
            if (o !== a) {
              for (u = s; u < i.bucketSize; ++u) e(r[o][u], t++);
              for (u = o + 1; u < a; ++u) for (var n = 0; n < i.bucketSize; ++n) e(r[u][n], t++);
              for (u = 0; u <= l; ++u) e(r[a][u], t++);
            } else for (var u = s; u <= l; ++u) e(r[o][u], t++);
          }
        };
        var h = function (e) {
          var t = o * i.bucketSize + s,
            r = t + e,
            n = a * i.bucketSize + l;
          if (r < t || r > n) throw new Error("pos should more than 0 and less than queue's size");
          return {
            curNodeBucketIndex: Math.floor(r / i.bucketSize),
            curNodePointerIndex: r % i.bucketSize
          };
        };
        this.getElementByPos = function (e) {
          var t = h(e),
            n = t.curNodeBucketIndex,
            i = t.curNodePointerIndex;
          return r[n][i];
        }, this.eraseElementByPos = function (e) {
          var t = this;
          if (e < 0 || e > c) throw new Error("pos should more than 0 and less than queue's size");
          if (0 === e) this.popFront();else if (e === this.size()) this.popBack();else {
            for (var r = [], n = e + 1; n < c; ++n) r.push(this.getElementByPos(n));
            this.cut(e), this.popBack(), r.forEach(function (e) {
              return t.pushBack(e);
            });
          }
        }, this.eraseElementByValue = function (e) {
          if (!this.empty()) {
            var t = [];
            this.forEach(function (r) {
              r !== e && t.push(r);
            });
            for (var r = t.length, n = 0; n < r; ++n) this.setElementByPos(n, t[n]);
            this.cut(r - 1);
          }
        };
        var f = function (e) {
          for (var t = [], n = e * i.sigma, h = Math.max(Math.ceil(n / i.bucketSize), 2), f = 0; f < h; ++f) t.push(new Array(i.bucketSize));
          var p = Math.ceil(e / i.bucketSize),
            d = Math.floor(h / 2) - Math.floor(p / 2),
            g = d,
            y = 0;
          if (this.size()) for (f = 0; f < p; ++f) {
            for (var b = 0; b < i.bucketSize; ++b) if (t[d + f][b] = this.front(), this.popFront(), this.empty()) {
              g = d + f, y = b;
              break;
            }
            if (this.empty()) break;
          }
          r = t, o = d, s = 0, a = g, l = y, u = h, c = e;
        };
        this.pushBack = function (e) {
          this.empty() || (a === u - 1 && l === i.bucketSize - 1 && f.call(this, this.size()), l < i.bucketSize - 1 ? ++l : a < u - 1 && (++a, l = 0)), ++c, r[a][l] = e;
        }, this.popBack = function () {
          this.empty() || (1 !== this.size() && (l > 0 ? --l : o < a && (--a, l = i.bucketSize - 1)), c > 0 && --c);
        }, this.setElementByPos = function (e, t) {
          var n = h(e),
            i = n.curNodeBucketIndex,
            o = n.curNodePointerIndex;
          r[i][o] = t;
        }, this.insert = function (e, t, r) {
          var n = this;
          if (void 0 === r && (r = 1), 0 === e) for (; r--;) this.pushFront(t);else if (e === this.size()) for (; r--;) this.pushBack(t);else {
            for (var i = [], o = e; o < c; ++o) i.push(this.getElementByPos(o));
            this.cut(e - 1);
            for (o = 0; o < r; ++o) this.pushBack(t);
            i.forEach(function (e) {
              return n.pushBack(e);
            });
          }
        }, this.find = function (e) {
          if (o === a) {
            for (var t = s; t <= l; ++t) if (r[o][t] === e) return !0;
            return !1;
          }
          for (t = s; t < i.bucketSize; ++t) if (r[o][t] === e) return !0;
          for (t = o + 1; t < a; ++t) for (var n = 0; n < i.bucketSize; ++n) if (r[t][n] === e) return !0;
          for (t = 0; t <= l; ++t) if (r[a][t] === e) return !0;
          return !1;
        }, this.reverse = function () {
          for (var e = 0, t = c - 1; e < t;) {
            var r = this.getElementByPos(e);
            this.setElementByPos(e, this.getElementByPos(t)), this.setElementByPos(t, r), ++e, --t;
          }
        }, this.unique = function () {
          if (!this.empty()) {
            var e = [],
              t = this.front();
            this.forEach(function (r, n) {
              0 !== n && r === t || (e.push(r), t = r);
            });
            for (var r = 0; r < c; ++r) this.setElementByPos(r, e[r]);
            this.cut(e.length - 1);
          }
        }, this.sort = function (e) {
          var t = [];
          this.forEach(function (e) {
            t.push(e);
          }), t.sort(e);
          for (var r = 0; r < c; ++r) this.setElementByPos(r, t[r]);
        }, this.pushFront = function (e) {
          this.empty() || (0 === o && 0 === s && f.call(this, this.size()), s > 0 ? --s : o > 0 && (--o, s = i.bucketSize - 1)), ++c, r[o][s] = e;
        }, this.popFront = function () {
          this.empty() || (1 !== this.size() && (s < i.bucketSize - 1 ? ++s : o < a && (++o, s = 0)), c > 0 && --c);
        }, this.shrinkToFit = function () {
          var e = this,
            t = [];
          this.forEach(function (e) {
            t.push(e);
          });
          var n = t.length;
          r = [];
          for (var o = Math.ceil(n / i.bucketSize), s = 0; s < o; ++s) r.push(new Array(i.bucketSize));
          this.clear(), t.forEach(function (t) {
            return e.pushBack(t);
          });
        }, this.cut = function (e) {
          if (e < 0) this.clear();else {
            var t = h(e),
              r = t.curNodeBucketIndex,
              n = t.curNodePointerIndex;
            a = r, l = n, c = e + 1;
          }
        }, this[Symbol.iterator] = function () {
          return function () {
            var e, t;
            return n(this, function (n) {
              switch (n.label) {
                case 0:
                  if (0 === c) return [2];
                  if (o !== a) return [3, 5];
                  t = s, n.label = 1;
                case 1:
                  return t <= l ? [4, r[o][t]] : [3, 4];
                case 2:
                  n.sent(), n.label = 3;
                case 3:
                  return ++t, [3, 1];
                case 4:
                  return [2];
                case 5:
                  t = s, n.label = 6;
                case 6:
                  return t < i.bucketSize ? [4, r[o][t]] : [3, 9];
                case 7:
                  n.sent(), n.label = 8;
                case 8:
                  return ++t, [3, 6];
                case 9:
                  t = o + 1, n.label = 10;
                case 10:
                  if (!(t < a)) return [3, 15];
                  e = 0, n.label = 11;
                case 11:
                  return e < i.bucketSize ? [4, r[t][e]] : [3, 14];
                case 12:
                  n.sent(), n.label = 13;
                case 13:
                  return ++e, [3, 11];
                case 14:
                  return ++t, [3, 10];
                case 15:
                  t = 0, n.label = 16;
                case 16:
                  return t <= l ? [4, r[a][t]] : [3, 19];
                case 17:
                  n.sent(), n.label = 18;
                case 18:
                  return ++t, [3, 16];
                case 19:
                  return [2];
              }
            });
          }();
        }, function () {
          var n = i.bucketSize;
          e.size ? n = e.size() : e.length && (n = e.length);
          var s = n * i.sigma;
          u = Math.ceil(s / i.bucketSize), u = Math.max(u, 3);
          for (var l = 0; l < u; ++l) r.push(new Array(i.bucketSize));
          var c = Math.ceil(n / i.bucketSize);
          o = Math.floor(u / 2) - Math.floor(c / 2), a = o, e.forEach(function (e) {
            return t.pushBack(e);
          });
        }(), Object.freeze(this);
      }
      Object.defineProperty(r, "__esModule", {
        value: !0
      }), i.sigma = 3, i.bucketSize = 5e3, Object.freeze(i), r.default = i;
    }, {}],
    27: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
          var r,
            n,
            i,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & i[0]) throw i[1];
                return i[1];
              },
              trys: [],
              ops: []
            };
          return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function a(o) {
            return function (a) {
              return function (o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; s;) try {
                  if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                  switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      s.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = s.ops.pop(), s.trys.pop();
                      continue;
                    default:
                      if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        s.label = i[1], i = o;
                        break;
                      }
                      if (i && s.label < i[2]) {
                        s.label = i[2], s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  o = [6, e], n = 0;
                } finally {
                  r = i = 0;
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                };
              }([o, a]);
            };
          }
        },
        i = this && this.__values || function (e) {
          var t = "function" == typeof Symbol && Symbol.iterator,
            r = t && e[t],
            n = 0;
          if (r) return r.call(e);
          if (e && "number" == typeof e.length) return {
            next: function () {
              return e && n >= e.length && (e = void 0), {
                value: e && e[n++],
                done: !e
              };
            }
          };
          throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var o = e("../LinkList/LinkList"),
        s = e("../Map/Map");
      function a(e, t, r) {
        var l = this;
        if (void 0 === e && (e = []), void 0 === t && (t = a.initSize), r = r || function (e) {
          var t,
            r,
            n = 0,
            o = "";
          if ("number" == typeof e) n = ((n = Math.floor(e)) << 5) - n, n &= n;else {
            o = "string" != typeof e ? JSON.stringify(e) : e;
            try {
              for (var s = i(o), a = s.next(); !a.done; a = s.next()) {
                n = (n << 5) - n + a.value.charCodeAt(0), n &= n;
              }
            } catch (e) {
              t = {
                error: e
              };
            } finally {
              try {
                a && !a.done && (r = s.return) && r.call(s);
              } finally {
                if (t) throw t.error;
              }
            }
          }
          return n ^= n >>> 16;
        }, 0 != (t & t - 1)) throw new Error("initBucketNum must be 2 to the power of n");
        var u = 0,
          c = [],
          h = Math.max(a.initSize, Math.min(a.maxSize, t));
        this.size = function () {
          return u;
        }, this.empty = function () {
          return 0 === u;
        }, this.clear = function () {
          u = 0, h = t, c = [];
        }, this.forEach = function (e) {
          var t = 0;
          c.forEach(function (r) {
            r.forEach(function (r) {
              e(r, t++);
            });
          });
        };
        this.setElement = function (e, t) {
          var n, l;
          if (null === e || void 0 === e) throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
          if (null !== t && void 0 !== t) {
            var f = r(e) & h - 1;
            if (c[f]) {
              var p = c[f].size();
              if (c[f] instanceof o.default) {
                try {
                  for (var d = i(c[f]), g = d.next(); !g.done; g = d.next()) {
                    var y = g.value;
                    if (y.key === e) return void (y.value = t);
                  }
                } catch (e) {
                  n = {
                    error: e
                  };
                } finally {
                  try {
                    g && !g.done && (l = d.return) && l.call(d);
                  } finally {
                    if (n) throw n.error;
                  }
                }
                c[f].pushBack({
                  key: e,
                  value: t
                }), c[f].size() >= a.treeifyThreshold && (c[f] = new s.default(c[f]));
              } else c[f].setElement(e, t);
              var b = c[f].size();
              u += b - p;
            } else ++u, c[f] = new o.default([{
              key: e,
              value: t
            }]);
            u > h * a.sigma && function (e) {
              if (!(e >= a.maxSize)) {
                h = 2 * e;
                var t = [];
                c.forEach(function (n, i) {
                  if (!n.empty()) {
                    if (n instanceof o.default && 1 === n.size()) {
                      var l = n.front(),
                        u = l.key,
                        f = l.value;
                      t[r(u) & h - 1] = new o.default([{
                        key: u,
                        value: f
                      }]);
                    } else if (n instanceof s.default) {
                      var p = new o.default(),
                        d = new o.default();
                      n.forEach(function (t) {
                        0 == (r(t.key) & e) ? p.pushBack(t) : d.pushBack(t);
                      }), p.size() > a.untreeifyThreshold ? t[i] = new s.default(p) : p.size() && (t[i] = p), d.size() > a.untreeifyThreshold ? t[i + e] = new s.default(d) : d.size() && (t[i + e] = d);
                    } else {
                      var g = new o.default(),
                        y = new o.default();
                      n.forEach(function (t) {
                        0 == (r(t.key) & e) ? g.pushBack(t) : y.pushBack(t);
                      }), g.size() && (t[i] = g), y.size() && (t[i + e] = y);
                    }
                    c[i].clear();
                  }
                }), c = t;
              }
            }.call(this, h);
          } else this.eraseElementByKey(e);
        }, this.getElementByKey = function (e) {
          var t,
            n,
            o = r(e) & h - 1;
          if (c[o]) {
            if (c[o] instanceof s.default) return c[o].getElementByKey(e);
            try {
              for (var a = i(c[o]), l = a.next(); !l.done; l = a.next()) {
                var u = l.value;
                if (u.key === e) return u.value;
              }
            } catch (e) {
              t = {
                error: e
              };
            } finally {
              try {
                l && !l.done && (n = a.return) && n.call(a);
              } finally {
                if (t) throw t.error;
              }
            }
          }
        }, this.eraseElementByKey = function (e) {
          var t,
            n,
            l = r(e) & h - 1;
          if (c[l]) {
            var f = c[l].size();
            if (c[l] instanceof s.default) c[l].eraseElementByKey(e), c[l].size() <= a.untreeifyThreshold && (c[l] = new o.default(c[l]));else {
              var p = -1;
              try {
                for (var d = i(c[l]), g = d.next(); !g.done; g = d.next()) {
                  if (++p, g.value.key === e) {
                    c[l].eraseElementByPos(p);
                    break;
                  }
                }
              } catch (e) {
                t = {
                  error: e
                };
              } finally {
                try {
                  g && !g.done && (n = d.return) && n.call(d);
                } finally {
                  if (t) throw t.error;
                }
              }
            }
            var y = c[l].size();
            u += y - f;
          }
        }, this.find = function (e) {
          var t,
            n,
            o = r(e) & h - 1;
          if (!c[o]) return !1;
          if (c[o] instanceof s.default) return c[o].find(e);
          try {
            for (var a = i(c[o]), l = a.next(); !l.done; l = a.next()) {
              if (l.value.key === e) return !0;
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              l && !l.done && (n = a.return) && n.call(a);
            } finally {
              if (t) throw t.error;
            }
          }
          return !1;
        }, this[Symbol.iterator] = function () {
          return function () {
            var e, t, r, o, s, a;
            return n(this, function (n) {
              switch (n.label) {
                case 0:
                  e = 0, n.label = 1;
                case 1:
                  if (!(e < h)) return [3, 10];
                  for (; e < h && !c[e];) ++e;
                  if (e >= h) return [3, 10];
                  n.label = 2;
                case 2:
                  n.trys.push([2, 7, 8, 9]), s = void 0, t = i(c[e]), r = t.next(), n.label = 3;
                case 3:
                  return r.done ? [3, 6] : [4, r.value];
                case 4:
                  n.sent(), n.label = 5;
                case 5:
                  return r = t.next(), [3, 3];
                case 6:
                  return [3, 9];
                case 7:
                  return o = n.sent(), s = {
                    error: o
                  }, [3, 9];
                case 8:
                  try {
                    r && !r.done && (a = t.return) && a.call(t);
                  } finally {
                    if (s) throw s.error;
                  }
                  return [7];
                case 9:
                  return ++e, [3, 1];
                case 10:
                  return [2];
              }
            });
          }();
        }, e.forEach(function (e) {
          var t = e.key,
            r = e.value;
          return l.setElement(t, r);
        }), Object.freeze(this);
      }
      a.initSize = 16, a.maxSize = 1 << 30, a.sigma = .75, a.treeifyThreshold = 8, a.untreeifyThreshold = 6, a.minTreeifySize = 64, Object.freeze(a), r.default = a;
    }, {
      "../LinkList/LinkList": 29,
      "../Map/Map": 30
    }],
    28: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
          var r,
            n,
            i,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & i[0]) throw i[1];
                return i[1];
              },
              trys: [],
              ops: []
            };
          return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function a(o) {
            return function (a) {
              return function (o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; s;) try {
                  if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                  switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      s.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = s.ops.pop(), s.trys.pop();
                      continue;
                    default:
                      if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        s.label = i[1], i = o;
                        break;
                      }
                      if (i && s.label < i[2]) {
                        s.label = i[2], s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  o = [6, e], n = 0;
                } finally {
                  r = i = 0;
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                };
              }([o, a]);
            };
          }
        },
        i = this && this.__values || function (e) {
          var t = "function" == typeof Symbol && Symbol.iterator,
            r = t && e[t],
            n = 0;
          if (r) return r.call(e);
          if (e && "number" == typeof e.length) return {
            next: function () {
              return e && n >= e.length && (e = void 0), {
                value: e && e[n++],
                done: !e
              };
            }
          };
          throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var o = e("../Set/Set"),
        s = e("../LinkList/LinkList");
      function a(e, t, r) {
        var l = this;
        if (void 0 === e && (e = []), void 0 === t && (t = a.initSize), r = r || function (e) {
          var t = 0,
            r = "";
          if ("number" == typeof e) t = ((t = Math.floor(e)) << 5) - t, t &= t;else {
            r = "string" != typeof e ? JSON.stringify(e) : e;
            for (var n = 0; n < r.length; n++) {
              t = (t << 5) - t + r.charCodeAt(n), t &= t;
            }
          }
          return t ^= t >>> 16;
        }, 0 != (t & t - 1)) throw new Error("initBucketNum must be 2 to the power of n");
        var u = 0,
          c = [],
          h = Math.max(a.initSize, Math.min(a.maxSize, t));
        this.size = function () {
          return u;
        }, this.empty = function () {
          return 0 === u;
        }, this.clear = function () {
          u = 0, h = t, c = [];
        }, this.forEach = function (e) {
          var t = 0;
          c.forEach(function (r) {
            r.forEach(function (r) {
              e(r, t++);
            });
          });
        };
        this.insert = function (e) {
          if (null === e || void 0 === e) throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
          var t = r(e) & h - 1;
          if (c[t]) {
            var n = c[t].size();
            if (c[t] instanceof s.default) {
              if (c[t].find(e)) return;
              c[t].pushBack(e), c[t].size() >= a.treeifyThreshold && (c[t] = new o.default(c[t]));
            } else c[t].insert(e);
            var i = c[t].size();
            u += i - n;
          } else c[t] = new s.default([e]), ++u;
          u > h * a.sigma && function (e) {
            if (!(e >= a.maxSize)) {
              h = 2 * e;
              var t = [];
              c.forEach(function (n, i) {
                if (!n.empty()) {
                  if (n instanceof s.default && 1 === n.size()) {
                    var l = n.front();
                    if (void 0 === l) throw new Error("unknown error");
                    t[r(l) & h - 1] = new s.default([l]);
                  } else if (n instanceof o.default) {
                    var u = new s.default(),
                      f = new s.default();
                    n.forEach(function (t) {
                      0 == (r(t) & e) ? u.pushBack(t) : f.pushBack(t);
                    }), u.size() > a.untreeifyThreshold ? t[i] = new o.default(u) : u.size() && (t[i] = u), f.size() > a.untreeifyThreshold ? t[i + e] = new o.default(f) : f.size() && (t[i + e] = f);
                  } else {
                    var p = new s.default(),
                      d = new s.default();
                    n.forEach(function (t) {
                      0 == (r(t) & e) ? p.pushBack(t) : d.pushBack(t);
                    }), p.size() && (t[i] = p), d.size() && (t[i + e] = d);
                  }
                  c[i].clear();
                }
              }), c = t;
            }
          }.call(this, h);
        }, this.eraseElementByValue = function (e) {
          var t = r(e) & h - 1;
          if (c[t]) {
            var n = c[t].size();
            c[t].eraseElementByValue(e), c[t] instanceof o.default && c[t].size() <= a.untreeifyThreshold && (c[t] = new s.default(c[t]));
            var i = c[t].size();
            u += i - n;
          }
        }, this.find = function (e) {
          var t = r(e) & h - 1;
          return !!c[t] && c[t].find(e);
        }, this[Symbol.iterator] = function () {
          return function () {
            var e, t, r, o, s, a;
            return n(this, function (n) {
              switch (n.label) {
                case 0:
                  e = 0, n.label = 1;
                case 1:
                  if (!(e < h)) return [3, 10];
                  for (; e < h && !c[e];) ++e;
                  if (e >= h) return [3, 10];
                  n.label = 2;
                case 2:
                  n.trys.push([2, 7, 8, 9]), s = void 0, t = i(c[e]), r = t.next(), n.label = 3;
                case 3:
                  return r.done ? [3, 6] : [4, r.value];
                case 4:
                  n.sent(), n.label = 5;
                case 5:
                  return r = t.next(), [3, 3];
                case 6:
                  return [3, 9];
                case 7:
                  return o = n.sent(), s = {
                    error: o
                  }, [3, 9];
                case 8:
                  try {
                    r && !r.done && (a = t.return) && a.call(t);
                  } finally {
                    if (s) throw s.error;
                  }
                  return [7];
                case 9:
                  return ++e, [3, 1];
                case 10:
                  return [2];
              }
            });
          }();
        }, e.forEach(function (e) {
          return l.insert(e);
        }), Object.freeze(this);
      }
      a.initSize = 16, a.maxSize = 1 << 30, a.sigma = .75, a.treeifyThreshold = 8, a.untreeifyThreshold = 6, a.minTreeifySize = 64, Object.freeze(a), r.default = a;
    }, {
      "../LinkList/LinkList": 29,
      "../Set/Set": 33
    }],
    29: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
        var r,
          n,
          i,
          o,
          s = {
            label: 0,
            sent: function () {
              if (1 & i[0]) throw i[1];
              return i[1];
            },
            trys: [],
            ops: []
          };
        return o = {
          next: a(0),
          throw: a(1),
          return: a(2)
        }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
          return this;
        }), o;
        function a(o) {
          return function (a) {
            return function (o) {
              if (r) throw new TypeError("Generator is already executing.");
              for (; s;) try {
                if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                  case 0:
                  case 1:
                    i = o;
                    break;
                  case 4:
                    return s.label++, {
                      value: o[1],
                      done: !1
                    };
                  case 5:
                    s.label++, n = o[1], o = [0];
                    continue;
                  case 7:
                    o = s.ops.pop(), s.trys.pop();
                    continue;
                  default:
                    if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                      s = 0;
                      continue;
                    }
                    if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                      s.label = o[1];
                      break;
                    }
                    if (6 === o[0] && s.label < i[1]) {
                      s.label = i[1], i = o;
                      break;
                    }
                    if (i && s.label < i[2]) {
                      s.label = i[2], s.ops.push(o);
                      break;
                    }
                    i[2] && s.ops.pop(), s.trys.pop();
                    continue;
                }
                o = t.call(e, s);
              } catch (e) {
                o = [6, e], n = 0;
              } finally {
                r = i = 0;
              }
              if (5 & o[0]) throw o[1];
              return {
                value: o[0] ? o[1] : void 0,
                done: !0
              };
            }([o, a]);
          };
        }
      };
      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var i = function () {
        return function (e) {
          this.value = void 0, this.pre = void 0, this.next = void 0, this.value = e;
        };
      }();
      function o(e) {
        var t = this;
        void 0 === e && (e = []);
        var r = 0,
          o = void 0,
          s = void 0;
        this.size = function () {
          return r;
        }, this.empty = function () {
          return 0 === r;
        }, this.clear = function () {
          o = s = void 0, r = 0;
        }, this.front = function () {
          return null === o || void 0 === o ? void 0 : o.value;
        }, this.back = function () {
          return null === s || void 0 === s ? void 0 : s.value;
        }, this.forEach = function (e) {
          for (var t = o, r = 0; t;) {
            if (void 0 === t.value) throw new Error("unknown error");
            e(t.value, r++), t = t.next;
          }
        }, this.getElementByPos = function (e) {
          if (e < 0 || e >= r) throw new Error("pos must more then 0 and less then the list length");
          for (var t = o; e-- && t;) t = t.next;
          if (!t || void 0 === t.value) throw new Error("unknown error");
          return t.value;
        }, this.eraseElementByPos = function (e) {
          if (e < 0 || e >= r) throw new Error("erase pos must more then 0 and less then the list length");
          if (0 === e) this.popFront();else if (e === r - 1) this.popBack();else {
            for (var t = o; e--;) {
              if (!(null === t || void 0 === t ? void 0 : t.next)) throw new Error("unknown error");
              t = t.next;
            }
            if (!t || !t.pre || !t.next) throw new Error("unknown error");
            var n = t.pre,
              i = t.next;
            i.pre = n, n.next = i, r > 0 && --r;
          }
        }, this.eraseElementByValue = function (e) {
          for (; o && o.value === e;) this.popFront();
          for (; s && s.value === e;) this.popBack();
          if (o) for (var t = o; t;) {
            if (t.value === e) {
              var n = t.pre,
                i = t.next;
              i && (i.pre = n), n && (n.next = i), r > 0 && --r;
            }
            t = t.next;
          }
        }, this.pushBack = function (e) {
          if (null === e || void 0 === e) throw new Error("you can't push null or undefined here");
          ++r;
          var t = new i(e);
          s ? (s.next = t, t.pre = s, s = t) : o = s = t;
        }, this.popBack = function () {
          s && (r > 0 && --r, s && (o === s ? o = s = void 0 : (s = s.pre) && (s.next = void 0)));
        }, this.setElementByPos = function (e, t) {
          if (null === t || void 0 === t) throw new Error("you can't set null or undefined here");
          if (e < 0 || e >= r) throw new Error("pos must more then 0 and less then the list length");
          for (var n = o; e--;) {
            if (!n) throw new Error("unknown error");
            n = n.next;
          }
          n && (n.value = t);
        }, this.insert = function (e, t, n) {
          if (void 0 === n && (n = 1), null === t || void 0 === t) throw new Error("you can't insert null or undefined here");
          if (e < 0 || e > r) throw new Error("insert pos must more then 0 and less then or equal to the list length");
          if (n < 0) throw new Error("insert size must more than 0");
          if (0 === e) for (; n--;) this.pushFront(t);else if (e === r) for (; n--;) this.pushBack(t);else {
            for (var s = o, a = 1; a < e; ++a) {
              if (!(null === s || void 0 === s ? void 0 : s.next)) throw new Error("unknown error");
              s = null === s || void 0 === s ? void 0 : s.next;
            }
            if (!s) throw new Error("unknown error");
            var l = s.next;
            for (r += n; n--;) s.next = new i(t), s.next.pre = s, s = s.next;
            s.next = l, l && (l.pre = s);
          }
        }, this.find = function (e) {
          for (var t = o; t;) {
            if (t.value === e) return !0;
            t = t.next;
          }
          return !1;
        }, this.reverse = function () {
          for (var e = o, t = s, n = 0; e && t && 2 * n < r;) {
            var i = e.value;
            e.value = t.value, t.value = i, e = e.next, t = t.pre, ++n;
          }
        }, this.unique = function () {
          for (var e = o; e;) {
            for (var t = e; t && t.next && t.value === t.next.value;) t = t.next, r > 0 && --r;
            e.next = t.next, e.next && (e.next.pre = e), e = e.next;
          }
        }, this.sort = function (e) {
          var t = [];
          this.forEach(function (e) {
            t.push(e);
          }), t.sort(e);
          var r = o;
          t.forEach(function (e) {
            r && (r.value = e, r = r.next);
          });
        }, this.pushFront = function (e) {
          if (null === e || void 0 === e) throw new Error("you can't push null or undefined here");
          ++r;
          var t = new i(e);
          o ? (t.next = o, o.pre = t, o = t) : o = s = t;
        }, this.popFront = function () {
          o && (r > 0 && --r, o && (o === s ? o = s = void 0 : (o = o.next) && (o.pre = void 0)));
        }, this.merge = function (e) {
          var t = this,
            n = o;
          e.forEach(function (e) {
            for (; n && void 0 !== n.value && n.value <= e;) n = n.next;
            if (void 0 === n) t.pushBack(e), n = s;else if (n === o) t.pushFront(e), n = o;else {
              ++r;
              var a = n.pre;
              a && (a.next = new i(e), a.next.pre = a, a.next.next = n, n && (n.pre = a.next));
            }
          });
        }, this[Symbol.iterator] = function () {
          return function () {
            var e;
            return n(this, function (t) {
              switch (t.label) {
                case 0:
                  e = o, t.label = 1;
                case 1:
                  if (void 0 === e) return [3, 3];
                  if (!e.value) throw new Error("unknown error");
                  return [4, e.value];
                case 2:
                  return t.sent(), e = e.next, [3, 1];
                case 3:
                  return [2];
              }
            });
          }();
        }, e.forEach(function (e) {
          return t.pushBack(e);
        }), Object.freeze(this);
      }
      Object.freeze(o), r.default = o;
    }, {}],
    30: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
          var r,
            n,
            i,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & i[0]) throw i[1];
                return i[1];
              },
              trys: [],
              ops: []
            };
          return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function a(o) {
            return function (a) {
              return function (o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; s;) try {
                  if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                  switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      s.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = s.ops.pop(), s.trys.pop();
                      continue;
                    default:
                      if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        s.label = i[1], i = o;
                        break;
                      }
                      if (i && s.label < i[2]) {
                        s.label = i[2], s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  o = [6, e], n = 0;
                } finally {
                  r = i = 0;
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                };
              }([o, a]);
            };
          }
        },
        i = this && this.__values || function (e) {
          var t = "function" == typeof Symbol && Symbol.iterator,
            r = t && e[t],
            n = 0;
          if (r) return r.call(e);
          if (e && "number" == typeof e.length) return {
            next: function () {
              return e && n >= e.length && (e = void 0), {
                value: e && e[n++],
                done: !e
              };
            }
          };
          throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var o = e("../Base/TreeNode");
      function s(e, t) {
        var r = this;
        void 0 === e && (e = []), t = t || function (e, t) {
          return e < t ? -1 : e > t ? 1 : 0;
        };
        var s = 0,
          a = new o.default();
        a.color = o.default.TreeNodeColorType.black, this.size = function () {
          return s;
        }, this.empty = function () {
          return 0 === s;
        }, this.clear = function () {
          s = 0, a.key = a.value = void 0, a.leftChild = a.rightChild = a.brother = void 0;
        };
        var l = function (e) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            return e.leftChild ? l(e.leftChild) : e;
          },
          u = function (e) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            return e.rightChild ? u(e.rightChild) : e;
          };
        this.front = function () {
          if (!this.empty()) {
            var e = l(a);
            if (void 0 === e.key || void 0 === e.value) throw new Error("unknown error");
            return {
              key: e.key,
              value: e.value
            };
          }
        }, this.back = function () {
          if (!this.empty()) {
            var e = u(a);
            if (void 0 === e.key || void 0 === e.value) throw new Error("unknown error");
            return {
              key: e.key,
              value: e.value
            };
          }
        }, this.forEach = function (e) {
          var t,
            r,
            n = 0;
          try {
            for (var o = i(this), s = o.next(); !s.done; s = o.next()) {
              e(s.value, n++);
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              s && !s.done && (r = o.return) && r.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
        }, this.getElementByPos = function (e) {
          var t, r;
          if (e < 0 || e >= this.size()) throw new Error("pos must more than 0 and less than set's size");
          var n = 0;
          try {
            for (var o = i(this), s = o.next(); !s.done; s = o.next()) {
              var a = s.value;
              if (n === e) return a;
              ++n;
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              s && !s.done && (r = o.return) && r.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
          throw new Error("unknown Error");
        };
        var c = function (e, r) {
          if (e && void 0 !== e.key && void 0 !== e.value) {
            var n = t(e.key, r);
            return 0 === n ? {
              key: e.key,
              value: e.value
            } : n < 0 ? c(e.rightChild, r) : c(e.leftChild, r) || {
              key: e.key,
              value: e.value
            };
          }
        };
        this.lowerBound = function (e) {
          return c(a, e);
        };
        var h = function (e, r) {
          if (e && void 0 !== e.key && void 0 !== e.value) return t(e.key, r) <= 0 ? h(e.rightChild, r) : h(e.leftChild, r) || {
            key: e.key,
            value: e.value
          };
        };
        this.upperBound = function (e) {
          return h(a, e);
        };
        var f = function (e, r) {
          if (e && void 0 !== e.key && void 0 !== e.value) {
            var n = t(e.key, r);
            return 0 === n ? {
              key: e.key,
              value: e.value
            } : n > 0 ? f(e.leftChild, r) : f(e.rightChild, r) || {
              key: e.key,
              value: e.value
            };
          }
        };
        this.reverseLowerBound = function (e) {
          return f(a, e);
        };
        var p = function (e, r) {
          if (e && void 0 !== e.key && void 0 !== e.value) return t(e.key, r) >= 0 ? p(e.leftChild, r) : p(e.rightChild, r) || {
            key: e.key,
            value: e.value
          };
        };
        this.reverseUpperBound = function (e) {
          return p(a, e);
        };
        var d = function (e) {
            var t = e.parent;
            if (!t) {
              if (e === a) return;
              throw new Error("unknown error");
            }
            if (e.color !== o.default.TreeNodeColorType.red) {
              var r = e.brother;
              if (!r) throw new Error("unknown error");
              if (e === t.leftChild) {
                if (r.color === o.default.TreeNodeColorType.red) {
                  r.color = o.default.TreeNodeColorType.black, t.color = o.default.TreeNodeColorType.red;
                  var n = t.rotateLeft();
                  a === t && (a = n), d(e);
                } else if (r.color === o.default.TreeNodeColorType.black) if (r.rightChild && r.rightChild.color === o.default.TreeNodeColorType.red) {
                  r.color = t.color, t.color = o.default.TreeNodeColorType.black, r.rightChild && (r.rightChild.color = o.default.TreeNodeColorType.black);
                  n = t.rotateLeft();
                  a === t && (a = n), e.color = o.default.TreeNodeColorType.black;
                } else if (r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || !r.leftChild || r.leftChild.color !== o.default.TreeNodeColorType.red) r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || (r.color = o.default.TreeNodeColorType.red, d(t));else {
                  r.color = o.default.TreeNodeColorType.red, r.leftChild && (r.leftChild.color = o.default.TreeNodeColorType.black);
                  n = r.rotateRight();
                  a === r && (a = n), d(e);
                }
              } else if (e === t.rightChild) if (r.color === o.default.TreeNodeColorType.red) {
                r.color = o.default.TreeNodeColorType.black, t.color = o.default.TreeNodeColorType.red;
                n = t.rotateRight();
                a === t && (a = n), d(e);
              } else if (r.color === o.default.TreeNodeColorType.black) if (r.leftChild && r.leftChild.color === o.default.TreeNodeColorType.red) {
                r.color = t.color, t.color = o.default.TreeNodeColorType.black, r.leftChild && (r.leftChild.color = o.default.TreeNodeColorType.black);
                n = t.rotateRight();
                a === t && (a = n), e.color = o.default.TreeNodeColorType.black;
              } else if (r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || !r.rightChild || r.rightChild.color !== o.default.TreeNodeColorType.red) r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || (r.color = o.default.TreeNodeColorType.red, d(t));else {
                r.color = o.default.TreeNodeColorType.red, r.rightChild && (r.rightChild.color = o.default.TreeNodeColorType.black);
                n = r.rotateLeft();
                a === r && (a = n), d(e);
              }
            } else e.color = o.default.TreeNodeColorType.black;
          },
          g = function (e) {
            for (var t = e; t.leftChild || t.rightChild;) {
              if (t.rightChild) {
                t = l(t.rightChild);
                var r = e.key;
                e.key = t.key, t.key = r;
                var n = e.value;
                e.value = t.value, t.value = n, e = t;
              }
              if (t.leftChild) {
                t = u(t.leftChild);
                r = e.key;
                e.key = t.key, t.key = r;
                n = e.value;
                e.value = t.value, t.value = n, e = t;
              }
            }
            d(t), t && t.remove(), --s, a.color = o.default.TreeNodeColorType.black;
          },
          y = function (e, t) {
            return !(!e || void 0 === e.key) && (!!y(e.leftChild, t) || !!t(e) || y(e.rightChild, t));
          };
        this.eraseElementByPos = function (e) {
          if (e < 0 || e >= s) throw new Error("pos must more than 0 and less than set's size");
          var t = 0;
          y(a, function (r) {
            return e === t ? (g(r), !0) : (++t, !1);
          });
        }, this.eraseElementByKey = function (e) {
          if (!this.empty()) {
            var r = v(a, e);
            void 0 !== r && void 0 !== r.key && 0 === t(r.key, e) && g(r);
          }
        };
        var b = function (e, r) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            var n = t(r, e.key);
            return n < 0 ? e.leftChild ? b(e.leftChild, r) : (e.leftChild = new o.default(), e.leftChild.parent = e, e.leftChild.brother = e.rightChild, e.rightChild && (e.rightChild.brother = e.leftChild), e.leftChild) : n > 0 ? e.rightChild ? b(e.rightChild, r) : (e.rightChild = new o.default(), e.rightChild.parent = e, e.rightChild.brother = e.leftChild, e.leftChild && (e.leftChild.brother = e.rightChild), e.rightChild) : e;
          },
          m = function (e) {
            var t = e.parent;
            if (!t) {
              if (e === a) return;
              throw new Error("unknown error");
            }
            if (t.color !== o.default.TreeNodeColorType.black && t.color === o.default.TreeNodeColorType.red) {
              var r = t.brother,
                n = t.parent;
              if (!n) throw new Error("unknown error");
              if (r && r.color === o.default.TreeNodeColorType.red) r.color = t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red, m(n);else if (!r || r.color === o.default.TreeNodeColorType.black) if (t === n.leftChild) {
                if (e === t.leftChild) {
                  t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red;
                  var i = n.rotateRight();
                  n === a && (a = i);
                } else if (e === t.rightChild) {
                  i = t.rotateLeft();
                  n === a && (a = i), m(t);
                }
              } else if (t === n.rightChild) if (e === t.leftChild) {
                i = t.rotateRight();
                n === a && (a = i), m(t);
              } else if (e === t.rightChild) {
                t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red;
                i = n.rotateLeft();
                n === a && (a = i);
              }
            }
          };
        this.setElement = function (e, r) {
          if (null === e || void 0 === e) throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
          if (null !== r && void 0 !== r) {
            if (this.empty()) return ++s, a.key = e, a.value = r, void (a.color = o.default.TreeNodeColorType.black);
            var n = b(a, e);
            void 0 === n.key || 0 !== t(n.key, e) ? (++s, n.key = e, n.value = r, m(n), a.color = o.default.TreeNodeColorType.black) : n.value = r;
          } else this.eraseElementByKey(e);
        };
        var v = function (e, r) {
          if (e && void 0 !== e.key) {
            var n = t(r, e.key);
            return n < 0 ? v(e.leftChild, r) : n > 0 ? v(e.rightChild, r) : e;
          }
        };
        this.find = function (e) {
          return !!v(a, e);
        }, this.getElementByKey = function (e) {
          var t = v(a, e);
          if (void 0 === (null === t || void 0 === t ? void 0 : t.key) || void 0 === (null === t || void 0 === t ? void 0 : t.value)) throw new Error("unknown error");
          return t.value;
        }, this.union = function (e) {
          var t = this;
          e.forEach(function (e) {
            var r = e.key,
              n = e.value;
            return t.setElement(r, n);
          });
        }, this.getHeight = function () {
          if (this.empty()) return 0;
          var e = function (t) {
            return t ? Math.max(e(t.leftChild), e(t.rightChild)) + 1 : 1;
          };
          return e(a);
        };
        var w = function (e) {
          return n(this, function (t) {
            switch (t.label) {
              case 0:
                return e && void 0 !== e.key && void 0 !== e.value ? [5, i(w(e.leftChild))] : [2];
              case 1:
                return t.sent(), [4, {
                  key: e.key,
                  value: e.value
                }];
              case 2:
                return t.sent(), [5, i(w(e.rightChild))];
              case 3:
                return t.sent(), [2];
            }
          });
        };
        this[Symbol.iterator] = function () {
          return w(a);
        }, e.forEach(function (e) {
          var t = e.key,
            n = e.value;
          return r.setElement(t, n);
        }), Object.freeze(this);
      }
      Object.freeze(s), r.default = s;
    }, {
      "../Base/TreeNode": 25
    }],
    31: [function (e, t, r) {
      "use strict";

      function n(e, t) {
        void 0 === e && (e = []), t = t || function (e, t) {
          return e > t ? -1 : e < t ? 1 : 0;
        };
        var r = [];
        e.forEach(function (e) {
          return r.push(e);
        });
        var n = r.length,
          i = function (e, t) {
            if (e < 0 || e >= n) throw new Error("unknown error");
            if (t < 0 || t >= n) throw new Error("unknown error");
            var i = r[e];
            r[e] = r[t], r[t] = i;
          },
          o = function (e) {
            if (e < 0 || e >= n) throw new Error("unknown error");
            var o = 2 * e + 1,
              s = 2 * e + 2;
            o < n && t(r[e], r[o]) > 0 && i(e, o), s < n && t(r[e], r[s]) > 0 && i(e, s);
          };
        !function () {
          for (var e = Math.floor((n - 1) / 2); e >= 0; --e) for (var o = e, s = 2 * o + 1; s < n;) {
            var a = s + 1,
              l = s;
            if (a < n && t(r[s], r[a]) > 0 && (l = a), t(r[o], r[l]) <= 0) break;
            i(o, l), s = 2 * (o = l) + 1;
          }
        }(), this.size = function () {
          return n;
        }, this.empty = function () {
          return 0 === n;
        }, this.clear = function () {
          n = 0, r.length = 0;
        }, this.push = function (e) {
          if (r.push(e), 1 !== ++n) for (var i = n - 1; i > 0;) {
            var s = Math.floor((i - 1) / 2);
            if (t(r[s], e) <= 0) break;
            o(s), i = s;
          }
        }, this.pop = function () {
          if (!this.empty()) if (1 !== this.size()) {
            var e = r[n - 1];
            --n;
            for (var i = 0; i < this.size();) {
              var o = 2 * i + 1,
                s = 2 * i + 2;
              if (o >= this.size()) break;
              var a = o;
              if (s < this.size() && t(r[o], r[s]) > 0 && (a = s), t(r[a], e) >= 0) break;
              r[i] = r[a], i = a;
            }
            r[i] = e;
          } else --n;
        }, this.top = function () {
          return r[0];
        }, Object.freeze(this);
      }
      Object.defineProperty(r, "__esModule", {
        value: !0
      }), Object.freeze(n), r.default = n;
    }, {}],
    32: [function (e, t, r) {
      "use strict";

      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var n = e("../LinkList/LinkList");
      function i(e) {
        void 0 === e && (e = []);
        var t = new n.default(e);
        this.size = function () {
          return t.size();
        }, this.empty = function () {
          return t.empty();
        }, this.clear = function () {
          t.clear();
        }, this.push = function (e) {
          t.pushBack(e);
        }, this.pop = function () {
          t.popFront();
        }, this.front = function () {
          return t.front();
        }, Object.freeze(this);
      }
      Object.freeze(i), r.default = i;
    }, {
      "../LinkList/LinkList": 29
    }],
    33: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
          var r,
            n,
            i,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & i[0]) throw i[1];
                return i[1];
              },
              trys: [],
              ops: []
            };
          return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function a(o) {
            return function (a) {
              return function (o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; s;) try {
                  if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                  switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      s.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = s.ops.pop(), s.trys.pop();
                      continue;
                    default:
                      if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        s.label = i[1], i = o;
                        break;
                      }
                      if (i && s.label < i[2]) {
                        s.label = i[2], s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  o = [6, e], n = 0;
                } finally {
                  r = i = 0;
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                };
              }([o, a]);
            };
          }
        },
        i = this && this.__values || function (e) {
          var t = "function" == typeof Symbol && Symbol.iterator,
            r = t && e[t],
            n = 0;
          if (r) return r.call(e);
          if (e && "number" == typeof e.length) return {
            next: function () {
              return e && n >= e.length && (e = void 0), {
                value: e && e[n++],
                done: !e
              };
            }
          };
          throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
      Object.defineProperty(r, "__esModule", {
        value: !0
      });
      var o = e("../Base/TreeNode");
      function s(e, t) {
        var r = this;
        void 0 === e && (e = []), t = t || function (e, t) {
          return e < t ? -1 : e > t ? 1 : 0;
        };
        var s = 0,
          a = new o.default();
        a.color = o.default.TreeNodeColorType.black, this.size = function () {
          return s;
        }, this.empty = function () {
          return 0 === s;
        }, this.clear = function () {
          s = 0, a.key = void 0, a.leftChild = a.rightChild = a.brother = a.parent = void 0, a.color = o.default.TreeNodeColorType.black;
        };
        var l = function (e) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            return e.leftChild ? l(e.leftChild) : e;
          },
          u = function (e) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            return e.rightChild ? u(e.rightChild) : e;
          };
        this.front = function () {
          if (!this.empty()) return l(a).key;
        }, this.back = function () {
          if (!this.empty()) return u(a).key;
        }, this.forEach = function (e) {
          var t,
            r,
            n = 0;
          try {
            for (var o = i(this), s = o.next(); !s.done; s = o.next()) {
              e(s.value, n++);
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              s && !s.done && (r = o.return) && r.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
        }, this.getElementByPos = function (e) {
          var t, r;
          if (e < 0 || e >= this.size()) throw new Error("pos must more than 0 and less than set's size");
          var n = 0;
          try {
            for (var o = i(this), s = o.next(); !s.done; s = o.next()) {
              var a = s.value;
              if (n === e) return a;
              ++n;
            }
          } catch (e) {
            t = {
              error: e
            };
          } finally {
            try {
              s && !s.done && (r = o.return) && r.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
          throw new Error("unknown error");
        };
        var c = function (e) {
            var t = e.parent;
            if (!t) {
              if (e === a) return;
              throw new Error("unknown error");
            }
            if (e.color !== o.default.TreeNodeColorType.red) {
              var r = e.brother;
              if (!r) throw new Error("unknown error");
              if (e === t.leftChild) {
                if (r.color === o.default.TreeNodeColorType.red) {
                  r.color = o.default.TreeNodeColorType.black, t.color = o.default.TreeNodeColorType.red;
                  var n = t.rotateLeft();
                  a === t && (a = n), c(e);
                } else if (r.color === o.default.TreeNodeColorType.black) if (r.rightChild && r.rightChild.color === o.default.TreeNodeColorType.red) {
                  r.color = t.color, t.color = o.default.TreeNodeColorType.black, r.rightChild && (r.rightChild.color = o.default.TreeNodeColorType.black);
                  n = t.rotateLeft();
                  a === t && (a = n), e.color = o.default.TreeNodeColorType.black;
                } else if (r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || !r.leftChild || r.leftChild.color !== o.default.TreeNodeColorType.red) r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || (r.color = o.default.TreeNodeColorType.red, c(t));else {
                  r.color = o.default.TreeNodeColorType.red, r.leftChild && (r.leftChild.color = o.default.TreeNodeColorType.black);
                  n = r.rotateRight();
                  a === r && (a = n), c(e);
                }
              } else if (e === t.rightChild) if (r.color === o.default.TreeNodeColorType.red) {
                r.color = o.default.TreeNodeColorType.black, t.color = o.default.TreeNodeColorType.red;
                n = t.rotateRight();
                a === t && (a = n), c(e);
              } else if (r.color === o.default.TreeNodeColorType.black) if (r.leftChild && r.leftChild.color === o.default.TreeNodeColorType.red) {
                r.color = t.color, t.color = o.default.TreeNodeColorType.black, r.leftChild && (r.leftChild.color = o.default.TreeNodeColorType.black);
                n = t.rotateRight();
                a === t && (a = n), e.color = o.default.TreeNodeColorType.black;
              } else if (r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || !r.rightChild || r.rightChild.color !== o.default.TreeNodeColorType.red) r.leftChild && r.leftChild.color !== o.default.TreeNodeColorType.black || r.rightChild && r.rightChild.color !== o.default.TreeNodeColorType.black || (r.color = o.default.TreeNodeColorType.red, c(t));else {
                r.color = o.default.TreeNodeColorType.red, r.rightChild && (r.rightChild.color = o.default.TreeNodeColorType.black);
                n = r.rotateLeft();
                a === r && (a = n), c(e);
              }
            } else e.color = o.default.TreeNodeColorType.black;
          },
          h = function (e) {
            for (var t = e; t.leftChild || t.rightChild;) {
              if (t.rightChild) {
                t = l(t.rightChild);
                var r = e.key;
                e.key = t.key, t.key = r, e = t;
              }
              if (t.leftChild) {
                t = u(t.leftChild);
                r = e.key;
                e.key = t.key, t.key = r, e = t;
              }
            }
            c(t), t && t.remove(), --s, a.color = o.default.TreeNodeColorType.black;
          },
          f = function (e, t) {
            return !(!e || void 0 === e.key) && (!!f(e.leftChild, t) || !!t(e) || f(e.rightChild, t));
          };
        this.eraseElementByPos = function (e) {
          if (e < 0 || e >= s) throw new Error("pos must more than 0 and less than set's size");
          var t = 0;
          f(a, function (r) {
            return e === t ? (h(r), !0) : (++t, !1);
          });
        }, this.eraseElementByValue = function (e) {
          if (!this.empty()) {
            var r = g(a, e);
            void 0 !== r && void 0 !== r.key && 0 === t(r.key, e) && h(r);
          }
        };
        var p = function (e, r) {
            if (!e || void 0 === e.key) throw new Error("unknown error");
            var n = t(r, e.key);
            return n < 0 ? e.leftChild ? p(e.leftChild, r) : (e.leftChild = new o.default(), e.leftChild.parent = e, e.leftChild.brother = e.rightChild, e.rightChild && (e.rightChild.brother = e.leftChild), e.leftChild) : n > 0 ? e.rightChild ? p(e.rightChild, r) : (e.rightChild = new o.default(), e.rightChild.parent = e, e.rightChild.brother = e.leftChild, e.leftChild && (e.leftChild.brother = e.rightChild), e.rightChild) : e;
          },
          d = function (e) {
            var t = e.parent;
            if (!t) {
              if (e === a) return;
              throw new Error("unknown error");
            }
            if (t.color !== o.default.TreeNodeColorType.black && t.color === o.default.TreeNodeColorType.red) {
              var r = t.brother,
                n = t.parent;
              if (!n) throw new Error("unknown error");
              if (r && r.color === o.default.TreeNodeColorType.red) r.color = t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red, d(n);else if (!r || r.color === o.default.TreeNodeColorType.black) if (t === n.leftChild) {
                if (e === t.leftChild) {
                  t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red;
                  var i = n.rotateRight();
                  n === a && (a = i);
                } else if (e === t.rightChild) {
                  i = t.rotateLeft();
                  n === a && (a = i), d(t);
                }
              } else if (t === n.rightChild) if (e === t.leftChild) {
                i = t.rotateRight();
                n === a && (a = i), d(t);
              } else if (e === t.rightChild) {
                t.color = o.default.TreeNodeColorType.black, n.color = o.default.TreeNodeColorType.red;
                i = n.rotateLeft();
                n === a && (a = i);
              }
            }
          };
        this.insert = function (e) {
          if (null === e || void 0 === e) throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
          if (this.empty()) return ++s, a.key = e, void (a.color = o.default.TreeNodeColorType.black);
          var r = p(a, e);
          void 0 !== r.key && 0 === t(r.key, e) || (++s, r.key = e, d(r), a.color = o.default.TreeNodeColorType.black);
        };
        var g = function (e, r) {
          if (e && void 0 !== e.key) {
            var n = t(r, e.key);
            return n < 0 ? g(e.leftChild, r) : n > 0 ? g(e.rightChild, r) : e;
          }
        };
        this.find = function (e) {
          var r = g(a, e);
          return void 0 !== r && void 0 !== r.key && 0 === t(r.key, e);
        };
        var y = function (e, r) {
          if (e && void 0 !== e.key) {
            var n = t(e.key, r);
            return 0 === n ? e.key : n < 0 ? y(e.rightChild, r) : y(e.leftChild, r) || e.key;
          }
        };
        this.lowerBound = function (e) {
          return y(a, e);
        };
        var b = function (e, r) {
          if (e && void 0 !== e.key) return t(e.key, r) <= 0 ? b(e.rightChild, r) : b(e.leftChild, r) || e.key;
        };
        this.upperBound = function (e) {
          return b(a, e);
        };
        var m = function (e, r) {
          if (e && void 0 !== e.key) {
            var n = t(e.key, r);
            return 0 === n ? e.key : n > 0 ? m(e.leftChild, r) : m(e.rightChild, r) || e.key;
          }
        };
        this.reverseLowerBound = function (e) {
          return m(a, e);
        };
        var v = function (e, r) {
          if (e && void 0 !== e.key) return t(e.key, r) >= 0 ? v(e.leftChild, r) : v(e.rightChild, r) || e.key;
        };
        this.reverseUpperBound = function (e) {
          return v(a, e);
        }, this.union = function (e) {
          var t = this;
          e.forEach(function (e) {
            return t.insert(e);
          });
        }, this.getHeight = function () {
          if (this.empty()) return 0;
          var e = function (t) {
            return t ? Math.max(e(t.leftChild), e(t.rightChild)) + 1 : 1;
          };
          return e(a);
        };
        var w = function (e) {
          return n(this, function (t) {
            switch (t.label) {
              case 0:
                return e && void 0 !== e.key ? [5, i(w(e.leftChild))] : [2];
              case 1:
                return t.sent(), [4, e.key];
              case 2:
                return t.sent(), [5, i(w(e.rightChild))];
              case 3:
                return t.sent(), [2];
            }
          });
        };
        this[Symbol.iterator] = function () {
          return w(a);
        }, e.forEach(function (e) {
          return r.insert(e);
        }), Object.freeze(this);
      }
      Object.freeze(s), r.default = s;
    }, {
      "../Base/TreeNode": 25
    }],
    34: [function (e, t, r) {
      "use strict";

      function n(e) {
        var t = this;
        void 0 === e && (e = []);
        var r = 0,
          n = [];
        this.size = function () {
          return r;
        }, this.empty = function () {
          return 0 === r;
        }, this.clear = function () {
          r = 0, n.length = 0;
        }, this.push = function (e) {
          n.push(e), ++r;
        }, this.pop = function () {
          n.pop(), r > 0 && --r;
        }, this.top = function () {
          return n[r - 1];
        }, e.forEach(function (e) {
          return t.push(e);
        }), Object.freeze(this);
      }
      Object.defineProperty(r, "__esModule", {
        value: !0
      }), Object.freeze(n), r.default = n;
    }, {}],
    35: [function (e, t, r) {
      "use strict";

      var n = this && this.__generator || function (e, t) {
          var r,
            n,
            i,
            o,
            s = {
              label: 0,
              sent: function () {
                if (1 & i[0]) throw i[1];
                return i[1];
              },
              trys: [],
              ops: []
            };
          return o = {
            next: a(0),
            throw: a(1),
            return: a(2)
          }, "function" == typeof Symbol && (o[Symbol.iterator] = function () {
            return this;
          }), o;
          function a(o) {
            return function (a) {
              return function (o) {
                if (r) throw new TypeError("Generator is already executing.");
                for (; s;) try {
                  if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 0) : n.next) && !(i = i.call(n, o[1])).done) return i;
                  switch (n = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                    case 0:
                    case 1:
                      i = o;
                      break;
                    case 4:
                      return s.label++, {
                        value: o[1],
                        done: !1
                      };
                    case 5:
                      s.label++, n = o[1], o = [0];
                      continue;
                    case 7:
                      o = s.ops.pop(), s.trys.pop();
                      continue;
                    default:
                      if (!(i = (i = s.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                        s = 0;
                        continue;
                      }
                      if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                        s.label = o[1];
                        break;
                      }
                      if (6 === o[0] && s.label < i[1]) {
                        s.label = i[1], i = o;
                        break;
                      }
                      if (i && s.label < i[2]) {
                        s.label = i[2], s.ops.push(o);
                        break;
                      }
                      i[2] && s.ops.pop(), s.trys.pop();
                      continue;
                  }
                  o = t.call(e, s);
                } catch (e) {
                  o = [6, e], n = 0;
                } finally {
                  r = i = 0;
                }
                if (5 & o[0]) throw o[1];
                return {
                  value: o[0] ? o[1] : void 0,
                  done: !0
                };
              }([o, a]);
            };
          }
        },
        i = this && this.__read || function (e, t) {
          var r = "function" == typeof Symbol && e[Symbol.iterator];
          if (!r) return e;
          var n,
            i,
            o = r.call(e),
            s = [];
          try {
            for (; (void 0 === t || t-- > 0) && !(n = o.next()).done;) s.push(n.value);
          } catch (e) {
            i = {
              error: e
            };
          } finally {
            try {
              n && !n.done && (r = o.return) && r.call(o);
            } finally {
              if (i) throw i.error;
            }
          }
          return s;
        },
        o = this && this.__spreadArray || function (e, t, r) {
          if (r || 2 === arguments.length) for (var n, i = 0, o = t.length; i < o; i++) !n && i in t || (n || (n = Array.prototype.slice.call(t, 0, i)), n[i] = t[i]);
          return e.concat(n || Array.prototype.slice.call(t));
        },
        s = this && this.__values || function (e) {
          var t = "function" == typeof Symbol && Symbol.iterator,
            r = t && e[t],
            n = 0;
          if (r) return r.call(e);
          if (e && "number" == typeof e.length) return {
            next: function () {
              return e && n >= e.length && (e = void 0), {
                value: e && e[n++],
                done: !e
              };
            }
          };
          throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
        };
      function a(e) {
        var t = this;
        void 0 === e && (e = []);
        var r = 0,
          a = [];
        this.size = function () {
          return r;
        }, this.empty = function () {
          return 0 === r;
        }, this.clear = function () {
          r = 0, a.length = 0;
        }, this.front = function () {
          if (!this.empty()) return a[0];
        }, this.back = function () {
          if (!this.empty()) return a[r - 1];
        }, this.forEach = function (e) {
          a.forEach(e);
        }, this.getElementByPos = function (e) {
          if (e < 0 || e >= r) throw new Error("pos must more than 0 and less than vector's size");
          return a[e];
        }, this.eraseElementByPos = function (e) {
          if (e < 0 || e >= r) throw new Error("pos must more than 0 and less than vector's size");
          for (var t = e; t < r - 1; ++t) a[t] = a[t + 1];
          this.popBack();
        }, this.eraseElementByValue = function (e) {
          var t = [];
          this.forEach(function (r) {
            r !== e && t.push(r);
          }), t.forEach(function (e, t) {
            a[t] = e;
          });
          for (var n = t.length; r > n;) this.popBack();
        }, this.pushBack = function (e) {
          a.push(e), ++r;
        }, this.popBack = function () {
          a.pop(), r > 0 && --r;
        }, this.setElementByPos = function (e, t) {
          if (e < 0 || e >= r) throw new Error("pos must more than 0 and less than vector's size");
          a[e] = t;
        }, this.insert = function (e, t, n) {
          if (void 0 === n && (n = 1), e < 0 || e > r) throw new Error("pos must more than 0 and less than or equal to vector's size");
          a.splice.apply(a, o([e, 0], i(new Array(n).fill(t)), !1)), r += n;
        }, this.find = function (e) {
          return a.includes(e);
        }, this.reverse = function () {
          a.reverse();
        }, this.unique = function () {
          var e,
            t = [];
          this.forEach(function (r, n) {
            0 !== n && r === e || (t.push(r), e = r);
          }), t.forEach(function (e, t) {
            a[t] = e;
          });
          for (var n = t.length; r > n;) this.popBack();
        }, this.sort = function (e) {
          a.sort(e);
        }, this[Symbol.iterator] = function () {
          return function () {
            return n(this, function (e) {
              switch (e.label) {
                case 0:
                  return [5, s(a)];
                case 1:
                  return [2, e.sent()];
              }
            });
          }();
        }, e.forEach(function (e) {
          return t.pushBack(e);
        }), Object.freeze(this);
      }
      Object.defineProperty(r, "__esModule", {
        value: !0
      }), Object.freeze(a), r.default = a;
    }, {}],
    36: [function (e, t, r) {
      "use strict";

      Object.defineProperty(r, "__esModule", {
        value: !0
      }), r.HashMap = r.HashSet = r.Map = r.Set = r.PriorityQueue = r.Deque = r.LinkList = r.Queue = r.Stack = r.Vector = void 0;
      var n = e("./Vector/Vector");
      r.Vector = n.default;
      var i = e("./Stack/Stack");
      r.Stack = i.default;
      var o = e("./Queue/Queue");
      r.Queue = o.default;
      var s = e("./LinkList/LinkList");
      r.LinkList = s.default;
      var a = e("./Deque/Deque");
      r.Deque = a.default;
      var l = e("./PriorityQueue/PriorityQueue");
      r.PriorityQueue = l.default;
      var u = e("./Set/Set");
      r.Set = u.default;
      var c = e("./Map/Map");
      r.Map = c.default;
      var h = e("./HashSet/HashSet");
      r.HashSet = h.default;
      var f = e("./HashMap/HashMap");
      r.HashMap = f.default;
    }, {
      "./Deque/Deque": 26,
      "./HashMap/HashMap": 27,
      "./HashSet/HashSet": 28,
      "./LinkList/LinkList": 29,
      "./Map/Map": 30,
      "./PriorityQueue/PriorityQueue": 31,
      "./Queue/Queue": 32,
      "./Set/Set": 33,
      "./Stack/Stack": 34,
      "./Vector/Vector": 35
    }],
    37: [function (e, t, r) {
      "use strict";

      const n = e("yallist"),
        i = Symbol("max"),
        o = Symbol("length"),
        s = Symbol("lengthCalculator"),
        a = Symbol("allowStale"),
        l = Symbol("maxAge"),
        u = Symbol("dispose"),
        c = Symbol("noDisposeOnSet"),
        h = Symbol("lruList"),
        f = Symbol("cache"),
        p = Symbol("updateAgeOnGet"),
        d = () => 1;
      const g = (e, t, r) => {
          const n = e[f].get(t);
          if (n) {
            const t = n.value;
            if (y(e, t)) {
              if (m(e, n), !e[a]) return;
            } else r && (e[p] && (n.value.now = Date.now()), e[h].unshiftNode(n));
            return t.value;
          }
        },
        y = (e, t) => {
          if (!t || !t.maxAge && !e[l]) return !1;
          const r = Date.now() - t.now;
          return t.maxAge ? r > t.maxAge : e[l] && r > e[l];
        },
        b = e => {
          if (e[o] > e[i]) for (let t = e[h].tail; e[o] > e[i] && null !== t;) {
            const r = t.prev;
            m(e, t), t = r;
          }
        },
        m = (e, t) => {
          if (t) {
            const r = t.value;
            e[u] && e[u](r.key, r.value), e[o] -= r.length, e[f].delete(r.key), e[h].removeNode(t);
          }
        };
      class v {
        constructor(e, t, r, n, i) {
          this.key = e, this.value = t, this.length = r, this.now = n, this.maxAge = i || 0;
        }
      }
      const w = (e, t, r, n) => {
        let i = r.value;
        y(e, i) && (m(e, r), e[a] || (i = void 0)), i && t.call(n, i.value, i.key, e);
      };
      t.exports = class {
        constructor(e) {
          if ("number" == typeof e && (e = {
            max: e
          }), e || (e = {}), e.max && ("number" != typeof e.max || e.max < 0)) throw new TypeError("max must be a non-negative number");
          this[i] = e.max || 1 / 0;
          const t = e.length || d;
          if (this[s] = "function" != typeof t ? d : t, this[a] = e.stale || !1, e.maxAge && "number" != typeof e.maxAge) throw new TypeError("maxAge must be a number");
          this[l] = e.maxAge || 0, this[u] = e.dispose, this[c] = e.noDisposeOnSet || !1, this[p] = e.updateAgeOnGet || !1, this.reset();
        }
        set max(e) {
          if ("number" != typeof e || e < 0) throw new TypeError("max must be a non-negative number");
          this[i] = e || 1 / 0, b(this);
        }
        get max() {
          return this[i];
        }
        set allowStale(e) {
          this[a] = !!e;
        }
        get allowStale() {
          return this[a];
        }
        set maxAge(e) {
          if ("number" != typeof e) throw new TypeError("maxAge must be a non-negative number");
          this[l] = e, b(this);
        }
        get maxAge() {
          return this[l];
        }
        set lengthCalculator(e) {
          "function" != typeof e && (e = d), e !== this[s] && (this[s] = e, this[o] = 0, this[h].forEach(e => {
            e.length = this[s](e.value, e.key), this[o] += e.length;
          })), b(this);
        }
        get lengthCalculator() {
          return this[s];
        }
        get length() {
          return this[o];
        }
        get itemCount() {
          return this[h].length;
        }
        rforEach(e, t) {
          t = t || this;
          for (let r = this[h].tail; null !== r;) {
            const n = r.prev;
            w(this, e, r, t), r = n;
          }
        }
        forEach(e, t) {
          t = t || this;
          for (let r = this[h].head; null !== r;) {
            const n = r.next;
            w(this, e, r, t), r = n;
          }
        }
        keys() {
          return this[h].toArray().map(e => e.key);
        }
        values() {
          return this[h].toArray().map(e => e.value);
        }
        reset() {
          this[u] && this[h] && this[h].length && this[h].forEach(e => this[u](e.key, e.value)), this[f] = new Map(), this[h] = new n(), this[o] = 0;
        }
        dump() {
          return this[h].map(e => !y(this, e) && {
            k: e.key,
            v: e.value,
            e: e.now + (e.maxAge || 0)
          }).toArray().filter(e => e);
        }
        dumpLru() {
          return this[h];
        }
        set(e, t, r) {
          if ((r = r || this[l]) && "number" != typeof r) throw new TypeError("maxAge must be a number");
          const n = r ? Date.now() : 0,
            a = this[s](t, e);
          if (this[f].has(e)) {
            if (a > this[i]) return m(this, this[f].get(e)), !1;
            const s = this[f].get(e).value;
            return this[u] && (this[c] || this[u](e, s.value)), s.now = n, s.maxAge = r, s.value = t, this[o] += a - s.length, s.length = a, this.get(e), b(this), !0;
          }
          const p = new v(e, t, a, n, r);
          return p.length > this[i] ? (this[u] && this[u](e, t), !1) : (this[o] += p.length, this[h].unshift(p), this[f].set(e, this[h].head), b(this), !0);
        }
        has(e) {
          if (!this[f].has(e)) return !1;
          const t = this[f].get(e).value;
          return !y(this, t);
        }
        get(e) {
          return g(this, e, !0);
        }
        peek(e) {
          return g(this, e, !1);
        }
        pop() {
          const e = this[h].tail;
          return e ? (m(this, e), e.value) : null;
        }
        del(e) {
          m(this, this[f].get(e));
        }
        load(e) {
          this.reset();
          const t = Date.now();
          for (let r = e.length - 1; r >= 0; r--) {
            const n = e[r],
              i = n.e || 0;
            if (0 === i) this.set(n.k, n.v);else {
              const e = i - t;
              e > 0 && this.set(n.k, n.v, e);
            }
          }
        }
        prune() {
          this[f].forEach((e, t) => g(this, t, !1));
        }
      };
    }, {
      yallist: 83
    }],
    38: [function (e, t, r) {
      (function (e) {
        (function () {
          const r = t.exports;
          r.types = {
            0: "reserved",
            1: "connect",
            2: "connack",
            3: "publish",
            4: "puback",
            5: "pubrec",
            6: "pubrel",
            7: "pubcomp",
            8: "subscribe",
            9: "suback",
            10: "unsubscribe",
            11: "unsuback",
            12: "pingreq",
            13: "pingresp",
            14: "disconnect",
            15: "auth"
          }, r.codes = {};
          for (const e in r.types) {
            const t = r.types[e];
            r.codes[t] = e;
          }
          r.CMD_SHIFT = 4, r.CMD_MASK = 240, r.DUP_MASK = 8, r.QOS_MASK = 3, r.QOS_SHIFT = 1, r.RETAIN_MASK = 1, r.VARBYTEINT_MASK = 127, r.VARBYTEINT_FIN_MASK = 128, r.VARBYTEINT_MAX = 268435455, r.SESSIONPRESENT_MASK = 1, r.SESSIONPRESENT_HEADER = e.from([r.SESSIONPRESENT_MASK]), r.CONNACK_HEADER = e.from([r.codes.connack << r.CMD_SHIFT]), r.USERNAME_MASK = 128, r.PASSWORD_MASK = 64, r.WILL_RETAIN_MASK = 32, r.WILL_QOS_MASK = 24, r.WILL_QOS_SHIFT = 3, r.WILL_FLAG_MASK = 4, r.CLEAN_SESSION_MASK = 2, r.CONNECT_HEADER = e.from([r.codes.connect << r.CMD_SHIFT]), r.properties = {
            sessionExpiryInterval: 17,
            willDelayInterval: 24,
            receiveMaximum: 33,
            maximumPacketSize: 39,
            topicAliasMaximum: 34,
            requestResponseInformation: 25,
            requestProblemInformation: 23,
            userProperties: 38,
            authenticationMethod: 21,
            authenticationData: 22,
            payloadFormatIndicator: 1,
            messageExpiryInterval: 2,
            contentType: 3,
            responseTopic: 8,
            correlationData: 9,
            maximumQoS: 36,
            retainAvailable: 37,
            assignedClientIdentifier: 18,
            reasonString: 31,
            wildcardSubscriptionAvailable: 40,
            subscriptionIdentifiersAvailable: 41,
            sharedSubscriptionAvailable: 42,
            serverKeepAlive: 19,
            responseInformation: 26,
            serverReference: 28,
            topicAlias: 35,
            subscriptionIdentifier: 11
          }, r.propertiesCodes = {};
          for (const e in r.properties) {
            const t = r.properties[e];
            r.propertiesCodes[t] = e;
          }
          function n(t) {
            return [0, 1, 2].map(n => [0, 1].map(i => [0, 1].map(o => {
              const s = e.alloc(1);
              return s.writeUInt8(r.codes[t] << r.CMD_SHIFT | (i ? r.DUP_MASK : 0) | n << r.QOS_SHIFT | o, 0, !0), s;
            })));
          }
          r.propertiesTypes = {
            sessionExpiryInterval: "int32",
            willDelayInterval: "int32",
            receiveMaximum: "int16",
            maximumPacketSize: "int32",
            topicAliasMaximum: "int16",
            requestResponseInformation: "byte",
            requestProblemInformation: "byte",
            userProperties: "pair",
            authenticationMethod: "string",
            authenticationData: "binary",
            payloadFormatIndicator: "byte",
            messageExpiryInterval: "int32",
            contentType: "string",
            responseTopic: "string",
            correlationData: "binary",
            maximumQoS: "int8",
            retainAvailable: "byte",
            assignedClientIdentifier: "string",
            reasonString: "string",
            wildcardSubscriptionAvailable: "byte",
            subscriptionIdentifiersAvailable: "byte",
            sharedSubscriptionAvailable: "byte",
            serverKeepAlive: "int16",
            responseInformation: "string",
            serverReference: "string",
            topicAlias: "int16",
            subscriptionIdentifier: "var"
          }, r.PUBLISH_HEADER = n("publish"), r.SUBSCRIBE_HEADER = n("subscribe"), r.SUBSCRIBE_OPTIONS_QOS_MASK = 3, r.SUBSCRIBE_OPTIONS_NL_MASK = 1, r.SUBSCRIBE_OPTIONS_NL_SHIFT = 2, r.SUBSCRIBE_OPTIONS_RAP_MASK = 1, r.SUBSCRIBE_OPTIONS_RAP_SHIFT = 3, r.SUBSCRIBE_OPTIONS_RH_MASK = 3, r.SUBSCRIBE_OPTIONS_RH_SHIFT = 4, r.SUBSCRIBE_OPTIONS_RH = [0, 16, 32], r.SUBSCRIBE_OPTIONS_NL = 4, r.SUBSCRIBE_OPTIONS_RAP = 8, r.SUBSCRIBE_OPTIONS_QOS = [0, 1, 2], r.UNSUBSCRIBE_HEADER = n("unsubscribe"), r.ACKS = {
            unsuback: n("unsuback"),
            puback: n("puback"),
            pubcomp: n("pubcomp"),
            pubrel: n("pubrel"),
            pubrec: n("pubrec")
          }, r.SUBACK_HEADER = e.from([r.codes.suback << r.CMD_SHIFT]), r.VERSION3 = e.from([3]), r.VERSION4 = e.from([4]), r.VERSION5 = e.from([5]), r.VERSION131 = e.from([131]), r.VERSION132 = e.from([132]), r.QOS = [0, 1, 2].map(t => e.from([t])), r.EMPTY = {
            pingreq: e.from([r.codes.pingreq << 4, 0]),
            pingresp: e.from([r.codes.pingresp << 4, 0]),
            disconnect: e.from([r.codes.disconnect << 4, 0])
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      buffer: 17
    }],
    39: [function (e, t, r) {
      (function (r) {
        (function () {
          const n = e("./writeToStream"),
            i = e("events");
          class o extends i {
            constructor() {
              super(), this._array = new Array(20), this._i = 0;
            }
            write(e) {
              return this._array[this._i++] = e, !0;
            }
            concat() {
              let e = 0;
              const t = new Array(this._array.length),
                n = this._array;
              let i,
                o = 0;
              for (i = 0; i < n.length && void 0 !== n[i]; i++) "string" != typeof n[i] ? t[i] = n[i].length : t[i] = r.byteLength(n[i]), e += t[i];
              const s = r.allocUnsafe(e);
              for (i = 0; i < n.length && void 0 !== n[i]; i++) "string" != typeof n[i] ? (n[i].copy(s, o), o += t[i]) : (s.write(n[i], o), o += t[i]);
              return s;
            }
          }
          t.exports = function (e, t) {
            const r = new o();
            return n(e, r, t), r.concat();
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      "./writeToStream": 44,
      buffer: 17,
      events: 22
    }],
    40: [function (e, t, r) {
      r.parser = e("./parser").parser, r.generate = e("./generate"), r.writeToStream = e("./writeToStream");
    }, {
      "./generate": 39,
      "./parser": 43,
      "./writeToStream": 44
    }],
    41: [function (e, t, r) {
      (function (e) {
        (function () {
          const r = 65536,
            n = {},
            i = e.isBuffer(e.from([1, 2]).subarray(0, 1));
          function o(t) {
            const r = e.allocUnsafe(2);
            return r.writeUInt8(t >> 8, 0), r.writeUInt8(255 & t, 1), r;
          }
          t.exports = {
            cache: n,
            generateCache: function () {
              for (let e = 0; e < r; e++) n[e] = o(e);
            },
            generateNumber: o,
            genBufVariableByteInt: function (t) {
              let r = 0,
                n = 0;
              const o = e.allocUnsafe(4);
              do {
                r = t % 128 | 0, (t = t / 128 | 0) > 0 && (r |= 128), o.writeUInt8(r, n++);
              } while (t > 0 && n < 4);
              return t > 0 && (n = 0), i ? o.subarray(0, n) : o.slice(0, n);
            },
            generate4ByteBuffer: function (t) {
              const r = e.allocUnsafe(4);
              return r.writeUInt32BE(t, 0), r;
            }
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      buffer: 17
    }],
    42: [function (e, t, r) {
      t.exports = class {
        constructor() {
          this.cmd = null, this.retain = !1, this.qos = 0, this.dup = !1, this.length = -1, this.topic = null, this.payload = null;
        }
      };
    }, {}],
    43: [function (e, t, r) {
      const n = e("bl"),
        i = e("events"),
        o = e("./packet"),
        s = e("./constants"),
        a = e("debug")("mqtt-packet:parser");
      class l extends i {
        constructor() {
          super(), this.parser = this.constructor.parser;
        }
        static parser(e) {
          return this instanceof l ? (this.settings = e || {}, this._states = ["_parseHeader", "_parseLength", "_parsePayload", "_newPacket"], this._resetState(), this) : new l().parser(e);
        }
        _resetState() {
          a("_resetState: resetting packet, error, _list, and _stateCounter"), this.packet = new o(), this.error = null, this._list = n(), this._stateCounter = 0;
        }
        parse(e) {
          for (this.error && this._resetState(), this._list.append(e), a("parse: current state: %s", this._states[this._stateCounter]); (-1 !== this.packet.length || this._list.length > 0) && this[this._states[this._stateCounter]]() && !this.error;) this._stateCounter++, a("parse: state complete. _stateCounter is now: %d", this._stateCounter), a("parse: packet.length: %d, buffer list length: %d", this.packet.length, this._list.length), this._stateCounter >= this._states.length && (this._stateCounter = 0);
          return a("parse: exited while loop. packet: %d, buffer list length: %d", this.packet.length, this._list.length), this._list.length;
        }
        _parseHeader() {
          const e = this._list.readUInt8(0);
          return this.packet.cmd = s.types[e >> s.CMD_SHIFT], this.packet.retain = 0 != (e & s.RETAIN_MASK), this.packet.qos = e >> s.QOS_SHIFT & s.QOS_MASK, this.packet.dup = 0 != (e & s.DUP_MASK), a("_parseHeader: packet: %o", this.packet), this._list.consume(1), !0;
        }
        _parseLength() {
          const e = this._parseVarByteNum(!0);
          return e && (this.packet.length = e.value, this._list.consume(e.bytes)), a("_parseLength %d", e.value), !!e;
        }
        _parsePayload() {
          a("_parsePayload: payload %O", this._list);
          let e = !1;
          if (0 === this.packet.length || this._list.length >= this.packet.length) {
            switch (this._pos = 0, this.packet.cmd) {
              case "connect":
                this._parseConnect();
                break;
              case "connack":
                this._parseConnack();
                break;
              case "publish":
                this._parsePublish();
                break;
              case "puback":
              case "pubrec":
              case "pubrel":
              case "pubcomp":
                this._parseConfirmation();
                break;
              case "subscribe":
                this._parseSubscribe();
                break;
              case "suback":
                this._parseSuback();
                break;
              case "unsubscribe":
                this._parseUnsubscribe();
                break;
              case "unsuback":
                this._parseUnsuback();
                break;
              case "pingreq":
              case "pingresp":
                break;
              case "disconnect":
                this._parseDisconnect();
                break;
              case "auth":
                this._parseAuth();
                break;
              default:
                this._emitError(new Error("Not supported"));
            }
            e = !0;
          }
          return a("_parsePayload complete result: %s", e), e;
        }
        _parseConnect() {
          let e, t, r, n;
          a("_parseConnect");
          const i = {},
            o = this.packet,
            l = this._parseString();
          if (null === l) return this._emitError(new Error("Cannot parse protocolId"));
          if ("MQTT" !== l && "MQIsdp" !== l) return this._emitError(new Error("Invalid protocolId"));
          if (o.protocolId = l, this._pos >= this._list.length) return this._emitError(new Error("Packet too short"));
          if (o.protocolVersion = this._list.readUInt8(this._pos), o.protocolVersion >= 128 && (o.bridgeMode = !0, o.protocolVersion = o.protocolVersion - 128), 3 !== o.protocolVersion && 4 !== o.protocolVersion && 5 !== o.protocolVersion) return this._emitError(new Error("Invalid protocol version"));
          if (this._pos++, this._pos >= this._list.length) return this._emitError(new Error("Packet too short"));
          if (i.username = this._list.readUInt8(this._pos) & s.USERNAME_MASK, i.password = this._list.readUInt8(this._pos) & s.PASSWORD_MASK, i.will = this._list.readUInt8(this._pos) & s.WILL_FLAG_MASK, i.will && (o.will = {}, o.will.retain = 0 != (this._list.readUInt8(this._pos) & s.WILL_RETAIN_MASK), o.will.qos = (this._list.readUInt8(this._pos) & s.WILL_QOS_MASK) >> s.WILL_QOS_SHIFT), o.clean = 0 != (this._list.readUInt8(this._pos) & s.CLEAN_SESSION_MASK), this._pos++, o.keepalive = this._parseNum(), -1 === o.keepalive) return this._emitError(new Error("Packet too short"));
          if (5 === o.protocolVersion) {
            const e = this._parseProperties();
            Object.getOwnPropertyNames(e).length && (o.properties = e);
          }
          const u = this._parseString();
          if (null === u) return this._emitError(new Error("Packet too short"));
          if (o.clientId = u, a("_parseConnect: packet.clientId: %s", o.clientId), i.will) {
            if (5 === o.protocolVersion) {
              const e = this._parseProperties();
              Object.getOwnPropertyNames(e).length && (o.will.properties = e);
            }
            if (null === (e = this._parseString())) return this._emitError(new Error("Cannot parse will topic"));
            if (o.will.topic = e, a("_parseConnect: packet.will.topic: %s", o.will.topic), null === (t = this._parseBuffer())) return this._emitError(new Error("Cannot parse will payload"));
            o.will.payload = t, a("_parseConnect: packet.will.paylaod: %s", o.will.payload);
          }
          if (i.username) {
            if (null === (n = this._parseString())) return this._emitError(new Error("Cannot parse username"));
            o.username = n, a("_parseConnect: packet.username: %s", o.username);
          }
          if (i.password) {
            if (null === (r = this._parseBuffer())) return this._emitError(new Error("Cannot parse password"));
            o.password = r;
          }
          return this.settings = o, a("_parseConnect: complete"), o;
        }
        _parseConnack() {
          a("_parseConnack");
          const e = this.packet;
          if (this._list.length < 1) return null;
          if (e.sessionPresent = !!(this._list.readUInt8(this._pos++) & s.SESSIONPRESENT_MASK), 5 === this.settings.protocolVersion) this._list.length >= 2 ? e.reasonCode = this._list.readUInt8(this._pos++) : e.reasonCode = 0;else {
            if (this._list.length < 2) return null;
            e.returnCode = this._list.readUInt8(this._pos++);
          }
          if (-1 === e.returnCode || -1 === e.reasonCode) return this._emitError(new Error("Cannot parse return code"));
          if (5 === this.settings.protocolVersion) {
            const t = this._parseProperties();
            Object.getOwnPropertyNames(t).length && (e.properties = t);
          }
          a("_parseConnack: complete");
        }
        _parsePublish() {
          a("_parsePublish");
          const e = this.packet;
          if (e.topic = this._parseString(), null === e.topic) return this._emitError(new Error("Cannot parse topic"));
          if (!(e.qos > 0) || this._parseMessageId()) {
            if (5 === this.settings.protocolVersion) {
              const t = this._parseProperties();
              Object.getOwnPropertyNames(t).length && (e.properties = t);
            }
            e.payload = this._list.slice(this._pos, e.length), a("_parsePublish: payload from buffer list: %o", e.payload);
          }
        }
        _parseSubscribe() {
          a("_parseSubscribe");
          const e = this.packet;
          let t, r, n, i, o, l, u;
          if (1 !== e.qos) return this._emitError(new Error("Wrong subscribe header"));
          if (e.subscriptions = [], this._parseMessageId()) {
            if (5 === this.settings.protocolVersion) {
              const t = this._parseProperties();
              Object.getOwnPropertyNames(t).length && (e.properties = t);
            }
            for (; this._pos < e.length;) {
              if (null === (t = this._parseString())) return this._emitError(new Error("Cannot parse topic"));
              if (this._pos >= e.length) return this._emitError(new Error("Malformed Subscribe Payload"));
              n = (r = this._parseByte()) & s.SUBSCRIBE_OPTIONS_QOS_MASK, l = 0 != (r >> s.SUBSCRIBE_OPTIONS_NL_SHIFT & s.SUBSCRIBE_OPTIONS_NL_MASK), o = 0 != (r >> s.SUBSCRIBE_OPTIONS_RAP_SHIFT & s.SUBSCRIBE_OPTIONS_RAP_MASK), i = r >> s.SUBSCRIBE_OPTIONS_RH_SHIFT & s.SUBSCRIBE_OPTIONS_RH_MASK, u = {
                topic: t,
                qos: n
              }, 5 === this.settings.protocolVersion ? (u.nl = l, u.rap = o, u.rh = i) : this.settings.bridgeMode && (u.rh = 0, u.rap = !0, u.nl = !0), a("_parseSubscribe: push subscription `%s` to subscription", u), e.subscriptions.push(u);
            }
          }
        }
        _parseSuback() {
          a("_parseSuback");
          const e = this.packet;
          if (this.packet.granted = [], this._parseMessageId()) {
            if (5 === this.settings.protocolVersion) {
              const t = this._parseProperties();
              Object.getOwnPropertyNames(t).length && (e.properties = t);
            }
            for (; this._pos < this.packet.length;) this.packet.granted.push(this._list.readUInt8(this._pos++));
          }
        }
        _parseUnsubscribe() {
          a("_parseUnsubscribe");
          const e = this.packet;
          if (e.unsubscriptions = [], this._parseMessageId()) {
            if (5 === this.settings.protocolVersion) {
              const t = this._parseProperties();
              Object.getOwnPropertyNames(t).length && (e.properties = t);
            }
            for (; this._pos < e.length;) {
              const t = this._parseString();
              if (null === t) return this._emitError(new Error("Cannot parse topic"));
              a("_parseUnsubscribe: push topic `%s` to unsubscriptions", t), e.unsubscriptions.push(t);
            }
          }
        }
        _parseUnsuback() {
          a("_parseUnsuback");
          const e = this.packet;
          if (!this._parseMessageId()) return this._emitError(new Error("Cannot parse messageId"));
          if (5 === this.settings.protocolVersion) {
            const t = this._parseProperties();
            for (Object.getOwnPropertyNames(t).length && (e.properties = t), e.granted = []; this._pos < this.packet.length;) this.packet.granted.push(this._list.readUInt8(this._pos++));
          }
        }
        _parseConfirmation() {
          a("_parseConfirmation: packet.cmd: `%s`", this.packet.cmd);
          const e = this.packet;
          if (this._parseMessageId(), 5 === this.settings.protocolVersion && (e.length > 2 ? (e.reasonCode = this._parseByte(), a("_parseConfirmation: packet.reasonCode `%d`", e.reasonCode)) : e.reasonCode = 0, e.length > 3)) {
            const t = this._parseProperties();
            Object.getOwnPropertyNames(t).length && (e.properties = t);
          }
          return !0;
        }
        _parseDisconnect() {
          const e = this.packet;
          if (a("_parseDisconnect"), 5 === this.settings.protocolVersion) {
            this._list.length > 0 ? e.reasonCode = this._parseByte() : e.reasonCode = 0;
            const t = this._parseProperties();
            Object.getOwnPropertyNames(t).length && (e.properties = t);
          }
          return a("_parseDisconnect result: true"), !0;
        }
        _parseAuth() {
          a("_parseAuth");
          const e = this.packet;
          if (5 !== this.settings.protocolVersion) return this._emitError(new Error("Not supported auth packet for this version MQTT"));
          e.reasonCode = this._parseByte();
          const t = this._parseProperties();
          return Object.getOwnPropertyNames(t).length && (e.properties = t), a("_parseAuth: result: true"), !0;
        }
        _parseMessageId() {
          const e = this.packet;
          return e.messageId = this._parseNum(), null === e.messageId ? (this._emitError(new Error("Cannot parse messageId")), !1) : (a("_parseMessageId: packet.messageId %d", e.messageId), !0);
        }
        _parseString(e) {
          const t = this._parseNum(),
            r = t + this._pos;
          if (-1 === t || r > this._list.length || r > this.packet.length) return null;
          const n = this._list.toString("utf8", this._pos, r);
          return this._pos += t, a("_parseString: result: %s", n), n;
        }
        _parseStringPair() {
          return a("_parseStringPair"), {
            name: this._parseString(),
            value: this._parseString()
          };
        }
        _parseBuffer() {
          const e = this._parseNum(),
            t = e + this._pos;
          if (-1 === e || t > this._list.length || t > this.packet.length) return null;
          const r = this._list.slice(this._pos, t);
          return this._pos += e, a("_parseBuffer: result: %o", r), r;
        }
        _parseNum() {
          if (this._list.length - this._pos < 2) return -1;
          const e = this._list.readUInt16BE(this._pos);
          return this._pos += 2, a("_parseNum: result: %s", e), e;
        }
        _parse4ByteNum() {
          if (this._list.length - this._pos < 4) return -1;
          const e = this._list.readUInt32BE(this._pos);
          return this._pos += 4, a("_parse4ByteNum: result: %s", e), e;
        }
        _parseVarByteNum(e) {
          a("_parseVarByteNum");
          let t,
            r = 0,
            n = 1,
            i = 0,
            o = !1;
          const l = this._pos ? this._pos : 0;
          for (; r < 4 && l + r < this._list.length;) {
            if (i += n * ((t = this._list.readUInt8(l + r++)) & s.VARBYTEINT_MASK), n *= 128, 0 == (t & s.VARBYTEINT_FIN_MASK)) {
              o = !0;
              break;
            }
            if (this._list.length <= r) break;
          }
          return !o && 4 === r && this._list.length >= r && this._emitError(new Error("Invalid variable byte integer")), l && (this._pos += r), a("_parseVarByteNum: result: %o", o = !!o && (e ? {
            bytes: r,
            value: i
          } : i)), o;
        }
        _parseByte() {
          let e;
          return this._pos < this._list.length && (e = this._list.readUInt8(this._pos), this._pos++), a("_parseByte: result: %o", e), e;
        }
        _parseByType(e) {
          switch (a("_parseByType: type: %s", e), e) {
            case "byte":
              return 0 !== this._parseByte();
            case "int8":
              return this._parseByte();
            case "int16":
              return this._parseNum();
            case "int32":
              return this._parse4ByteNum();
            case "var":
              return this._parseVarByteNum();
            case "string":
              return this._parseString();
            case "pair":
              return this._parseStringPair();
            case "binary":
              return this._parseBuffer();
          }
        }
        _parseProperties() {
          a("_parseProperties");
          const e = this._parseVarByteNum(),
            t = this._pos + e,
            r = {};
          for (; this._pos < t;) {
            const e = this._parseByte();
            if (!e) return this._emitError(new Error("Cannot parse property code type")), !1;
            const t = s.propertiesCodes[e];
            if (!t) return this._emitError(new Error("Unknown property")), !1;
            if ("userProperties" !== t) r[t] ? Array.isArray(r[t]) ? r[t].push(this._parseByType(s.propertiesTypes[t])) : (r[t] = [r[t]], r[t].push(this._parseByType(s.propertiesTypes[t]))) : r[t] = this._parseByType(s.propertiesTypes[t]);else {
              r[t] || (r[t] = Object.create(null));
              const e = this._parseByType(s.propertiesTypes[t]);
              if (r[t][e.name]) {
                if (Array.isArray(r[t][e.name])) r[t][e.name].push(e.value);else {
                  const n = r[t][e.name];
                  r[t][e.name] = [n], r[t][e.name].push(e.value);
                }
              } else r[t][e.name] = e.value;
            }
          }
          return r;
        }
        _newPacket() {
          return a("_newPacket"), this.packet && (this._list.consume(this.packet.length), a("_newPacket: parser emit packet: packet.cmd: %s, packet.payload: %s, packet.length: %d", this.packet.cmd, this.packet.payload, this.packet.length), this.emit("packet", this.packet)), a("_newPacket: new packet"), this.packet = new o(), this._pos = 0, !0;
        }
        _emitError(e) {
          a("_emitError"), this.error = e, this.emit("error", e);
        }
      }
      t.exports = l;
    }, {
      "./constants": 38,
      "./packet": 42,
      bl: 15,
      debug: 18,
      events: 22
    }],
    44: [function (e, t, r) {
      (function (r) {
        (function () {
          const n = e("./constants"),
            i = r.allocUnsafe(0),
            o = r.from([0]),
            s = e("./numbers"),
            a = e("process-nextick-args").nextTick,
            l = e("debug")("mqtt-packet:writeToStream"),
            u = s.cache,
            c = s.generateNumber,
            h = s.generateCache,
            f = s.genBufVariableByteInt,
            p = s.generate4ByteBuffer;
          let d = k,
            g = !0;
          function y(e, t, s) {
            switch (l("generate called"), t.cork && (t.cork(), a(b, t)), g && (g = !1, h()), l("generate: packet.cmd: %s", e.cmd), e.cmd) {
              case "connect":
                return function (e, t, i) {
                  const o = e || {},
                    s = o.protocolId || "MQTT";
                  let a = o.protocolVersion || 4;
                  const l = o.will;
                  let u = o.clean;
                  const c = o.keepalive || 0,
                    h = o.clientId || "",
                    f = o.username,
                    p = o.password,
                    g = o.properties;
                  void 0 === u && (u = !0);
                  let y = 0;
                  if (!s || "string" != typeof s && !r.isBuffer(s)) return t.emit("error", new Error("Invalid protocolId")), !1;
                  y += s.length + 2;
                  if (3 !== a && 4 !== a && 5 !== a) return t.emit("error", new Error("Invalid protocol version")), !1;
                  y += 1;
                  if (("string" == typeof h || r.isBuffer(h)) && (h || a >= 4) && (h || u)) y += r.byteLength(h) + 2;else {
                    if (a < 4) return t.emit("error", new Error("clientId must be supplied before 3.1.1")), !1;
                    if (1 * u == 0) return t.emit("error", new Error("clientId must be given if cleanSession set to 0")), !1;
                  }
                  if ("number" != typeof c || c < 0 || c > 65535 || c % 1 != 0) return t.emit("error", new Error("Invalid keepalive")), !1;
                  y += 2;
                  if (y += 1, 5 === a) {
                    var b = C(t, g);
                    if (!b) return !1;
                    y += b.length;
                  }
                  if (l) {
                    if ("object" != typeof l) return t.emit("error", new Error("Invalid will")), !1;
                    if (!l.topic || "string" != typeof l.topic) return t.emit("error", new Error("Invalid will topic")), !1;
                    if (y += r.byteLength(l.topic) + 2, y += 2, l.payload) {
                      if (!(l.payload.length >= 0)) return t.emit("error", new Error("Invalid will payload")), !1;
                      "string" == typeof l.payload ? y += r.byteLength(l.payload) : y += l.payload.length;
                    }
                    var m = {};
                    if (5 === a) {
                      if (!(m = C(t, l.properties))) return !1;
                      y += m.length;
                    }
                  }
                  let _ = !1;
                  if (null != f) {
                    if (!P(f)) return t.emit("error", new Error("Invalid username")), !1;
                    _ = !0, y += r.byteLength(f) + 2;
                  }
                  if (null != p) {
                    if (!_) return t.emit("error", new Error("Username is required to use password")), !1;
                    if (!P(p)) return t.emit("error", new Error("Invalid password")), !1;
                    y += I(p) + 2;
                  }
                  t.write(n.CONNECT_HEADER), v(t, y), E(t, s), o.bridgeMode && (a += 128);
                  t.write(131 === a ? n.VERSION131 : 132 === a ? n.VERSION132 : 4 === a ? n.VERSION4 : 5 === a ? n.VERSION5 : n.VERSION3);
                  let k = 0;
                  k |= null != f ? n.USERNAME_MASK : 0, k |= null != p ? n.PASSWORD_MASK : 0, k |= l && l.retain ? n.WILL_RETAIN_MASK : 0, k |= l && l.qos ? l.qos << n.WILL_QOS_SHIFT : 0, k |= l ? n.WILL_FLAG_MASK : 0, k |= u ? n.CLEAN_SESSION_MASK : 0, t.write(r.from([k])), d(t, c), 5 === a && b.write();
                  E(t, h), l && (5 === a && m.write(), w(t, l.topic), E(t, l.payload));
                  null != f && E(t, f);
                  null != p && E(t, p);
                  return !0;
                }(e, t);
              case "connack":
                return function (e, t, i) {
                  const s = i ? i.protocolVersion : 4,
                    a = e || {},
                    l = 5 === s ? a.reasonCode : a.returnCode,
                    u = a.properties;
                  let c = 2;
                  if ("number" != typeof l) return t.emit("error", new Error("Invalid return code")), !1;
                  let h = null;
                  if (5 === s) {
                    if (!(h = C(t, u))) return !1;
                    c += h.length;
                  }
                  t.write(n.CONNACK_HEADER), v(t, c), t.write(a.sessionPresent ? n.SESSIONPRESENT_HEADER : o), t.write(r.from([l])), null != h && h.write();
                  return !0;
                }(e, t, s);
              case "publish":
                return function (e, t, o) {
                  l("publish: packet: %o", e);
                  const s = o ? o.protocolVersion : 4,
                    a = e || {},
                    u = a.qos || 0,
                    c = a.retain ? n.RETAIN_MASK : 0,
                    h = a.topic,
                    f = a.payload || i,
                    p = a.messageId,
                    g = a.properties;
                  let y = 0;
                  if ("string" == typeof h) y += r.byteLength(h) + 2;else {
                    if (!r.isBuffer(h)) return t.emit("error", new Error("Invalid topic")), !1;
                    y += h.length + 2;
                  }
                  r.isBuffer(f) ? y += f.length : y += r.byteLength(f);
                  if (u && "number" != typeof p) return t.emit("error", new Error("Invalid messageId")), !1;
                  u && (y += 2);
                  let b = null;
                  if (5 === s) {
                    if (!(b = C(t, g))) return !1;
                    y += b.length;
                  }
                  t.write(n.PUBLISH_HEADER[u][a.dup ? 1 : 0][c ? 1 : 0]), v(t, y), d(t, I(h)), t.write(h), u > 0 && d(t, p);
                  null != b && b.write();
                  return l("publish: payload: %o", f), t.write(f);
                }(e, t, s);
              case "puback":
              case "pubrec":
              case "pubrel":
              case "pubcomp":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.cmd || "puback",
                    l = s.messageId,
                    u = s.dup && "pubrel" === a ? n.DUP_MASK : 0;
                  let c = 0;
                  const h = s.reasonCode,
                    f = s.properties;
                  let p = 5 === o ? 3 : 2;
                  "pubrel" === a && (c = 1);
                  if ("number" != typeof l) return t.emit("error", new Error("Invalid messageId")), !1;
                  let g = null;
                  if (5 === o && "object" == typeof f) {
                    if (!(g = T(t, f, i, p))) return !1;
                    p += g.length;
                  }
                  t.write(n.ACKS[a][c][u][0]), v(t, p), d(t, l), 5 === o && t.write(r.from([h]));
                  null !== g && g.write();
                  return !0;
                }(e, t, s);
              case "subscribe":
                return function (e, t, i) {
                  l("subscribe: packet: ");
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.dup ? n.DUP_MASK : 0,
                    u = s.messageId,
                    c = s.subscriptions,
                    h = s.properties;
                  let f = 0;
                  if ("number" != typeof u) return t.emit("error", new Error("Invalid messageId")), !1;
                  f += 2;
                  let p = null;
                  if (5 === o) {
                    if (!(p = C(t, h))) return !1;
                    f += p.length;
                  }
                  if ("object" != typeof c || !c.length) return t.emit("error", new Error("Invalid subscriptions")), !1;
                  for (let e = 0; e < c.length; e += 1) {
                    const n = c[e].topic,
                      i = c[e].qos;
                    if ("string" != typeof n) return t.emit("error", new Error("Invalid subscriptions - invalid topic")), !1;
                    if ("number" != typeof i) return t.emit("error", new Error("Invalid subscriptions - invalid qos")), !1;
                    if (5 === o) {
                      const r = c[e].nl || !1;
                      if ("boolean" != typeof r) return t.emit("error", new Error("Invalid subscriptions - invalid No Local")), !1;
                      const n = c[e].rap || !1;
                      if ("boolean" != typeof n) return t.emit("error", new Error("Invalid subscriptions - invalid Retain as Published")), !1;
                      const i = c[e].rh || 0;
                      if ("number" != typeof i || i > 2) return t.emit("error", new Error("Invalid subscriptions - invalid Retain Handling")), !1;
                    }
                    f += r.byteLength(n) + 2 + 1;
                  }
                  l("subscribe: writing to stream: %o", n.SUBSCRIBE_HEADER), t.write(n.SUBSCRIBE_HEADER[1][a ? 1 : 0][0]), v(t, f), d(t, u), null !== p && p.write();
                  let g = !0;
                  for (const e of c) {
                    const i = e.topic,
                      s = e.qos,
                      a = +e.nl,
                      l = +e.rap,
                      u = e.rh;
                    let c;
                    w(t, i), c = n.SUBSCRIBE_OPTIONS_QOS[s], 5 === o && (c |= a ? n.SUBSCRIBE_OPTIONS_NL : 0, c |= l ? n.SUBSCRIBE_OPTIONS_RAP : 0, c |= u ? n.SUBSCRIBE_OPTIONS_RH[u] : 0), g = t.write(r.from([c]));
                  }
                  return g;
                }(e, t, s);
              case "suback":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.messageId,
                    l = s.granted,
                    u = s.properties;
                  let c = 0;
                  if ("number" != typeof a) return t.emit("error", new Error("Invalid messageId")), !1;
                  c += 2;
                  if ("object" != typeof l || !l.length) return t.emit("error", new Error("Invalid qos vector")), !1;
                  for (let e = 0; e < l.length; e += 1) {
                    if ("number" != typeof l[e]) return t.emit("error", new Error("Invalid qos vector")), !1;
                    c += 1;
                  }
                  let h = null;
                  if (5 === o) {
                    if (!(h = T(t, u, i, c))) return !1;
                    c += h.length;
                  }
                  t.write(n.SUBACK_HEADER), v(t, c), d(t, a), null !== h && h.write();
                  return t.write(r.from(l));
                }(e, t, s);
              case "unsubscribe":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.messageId,
                    l = s.dup ? n.DUP_MASK : 0,
                    u = s.unsubscriptions,
                    c = s.properties;
                  let h = 0;
                  if ("number" != typeof a) return t.emit("error", new Error("Invalid messageId")), !1;
                  h += 2;
                  if ("object" != typeof u || !u.length) return t.emit("error", new Error("Invalid unsubscriptions")), !1;
                  for (let e = 0; e < u.length; e += 1) {
                    if ("string" != typeof u[e]) return t.emit("error", new Error("Invalid unsubscriptions")), !1;
                    h += r.byteLength(u[e]) + 2;
                  }
                  let f = null;
                  if (5 === o) {
                    if (!(f = C(t, c))) return !1;
                    h += f.length;
                  }
                  t.write(n.UNSUBSCRIBE_HEADER[1][l ? 1 : 0][0]), v(t, h), d(t, a), null !== f && f.write();
                  let p = !0;
                  for (let e = 0; e < u.length; e++) p = w(t, u[e]);
                  return p;
                }(e, t, s);
              case "unsuback":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.messageId,
                    l = s.dup ? n.DUP_MASK : 0,
                    u = s.granted,
                    c = s.properties,
                    h = s.cmd;
                  let f = 2;
                  if ("number" != typeof a) return t.emit("error", new Error("Invalid messageId")), !1;
                  if (5 === o) {
                    if ("object" != typeof u || !u.length) return t.emit("error", new Error("Invalid qos vector")), !1;
                    for (let e = 0; e < u.length; e += 1) {
                      if ("number" != typeof u[e]) return t.emit("error", new Error("Invalid qos vector")), !1;
                      f += 1;
                    }
                  }
                  let p = null;
                  if (5 === o) {
                    if (!(p = T(t, c, i, f))) return !1;
                    f += p.length;
                  }
                  t.write(n.ACKS[h][0][l][0]), v(t, f), d(t, a), null !== p && p.write();
                  5 === o && t.write(r.from(u));
                  return !0;
                }(e, t, s);
              case "pingreq":
              case "pingresp":
                return function (e, t, r) {
                  return t.write(n.EMPTY[e.cmd]);
                }(e, t);
              case "disconnect":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.reasonCode,
                    l = s.properties;
                  let u = 5 === o ? 1 : 0,
                    c = null;
                  if (5 === o) {
                    if (!(c = T(t, l, i, u))) return !1;
                    u += c.length;
                  }
                  t.write(r.from([n.codes.disconnect << 4])), v(t, u), 5 === o && t.write(r.from([a]));
                  null !== c && c.write();
                  return !0;
                }(e, t, s);
              case "auth":
                return function (e, t, i) {
                  const o = i ? i.protocolVersion : 4,
                    s = e || {},
                    a = s.reasonCode,
                    l = s.properties;
                  let u = 5 === o ? 1 : 0;
                  5 !== o && t.emit("error", new Error("Invalid mqtt version for auth packet"));
                  const c = T(t, l, i, u);
                  if (!c) return !1;
                  u += c.length, t.write(r.from([n.codes.auth << 4])), v(t, u), t.write(r.from([a])), null !== c && c.write();
                  return !0;
                }(e, t, s);
              default:
                return t.emit("error", new Error("Unknown command")), !1;
            }
          }
          function b(e) {
            e.uncork();
          }
          Object.defineProperty(y, "cacheNumbers", {
            get: () => d === k,
            set(e) {
              e ? (u && 0 !== Object.keys(u).length || (g = !0), d = k) : (g = !1, d = S);
            }
          });
          const m = {};
          function v(e, t) {
            if (t > n.VARBYTEINT_MAX) return e.emit("error", new Error(`Invalid variable byte integer: ${t}`)), !1;
            let r = m[t];
            return r || (r = f(t), t < 16384 && (m[t] = r)), l("writeVarByteInt: writing to stream: %o", r), e.write(r);
          }
          function w(e, t) {
            const n = r.byteLength(t);
            return d(e, n), l("writeString: %s", t), e.write(t, "utf8");
          }
          function _(e, t, r) {
            w(e, t), w(e, r);
          }
          function k(e, t) {
            return l("writeNumberCached: number: %d", t), l("writeNumberCached: %o", u[t]), e.write(u[t]);
          }
          function S(e, t) {
            const r = c(t);
            return l("writeNumberGenerated: %o", r), e.write(r);
          }
          function E(e, t) {
            "string" == typeof t ? w(e, t) : t ? (d(e, t.length), e.write(t)) : d(e, 0);
          }
          function C(e, t) {
            if ("object" != typeof t || null != t.length) return {
              length: 1,
              write() {
                A(e, {}, 0);
              }
            };
            let i = 0;
            function o(t, i) {
              let o = 0;
              switch (n.propertiesTypes[t]) {
                case "byte":
                  if ("boolean" != typeof i) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 2;
                  break;
                case "int8":
                  if ("number" != typeof i || i < 0 || i > 255) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 2;
                  break;
                case "binary":
                  if (i && null === i) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 1 + r.byteLength(i) + 2;
                  break;
                case "int16":
                  if ("number" != typeof i || i < 0 || i > 65535) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 3;
                  break;
                case "int32":
                  if ("number" != typeof i || i < 0 || i > 4294967295) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 5;
                  break;
                case "var":
                  if ("number" != typeof i || i < 0 || i > 268435455) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 1 + r.byteLength(f(i));
                  break;
                case "string":
                  if ("string" != typeof i) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += 3 + r.byteLength(i.toString());
                  break;
                case "pair":
                  if ("object" != typeof i) return e.emit("error", new Error(`Invalid ${t}: ${i}`)), !1;
                  o += Object.getOwnPropertyNames(i).reduce((e, t) => {
                    const n = i[t];
                    return Array.isArray(n) ? e += n.reduce((e, n) => e += 3 + r.byteLength(t.toString()) + 2 + r.byteLength(n.toString()), 0) : e += 3 + r.byteLength(t.toString()) + 2 + r.byteLength(i[t].toString()), e;
                  }, 0);
                  break;
                default:
                  return e.emit("error", new Error(`Invalid property ${t}: ${i}`)), !1;
              }
              return o;
            }
            if (t) for (const e in t) {
              let r = 0,
                n = 0;
              const s = t[e];
              if (Array.isArray(s)) for (let t = 0; t < s.length; t++) {
                if (!(n = o(e, s[t]))) return !1;
                r += n;
              } else {
                if (!(n = o(e, s))) return !1;
                r = n;
              }
              if (!r) return !1;
              i += r;
            }
            return {
              length: r.byteLength(f(i)) + i,
              write() {
                A(e, t, i);
              }
            };
          }
          function T(e, t, r, n) {
            const i = ["reasonString", "userProperties"],
              o = r && r.properties && r.properties.maximumPacketSize ? r.properties.maximumPacketSize : 0;
            let s = C(e, t);
            if (o) for (; n + s.length > o;) {
              const r = i.shift();
              if (!r || !t[r]) return !1;
              delete t[r], s = C(e, t);
            }
            return s;
          }
          function x(e, t, i) {
            switch (n.propertiesTypes[t]) {
              case "byte":
                e.write(r.from([n.properties[t]])), e.write(r.from([+i]));
                break;
              case "int8":
                e.write(r.from([n.properties[t]])), e.write(r.from([i]));
                break;
              case "binary":
                e.write(r.from([n.properties[t]])), E(e, i);
                break;
              case "int16":
                e.write(r.from([n.properties[t]])), d(e, i);
                break;
              case "int32":
                e.write(r.from([n.properties[t]])), function (e, t) {
                  const r = p(t);
                  l("write4ByteNumber: %o", r), e.write(r);
                }(e, i);
                break;
              case "var":
                e.write(r.from([n.properties[t]])), v(e, i);
                break;
              case "string":
                e.write(r.from([n.properties[t]])), w(e, i);
                break;
              case "pair":
                Object.getOwnPropertyNames(i).forEach(o => {
                  const s = i[o];
                  Array.isArray(s) ? s.forEach(i => {
                    e.write(r.from([n.properties[t]])), _(e, o.toString(), i.toString());
                  }) : (e.write(r.from([n.properties[t]])), _(e, o.toString(), s.toString()));
                });
                break;
              default:
                return e.emit("error", new Error(`Invalid property ${t} value: ${i}`)), !1;
            }
          }
          function A(e, t, r) {
            v(e, r);
            for (const r in t) if (Object.prototype.hasOwnProperty.call(t, r) && null !== t[r]) {
              const n = t[r];
              if (Array.isArray(n)) for (let t = 0; t < n.length; t++) x(e, r, n[t]);else x(e, r, n);
            }
          }
          function I(e) {
            return e ? e instanceof r ? e.length : r.byteLength(e) : 0;
          }
          function P(e) {
            return "string" == typeof e || e instanceof r;
          }
          t.exports = y;
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      "./constants": 38,
      "./numbers": 41,
      buffer: 17,
      debug: 18,
      "process-nextick-args": 49
    }],
    45: [function (e, t, r) {
      var n = 1e3,
        i = 60 * n,
        o = 60 * i,
        s = 24 * o,
        a = 7 * s,
        l = 365.25 * s;
      function u(e, t, r, n) {
        var i = t >= 1.5 * r;
        return Math.round(e / r) + " " + n + (i ? "s" : "");
      }
      t.exports = function (e, t) {
        t = t || {};
        var r = typeof e;
        if ("string" === r && e.length > 0) return function (e) {
          if ((e = String(e)).length > 100) return;
          var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
          if (!t) return;
          var r = parseFloat(t[1]);
          switch ((t[2] || "ms").toLowerCase()) {
            case "years":
            case "year":
            case "yrs":
            case "yr":
            case "y":
              return r * l;
            case "weeks":
            case "week":
            case "w":
              return r * a;
            case "days":
            case "day":
            case "d":
              return r * s;
            case "hours":
            case "hour":
            case "hrs":
            case "hr":
            case "h":
              return r * o;
            case "minutes":
            case "minute":
            case "mins":
            case "min":
            case "m":
              return r * i;
            case "seconds":
            case "second":
            case "secs":
            case "sec":
            case "s":
              return r * n;
            case "milliseconds":
            case "millisecond":
            case "msecs":
            case "msec":
            case "ms":
              return r;
            default:
              return;
          }
        }(e);
        if ("number" === r && isFinite(e)) return t.long ? function (e) {
          var t = Math.abs(e);
          if (t >= s) return u(e, t, s, "day");
          if (t >= o) return u(e, t, o, "hour");
          if (t >= i) return u(e, t, i, "minute");
          if (t >= n) return u(e, t, n, "second");
          return e + " ms";
        }(e) : function (e) {
          var t = Math.abs(e);
          if (t >= s) return Math.round(e / s) + "d";
          if (t >= o) return Math.round(e / o) + "h";
          if (t >= i) return Math.round(e / i) + "m";
          if (t >= n) return Math.round(e / n) + "s";
          return e + "ms";
        }(e);
        throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
      };
    }, {}],
    46: [function (e, t, r) {
      const n = e("./lib/number-allocator.js");
      t.exports.NumberAllocator = n;
    }, {
      "./lib/number-allocator.js": 47
    }],
    47: [function (e, t, r) {
      "use strict";

      const n = e("js-sdsl").Set,
        i = e("debug")("number-allocator:trace"),
        o = e("debug")("number-allocator:error");
      function s(e, t) {
        this.low = e, this.high = t;
      }
      function a(e, t) {
        if (!(this instanceof a)) return new a(e, t);
        this.min = e, this.max = t, this.ss = new n([], (e, t) => e.compare(t)), i("Create"), this.clear();
      }
      s.prototype.equals = function (e) {
        return this.low === e.low && this.high === e.high;
      }, s.prototype.compare = function (e) {
        return this.low < e.low && this.high < e.low ? -1 : e.low < this.low && e.high < this.low ? 1 : 0;
      }, a.prototype.firstVacant = function () {
        return 0 === this.ss.size() ? null : this.ss.front().low;
      }, a.prototype.alloc = function () {
        if (0 === this.ss.size()) return i("alloc():empty"), null;
        const e = this.ss.front(),
          t = e.low;
        return t + 1 <= e.high ? ++e.low : this.ss.eraseElementByPos(0), i("alloc():" + t), t;
      }, a.prototype.use = function (e) {
        const t = new s(e, e),
          r = this.ss.lowerBound(t);
        if (r) {
          if (r.equals(t)) return this.ss.eraseElementByValue(r), i("use():" + e), !0;
          if (r.low > e) return !1;
          if (r.low === e) return ++r.low, i("use():" + e), !0;
          if (r.high === e) return --r.high, i("use():" + e), !0;
          const n = r.low;
          return r.low = e + 1, this.ss.insert(new s(n, e - 1)), i("use():" + e), !0;
        }
        return i("use():failed"), !1;
      }, a.prototype.free = function (e) {
        if (e < this.min || e > this.max) return void o("free():" + e + " is out of range");
        const t = new s(e, e),
          r = this.ss.lowerBound(t);
        if (r) {
          if (r.low <= e && e <= r.high) return void o("free():" + e + " has already been vacant");
          if (r === this.ss.front()) e + 1 === r.low ? --r.low : this.ss.insert(t);else {
            const n = this.ss.reverseLowerBound(t);
            n.high + 1 === e ? e + 1 === r.low ? (this.ss.eraseElementByValue(n), r.low = n.low) : n.high = e : e + 1 === r.low ? r.low = e : this.ss.insert(t);
          }
        } else {
          if (r === this.ss.front()) return void this.ss.insert(t);
          const n = this.ss.reverseLowerBound(t);
          n.high + 1 === e ? n.high = e : this.ss.insert(t);
        }
        i("free():" + e);
      }, a.prototype.clear = function () {
        i("clear()"), this.ss.clear(), this.ss.insert(new s(this.min, this.max));
      }, a.prototype.intervalCount = function () {
        return this.ss.size();
      }, a.prototype.dump = function () {
        console.log("length:" + this.ss.size());
        for (const e of this.ss) console.log(e);
      }, t.exports = a;
    }, {
      debug: 18,
      "js-sdsl": 36
    }],
    48: [function (e, t, r) {
      var n = e("wrappy");
      function i(e) {
        var t = function () {
          return t.called ? t.value : (t.called = !0, t.value = e.apply(this, arguments));
        };
        return t.called = !1, t;
      }
      function o(e) {
        var t = function () {
            if (t.called) throw new Error(t.onceError);
            return t.called = !0, t.value = e.apply(this, arguments);
          },
          r = e.name || "Function wrapped with `once`";
        return t.onceError = r + " shouldn't be called more than once", t.called = !1, t;
      }
      t.exports = n(i), t.exports.strict = n(o), i.proto = i(function () {
        Object.defineProperty(Function.prototype, "once", {
          value: function () {
            return i(this);
          },
          configurable: !0
        }), Object.defineProperty(Function.prototype, "onceStrict", {
          value: function () {
            return o(this);
          },
          configurable: !0
        });
      });
    }, {
      wrappy: 79
    }],
    49: [function (e, t, r) {
      (function (e) {
        (function () {
          "use strict";

          void 0 === e || !e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
            nextTick: function (t, r, n, i) {
              if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
              var o,
                s,
                a = arguments.length;
              switch (a) {
                case 0:
                case 1:
                  return e.nextTick(t);
                case 2:
                  return e.nextTick(function () {
                    t.call(null, r);
                  });
                case 3:
                  return e.nextTick(function () {
                    t.call(null, r, n);
                  });
                case 4:
                  return e.nextTick(function () {
                    t.call(null, r, n, i);
                  });
                default:
                  for (o = new Array(a - 1), s = 0; s < o.length;) o[s++] = arguments[s];
                  return e.nextTick(function () {
                    t.apply(null, o);
                  });
              }
            }
          } : t.exports = e;
        }).call(this);
      }).call(this, e("_process"));
    }, {
      _process: 50
    }],
    50: [function (e, t, r) {
      var n,
        i,
        o = t.exports = {};
      function s() {
        throw new Error("setTimeout has not been defined");
      }
      function a() {
        throw new Error("clearTimeout has not been defined");
      }
      function l(e) {
        if (n === setTimeout) return setTimeout(e, 0);
        if ((n === s || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
        try {
          return n(e, 0);
        } catch (t) {
          try {
            return n.call(null, e, 0);
          } catch (t) {
            return n.call(this, e, 0);
          }
        }
      }
      !function () {
        try {
          n = "function" == typeof setTimeout ? setTimeout : s;
        } catch (e) {
          n = s;
        }
        try {
          i = "function" == typeof clearTimeout ? clearTimeout : a;
        } catch (e) {
          i = a;
        }
      }();
      var u,
        c = [],
        h = !1,
        f = -1;
      function p() {
        h && u && (h = !1, u.length ? c = u.concat(c) : f = -1, c.length && d());
      }
      function d() {
        if (!h) {
          var e = l(p);
          h = !0;
          for (var t = c.length; t;) {
            for (u = c, c = []; ++f < t;) u && u[f].run();
            f = -1, t = c.length;
          }
          u = null, h = !1, function (e) {
            if (i === clearTimeout) return clearTimeout(e);
            if ((i === a || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);
            try {
              i(e);
            } catch (t) {
              try {
                return i.call(null, e);
              } catch (t) {
                return i.call(this, e);
              }
            }
          }(e);
        }
      }
      function g(e, t) {
        this.fun = e, this.array = t;
      }
      function y() {}
      o.nextTick = function (e) {
        var t = new Array(arguments.length - 1);
        if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
        c.push(new g(e, t)), 1 !== c.length || h || l(d);
      }, g.prototype.run = function () {
        this.fun.apply(null, this.array);
      }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = y, o.addListener = y, o.once = y, o.off = y, o.removeListener = y, o.removeAllListeners = y, o.emit = y, o.prependListener = y, o.prependOnceListener = y, o.listeners = function (e) {
        return [];
      }, o.binding = function (e) {
        throw new Error("process.binding is not supported");
      }, o.cwd = function () {
        return "/";
      }, o.chdir = function (e) {
        throw new Error("process.chdir is not supported");
      }, o.umask = function () {
        return 0;
      };
    }, {}],
    51: [function (e, t, r) {
      (function (e) {
        (function () {
          !function (n) {
            var i = "object" == typeof r && r && !r.nodeType && r,
              o = "object" == typeof t && t && !t.nodeType && t,
              s = "object" == typeof e && e;
            s.global !== s && s.window !== s && s.self !== s || (n = s);
            var a,
              l,
              u = 2147483647,
              c = 36,
              h = 1,
              f = 26,
              p = 38,
              d = 700,
              g = 72,
              y = 128,
              b = "-",
              m = /^xn--/,
              v = /[^\x20-\x7E]/,
              w = /[\x2E\u3002\uFF0E\uFF61]/g,
              _ = {
                overflow: "Overflow: input needs wider integers to process",
                "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                "invalid-input": "Invalid input"
              },
              k = c - h,
              S = Math.floor,
              E = String.fromCharCode;
            function C(e) {
              throw new RangeError(_[e]);
            }
            function T(e, t) {
              for (var r = e.length, n = []; r--;) n[r] = t(e[r]);
              return n;
            }
            function x(e, t) {
              var r = e.split("@"),
                n = "";
              return r.length > 1 && (n = r[0] + "@", e = r[1]), n + T((e = e.replace(w, ".")).split("."), t).join(".");
            }
            function A(e) {
              for (var t, r, n = [], i = 0, o = e.length; i < o;) (t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < o ? 56320 == (64512 & (r = e.charCodeAt(i++))) ? n.push(((1023 & t) << 10) + (1023 & r) + 65536) : (n.push(t), i--) : n.push(t);
              return n;
            }
            function I(e) {
              return T(e, function (e) {
                var t = "";
                return e > 65535 && (t += E((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += E(e);
              }).join("");
            }
            function P(e, t) {
              return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
            }
            function O(e, t, r) {
              var n = 0;
              for (e = r ? S(e / d) : e >> 1, e += S(e / t); e > k * f >> 1; n += c) e = S(e / k);
              return S(n + (k + 1) * e / (e + p));
            }
            function B(e) {
              var t,
                r,
                n,
                i,
                o,
                s,
                a,
                l,
                p,
                d,
                m,
                v = [],
                w = e.length,
                _ = 0,
                k = y,
                E = g;
              for ((r = e.lastIndexOf(b)) < 0 && (r = 0), n = 0; n < r; ++n) e.charCodeAt(n) >= 128 && C("not-basic"), v.push(e.charCodeAt(n));
              for (i = r > 0 ? r + 1 : 0; i < w;) {
                for (o = _, s = 1, a = c; i >= w && C("invalid-input"), ((l = (m = e.charCodeAt(i++)) - 48 < 10 ? m - 22 : m - 65 < 26 ? m - 65 : m - 97 < 26 ? m - 97 : c) >= c || l > S((u - _) / s)) && C("overflow"), _ += l * s, !(l < (p = a <= E ? h : a >= E + f ? f : a - E)); a += c) s > S(u / (d = c - p)) && C("overflow"), s *= d;
                E = O(_ - o, t = v.length + 1, 0 == o), S(_ / t) > u - k && C("overflow"), k += S(_ / t), _ %= t, v.splice(_++, 0, k);
              }
              return I(v);
            }
            function R(e) {
              var t,
                r,
                n,
                i,
                o,
                s,
                a,
                l,
                p,
                d,
                m,
                v,
                w,
                _,
                k,
                T = [];
              for (v = (e = A(e)).length, t = y, r = 0, o = g, s = 0; s < v; ++s) (m = e[s]) < 128 && T.push(E(m));
              for (n = i = T.length, i && T.push(b); n < v;) {
                for (a = u, s = 0; s < v; ++s) (m = e[s]) >= t && m < a && (a = m);
                for (a - t > S((u - r) / (w = n + 1)) && C("overflow"), r += (a - t) * w, t = a, s = 0; s < v; ++s) if ((m = e[s]) < t && ++r > u && C("overflow"), m == t) {
                  for (l = r, p = c; !(l < (d = p <= o ? h : p >= o + f ? f : p - o)); p += c) k = l - d, _ = c - d, T.push(E(P(d + k % _, 0))), l = S(k / _);
                  T.push(E(P(l, 0))), o = O(r, w, n == i), r = 0, ++n;
                }
                ++r, ++t;
              }
              return T.join("");
            }
            if (a = {
              version: "1.4.1",
              ucs2: {
                decode: A,
                encode: I
              },
              decode: B,
              encode: R,
              toASCII: function (e) {
                return x(e, function (e) {
                  return v.test(e) ? "xn--" + R(e) : e;
                });
              },
              toUnicode: function (e) {
                return x(e, function (e) {
                  return m.test(e) ? B(e.slice(4).toLowerCase()) : e;
                });
              }
            }, i && o) {
              if (t.exports == i) o.exports = a;else for (l in a) a.hasOwnProperty(l) && (i[l] = a[l]);
            } else n.punycode = a;
          }(this);
        }).call(this);
      }).call(this, "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    52: [function (e, t, r) {
      "use strict";

      function n(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }
      t.exports = function (e, t, r, o) {
        t = t || "&", r = r || "=";
        var s = {};
        if ("string" != typeof e || 0 === e.length) return s;
        var a = /\+/g;
        e = e.split(t);
        var l = 1e3;
        o && "number" == typeof o.maxKeys && (l = o.maxKeys);
        var u = e.length;
        l > 0 && u > l && (u = l);
        for (var c = 0; c < u; ++c) {
          var h,
            f,
            p,
            d,
            g = e[c].replace(a, "%20"),
            y = g.indexOf(r);
          y >= 0 ? (h = g.substr(0, y), f = g.substr(y + 1)) : (h = g, f = ""), p = decodeURIComponent(h), d = decodeURIComponent(f), n(s, p) ? i(s[p]) ? s[p].push(d) : s[p] = [s[p], d] : s[p] = d;
        }
        return s;
      };
      var i = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      };
    }, {}],
    53: [function (e, t, r) {
      "use strict";

      var n = function (e) {
        switch (typeof e) {
          case "string":
            return e;
          case "boolean":
            return e ? "true" : "false";
          case "number":
            return isFinite(e) ? e : "";
          default:
            return "";
        }
      };
      t.exports = function (e, t, r, a) {
        return t = t || "&", r = r || "=", null === e && (e = void 0), "object" == typeof e ? o(s(e), function (s) {
          var a = encodeURIComponent(n(s)) + r;
          return i(e[s]) ? o(e[s], function (e) {
            return a + encodeURIComponent(n(e));
          }).join(t) : a + encodeURIComponent(n(e[s]));
        }).join(t) : a ? encodeURIComponent(n(a)) + r + encodeURIComponent(n(e)) : "";
      };
      var i = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
      };
      function o(e, t) {
        if (e.map) return e.map(t);
        for (var r = [], n = 0; n < e.length; n++) r.push(t(e[n], n));
        return r;
      }
      var s = Object.keys || function (e) {
        var t = [];
        for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
        return t;
      };
    }, {}],
    54: [function (e, t, r) {
      "use strict";

      r.decode = r.parse = e("./decode"), r.encode = r.stringify = e("./encode");
    }, {
      "./decode": 52,
      "./encode": 53
    }],
    55: [function (e, t, r) {
      "use strict";

      var n = {};
      function i(e, t, r) {
        r || (r = Error);
        var i = function (e) {
          var r, n;
          function i(r, n, i) {
            return e.call(this, function (e, r, n) {
              return "string" == typeof t ? t : t(e, r, n);
            }(r, n, i)) || this;
          }
          return n = e, (r = i).prototype = Object.create(n.prototype), r.prototype.constructor = r, r.__proto__ = n, i;
        }(r);
        i.prototype.name = r.name, i.prototype.code = e, n[e] = i;
      }
      function o(e, t) {
        if (Array.isArray(e)) {
          var r = e.length;
          return e = e.map(function (e) {
            return String(e);
          }), r > 2 ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0]);
        }
        return "of ".concat(t, " ").concat(String(e));
      }
      i("ERR_INVALID_OPT_VALUE", function (e, t) {
        return 'The value "' + t + '" is invalid for option "' + e + '"';
      }, TypeError), i("ERR_INVALID_ARG_TYPE", function (e, t, r) {
        var n, i, s, a;
        if ("string" == typeof t && (i = "not ", t.substr(!s || s < 0 ? 0 : +s, i.length) === i) ? (n = "must not be", t = t.replace(/^not /, "")) : n = "must be", function (e, t, r) {
          return (void 0 === r || r > e.length) && (r = e.length), e.substring(r - t.length, r) === t;
        }(e, " argument")) a = "The ".concat(e, " ").concat(n, " ").concat(o(t, "type"));else {
          var l = function (e, t, r) {
            return "number" != typeof r && (r = 0), !(r + t.length > e.length) && -1 !== e.indexOf(t, r);
          }(e, ".") ? "property" : "argument";
          a = 'The "'.concat(e, '" ').concat(l, " ").concat(n, " ").concat(o(t, "type"));
        }
        return a += ". Received type ".concat(typeof r);
      }, TypeError), i("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), i("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
        return "The " + e + " method is not implemented";
      }), i("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), i("ERR_STREAM_DESTROYED", function (e) {
        return "Cannot call " + e + " after a stream was destroyed";
      }), i("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), i("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), i("ERR_STREAM_WRITE_AFTER_END", "write after end"), i("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), i("ERR_UNKNOWN_ENCODING", function (e) {
        return "Unknown encoding: " + e;
      }, TypeError), i("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t.exports.codes = n;
    }, {}],
    56: [function (e, t, r) {
      (function (r) {
        (function () {
          "use strict";

          var n = Object.keys || function (e) {
            var t = [];
            for (var r in e) t.push(r);
            return t;
          };
          t.exports = u;
          var i = e("./_stream_readable"),
            o = e("./_stream_writable");
          e("inherits")(u, i);
          for (var s = n(o.prototype), a = 0; a < s.length; a++) {
            var l = s[a];
            u.prototype[l] || (u.prototype[l] = o.prototype[l]);
          }
          function u(e) {
            if (!(this instanceof u)) return new u(e);
            i.call(this, e), o.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", c)));
          }
          function c() {
            this._writableState.ended || r.nextTick(h, this);
          }
          function h(e) {
            e.end();
          }
          Object.defineProperty(u.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
              return this._writableState.highWaterMark;
            }
          }), Object.defineProperty(u.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
              return this._writableState && this._writableState.getBuffer();
            }
          }), Object.defineProperty(u.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
              return this._writableState.length;
            }
          }), Object.defineProperty(u.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
              return void 0 !== this._readableState && void 0 !== this._writableState && this._readableState.destroyed && this._writableState.destroyed;
            },
            set: function (e) {
              void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e);
            }
          });
        }).call(this);
      }).call(this, e("_process"));
    }, {
      "./_stream_readable": 58,
      "./_stream_writable": 60,
      _process: 50,
      inherits: 24
    }],
    57: [function (e, t, r) {
      "use strict";

      t.exports = i;
      var n = e("./_stream_transform");
      function i(e) {
        if (!(this instanceof i)) return new i(e);
        n.call(this, e);
      }
      e("inherits")(i, n), i.prototype._transform = function (e, t, r) {
        r(null, e);
      };
    }, {
      "./_stream_transform": 59,
      inherits: 24
    }],
    58: [function (e, t, r) {
      (function (r, n) {
        (function () {
          "use strict";

          var i;
          t.exports = C, C.ReadableState = E;
          e("events").EventEmitter;
          var o = function (e, t) {
              return e.listeners(t).length;
            },
            s = e("./internal/streams/stream"),
            a = e("buffer").Buffer,
            l = n.Uint8Array || function () {};
          var u,
            c = e("util");
          u = c && c.debuglog ? c.debuglog("stream") : function () {};
          var h,
            f,
            p,
            d = e("./internal/streams/buffer_list"),
            g = e("./internal/streams/destroy"),
            y = e("./internal/streams/state").getHighWaterMark,
            b = e("../errors").codes,
            m = b.ERR_INVALID_ARG_TYPE,
            v = b.ERR_STREAM_PUSH_AFTER_EOF,
            w = b.ERR_METHOD_NOT_IMPLEMENTED,
            _ = b.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
          e("inherits")(C, s);
          var k = g.errorOrDestroy,
            S = ["error", "close", "destroy", "pause", "resume"];
          function E(t, r, n) {
            i = i || e("./_stream_duplex"), t = t || {}, "boolean" != typeof n && (n = r instanceof i), this.objectMode = !!t.objectMode, n && (this.objectMode = this.objectMode || !!t.readableObjectMode), this.highWaterMark = y(this, t, "readableHighWaterMark", n), this.buffer = new d(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.destroyed = !1, this.defaultEncoding = t.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, t.encoding && (h || (h = e("string_decoder/").StringDecoder), this.decoder = new h(t.encoding), this.encoding = t.encoding);
          }
          function C(t) {
            if (i = i || e("./_stream_duplex"), !(this instanceof C)) return new C(t);
            var r = this instanceof i;
            this._readableState = new E(t, this, r), this.readable = !0, t && ("function" == typeof t.read && (this._read = t.read), "function" == typeof t.destroy && (this._destroy = t.destroy)), s.call(this);
          }
          function T(e, t, r, n, i) {
            u("readableAddChunk", t);
            var o,
              s = e._readableState;
            if (null === t) s.reading = !1, function (e, t) {
              if (u("onEofChunk"), t.ended) return;
              if (t.decoder) {
                var r = t.decoder.end();
                r && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length);
              }
              t.ended = !0, t.sync ? P(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, O(e)));
            }(e, s);else if (i || (o = function (e, t) {
              var r;
              n = t, a.isBuffer(n) || n instanceof l || "string" == typeof t || void 0 === t || e.objectMode || (r = new m("chunk", ["string", "Buffer", "Uint8Array"], t));
              var n;
              return r;
            }(s, t)), o) k(e, o);else if (s.objectMode || t && t.length > 0) {
              if ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === a.prototype || (t = function (e) {
                return a.from(e);
              }(t)), n) s.endEmitted ? k(e, new _()) : x(e, s, t, !0);else if (s.ended) k(e, new v());else {
                if (s.destroyed) return !1;
                s.reading = !1, s.decoder && !r ? (t = s.decoder.write(t), s.objectMode || 0 !== t.length ? x(e, s, t, !1) : B(e, s)) : x(e, s, t, !1);
              }
            } else n || (s.reading = !1, B(e, s));
            return !s.ended && (s.length < s.highWaterMark || 0 === s.length);
          }
          function x(e, t, r, n) {
            t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, n ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && P(e)), B(e, t);
          }
          Object.defineProperty(C.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
              return void 0 !== this._readableState && this._readableState.destroyed;
            },
            set: function (e) {
              this._readableState && (this._readableState.destroyed = e);
            }
          }), C.prototype.destroy = g.destroy, C.prototype._undestroy = g.undestroy, C.prototype._destroy = function (e, t) {
            t(e);
          }, C.prototype.push = function (e, t) {
            var r,
              n = this._readableState;
            return n.objectMode ? r = !0 : "string" == typeof e && ((t = t || n.defaultEncoding) !== n.encoding && (e = a.from(e, t), t = ""), r = !0), T(this, e, t, !1, r);
          }, C.prototype.unshift = function (e) {
            return T(this, e, null, !0, !1);
          }, C.prototype.isPaused = function () {
            return !1 === this._readableState.flowing;
          }, C.prototype.setEncoding = function (t) {
            h || (h = e("string_decoder/").StringDecoder);
            var r = new h(t);
            this._readableState.decoder = r, this._readableState.encoding = this._readableState.decoder.encoding;
            for (var n = this._readableState.buffer.head, i = ""; null !== n;) i += r.write(n.data), n = n.next;
            return this._readableState.buffer.clear(), "" !== i && this._readableState.buffer.push(i), this._readableState.length = i.length, this;
          };
          var A = 1073741824;
          function I(e, t) {
            return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = function (e) {
              return e >= A ? e = A : (e--, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e++), e;
            }(e)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
          }
          function P(e) {
            var t = e._readableState;
            u("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (u("emitReadable", t.flowing), t.emittedReadable = !0, r.nextTick(O, e));
          }
          function O(e) {
            var t = e._readableState;
            u("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, j(e);
          }
          function B(e, t) {
            t.readingMore || (t.readingMore = !0, r.nextTick(R, e, t));
          }
          function R(e, t) {
            for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
              var r = t.length;
              if (u("maybeReadMore read 0"), e.read(0), r === t.length) break;
            }
            t.readingMore = !1;
          }
          function M(e) {
            var t = e._readableState;
            t.readableListening = e.listenerCount("readable") > 0, t.resumeScheduled && !t.paused ? t.flowing = !0 : e.listenerCount("data") > 0 && e.resume();
          }
          function N(e) {
            u("readable nexttick read 0"), e.read(0);
          }
          function L(e, t) {
            u("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), j(e), t.flowing && !t.reading && e.read(0);
          }
          function j(e) {
            var t = e._readableState;
            for (u("flow", t.flowing); t.flowing && null !== e.read(););
          }
          function U(e, t) {
            return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r);
            var r;
          }
          function q(e) {
            var t = e._readableState;
            u("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, r.nextTick(D, t, e));
          }
          function D(e, t) {
            if (u("endReadableNT", e.endEmitted, e.length), !e.endEmitted && 0 === e.length && (e.endEmitted = !0, t.readable = !1, t.emit("end"), e.autoDestroy)) {
              var r = t._writableState;
              (!r || r.autoDestroy && r.finished) && t.destroy();
            }
          }
          function z(e, t) {
            for (var r = 0, n = e.length; r < n; r++) if (e[r] === t) return r;
            return -1;
          }
          C.prototype.read = function (e) {
            u("read", e), e = parseInt(e, 10);
            var t = this._readableState,
              r = e;
            if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : t.length > 0) || t.ended)) return u("read: emitReadable", t.length, t.ended), 0 === t.length && t.ended ? q(this) : P(this), null;
            if (0 === (e = I(e, t)) && t.ended) return 0 === t.length && q(this), null;
            var n,
              i = t.needReadable;
            return u("need readable", i), (0 === t.length || t.length - e < t.highWaterMark) && u("length less than watermark", i = !0), t.ended || t.reading ? u("reading or ended", i = !1) : i && (u("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = I(r, t))), null === (n = e > 0 ? U(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && q(this)), null !== n && this.emit("data", n), n;
          }, C.prototype._read = function (e) {
            k(this, new w("_read()"));
          }, C.prototype.pipe = function (e, t) {
            var n = this,
              i = this._readableState;
            switch (i.pipesCount) {
              case 0:
                i.pipes = e;
                break;
              case 1:
                i.pipes = [i.pipes, e];
                break;
              default:
                i.pipes.push(e);
            }
            i.pipesCount += 1, u("pipe count=%d opts=%j", i.pipesCount, t);
            var s = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? l : y;
            function a(t, r) {
              u("onunpipe"), t === n && r && !1 === r.hasUnpiped && (r.hasUnpiped = !0, u("cleanup"), e.removeListener("close", d), e.removeListener("finish", g), e.removeListener("drain", c), e.removeListener("error", p), e.removeListener("unpipe", a), n.removeListener("end", l), n.removeListener("end", y), n.removeListener("data", f), h = !0, !i.awaitDrain || e._writableState && !e._writableState.needDrain || c());
            }
            function l() {
              u("onend"), e.end();
            }
            i.endEmitted ? r.nextTick(s) : n.once("end", s), e.on("unpipe", a);
            var c = function (e) {
              return function () {
                var t = e._readableState;
                u("pipeOnDrain", t.awaitDrain), t.awaitDrain && t.awaitDrain--, 0 === t.awaitDrain && o(e, "data") && (t.flowing = !0, j(e));
              };
            }(n);
            e.on("drain", c);
            var h = !1;
            function f(t) {
              u("ondata");
              var r = e.write(t);
              u("dest.write", r), !1 === r && ((1 === i.pipesCount && i.pipes === e || i.pipesCount > 1 && -1 !== z(i.pipes, e)) && !h && (u("false write response, pause", i.awaitDrain), i.awaitDrain++), n.pause());
            }
            function p(t) {
              u("onerror", t), y(), e.removeListener("error", p), 0 === o(e, "error") && k(e, t);
            }
            function d() {
              e.removeListener("finish", g), y();
            }
            function g() {
              u("onfinish"), e.removeListener("close", d), y();
            }
            function y() {
              u("unpipe"), n.unpipe(e);
            }
            return n.on("data", f), function (e, t, r) {
              if ("function" == typeof e.prependListener) return e.prependListener(t, r);
              e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r);
            }(e, "error", p), e.once("close", d), e.once("finish", g), e.emit("pipe", n), i.flowing || (u("pipe resume"), n.resume()), e;
          }, C.prototype.unpipe = function (e) {
            var t = this._readableState,
              r = {
                hasUnpiped: !1
              };
            if (0 === t.pipesCount) return this;
            if (1 === t.pipesCount) return e && e !== t.pipes ? this : (e || (e = t.pipes), t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r), this);
            if (!e) {
              var n = t.pipes,
                i = t.pipesCount;
              t.pipes = null, t.pipesCount = 0, t.flowing = !1;
              for (var o = 0; o < i; o++) n[o].emit("unpipe", this, {
                hasUnpiped: !1
              });
              return this;
            }
            var s = z(t.pipes, e);
            return -1 === s ? this : (t.pipes.splice(s, 1), t.pipesCount -= 1, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r), this);
          }, C.prototype.on = function (e, t) {
            var n = s.prototype.on.call(this, e, t),
              i = this._readableState;
            return "data" === e ? (i.readableListening = this.listenerCount("readable") > 0, !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, u("on readable", i.length, i.reading), i.length ? P(this) : i.reading || r.nextTick(N, this))), n;
          }, C.prototype.addListener = C.prototype.on, C.prototype.removeListener = function (e, t) {
            var n = s.prototype.removeListener.call(this, e, t);
            return "readable" === e && r.nextTick(M, this), n;
          }, C.prototype.removeAllListeners = function (e) {
            var t = s.prototype.removeAllListeners.apply(this, arguments);
            return "readable" !== e && void 0 !== e || r.nextTick(M, this), t;
          }, C.prototype.resume = function () {
            var e = this._readableState;
            return e.flowing || (u("resume"), e.flowing = !e.readableListening, function (e, t) {
              t.resumeScheduled || (t.resumeScheduled = !0, r.nextTick(L, e, t));
            }(this, e)), e.paused = !1, this;
          }, C.prototype.pause = function () {
            return u("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (u("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
          }, C.prototype.wrap = function (e) {
            var t = this,
              r = this._readableState,
              n = !1;
            for (var i in e.on("end", function () {
              if (u("wrapped end"), r.decoder && !r.ended) {
                var e = r.decoder.end();
                e && e.length && t.push(e);
              }
              t.push(null);
            }), e.on("data", function (i) {
              (u("wrapped data"), r.decoder && (i = r.decoder.write(i)), !r.objectMode || null !== i && void 0 !== i) && (r.objectMode || i && i.length) && (t.push(i) || (n = !0, e.pause()));
            }), e) void 0 === this[i] && "function" == typeof e[i] && (this[i] = function (t) {
              return function () {
                return e[t].apply(e, arguments);
              };
            }(i));
            for (var o = 0; o < S.length; o++) e.on(S[o], this.emit.bind(this, S[o]));
            return this._read = function (t) {
              u("wrapped _read", t), n && (n = !1, e.resume());
            }, this;
          }, "function" == typeof Symbol && (C.prototype[Symbol.asyncIterator] = function () {
            return void 0 === f && (f = e("./internal/streams/async_iterator")), f(this);
          }), Object.defineProperty(C.prototype, "readableHighWaterMark", {
            enumerable: !1,
            get: function () {
              return this._readableState.highWaterMark;
            }
          }), Object.defineProperty(C.prototype, "readableBuffer", {
            enumerable: !1,
            get: function () {
              return this._readableState && this._readableState.buffer;
            }
          }), Object.defineProperty(C.prototype, "readableFlowing", {
            enumerable: !1,
            get: function () {
              return this._readableState.flowing;
            },
            set: function (e) {
              this._readableState && (this._readableState.flowing = e);
            }
          }), C._fromList = U, Object.defineProperty(C.prototype, "readableLength", {
            enumerable: !1,
            get: function () {
              return this._readableState.length;
            }
          }), "function" == typeof Symbol && (C.from = function (t, r) {
            return void 0 === p && (p = e("./internal/streams/from")), p(C, t, r);
          });
        }).call(this);
      }).call(this, e("_process"), "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "../errors": 55,
      "./_stream_duplex": 56,
      "./internal/streams/async_iterator": 61,
      "./internal/streams/buffer_list": 62,
      "./internal/streams/destroy": 63,
      "./internal/streams/from": 65,
      "./internal/streams/state": 67,
      "./internal/streams/stream": 68,
      _process: 50,
      buffer: 17,
      events: 22,
      inherits: 24,
      "string_decoder/": 75,
      util: 16
    }],
    59: [function (e, t, r) {
      "use strict";

      t.exports = u;
      var n = e("../errors").codes,
        i = n.ERR_METHOD_NOT_IMPLEMENTED,
        o = n.ERR_MULTIPLE_CALLBACK,
        s = n.ERR_TRANSFORM_ALREADY_TRANSFORMING,
        a = n.ERR_TRANSFORM_WITH_LENGTH_0,
        l = e("./_stream_duplex");
      function u(e) {
        if (!(this instanceof u)) return new u(e);
        l.call(this, e), this._transformState = {
          afterTransform: function (e, t) {
            var r = this._transformState;
            r.transforming = !1;
            var n = r.writecb;
            if (null === n) return this.emit("error", new o());
            r.writechunk = null, r.writecb = null, null != t && this.push(t), n(e);
            var i = this._readableState;
            i.reading = !1, (i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
          }.bind(this),
          needTransform: !1,
          transforming: !1,
          writecb: null,
          writechunk: null,
          writeencoding: null
        }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", c);
      }
      function c() {
        var e = this;
        "function" != typeof this._flush || this._readableState.destroyed ? h(this, null, null) : this._flush(function (t, r) {
          h(e, t, r);
        });
      }
      function h(e, t, r) {
        if (t) return e.emit("error", t);
        if (null != r && e.push(r), e._writableState.length) throw new a();
        if (e._transformState.transforming) throw new s();
        return e.push(null);
      }
      e("inherits")(u, l), u.prototype.push = function (e, t) {
        return this._transformState.needTransform = !1, l.prototype.push.call(this, e, t);
      }, u.prototype._transform = function (e, t, r) {
        r(new i("_transform()"));
      }, u.prototype._write = function (e, t, r) {
        var n = this._transformState;
        if (n.writecb = r, n.writechunk = e, n.writeencoding = t, !n.transforming) {
          var i = this._readableState;
          (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark);
        }
      }, u.prototype._read = function (e) {
        var t = this._transformState;
        null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform));
      }, u.prototype._destroy = function (e, t) {
        l.prototype._destroy.call(this, e, function (e) {
          t(e);
        });
      };
    }, {
      "../errors": 55,
      "./_stream_duplex": 56,
      inherits: 24
    }],
    60: [function (e, t, r) {
      (function (r, n) {
        (function () {
          "use strict";

          function i(e) {
            var t = this;
            this.next = null, this.entry = null, this.finish = function () {
              !function (e, t, r) {
                var n = e.entry;
                e.entry = null;
                for (; n;) {
                  var i = n.callback;
                  t.pendingcb--, i(r), n = n.next;
                }
                t.corkedRequestsFree.next = e;
              }(t, e);
            };
          }
          var o;
          t.exports = C, C.WritableState = E;
          var s = {
              deprecate: e("util-deprecate")
            },
            a = e("./internal/streams/stream"),
            l = e("buffer").Buffer,
            u = n.Uint8Array || function () {};
          var c,
            h = e("./internal/streams/destroy"),
            f = e("./internal/streams/state").getHighWaterMark,
            p = e("../errors").codes,
            d = p.ERR_INVALID_ARG_TYPE,
            g = p.ERR_METHOD_NOT_IMPLEMENTED,
            y = p.ERR_MULTIPLE_CALLBACK,
            b = p.ERR_STREAM_CANNOT_PIPE,
            m = p.ERR_STREAM_DESTROYED,
            v = p.ERR_STREAM_NULL_VALUES,
            w = p.ERR_STREAM_WRITE_AFTER_END,
            _ = p.ERR_UNKNOWN_ENCODING,
            k = h.errorOrDestroy;
          function S() {}
          function E(t, n, s) {
            o = o || e("./_stream_duplex"), t = t || {}, "boolean" != typeof s && (s = n instanceof o), this.objectMode = !!t.objectMode, s && (this.objectMode = this.objectMode || !!t.writableObjectMode), this.highWaterMark = f(this, t, "writableHighWaterMark", s), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
            var a = !1 === t.decodeStrings;
            this.decodeStrings = !a, this.defaultEncoding = t.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
              !function (e, t) {
                var n = e._writableState,
                  i = n.sync,
                  o = n.writecb;
                if ("function" != typeof o) throw new y();
                if (function (e) {
                  e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0;
                }(n), t) !function (e, t, n, i, o) {
                  --t.pendingcb, n ? (r.nextTick(o, i), r.nextTick(O, e, t), e._writableState.errorEmitted = !0, k(e, i)) : (o(i), e._writableState.errorEmitted = !0, k(e, i), O(e, t));
                }(e, n, i, t, o);else {
                  var s = I(n) || e.destroyed;
                  s || n.corked || n.bufferProcessing || !n.bufferedRequest || A(e, n), i ? r.nextTick(x, e, n, s, o) : x(e, n, s, o);
                }
              }(n, e);
            }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== t.emitClose, this.autoDestroy = !!t.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new i(this);
          }
          function C(t) {
            var r = this instanceof (o = o || e("./_stream_duplex"));
            if (!r && !c.call(C, this)) return new C(t);
            this._writableState = new E(t, this, r), this.writable = !0, t && ("function" == typeof t.write && (this._write = t.write), "function" == typeof t.writev && (this._writev = t.writev), "function" == typeof t.destroy && (this._destroy = t.destroy), "function" == typeof t.final && (this._final = t.final)), a.call(this);
          }
          function T(e, t, r, n, i, o, s) {
            t.writelen = n, t.writecb = s, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new m("write")) : r ? e._writev(i, t.onwrite) : e._write(i, o, t.onwrite), t.sync = !1;
          }
          function x(e, t, r, n) {
            r || function (e, t) {
              0 === t.length && t.needDrain && (t.needDrain = !1, e.emit("drain"));
            }(e, t), t.pendingcb--, n(), O(e, t);
          }
          function A(e, t) {
            t.bufferProcessing = !0;
            var r = t.bufferedRequest;
            if (e._writev && r && r.next) {
              var n = t.bufferedRequestCount,
                o = new Array(n),
                s = t.corkedRequestsFree;
              s.entry = r;
              for (var a = 0, l = !0; r;) o[a] = r, r.isBuf || (l = !1), r = r.next, a += 1;
              o.allBuffers = l, T(e, t, !0, t.length, o, "", s.finish), t.pendingcb++, t.lastBufferedRequest = null, s.next ? (t.corkedRequestsFree = s.next, s.next = null) : t.corkedRequestsFree = new i(t), t.bufferedRequestCount = 0;
            } else {
              for (; r;) {
                var u = r.chunk,
                  c = r.encoding,
                  h = r.callback;
                if (T(e, t, !1, t.objectMode ? 1 : u.length, u, c, h), r = r.next, t.bufferedRequestCount--, t.writing) break;
              }
              null === r && (t.lastBufferedRequest = null);
            }
            t.bufferedRequest = r, t.bufferProcessing = !1;
          }
          function I(e) {
            return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
          }
          function P(e, t) {
            e._final(function (r) {
              t.pendingcb--, r && k(e, r), t.prefinished = !0, e.emit("prefinish"), O(e, t);
            });
          }
          function O(e, t) {
            var n = I(t);
            if (n && (function (e, t) {
              t.prefinished || t.finalCalled || ("function" != typeof e._final || t.destroyed ? (t.prefinished = !0, e.emit("prefinish")) : (t.pendingcb++, t.finalCalled = !0, r.nextTick(P, e, t)));
            }(e, t), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), t.autoDestroy))) {
              var i = e._readableState;
              (!i || i.autoDestroy && i.endEmitted) && e.destroy();
            }
            return n;
          }
          e("inherits")(C, a), E.prototype.getBuffer = function () {
            for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
            return t;
          }, function () {
            try {
              Object.defineProperty(E.prototype, "buffer", {
                get: s.deprecate(function () {
                  return this.getBuffer();
                }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
              });
            } catch (e) {}
          }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (c = Function.prototype[Symbol.hasInstance], Object.defineProperty(C, Symbol.hasInstance, {
            value: function (e) {
              return !!c.call(this, e) || this === C && e && e._writableState instanceof E;
            }
          })) : c = function (e) {
            return e instanceof this;
          }, C.prototype.pipe = function () {
            k(this, new b());
          }, C.prototype.write = function (e, t, n) {
            var i,
              o = this._writableState,
              s = !1,
              a = !o.objectMode && (i = e, l.isBuffer(i) || i instanceof u);
            return a && !l.isBuffer(e) && (e = function (e) {
              return l.from(e);
            }(e)), "function" == typeof t && (n = t, t = null), a ? t = "buffer" : t || (t = o.defaultEncoding), "function" != typeof n && (n = S), o.ending ? function (e, t) {
              var n = new w();
              k(e, n), r.nextTick(t, n);
            }(this, n) : (a || function (e, t, n, i) {
              var o;
              return null === n ? o = new v() : "string" == typeof n || t.objectMode || (o = new d("chunk", ["string", "Buffer"], n)), !o || (k(e, o), r.nextTick(i, o), !1);
            }(this, o, e, n)) && (o.pendingcb++, s = function (e, t, r, n, i, o) {
              if (!r) {
                var s = function (e, t, r) {
                  e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = l.from(t, r));
                  return t;
                }(t, n, i);
                n !== s && (r = !0, i = "buffer", n = s);
              }
              var a = t.objectMode ? 1 : n.length;
              t.length += a;
              var u = t.length < t.highWaterMark;
              u || (t.needDrain = !0);
              if (t.writing || t.corked) {
                var c = t.lastBufferedRequest;
                t.lastBufferedRequest = {
                  chunk: n,
                  encoding: i,
                  isBuf: r,
                  callback: o,
                  next: null
                }, c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1;
              } else T(e, t, !1, a, n, i, o);
              return u;
            }(this, o, a, e, t, n)), s;
          }, C.prototype.cork = function () {
            this._writableState.corked++;
          }, C.prototype.uncork = function () {
            var e = this._writableState;
            e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || A(this, e));
          }, C.prototype.setDefaultEncoding = function (e) {
            if ("string" == typeof e && (e = e.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()) > -1)) throw new _(e);
            return this._writableState.defaultEncoding = e, this;
          }, Object.defineProperty(C.prototype, "writableBuffer", {
            enumerable: !1,
            get: function () {
              return this._writableState && this._writableState.getBuffer();
            }
          }), Object.defineProperty(C.prototype, "writableHighWaterMark", {
            enumerable: !1,
            get: function () {
              return this._writableState.highWaterMark;
            }
          }), C.prototype._write = function (e, t, r) {
            r(new g("_write()"));
          }, C.prototype._writev = null, C.prototype.end = function (e, t, n) {
            var i = this._writableState;
            return "function" == typeof e ? (n = e, e = null, t = null) : "function" == typeof t && (n = t, t = null), null !== e && void 0 !== e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function (e, t, n) {
              t.ending = !0, O(e, t), n && (t.finished ? r.nextTick(n) : e.once("finish", n));
              t.ended = !0, e.writable = !1;
            }(this, i, n), this;
          }, Object.defineProperty(C.prototype, "writableLength", {
            enumerable: !1,
            get: function () {
              return this._writableState.length;
            }
          }), Object.defineProperty(C.prototype, "destroyed", {
            enumerable: !1,
            get: function () {
              return void 0 !== this._writableState && this._writableState.destroyed;
            },
            set: function (e) {
              this._writableState && (this._writableState.destroyed = e);
            }
          }), C.prototype.destroy = h.destroy, C.prototype._undestroy = h.undestroy, C.prototype._destroy = function (e, t) {
            t(e);
          };
        }).call(this);
      }).call(this, e("_process"), "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {
      "../errors": 55,
      "./_stream_duplex": 56,
      "./internal/streams/destroy": 63,
      "./internal/streams/state": 67,
      "./internal/streams/stream": 68,
      _process: 50,
      buffer: 17,
      inherits: 24,
      "util-deprecate": 78
    }],
    61: [function (e, t, r) {
      (function (r) {
        (function () {
          "use strict";

          var n;
          function i(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
              value: r,
              enumerable: !0,
              configurable: !0,
              writable: !0
            }) : e[t] = r, e;
          }
          var o = e("./end-of-stream"),
            s = Symbol("lastResolve"),
            a = Symbol("lastReject"),
            l = Symbol("error"),
            u = Symbol("ended"),
            c = Symbol("lastPromise"),
            h = Symbol("handlePromise"),
            f = Symbol("stream");
          function p(e, t) {
            return {
              value: e,
              done: t
            };
          }
          function d(e) {
            var t = e[s];
            if (null !== t) {
              var r = e[f].read();
              null !== r && (e[c] = null, e[s] = null, e[a] = null, t(p(r, !1)));
            }
          }
          var g = Object.getPrototypeOf(function () {}),
            y = Object.setPrototypeOf((i(n = {
              get stream() {
                return this[f];
              },
              next: function () {
                var e = this,
                  t = this[l];
                if (null !== t) return Promise.reject(t);
                if (this[u]) return Promise.resolve(p(void 0, !0));
                if (this[f].destroyed) return new Promise(function (t, n) {
                  r.nextTick(function () {
                    e[l] ? n(e[l]) : t(p(void 0, !0));
                  });
                });
                var n,
                  i = this[c];
                if (i) n = new Promise(function (e, t) {
                  return function (r, n) {
                    e.then(function () {
                      t[u] ? r(p(void 0, !0)) : t[h](r, n);
                    }, n);
                  };
                }(i, this));else {
                  var o = this[f].read();
                  if (null !== o) return Promise.resolve(p(o, !1));
                  n = new Promise(this[h]);
                }
                return this[c] = n, n;
              }
            }, Symbol.asyncIterator, function () {
              return this;
            }), i(n, "return", function () {
              var e = this;
              return new Promise(function (t, r) {
                e[f].destroy(null, function (e) {
                  e ? r(e) : t(p(void 0, !0));
                });
              });
            }), n), g);
          t.exports = function (e) {
            var t,
              n = Object.create(y, (i(t = {}, f, {
                value: e,
                writable: !0
              }), i(t, s, {
                value: null,
                writable: !0
              }), i(t, a, {
                value: null,
                writable: !0
              }), i(t, l, {
                value: null,
                writable: !0
              }), i(t, u, {
                value: e._readableState.endEmitted,
                writable: !0
              }), i(t, h, {
                value: function (e, t) {
                  var r = n[f].read();
                  r ? (n[c] = null, n[s] = null, n[a] = null, e(p(r, !1))) : (n[s] = e, n[a] = t);
                },
                writable: !0
              }), t));
            return n[c] = null, o(e, function (e) {
              if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
                var t = n[a];
                return null !== t && (n[c] = null, n[s] = null, n[a] = null, t(e)), void (n[l] = e);
              }
              var r = n[s];
              null !== r && (n[c] = null, n[s] = null, n[a] = null, r(p(void 0, !0))), n[u] = !0;
            }), e.on("readable", function (e) {
              r.nextTick(d, e);
            }.bind(null, n)), n;
          };
        }).call(this);
      }).call(this, e("_process"));
    }, {
      "./end-of-stream": 64,
      _process: 50
    }],
    62: [function (e, t, r) {
      "use strict";

      function n(e, t) {
        var r = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          t && (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })), r.push.apply(r, n);
        }
        return r;
      }
      function i(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e;
      }
      function o(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
        }
      }
      var s = e("buffer").Buffer,
        a = e("util").inspect,
        l = a && a.custom || "inspect";
      t.exports = function () {
        function e() {
          !function (e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
          }(this, e), this.head = null, this.tail = null, this.length = 0;
        }
        var t, r, u;
        return t = e, (r = [{
          key: "push",
          value: function (e) {
            var t = {
              data: e,
              next: null
            };
            this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
          }
        }, {
          key: "unshift",
          value: function (e) {
            var t = {
              data: e,
              next: this.head
            };
            0 === this.length && (this.tail = t), this.head = t, ++this.length;
          }
        }, {
          key: "shift",
          value: function () {
            if (0 !== this.length) {
              var e = this.head.data;
              return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e;
            }
          }
        }, {
          key: "clear",
          value: function () {
            this.head = this.tail = null, this.length = 0;
          }
        }, {
          key: "join",
          value: function (e) {
            if (0 === this.length) return "";
            for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
            return r;
          }
        }, {
          key: "concat",
          value: function (e) {
            if (0 === this.length) return s.alloc(0);
            for (var t, r, n, i = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o;) t = o.data, r = i, n = a, s.prototype.copy.call(t, r, n), a += o.data.length, o = o.next;
            return i;
          }
        }, {
          key: "consume",
          value: function (e, t) {
            var r;
            return e < this.head.data.length ? (r = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), r;
          }
        }, {
          key: "first",
          value: function () {
            return this.head.data;
          }
        }, {
          key: "_getString",
          value: function (e) {
            var t = this.head,
              r = 1,
              n = t.data;
            for (e -= n.length; t = t.next;) {
              var i = t.data,
                o = e > i.length ? i.length : e;
              if (o === i.length ? n += i : n += i.slice(0, e), 0 === (e -= o)) {
                o === i.length ? (++r, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t, t.data = i.slice(o));
                break;
              }
              ++r;
            }
            return this.length -= r, n;
          }
        }, {
          key: "_getBuffer",
          value: function (e) {
            var t = s.allocUnsafe(e),
              r = this.head,
              n = 1;
            for (r.data.copy(t), e -= r.data.length; r = r.next;) {
              var i = r.data,
                o = e > i.length ? i.length : e;
              if (i.copy(t, t.length - e, 0, o), 0 === (e -= o)) {
                o === i.length ? (++n, r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r, r.data = i.slice(o));
                break;
              }
              ++n;
            }
            return this.length -= n, t;
          }
        }, {
          key: l,
          value: function (e, t) {
            return a(this, function (e) {
              for (var t = 1; t < arguments.length; t++) {
                var r = null != arguments[t] ? arguments[t] : {};
                t % 2 ? n(Object(r), !0).forEach(function (t) {
                  i(e, t, r[t]);
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
                });
              }
              return e;
            }({}, t, {
              depth: 0,
              customInspect: !1
            }));
          }
        }]) && o(t.prototype, r), u && o(t, u), e;
      }();
    }, {
      buffer: 17,
      util: 16
    }],
    63: [function (e, t, r) {
      (function (e) {
        (function () {
          "use strict";

          function r(e, t) {
            i(e, t), n(e);
          }
          function n(e) {
            e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close");
          }
          function i(e, t) {
            e.emit("error", t);
          }
          t.exports = {
            destroy: function (t, o) {
              var s = this,
                a = this._readableState && this._readableState.destroyed,
                l = this._writableState && this._writableState.destroyed;
              return a || l ? (o ? o(t) : t && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, e.nextTick(i, this, t)) : e.nextTick(i, this, t)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(t || null, function (t) {
                !o && t ? s._writableState ? s._writableState.errorEmitted ? e.nextTick(n, s) : (s._writableState.errorEmitted = !0, e.nextTick(r, s, t)) : e.nextTick(r, s, t) : o ? (e.nextTick(n, s), o(t)) : e.nextTick(n, s);
              }), this);
            },
            undestroy: function () {
              this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
            },
            errorOrDestroy: function (e, t) {
              var r = e._readableState,
                n = e._writableState;
              r && r.autoDestroy || n && n.autoDestroy ? e.destroy(t) : e.emit("error", t);
            }
          };
        }).call(this);
      }).call(this, e("_process"));
    }, {
      _process: 50
    }],
    64: [function (e, t, r) {
      "use strict";

      var n = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
      function i() {}
      t.exports = function e(t, r, o) {
        if ("function" == typeof r) return e(t, null, r);
        r || (r = {}), o = function (e) {
          var t = !1;
          return function () {
            if (!t) {
              t = !0;
              for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) n[i] = arguments[i];
              e.apply(this, n);
            }
          };
        }(o || i);
        var s = r.readable || !1 !== r.readable && t.readable,
          a = r.writable || !1 !== r.writable && t.writable,
          l = function () {
            t.writable || c();
          },
          u = t._writableState && t._writableState.finished,
          c = function () {
            a = !1, u = !0, s || o.call(t);
          },
          h = t._readableState && t._readableState.endEmitted,
          f = function () {
            s = !1, h = !0, a || o.call(t);
          },
          p = function (e) {
            o.call(t, e);
          },
          d = function () {
            var e;
            return s && !h ? (t._readableState && t._readableState.ended || (e = new n()), o.call(t, e)) : a && !u ? (t._writableState && t._writableState.ended || (e = new n()), o.call(t, e)) : void 0;
          },
          g = function () {
            t.req.on("finish", c);
          };
        return function (e) {
          return e.setHeader && "function" == typeof e.abort;
        }(t) ? (t.on("complete", c), t.on("abort", d), t.req ? g() : t.on("request", g)) : a && !t._writableState && (t.on("end", l), t.on("close", l)), t.on("end", f), t.on("finish", c), !1 !== r.error && t.on("error", p), t.on("close", d), function () {
          t.removeListener("complete", c), t.removeListener("abort", d), t.removeListener("request", g), t.req && t.req.removeListener("finish", c), t.removeListener("end", l), t.removeListener("close", l), t.removeListener("finish", c), t.removeListener("end", f), t.removeListener("error", p), t.removeListener("close", d);
        };
      };
    }, {
      "../../../errors": 55
    }],
    65: [function (e, t, r) {
      t.exports = function () {
        throw new Error("Readable.from is not available in the browser");
      };
    }, {}],
    66: [function (e, t, r) {
      "use strict";

      var n;
      var i = e("../../../errors").codes,
        o = i.ERR_MISSING_ARGS,
        s = i.ERR_STREAM_DESTROYED;
      function a(e) {
        if (e) throw e;
      }
      function l(e) {
        e();
      }
      function u(e, t) {
        return e.pipe(t);
      }
      t.exports = function () {
        for (var t = arguments.length, r = new Array(t), i = 0; i < t; i++) r[i] = arguments[i];
        var c,
          h = function (e) {
            return e.length ? "function" != typeof e[e.length - 1] ? a : e.pop() : a;
          }(r);
        if (Array.isArray(r[0]) && (r = r[0]), r.length < 2) throw new o("streams");
        var f = r.map(function (t, i) {
          var o = i < r.length - 1;
          return function (t, r, i, o) {
            o = function (e) {
              var t = !1;
              return function () {
                t || (t = !0, e.apply(void 0, arguments));
              };
            }(o);
            var a = !1;
            t.on("close", function () {
              a = !0;
            }), void 0 === n && (n = e("./end-of-stream")), n(t, {
              readable: r,
              writable: i
            }, function (e) {
              if (e) return o(e);
              a = !0, o();
            });
            var l = !1;
            return function (e) {
              if (!a && !l) return l = !0, function (e) {
                return e.setHeader && "function" == typeof e.abort;
              }(t) ? t.abort() : "function" == typeof t.destroy ? t.destroy() : void o(e || new s("pipe"));
            };
          }(t, o, i > 0, function (e) {
            c || (c = e), e && f.forEach(l), o || (f.forEach(l), h(c));
          });
        });
        return r.reduce(u);
      };
    }, {
      "../../../errors": 55,
      "./end-of-stream": 64
    }],
    67: [function (e, t, r) {
      "use strict";

      var n = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
      t.exports = {
        getHighWaterMark: function (e, t, r, i) {
          var o = function (e, t, r) {
            return null != e.highWaterMark ? e.highWaterMark : t ? e[r] : null;
          }(t, i, r);
          if (null != o) {
            if (!isFinite(o) || Math.floor(o) !== o || o < 0) throw new n(i ? r : "highWaterMark", o);
            return Math.floor(o);
          }
          return e.objectMode ? 16 : 16384;
        }
      };
    }, {
      "../../../errors": 55
    }],
    68: [function (e, t, r) {
      t.exports = e("events").EventEmitter;
    }, {
      events: 22
    }],
    69: [function (e, t, r) {
      (r = t.exports = e("./lib/_stream_readable.js")).Stream = r, r.Readable = r, r.Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), r.finished = e("./lib/internal/streams/end-of-stream.js"), r.pipeline = e("./lib/internal/streams/pipeline.js");
    }, {
      "./lib/_stream_duplex.js": 56,
      "./lib/_stream_passthrough.js": 57,
      "./lib/_stream_readable.js": 58,
      "./lib/_stream_transform.js": 59,
      "./lib/_stream_writable.js": 60,
      "./lib/internal/streams/end-of-stream.js": 64,
      "./lib/internal/streams/pipeline.js": 66
    }],
    70: [function (e, t, r) {
      "use strict";

      t.exports = function () {
        if ("function" != typeof arguments[0]) throw new Error("callback needed");
        if ("number" != typeof arguments[1]) throw new Error("interval needed");
        var e;
        if (arguments.length > 0) {
          e = new Array(arguments.length - 2);
          for (var t = 0; t < e.length; t++) e[t] = arguments[t + 2];
        }
        return new function (e, t, r) {
          var n = this;
          this._callback = e, this._args = r, this._interval = setInterval(e, t, this._args), this.reschedule = function (e) {
            e || (e = n._interval), n._interval && clearInterval(n._interval), n._interval = setInterval(n._callback, e, n._args);
          }, this.clear = function () {
            n._interval && (clearInterval(n._interval), n._interval = void 0);
          }, this.destroy = function () {
            n._interval && clearInterval(n._interval), n._callback = void 0, n._interval = void 0, n._args = void 0;
          };
        }(arguments[0], arguments[1], e);
      };
    }, {}],
    71: [function (e, t, r) {
      "use strict";

      t.exports = e("./index.js")();
    }, {
      "./index.js": 72
    }],
    72: [function (e, t, r) {
      (function (e) {
        (function () {
          "use strict";

          function r(t) {
            return t instanceof e ? e.from(t) : new t.constructor(t.buffer.slice(), t.byteOffset, t.length);
          }
          t.exports = function (e) {
            return (e = e || {}).circles ? function (e) {
              var t = [],
                n = [];
              return e.proto ? function e(o) {
                if ("object" != typeof o || null === o) return o;
                if (o instanceof Date) return new Date(o);
                if (Array.isArray(o)) return i(o, e);
                if (o instanceof Map) return new Map(i(Array.from(o), e));
                if (o instanceof Set) return new Set(i(Array.from(o), e));
                var s = {};
                for (var a in t.push(o), n.push(s), o) {
                  var l = o[a];
                  if ("object" != typeof l || null === l) s[a] = l;else if (l instanceof Date) s[a] = new Date(l);else if (l instanceof Map) s[a] = new Map(i(Array.from(l), e));else if (l instanceof Set) s[a] = new Set(i(Array.from(l), e));else if (ArrayBuffer.isView(l)) s[a] = r(l);else {
                    var u = t.indexOf(l);
                    s[a] = -1 !== u ? n[u] : e(l);
                  }
                }
                return t.pop(), n.pop(), s;
              } : function e(o) {
                if ("object" != typeof o || null === o) return o;
                if (o instanceof Date) return new Date(o);
                if (Array.isArray(o)) return i(o, e);
                if (o instanceof Map) return new Map(i(Array.from(o), e));
                if (o instanceof Set) return new Set(i(Array.from(o), e));
                var s = {};
                for (var a in t.push(o), n.push(s), o) if (!1 !== Object.hasOwnProperty.call(o, a)) {
                  var l = o[a];
                  if ("object" != typeof l || null === l) s[a] = l;else if (l instanceof Date) s[a] = new Date(l);else if (l instanceof Map) s[a] = new Map(i(Array.from(l), e));else if (l instanceof Set) s[a] = new Set(i(Array.from(l), e));else if (ArrayBuffer.isView(l)) s[a] = r(l);else {
                    var u = t.indexOf(l);
                    s[a] = -1 !== u ? n[u] : e(l);
                  }
                }
                return t.pop(), n.pop(), s;
              };
              function i(e, i) {
                for (var o = Object.keys(e), s = new Array(o.length), a = 0; a < o.length; a++) {
                  var l = o[a],
                    u = e[l];
                  if ("object" != typeof u || null === u) s[l] = u;else if (u instanceof Date) s[l] = new Date(u);else if (ArrayBuffer.isView(u)) s[l] = r(u);else {
                    var c = t.indexOf(u);
                    s[l] = -1 !== c ? n[c] : i(u);
                  }
                }
                return s;
              }
            }(e) : e.proto ? function e(n) {
              if ("object" != typeof n || null === n) return n;
              if (n instanceof Date) return new Date(n);
              if (Array.isArray(n)) return t(n, e);
              if (n instanceof Map) return new Map(t(Array.from(n), e));
              if (n instanceof Set) return new Set(t(Array.from(n), e));
              var i = {};
              for (var o in n) {
                var s = n[o];
                "object" != typeof s || null === s ? i[o] = s : s instanceof Date ? i[o] = new Date(s) : s instanceof Map ? i[o] = new Map(t(Array.from(s), e)) : s instanceof Set ? i[o] = new Set(t(Array.from(s), e)) : ArrayBuffer.isView(s) ? i[o] = r(s) : i[o] = e(s);
              }
              return i;
            } : function e(n) {
              if ("object" != typeof n || null === n) return n;
              if (n instanceof Date) return new Date(n);
              if (Array.isArray(n)) return t(n, e);
              if (n instanceof Map) return new Map(t(Array.from(n), e));
              if (n instanceof Set) return new Set(t(Array.from(n), e));
              var i = {};
              for (var o in n) if (!1 !== Object.hasOwnProperty.call(n, o)) {
                var s = n[o];
                "object" != typeof s || null === s ? i[o] = s : s instanceof Date ? i[o] = new Date(s) : s instanceof Map ? i[o] = new Map(t(Array.from(s), e)) : s instanceof Set ? i[o] = new Set(t(Array.from(s), e)) : ArrayBuffer.isView(s) ? i[o] = r(s) : i[o] = e(s);
              }
              return i;
            };
            function t(e, t) {
              for (var n = Object.keys(e), i = new Array(n.length), o = 0; o < n.length; o++) {
                var s = n[o],
                  a = e[s];
                "object" != typeof a || null === a ? i[s] = a : a instanceof Date ? i[s] = new Date(a) : ArrayBuffer.isView(a) ? i[s] = r(a) : i[s] = t(a);
              }
              return i;
            }
          };
        }).call(this);
      }).call(this, e("buffer").Buffer);
    }, {
      buffer: 17
    }],
    73: [function (e, t, r) {
      var n = e("buffer"),
        i = n.Buffer;
      function o(e, t) {
        for (var r in e) t[r] = e[r];
      }
      function s(e, t, r) {
        return i(e, t, r);
      }
      i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow ? t.exports = n : (o(n, r), r.Buffer = s), s.prototype = Object.create(i.prototype), o(i, s), s.from = function (e, t, r) {
        if ("number" == typeof e) throw new TypeError("Argument must not be a number");
        return i(e, t, r);
      }, s.alloc = function (e, t, r) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        var n = i(e);
        return void 0 !== t ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0), n;
      }, s.allocUnsafe = function (e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return i(e);
      }, s.allocUnsafeSlow = function (e) {
        if ("number" != typeof e) throw new TypeError("Argument must be a number");
        return n.SlowBuffer(e);
      };
    }, {
      buffer: 17
    }],
    74: [function (e, t, r) {
      t.exports = function (e) {
        var t = e._readableState;
        return t ? t.objectMode || "number" == typeof e._duplexState ? e.read() : e.read((r = t, r.buffer.length ? r.buffer.head ? r.buffer.head.data.length : r.buffer[0].length : r.length)) : null;
        var r;
      };
    }, {}],
    75: [function (e, t, r) {
      "use strict";

      var n = e("safe-buffer").Buffer,
        i = n.isEncoding || function (e) {
          switch ((e = "" + e) && e.toLowerCase()) {
            case "hex":
            case "utf8":
            case "utf-8":
            case "ascii":
            case "binary":
            case "base64":
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
            case "raw":
              return !0;
            default:
              return !1;
          }
        };
      function o(e) {
        var t;
        switch (this.encoding = function (e) {
          var t = function (e) {
            if (!e) return "utf8";
            for (var t;;) switch (e) {
              case "utf8":
              case "utf-8":
                return "utf8";
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return "utf16le";
              case "latin1":
              case "binary":
                return "latin1";
              case "base64":
              case "ascii":
              case "hex":
                return e;
              default:
                if (t) return;
                e = ("" + e).toLowerCase(), t = !0;
            }
          }(e);
          if ("string" != typeof t && (n.isEncoding === i || !i(e))) throw new Error("Unknown encoding: " + e);
          return t || e;
        }(e), this.encoding) {
          case "utf16le":
            this.text = l, this.end = u, t = 4;
            break;
          case "utf8":
            this.fillLast = a, t = 4;
            break;
          case "base64":
            this.text = c, this.end = h, t = 3;
            break;
          default:
            return this.write = f, void (this.end = p);
        }
        this.lastNeed = 0, this.lastTotal = 0, this.lastChar = n.allocUnsafe(t);
      }
      function s(e) {
        return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
      }
      function a(e) {
        var t = this.lastTotal - this.lastNeed,
          r = function (e, t, r) {
            if (128 != (192 & t[0])) return e.lastNeed = 0, "�";
            if (e.lastNeed > 1 && t.length > 1) {
              if (128 != (192 & t[1])) return e.lastNeed = 1, "�";
              if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) return e.lastNeed = 2, "�";
            }
          }(this, e);
        return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length));
      }
      function l(e, t) {
        if ((e.length - t) % 2 == 0) {
          var r = e.toString("utf16le", t);
          if (r) {
            var n = r.charCodeAt(r.length - 1);
            if (n >= 55296 && n <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1);
          }
          return r;
        }
        return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
      }
      function u(e) {
        var t = e && e.length ? this.write(e) : "";
        if (this.lastNeed) {
          var r = this.lastTotal - this.lastNeed;
          return t + this.lastChar.toString("utf16le", 0, r);
        }
        return t;
      }
      function c(e, t) {
        var r = (e.length - t) % 3;
        return 0 === r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 === r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r));
      }
      function h(e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
      }
      function f(e) {
        return e.toString(this.encoding);
      }
      function p(e) {
        return e && e.length ? this.write(e) : "";
      }
      r.StringDecoder = o, o.prototype.write = function (e) {
        if (0 === e.length) return "";
        var t, r;
        if (this.lastNeed) {
          if (void 0 === (t = this.fillLast(e))) return "";
          r = this.lastNeed, this.lastNeed = 0;
        } else r = 0;
        return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
      }, o.prototype.end = function (e) {
        var t = e && e.length ? this.write(e) : "";
        return this.lastNeed ? t + "�" : t;
      }, o.prototype.text = function (e, t) {
        var r = function (e, t, r) {
          var n = t.length - 1;
          if (n < r) return 0;
          var i = s(t[n]);
          if (i >= 0) return i > 0 && (e.lastNeed = i - 1), i;
          if (--n < r || -2 === i) return 0;
          if ((i = s(t[n])) >= 0) return i > 0 && (e.lastNeed = i - 2), i;
          if (--n < r || -2 === i) return 0;
          if ((i = s(t[n])) >= 0) return i > 0 && (2 === i ? i = 0 : e.lastNeed = i - 3), i;
          return 0;
        }(this, e, t);
        if (!this.lastNeed) return e.toString("utf8", t);
        this.lastTotal = r;
        var n = e.length - (r - this.lastNeed);
        return e.copy(this.lastChar, 0, n), e.toString("utf8", t, n);
      }, o.prototype.fillLast = function (e) {
        if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
        e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length;
      };
    }, {
      "safe-buffer": 73
    }],
    76: [function (e, t, r) {
      "use strict";

      var n = e("punycode"),
        i = e("./util");
      function o() {
        this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
      }
      r.parse = v, r.resolve = function (e, t) {
        return v(e, !1, !0).resolve(t);
      }, r.resolveObject = function (e, t) {
        return e ? v(e, !1, !0).resolveObject(t) : t;
      }, r.format = function (e) {
        i.isString(e) && (e = v(e));
        return e instanceof o ? e.format() : o.prototype.format.call(e);
      }, r.Url = o;
      var s = /^([a-z0-9.+-]+:)/i,
        a = /:[0-9]*$/,
        l = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
        u = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"]),
        c = ["'"].concat(u),
        h = ["%", "/", "?", ";", "#"].concat(c),
        f = ["/", "?", "#"],
        p = /^[+a-z0-9A-Z_-]{0,63}$/,
        d = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
        g = {
          javascript: !0,
          "javascript:": !0
        },
        y = {
          javascript: !0,
          "javascript:": !0
        },
        b = {
          http: !0,
          https: !0,
          ftp: !0,
          gopher: !0,
          file: !0,
          "http:": !0,
          "https:": !0,
          "ftp:": !0,
          "gopher:": !0,
          "file:": !0
        },
        m = e("querystring");
      function v(e, t, r) {
        if (e && i.isObject(e) && e instanceof o) return e;
        var n = new o();
        return n.parse(e, t, r), n;
      }
      o.prototype.parse = function (e, t, r) {
        if (!i.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
        var o = e.indexOf("?"),
          a = -1 !== o && o < e.indexOf("#") ? "?" : "#",
          u = e.split(a);
        u[0] = u[0].replace(/\\/g, "/");
        var v = e = u.join(a);
        if (v = v.trim(), !r && 1 === e.split("#").length) {
          var w = l.exec(v);
          if (w) return this.path = v, this.href = v, this.pathname = w[1], w[2] ? (this.search = w[2], this.query = t ? m.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this;
        }
        var _ = s.exec(v);
        if (_) {
          var k = (_ = _[0]).toLowerCase();
          this.protocol = k, v = v.substr(_.length);
        }
        if (r || _ || v.match(/^\/\/[^@\/]+@[^@\/]+/)) {
          var S = "//" === v.substr(0, 2);
          !S || _ && y[_] || (v = v.substr(2), this.slashes = !0);
        }
        if (!y[_] && (S || _ && !b[_])) {
          for (var E, C, T = -1, x = 0; x < f.length; x++) {
            -1 !== (A = v.indexOf(f[x])) && (-1 === T || A < T) && (T = A);
          }
          -1 !== (C = -1 === T ? v.lastIndexOf("@") : v.lastIndexOf("@", T)) && (E = v.slice(0, C), v = v.slice(C + 1), this.auth = decodeURIComponent(E)), T = -1;
          for (x = 0; x < h.length; x++) {
            var A;
            -1 !== (A = v.indexOf(h[x])) && (-1 === T || A < T) && (T = A);
          }
          -1 === T && (T = v.length), this.host = v.slice(0, T), v = v.slice(T), this.parseHost(), this.hostname = this.hostname || "";
          var I = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
          if (!I) for (var P = this.hostname.split(/\./), O = (x = 0, P.length); x < O; x++) {
            var B = P[x];
            if (B && !B.match(p)) {
              for (var R = "", M = 0, N = B.length; M < N; M++) B.charCodeAt(M) > 127 ? R += "x" : R += B[M];
              if (!R.match(p)) {
                var L = P.slice(0, x),
                  j = P.slice(x + 1),
                  U = B.match(d);
                U && (L.push(U[1]), j.unshift(U[2])), j.length && (v = "/" + j.join(".") + v), this.hostname = L.join(".");
                break;
              }
            }
          }
          this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), I || (this.hostname = n.toASCII(this.hostname));
          var q = this.port ? ":" + this.port : "",
            D = this.hostname || "";
          this.host = D + q, this.href += this.host, I && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== v[0] && (v = "/" + v));
        }
        if (!g[k]) for (x = 0, O = c.length; x < O; x++) {
          var z = c[x];
          if (-1 !== v.indexOf(z)) {
            var F = encodeURIComponent(z);
            F === z && (F = escape(z)), v = v.split(z).join(F);
          }
        }
        var V = v.indexOf("#");
        -1 !== V && (this.hash = v.substr(V), v = v.slice(0, V));
        var H = v.indexOf("?");
        if (-1 !== H ? (this.search = v.substr(H), this.query = v.substr(H + 1), t && (this.query = m.parse(this.query)), v = v.slice(0, H)) : t && (this.search = "", this.query = {}), v && (this.pathname = v), b[k] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
          q = this.pathname || "";
          var W = this.search || "";
          this.path = q + W;
        }
        return this.href = this.format(), this;
      }, o.prototype.format = function () {
        var e = this.auth || "";
        e && (e = (e = encodeURIComponent(e)).replace(/%3A/i, ":"), e += "@");
        var t = this.protocol || "",
          r = this.pathname || "",
          n = this.hash || "",
          o = !1,
          s = "";
        this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && i.isObject(this.query) && Object.keys(this.query).length && (s = m.stringify(this.query));
        var a = this.search || s && "?" + s || "";
        return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || b[t]) && !1 !== o ? (o = "//" + (o || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : o || (o = ""), n && "#" !== n.charAt(0) && (n = "#" + n), a && "?" !== a.charAt(0) && (a = "?" + a), t + o + (r = r.replace(/[?#]/g, function (e) {
          return encodeURIComponent(e);
        })) + (a = a.replace("#", "%23")) + n;
      }, o.prototype.resolve = function (e) {
        return this.resolveObject(v(e, !1, !0)).format();
      }, o.prototype.resolveObject = function (e) {
        if (i.isString(e)) {
          var t = new o();
          t.parse(e, !1, !0), e = t;
        }
        for (var r = new o(), n = Object.keys(this), s = 0; s < n.length; s++) {
          var a = n[s];
          r[a] = this[a];
        }
        if (r.hash = e.hash, "" === e.href) return r.href = r.format(), r;
        if (e.slashes && !e.protocol) {
          for (var l = Object.keys(e), u = 0; u < l.length; u++) {
            var c = l[u];
            "protocol" !== c && (r[c] = e[c]);
          }
          return b[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r;
        }
        if (e.protocol && e.protocol !== r.protocol) {
          if (!b[e.protocol]) {
            for (var h = Object.keys(e), f = 0; f < h.length; f++) {
              var p = h[f];
              r[p] = e[p];
            }
            return r.href = r.format(), r;
          }
          if (r.protocol = e.protocol, e.host || y[e.protocol]) r.pathname = e.pathname;else {
            for (var d = (e.pathname || "").split("/"); d.length && !(e.host = d.shift()););
            e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== d[0] && d.unshift(""), d.length < 2 && d.unshift(""), r.pathname = d.join("/");
          }
          if (r.search = e.search, r.query = e.query, r.host = e.host || "", r.auth = e.auth, r.hostname = e.hostname || e.host, r.port = e.port, r.pathname || r.search) {
            var g = r.pathname || "",
              m = r.search || "";
            r.path = g + m;
          }
          return r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
        }
        var v = r.pathname && "/" === r.pathname.charAt(0),
          w = e.host || e.pathname && "/" === e.pathname.charAt(0),
          _ = w || v || r.host && e.pathname,
          k = _,
          S = r.pathname && r.pathname.split("/") || [],
          E = (d = e.pathname && e.pathname.split("/") || [], r.protocol && !b[r.protocol]);
        if (E && (r.hostname = "", r.port = null, r.host && ("" === S[0] ? S[0] = r.host : S.unshift(r.host)), r.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === d[0] ? d[0] = e.host : d.unshift(e.host)), e.host = null), _ = _ && ("" === d[0] || "" === S[0])), w) r.host = e.host || "" === e.host ? e.host : r.host, r.hostname = e.hostname || "" === e.hostname ? e.hostname : r.hostname, r.search = e.search, r.query = e.query, S = d;else if (d.length) S || (S = []), S.pop(), S = S.concat(d), r.search = e.search, r.query = e.query;else if (!i.isNullOrUndefined(e.search)) {
          if (E) r.hostname = r.host = S.shift(), (I = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = I.shift(), r.host = r.hostname = I.shift());
          return r.search = e.search, r.query = e.query, i.isNull(r.pathname) && i.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r;
        }
        if (!S.length) return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r;
        for (var C = S.slice(-1)[0], T = (r.host || e.host || S.length > 1) && ("." === C || ".." === C) || "" === C, x = 0, A = S.length; A >= 0; A--) "." === (C = S[A]) ? S.splice(A, 1) : ".." === C ? (S.splice(A, 1), x++) : x && (S.splice(A, 1), x--);
        if (!_ && !k) for (; x--; x) S.unshift("..");
        !_ || "" === S[0] || S[0] && "/" === S[0].charAt(0) || S.unshift(""), T && "/" !== S.join("/").substr(-1) && S.push("");
        var I,
          P = "" === S[0] || S[0] && "/" === S[0].charAt(0);
        E && (r.hostname = r.host = P ? "" : S.length ? S.shift() : "", (I = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@")) && (r.auth = I.shift(), r.host = r.hostname = I.shift()));
        return (_ = _ || r.host && S.length) && !P && S.unshift(""), S.length ? r.pathname = S.join("/") : (r.pathname = null, r.path = null), i.isNull(r.pathname) && i.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = e.auth || r.auth, r.slashes = r.slashes || e.slashes, r.href = r.format(), r;
      }, o.prototype.parseHost = function () {
        var e = this.host,
          t = a.exec(e);
        t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
      };
    }, {
      "./util": 77,
      punycode: 51,
      querystring: 54
    }],
    77: [function (e, t, r) {
      "use strict";

      t.exports = {
        isString: function (e) {
          return "string" == typeof e;
        },
        isObject: function (e) {
          return "object" == typeof e && null !== e;
        },
        isNull: function (e) {
          return null === e;
        },
        isNullOrUndefined: function (e) {
          return null == e;
        }
      };
    }, {}],
    78: [function (e, t, r) {
      (function (e) {
        (function () {
          function r(t) {
            try {
              if (!e.localStorage) return !1;
            } catch (e) {
              return !1;
            }
            var r = e.localStorage[t];
            return null != r && "true" === String(r).toLowerCase();
          }
          t.exports = function (e, t) {
            if (r("noDeprecation")) return e;
            var n = !1;
            return function () {
              if (!n) {
                if (r("throwDeprecation")) throw new Error(t);
                r("traceDeprecation") ? console.trace(t) : console.warn(t), n = !0;
              }
              return e.apply(this, arguments);
            };
          };
        }).call(this);
      }).call(this, "undefined" != typeof __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    79: [function (e, t, r) {
      t.exports = function e(t, r) {
        if (t && r) return e(t)(r);
        if ("function" != typeof t) throw new TypeError("need wrapper function");
        Object.keys(t).forEach(function (e) {
          n[e] = t[e];
        });
        return n;
        function n() {
          for (var e = new Array(arguments.length), r = 0; r < e.length; r++) e[r] = arguments[r];
          var n = t.apply(this, e),
            i = e[e.length - 1];
          return "function" == typeof n && n !== i && Object.keys(i).forEach(function (e) {
            n[e] = i[e];
          }), n;
        }
      };
    }, {}],
    80: [function (e, t, r) {
      "use strict";

      t.exports = function () {
        throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
      };
    }, {}],
    81: [function (e, t, r) {
      t.exports = function () {
        for (var e = {}, t = 0; t < arguments.length; t++) {
          var r = arguments[t];
          for (var i in r) n.call(r, i) && (e[i] = r[i]);
        }
        return e;
      };
      var n = Object.prototype.hasOwnProperty;
    }, {}],
    82: [function (e, t, r) {
      "use strict";

      t.exports = function (e) {
        e.prototype[Symbol.iterator] = function* () {
          for (let e = this.head; e; e = e.next) yield e.value;
        };
      };
    }, {}],
    83: [function (e, t, r) {
      "use strict";

      function n(e) {
        var t = this;
        if (t instanceof n || (t = new n()), t.tail = null, t.head = null, t.length = 0, e && "function" == typeof e.forEach) e.forEach(function (e) {
          t.push(e);
        });else if (arguments.length > 0) for (var r = 0, i = arguments.length; r < i; r++) t.push(arguments[r]);
        return t;
      }
      function i(e, t, r) {
        var n = t === e.head ? new a(r, null, t, e) : new a(r, t, t.next, e);
        return null === n.next && (e.tail = n), null === n.prev && (e.head = n), e.length++, n;
      }
      function o(e, t) {
        e.tail = new a(t, e.tail, null, e), e.head || (e.head = e.tail), e.length++;
      }
      function s(e, t) {
        e.head = new a(t, null, e.head, e), e.tail || (e.tail = e.head), e.length++;
      }
      function a(e, t, r, n) {
        if (!(this instanceof a)) return new a(e, t, r, n);
        this.list = n, this.value = e, t ? (t.next = this, this.prev = t) : this.prev = null, r ? (r.prev = this, this.next = r) : this.next = null;
      }
      t.exports = n, n.Node = a, n.create = n, n.prototype.removeNode = function (e) {
        if (e.list !== this) throw new Error("removing node which does not belong to this list");
        var t = e.next,
          r = e.prev;
        return t && (t.prev = r), r && (r.next = t), e === this.head && (this.head = t), e === this.tail && (this.tail = r), e.list.length--, e.next = null, e.prev = null, e.list = null, t;
      }, n.prototype.unshiftNode = function (e) {
        if (e !== this.head) {
          e.list && e.list.removeNode(e);
          var t = this.head;
          e.list = this, e.next = t, t && (t.prev = e), this.head = e, this.tail || (this.tail = e), this.length++;
        }
      }, n.prototype.pushNode = function (e) {
        if (e !== this.tail) {
          e.list && e.list.removeNode(e);
          var t = this.tail;
          e.list = this, e.prev = t, t && (t.next = e), this.tail = e, this.head || (this.head = e), this.length++;
        }
      }, n.prototype.push = function () {
        for (var e = 0, t = arguments.length; e < t; e++) o(this, arguments[e]);
        return this.length;
      }, n.prototype.unshift = function () {
        for (var e = 0, t = arguments.length; e < t; e++) s(this, arguments[e]);
        return this.length;
      }, n.prototype.pop = function () {
        if (this.tail) {
          var e = this.tail.value;
          return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, this.length--, e;
        }
      }, n.prototype.shift = function () {
        if (this.head) {
          var e = this.head.value;
          return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, this.length--, e;
        }
      }, n.prototype.forEach = function (e, t) {
        t = t || this;
        for (var r = this.head, n = 0; null !== r; n++) e.call(t, r.value, n, this), r = r.next;
      }, n.prototype.forEachReverse = function (e, t) {
        t = t || this;
        for (var r = this.tail, n = this.length - 1; null !== r; n--) e.call(t, r.value, n, this), r = r.prev;
      }, n.prototype.get = function (e) {
        for (var t = 0, r = this.head; null !== r && t < e; t++) r = r.next;
        if (t === e && null !== r) return r.value;
      }, n.prototype.getReverse = function (e) {
        for (var t = 0, r = this.tail; null !== r && t < e; t++) r = r.prev;
        if (t === e && null !== r) return r.value;
      }, n.prototype.map = function (e, t) {
        t = t || this;
        for (var r = new n(), i = this.head; null !== i;) r.push(e.call(t, i.value, this)), i = i.next;
        return r;
      }, n.prototype.mapReverse = function (e, t) {
        t = t || this;
        for (var r = new n(), i = this.tail; null !== i;) r.push(e.call(t, i.value, this)), i = i.prev;
        return r;
      }, n.prototype.reduce = function (e, t) {
        var r,
          n = this.head;
        if (arguments.length > 1) r = t;else {
          if (!this.head) throw new TypeError("Reduce of empty list with no initial value");
          n = this.head.next, r = this.head.value;
        }
        for (var i = 0; null !== n; i++) r = e(r, n.value, i), n = n.next;
        return r;
      }, n.prototype.reduceReverse = function (e, t) {
        var r,
          n = this.tail;
        if (arguments.length > 1) r = t;else {
          if (!this.tail) throw new TypeError("Reduce of empty list with no initial value");
          n = this.tail.prev, r = this.tail.value;
        }
        for (var i = this.length - 1; null !== n; i--) r = e(r, n.value, i), n = n.prev;
        return r;
      }, n.prototype.toArray = function () {
        for (var e = new Array(this.length), t = 0, r = this.head; null !== r; t++) e[t] = r.value, r = r.next;
        return e;
      }, n.prototype.toArrayReverse = function () {
        for (var e = new Array(this.length), t = 0, r = this.tail; null !== r; t++) e[t] = r.value, r = r.prev;
        return e;
      }, n.prototype.slice = function (e, t) {
        (t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length);
        var r = new n();
        if (t < e || t < 0) return r;
        e < 0 && (e = 0), t > this.length && (t = this.length);
        for (var i = 0, o = this.head; null !== o && i < e; i++) o = o.next;
        for (; null !== o && i < t; i++, o = o.next) r.push(o.value);
        return r;
      }, n.prototype.sliceReverse = function (e, t) {
        (t = t || this.length) < 0 && (t += this.length), (e = e || 0) < 0 && (e += this.length);
        var r = new n();
        if (t < e || t < 0) return r;
        e < 0 && (e = 0), t > this.length && (t = this.length);
        for (var i = this.length, o = this.tail; null !== o && i > t; i--) o = o.prev;
        for (; null !== o && i > e; i--, o = o.prev) r.push(o.value);
        return r;
      }, n.prototype.splice = function (e, t, ...r) {
        e > this.length && (e = this.length - 1), e < 0 && (e = this.length + e);
        for (var n = 0, o = this.head; null !== o && n < e; n++) o = o.next;
        var s = [];
        for (n = 0; o && n < t; n++) s.push(o.value), o = this.removeNode(o);
        null === o && (o = this.tail), o !== this.head && o !== this.tail && (o = o.prev);
        for (n = 0; n < r.length; n++) o = i(this, o, r[n]);
        return s;
      }, n.prototype.reverse = function () {
        for (var e = this.head, t = this.tail, r = e; null !== r; r = r.prev) {
          var n = r.prev;
          r.prev = r.next, r.next = n;
        }
        return this.head = t, this.tail = e, this;
      };
      try {
        e("./iterator.js")(n);
      } catch (e) {}
    }, {
      "./iterator.js": 82
    }]
  }, {}, [12])(12);
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

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
;// CONCATENATED MODULE: ../../osh-js/source/core/event/EventType.js
const EventType = {
  DATA: 'data',
  LAST_TIME: 'last-time',
  MASTER_TIME: 'master-time',
  STATUS: 'status',
  TIME_CHANGED: 'time-changed',
  CLOSED: 'closed'
};
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/common/handler/DataSource.handler.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/




class DataSourceHandler {
  constructor() {
    this.context = undefined;
    this.topic = undefined;
    this.broadcastChannel = undefined;
    this.values = [];
    // this.version = -Number.MAX_SAFE_INTEGER;
    this.version = 0;
    this.properties = {
      batchSize: 1
    };
    this.initialized = false;
  }
  createContext(properties) {
    throw Error('Should be overridden');
  }
  async init(properties, topics, dataSourceId) {
    this.dataSourceId = dataSourceId;
    this.properties = {
      ...this.properties,
      ...properties
    };
    this.setTopics(topics);
    this.context = this.createContext(properties);
    this.context.onChangeStatus = this.onChangeStatus.bind(this);
    this.context.handleData = this.handleData.bind(this); // bind context to handler
    await this.context.init(this.properties);
    this.initialized = true;
  }

  /**
   * Sets the current topic to listen
   * @param {Object} topics - the topics to listen
   * @param {String} topics.data - the topic to listen
   */
  setTopics(topics) {
    const topic = topics.data;
    if (this.topic === topic) {
      return;
    }
    if (isDefined(this.broadcastChannel)) {
      console.warn(`Replace old topic ${this.topic} by ${topic}`);
      this.broadcastChannel.close();
    }
    this.broadcastChannel = new BroadcastChannel(topic);
    this.topic = topic;
  }

  /**
   * Send a change status event into the broadcast channel
   * @param {Status} status - the new status
   */
  onChangeStatus(status) {
    if (status === Status.DISCONNECTED) {
      this.flushAll();
    }
    this.broadcastChannel.postMessage({
      type: EventType.STATUS,
      status: status,
      dataSourceId: this.dataSourceId
    });
  }
  handleData(data) {
    // check if data is an array
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        this.values.push({
          data: data[i],
          version: this.version
        });
      }
    } else {
      this.values.push({
        data: data,
        version: this.version
      });
    }
    // because parseData is ASYNC, the protocol can finish before the parsing method. In that case, we have to flushALl data
    if (!this.isConnected()) {
      this.flushAll();
    }
    if (this.values.length !== 0 && this.values.length >= this.properties.batchSize) {
      this.flush();
    }
  }
  connect(startTime = this.properties.startTime) {
    this.context.connect();
  }
  async disconnect() {
    return this.context.disconnect();
  }
  async updateProperties(properties) {
    await this.disconnect();
    this.properties = {
      ...this.properties,
      ...properties
    };
    this.version++;
    this.connect();
  }
  flushAll() {
    // while(this.values.length > 0) {
    //     this.flush();
    // }
  }
  flush() {
    let nbElements = this.values.length;
    // console.log('push message on ',this.broadcastChannel)
    this.broadcastChannel.postMessage({
      dataSourceId: this.dataSourceId,
      type: EventType.DATA,
      values: this.values.splice(0, nbElements)
    });
  }
  isInitialized() {
    return this.initialized;
  }
  isConnected() {
    return this.context.isConnected();
  }
}
/* harmony default export */ var DataSource_handler = (DataSourceHandler);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/Mode.js
/**
 * Enum for datasource mode.
 * @readonly
 * @enum {{name: string}}
 */
const Mode = {
  REPLAY: "replay",
  BATCH: "batch",
  REAL_TIME: "realTime"
};
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/common/handler/TimeSeries.handler.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

// v1





class DelegateHandler {
  constructor(context) {
    this.context = context;
    this.status = {
      cancel: false
    };
  }
  setContext(context) {
    this.context = context;
  }
  init(properties) {
    this.properties = properties;
  }
  handleData(data) {}
  connect() {
    this.status.cancel = false;
    this.context.connect();
  }
  async disconnect() {
    this.status.cancel = true;
    return this.context.disconnect();
  }
  setTimeTopic(timeTopic) {
    this.timeTopic = timeTopic;
  }
}
class DelegateRealTimeHandler extends DelegateHandler {
  init(properties) {
    super.init({
      ...properties,
      startTime: 'now',
      endTime: '2055-01-01'
    });
    this.status = {
      cancel: false
    };
    this.context.handleData = data => {
      if (!this.status.cancel) {
        this.handleData(data);
      }
    };
  }
  async disconnect() {
    this.status.cancel = true;
    return new Promise(async (resolve, reject) => {
      try {
        await this.context.disconnect();
      } catch (ex) {
        console.error(ex);
      } finally {
        resolve();
      }
    });
  }
}
class DelegateBatchHandler extends DelegateHandler {
  async fetchData(startTime, endTime) {
    console.warn(`fetching ${new Date(startTime).toISOString()} -> ` + `${new Date(endTime).toISOString()} for datasource ${this.context.properties.dataSourceId}`);
    return this.context.nextBatch(this.properties, startTime, endTime, this.status);
  }
  connect() {
    this.context.onChangeStatus(Status.FETCH_STARTED);
    this.fetchData(this.properties.startTime, this.properties.endTime).then(data => {
      if (!this.status.cancel) {
        this.handleData(data);
      }
    });
    this.context.onChangeStatus(Status.FETCH_ENDED);
  }
  async disconnect() {}
}
class DelegateReplayHandler extends DelegateHandler {
  constructor(context) {
    super(context);
    this.initialized = false;
    this.prefetchBatchDuration = 10000; // 10 sec
    this.prefetchNextBatchThreshold = 0.5; // 50%, fetch before the end
    this.startTime = undefined;
  }
  init(properties) {
    super.init(properties);
    this.prefetchBatchDuration = properties.prefetchBatchDuration || this.prefetchBatchDuration;
    this.status = {
      cancel: false
    };
    if (!isDefined(this.startTime)) {
      this.startTime = properties.startTime;
    }
  }
  async startLoop() {
    let startTimestamp = new Date(this.startTime).getTime();
    let endTimestamp = new Date(this.properties.endTime).getTime();
    if (startTimestamp >= endTimestamp) {
      console.warn(`Did not connect DataSource ${this.context.properties.dataSourceId}` + ` because startTime=${this.startTime} >= endTime=${this.properties.endTime}`);
      return;
    }
    if (!this.initialized) {
      this.initialized = true;
      this.status = {
        cancel: false
      };
    }
    let replaySpeed = this.properties.replaySpeed || 1;
    let prefetchBatchDuration = this.properties.prefetchBatchDuration * replaySpeed;
    let lastTimestamp;
    try {
      let data = await this.context.nextBatch();
      this.context.onChangeStatus(Status.FETCH_STARTED);
      if (this.status.cancel) {
        return;
      } else if (data.length > 0) {
        this.handleData(data);
        lastTimestamp = data[data.length - 1].timestamp;
      }
      if (lastTimestamp < endTimestamp) {
        let masterTimestamp;
        let fetching = false;
        this.timeBc = new BroadcastChannel(this.timeTopic);
        this.timeBc.onmessage = async event => {
          if (event.data.type === EventType.MASTER_TIME) {
            masterTimestamp = event.data.timestamp;
            if (masterTimestamp >= endTimestamp) {
              await this.disconnect();
              return;
            }
            if (lastTimestamp < endTimestamp && !fetching) {
              fetching = true;
              let dTimestamp = lastTimestamp - masterTimestamp;
              // less than 5 sec
              if (dTimestamp <= prefetchBatchDuration) {
                // request next batch
                if (!this.status.cancel) {
                  data = await this.context.nextBatch();
                  if (data.length > 0) {
                    this.handleData(data);
                    lastTimestamp = data[data.length - 1].timestamp;
                  }
                }
              }
              fetching = false;
            }
          }
        };
      }
    } catch (ex) {
      if (this.status.cancel) {
        console.warn(ex);
      } else {
        console.error(ex);
        throw Error(ex);
      }
    }
    assertDefined(this.timeTopic, 'TimeTopic');
  }
  connect(startTime) {
    if (startTime) {
      this.startTime = startTime;
      this.context.properties.startTime = this.startTime;
    }
    this.startLoop();
  }
  async disconnect() {
    if (!this.initialized) {
      console.warn(`The dataSource ${this.context.properties.dataSourceId} is not connected`);
      return;
    }
    this.status.cancel = true;
    return new Promise(async (resolve, reject) => {
      try {
        if (isDefined(this.promise)) {
          await this.promise;
        }
      } catch (ex) {
        // reject(ex);
      } finally {
        try {
          this.promise = undefined;
          this.context.onChangeStatus(Status.FETCH_ENDED);
          this.context.onChangeStatus(Status.DISCONNECTED);
          this.context.disconnect();
          if (isDefined(this.timeBc)) {
            this.timeBc.close();
            this.timeBc = undefined;
          }
          this.initialized = false;
        } catch (ex) {
          console.error(ex);
        } finally {
          resolve();
        }
      }
    });
  }
}
class TimeSeriesHandler extends DataSource_handler {
  constructor() {
    super();
    this.timeBroadcastChannel = null;
    this.delegateHandler = undefined;
    this.promiseDisconnect = new Promise(resolve => {
      resolve();
    }); // default one
    this.contexts = {};
  }
  async init(properties, topics, dataSourceId) {
    this.dataSourceId = dataSourceId;
    this.properties = {
      ...this.properties,
      ...properties,
      dataSourceId: dataSourceId
    };
    this.setTopics(topics);
    this.contexts[this.properties.mode] = this.createContext(this.properties);
    this.context = this.contexts[this.properties.mode];
    this.context.onChangeStatus = this.onChangeStatus.bind(this);
    await this.context.init(this.properties);
    await this.updateDelegateHandler(properties);
    this.delegateHandler.handleData = this.handleData.bind(this); // bind context to handler
    this.initialized = true;
  }
  createContext(properties) {
    throw Error('Should be overridden');
  }
  async updateDelegateHandler(properties) {
    if (isDefined(this.delegateHandler)) {
      await this.delegateHandler.disconnect();
    }
    if (properties.mode === Mode.REAL_TIME) {
      this.delegateRealTimeHandler = new DelegateRealTimeHandler(this.context);
      this.delegateHandler = this.delegateRealTimeHandler;
    } else if (properties.mode === Mode.REPLAY) {
      this.delegateReplayHandler = new DelegateReplayHandler(this.context);
      this.delegateHandler = this.delegateReplayHandler;
    } else if (properties.mode === Mode.BATCH) {
      this.delegateBatchHandler = new DelegateBatchHandler(this.context);
      this.delegateHandler = this.delegateBatchHandler;
    }
    this.delegateHandler.init(properties);
    this.delegateHandler.setTimeTopic(this.timeSyncTopic);
  }
  async updateProperties(properties) {
    try {
      this.timeBroadcastChannel.postMessage({
        dataSourceId: this.dataSourceId,
        type: EventType.TIME_CHANGED
      });
      await this.disconnect();
      this.properties = {
        ...this.properties,
        ...properties
      };
      if (!(this.properties.mode in this.contexts)) {
        console.warn(`creating new context for mode ${this.properties.mode}`);
        this.contexts[this.properties.mode] = this.createContext(this.properties);
      }
      this.context = this.contexts[this.properties.mode];
      this.context.onChangeStatus = this.onChangeStatus.bind(this);
      await this.context.init(this.properties);
      await this.updateDelegateHandler(this.properties);
      this.delegateHandler.handleData = this.handleData.bind(this); // bind context to handler
      this.connect();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
  setTopics(topics) {
    super.setTopics(topics);
    this.timeSyncTopic = undefined;
    if (isDefined(topics.time)) {
      this.setTimeTopic(topics.time);
    }
    if (isDefined(topics.sync)) {
      this.timeSyncTopic = topics.sync;
      this.delegateHandler.setTimeTopic(this.timeSyncTopic);
    }
  }
  setTimeTopic(timeTopic) {
    if (this.timeTopic === timeTopic) {
      return;
    }
    if (this.timeBroadcastChannel !== null) {
      console.warn(`Replace old topic ${this.timeTopic} by ${timeTopic}`);
      this.timeBroadcastChannel.close();
    }
    this.timeBroadcastChannel = new BroadcastChannel(timeTopic);
    this.timeTopic = timeTopic;
  }
  flushAll() {
    if (this.properties.mode !== Mode.BATCH && this.values.length > 0) {
      this.flush();
    }
  }
  flush() {
    // console.log('push message on ',this.broadcastChannel)
    this.broadcastChannel.postMessage({
      dataSourceId: this.dataSourceId,
      type: EventType.DATA,
      values: this.values
    });
    this.values = [];
  }
  handleData(data) {
    const results = [];
    if (Array.isArray(data)) {
      if (data.length === 0) {
        console.warn(`Data array is empty for datasource ${this.dataSourceId}`);
        return;
      }
      let d;
      for (let i = 0; i < data.length; i++) {
        d = {
          data: data[i],
          version: data[i].version
        };
        results.push(d);
      }
    } else {
      results.push({
        data: data,
        version: data[0].version
      });
    }
    if (results.length > 0) {
      this.lastData = results[results.length - 1];
      if (data[0].version !== this.properties.version) {
        console.warn('incompatible version, drop data');
      }
    }
    this.broadcastChannel.postMessage({
      dataSourceId: this.dataSourceId,
      type: EventType.DATA,
      values: results
    });
    if (this.timeBroadcastChannel !== null) {
      if (data.length > 0) {
        this.timeBroadcastChannel.postMessage({
          timestamp: data[data.length - 1].timestamp,
          type: EventType.LAST_TIME
        });
      }
    }
  }
  isConnected() {
    if (isDefined(this.delegateHandler.context)) {
      return this.delegateHandler.context.isConnected();
    } else {
      return false;
    }
  }
  async checkDisconnect() {
    await this.promiseDisconnect;
  }
  async connect(startTime = this.properties.startTime, version = this.properties.version) {
    this.properties.version = version;
    await this.checkDisconnect();
    if (this.delegateHandler instanceof DelegateReplayHandler && !isDefined(this.timeSyncTopic)) {
      throw Error('DataSynchronizer must be used in case of Mode.REPLAY');
    }
    this.context.init(this.properties);
    this.delegateHandler.connect(startTime);
  }
  async disconnect() {
    this.promiseDisconnect = this.delegateHandler.disconnect();
    return this.promiseDisconnect;
  }
}
/* harmony default export */ var TimeSeries_handler = (TimeSeriesHandler);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/Filter.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class SensorWebApiFilter {
  constructor(props) {
    this.props = props;
  }

  /**
   *
   * @param {string[]} [includes=[]] list of parameters to include - all if omitted
   * @param  {string[]} [excludes=[]] list of parameters to exclude - none if omitted
   * @return {string}
   */
  toQueryString(includes = [], excludes = []) {
    let queryString = '';
    let separator = '';
    excludes.push('replaySpeed');
    for (let queryParameter in this.props) {
      if (excludes.includes(queryParameter)) {
        continue;
      }
      if ((includes.length === 0 || includes.includes(queryParameter)) && isDefined(this.props[queryParameter])) {
        // if(Array.isArray(this.props[queryParameter])) {
        //     queryString += separator + queryParameter + '=' + encodeURIComponent(this.props[queryParameter].join());
        /*} else*/
        if (queryParameter === 'f' || queryParameter === 'format' || queryParameter === 'responseFormat' || queryParameter === 'obsFormat') {
          queryString += separator + queryParameter + '=' + this.props[queryParameter].replaceAll('+', '%2B');
          // } else {
          //     queryString += separator + queryParameter + '=' + encodeURIComponent(this.props[queryParameter]);
        } else {
          queryString += separator + queryParameter + '=' + this.props[queryParameter];
        }
        separator = '&';
      }
    }
    return queryString;
  }
}
/* harmony default export */ var Filter = (SensorWebApiFilter);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/control/ControlFilter.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class ControlFilter extends Filter {
  /**
   *
   * @param {Object} properties - object properties
   * @param {string[]} [properties.q=undefined] - Comma separated keywords used for full-text search
   * @param {string[]} [properties.actuableProperty=undefined] - Comma separated list of actuable property URIs to filter command streams
   * @param {string[]} [properties.select=undefined] - Comma separated list of properties to include or exclude from results (use "!" prefix to exclude)
   * @param {string} [properties.format='application/json'] - Mime type designating the format to use to encode the response.
   * @param {string} [properties.issueTime=undefined] - ISO 8601 time range to filter commands on their issue time. When this parameter is omitted,
   * no filtering on "issueTime" is applied.
   */
  constructor(properties) {
    super({
      q: undefined,
      actuableProperty: undefined,
      observedProperty: undefined,
      issueTime: undefined,
      select: undefined,
      format: 'application/json',
      ...properties // merge defined properties
    });
    //TODO: assertions
  }
}

/* harmony default export */ var control_ControlFilter = (ControlFilter);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/observation/ObservationFilter.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

class ObservationFilter extends Filter {
  /**
   *
   * @param {Object} properties - object properties
   * @param {any} [properties.phenomenonTime='now'] - time range <00:00:00T00:00:00Z/00:00:00T00:00:00Z> | 'now' | 'latest'
   * @param {any} [properties.resultTime='now'] - time range <00:00:00T00:00:00Z/00:00:00T00:00:00Z> | 'latest'
   * @param {string[]} [properties.featureOfInterest=undefined] - Comma separated list of feature of interest IDs to get observations for
   * @param {string[]} [properties.select=undefined] - Comma separated list of properties to include or exclude from results (use "!" prefix to exclude)
   * @param {number[]} [properties.bbox=undefined] - BBOX to filter resources on their location
   * @param {string} [properties.location=undefined] - WKT geometry and operator to filter resources on their location or geometry
   * @param {string} [properties.format='application/json'] - Mime type designating the format to use to encode the response.
   * @param {string} [properties.replaySpeed=undefined] - Mime type designating the format to use to encode the response.
   */
  constructor(properties) {
    super({
      phenomenonTime: undefined,
      resultTime: undefined,
      featureOfInterest: undefined,
      select: undefined,
      bbox: undefined,
      location: undefined,
      format: 'application/om+json',
      replaySpeed: undefined,
      ...properties // merge defined properties
    });
  }
}

/* harmony default export */ var observation_ObservationFilter = (ObservationFilter);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/common/context/DataSource.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

class DataSourceContext {
  constructor() {
    this.connector = undefined;
    this.properties = undefined;
  }
  async init(properties) {
    // this.parser.init(properties);
    this.properties = properties;
    this.connector = await this.createDataConnector(properties);
    this.connector.onChangeStatus = this.onChangeStatus.bind(this);
    this.connector.onMessage = this.onMessage.bind(this);
  }
  async createDataConnector(properties) {}
  connect() {}
  async onMessage(messages, format) {}
  async disconnect() {}
  handleData(data) {}
  isConnected() {
    return false;
  }
  onChangeStatus(status) {}
}
/* harmony default export */ var DataSource_context = (DataSourceContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sweapi/context/SweApi.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/





class SweApiContext extends DataSource_context {
  createControlFilter(properties) {
    const props = {};
    if (isDefined(properties.keywords)) {
      props.q = properties.keywords;
    }
    if (isDefined(properties.actuableProperty)) {
      props.actuableProperty = properties.actuableProperty;
    }
    if (isDefined(properties.statusCode)) {
      props.statusCode = properties.statusCode;
    }
    if (isDefined(properties.responseFormat)) {
      props.format = properties.responseFormat;
    }
    if (isDefined(properties.issueTime)) {
      props.issueTime = properties.issueTime;
    }
    if (isDefined(properties.executionTime)) {
      props.executionTime = properties.executionTime;
    }
    if (isDefined(properties.reportTime)) {
      props.reportTime = properties.reportTime;
    }
    return new control_ControlFilter(props);
  }
  createObservationFilter(properties) {
    const props = {};
    if (isDefined(properties.roi)) {
      props.location = props.roi;
    }
    if (isDefined(properties.responseFormat)) {
      props.format = properties.responseFormat;
    }
    if (isDefined(properties.replaySpeed)) {
      props.replaySpeed = properties.replaySpeed;
    }
    if (isDefined(properties.startTime)) {
      props.phenomenonTime = properties.startTime + '/' + properties.endTime;
    }
    if (isDefined(properties.resultTime)) {
      props.resultTime = properties.resultTime;
    }
    if (isDefined(properties.resultTime)) {
      props.resultTime = properties.resultTime;
    }
    if (isDefined(properties.featureOfInterest)) {
      props.featureOfInterest = properties.featureOfInterest;
    }
    if (isDefined(properties.excludedProps)) {
      props.select = properties.excludedProps.map(e => '!' + e);
    }
    if (isDefined(properties.includedProps)) {
      if (!isDefined(props.select)) {
        props.select = [];
      }
      props.select.concat(properties.includedProps);
    }
    return new observation_ObservationFilter(props);
  }
}
/* harmony default export */ var SweApi_context = (SweApiContext);
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-exception.stack.js
var web_dom_exception_stack = __webpack_require__(2801);
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/DataConnector.js
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




/**
 * The DataConnector is the abstract class used to create different connectors.
 */
class DataConnector {
  /**
   * @param {String} url - The full url used to connect to the data stream
   */
  constructor(url, properties) {
    this.url = url;
    this.properties = properties;
    this.id = "DataConnector-" + randomUUID();
    this.reconnectTimeout = 1000 * 20; // 20 sec
    this.status = Status.DISCONNECTED;
  }
  disconnect() {
    this.checkStatus(Status.DISCONNECTED);
    this.checkAndClearReconnection();
  }

  /**
   * Sets the url
   * @param url
   */
  setUrl(url) {
    this.url = url;
  }

  /**
   * The data protocol default id.
   * @return {String}
   */
  getId() {
    return this.id;
  }

  /**
   * The stream url.
   * @return {String}
   */
  getUrl() {
    return this.url;
  }

  /**
   * Sets the reconnection timeout
   * @param {Number} timeout - delay in milliseconds before reconnecting dataSource
   */
  setReconnectTimeout(timeout) {
    this.reconnectTimeout = timeout;
  }
  onReconnect() {
    return true;
  }
  connect() {}
  forceReconnect() {
    this.disconnect();
    this.connect();
  }

  /**
   * Called when the connection STATUS changes
   * @param {Status} status - the new status
   */
  onChangeStatus(status) {}

  /**
   * Check a change of the status and call the corresponding callbacks if necessary
   * @param {Status} status - the currentStatus
   */
  checkStatus(status) {
    if (status !== this.status) {
      this.onChangeStatus(status);
      this.status = status;
    }
  }
  /**
   * Called when the protocol has been disconnected
   */
  onDisconnect() {}

  /**
   * Called when the protocol has been connected
   */
  onConnect() {}
  postRequest() {}
  publishRequest() {}
  reset() {}
  close() {}
  onClose(statusCode) {}
  onError(reason) {}
}
/* harmony default export */ var connector_DataConnector = (DataConnector);
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/WebSocketConnector.js

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





/**
 * Defines the WebSocketConnector to connect to a remote server by creating a WebSocket channel.
 * @extends DataConnector
 * @example
 * import WebSocketConnector from 'osh-js/dataconnector/WebSocketConnector.js';
 *
 * let url = ...;
 * let connector = new WebSocketConnector(url);
 *
 * // connect
 * connector.connect();
 *
 * // disconnect
 * connector.disconnect();
 *
 * // close
 * connector.close();
 *
 */

let reconnectionInterval = -1;
class WebSocketConnector extends connector_DataConnector {
  /**
   *
   * @param url -
   * @param {Object} properties -
   */
  constructor(url, properties) {
    super(url, properties);
    this.interval = -1;
    this.lastReceiveTime = 0;
    this.extraUrl = '';
    this.reconnectRetry = properties && properties.reconnectRetry || 10;
  }

  /**
   * Connect to the webSocket. If the system supports WebWorker, it will automatically creates one otherwise use
   * the main thread.
   */
  doRequest(extraUrl = this.extraUrl, queryString = this.queryString) {
    if (!this.init) {
      this.extraUrl = extraUrl;
      this.queryString = queryString;
      let fullUrl = this.getUrl() + extraUrl;
      if (isDefined(queryString)) {
        fullUrl += '?' + queryString;
      }
      this.closed = false;
      this.init = true;
      //creates Web Socket
      this.ws = new WebSocket(fullUrl);
      this.ws.binaryType = 'arraybuffer';
      this.checkStatus(Status.CONNECTING);
      console.warn('WebSocket stream connecting');
      this.ws.onopen = function (event) {
        this.checkAndClearReconnection();
        this.checkStatus(Status.CONNECTED);
        console.warn('WebSocket stream connected');
      }.bind(this);
      this.ws.onmessage = function (event) {
        this.lastReceiveTime = Date.now();
        //callback data on message received
        if (event.data.byteLength > 0) {
          this.onMessage(event.data);
        }
      }.bind(this);

      // closes socket if any errors occur
      this.ws.onerror = function (event) {
        console.error('WebSocket stream error');
        this.checkStatus(Status.CLOSED_ERROR);
        this.init = false;
        this.lastReceiveTime = -1;
        this.createReconnection();
        this.onError(event);
      }.bind(this);
      this.ws.onclose = event => {
        console.warn('WebSocket stream closed: ', event.reason, event.code);
        if (event.code !== 1000 && !this.closed) {
          this.checkStatus(Status.CLOSED_ERROR);
          this.createReconnection();
        } else {
          this.checkStatus(Status.DISCONNECTED);
        }
        this.onClose(event.code);
      };
      if (this.reconnectionInterval !== -1) {
        clearInterval(this.reconnectionInterval);
        this.reconnectionInterval = -1;
      }
    }
  }

  /**
   * Connect to the webSocket. If the system supports WebWorker, it will automatically creates one otherwise use
   * the main thread.
   */
  doAsyncRequest(extraUrl = this.extraUrl, queryString = this.queryString) {
    return new Promise(async (resolve, reject) => {
      if (!this.init) {
        this.extraUrl = extraUrl;
        this.queryString = queryString;
        let fullUrl = this.getUrl() + extraUrl;
        if (isDefined(queryString)) {
          fullUrl += '?' + queryString;
        }
        this.closed = false;
        this.init = true;
        //creates Web Socket
        this.ws = new WebSocket(fullUrl);
        this.ws.binaryType = 'arraybuffer';
        this.checkStatus(Status.CONNECTING);
        console.warn('WebSocket stream connecting');
        const results = [];
        this.ws.onopen = function (event) {
          this.checkAndClearReconnection();
          this.checkStatus(Status.CONNECTED);
          console.warn('WebSocket stream connected');
        }.bind(this);
        this.ws.onmessage = function (event) {
          this.lastReceiveTime = Date.now();
          //callback data on message received
          if (event.data.byteLength > 0) {
            // this.onMessage(event.data);
            results.push(event.data);
          }
        }.bind(this);

        // closes socket if any errors occur
        this.ws.onerror = function (event) {
          console.error('WebSocket stream error');
          this.checkStatus(Status.CLOSED_ERROR);
          this.init = false;
          this.lastReceiveTime = -1;
          this.createReconnection();
          this.onError(event);
          reject(`onError WS: ${event}`);
        }.bind(this);
        this.ws.onclose = event => {
          console.warn('WebSocket stream closed: ', event.reason, event.code);
          if (event.code !== 1000 && !this.closed) {
            this.checkStatus(Status.CLOSED_ERROR);
            this.createReconnection();
          } else {
            this.checkStatus(Status.DISCONNECTED);
          }
          this.onClose(event.code);
          resolve(results);
        };
        if (this.reconnectionInterval !== -1) {
          clearInterval(this.reconnectionInterval);
          this.reconnectionInterval = -1;
        }
      }
    });
  }
  connect() {
    this.doRequest();
  }
  publishRequest(topic, payload) {
    if (isDefined(this.ws)) {
      this.ws.send(payload);
    }
  }
  checkAndClearReconnection() {
    if (reconnectionInterval !== -1) {
      clearInterval(reconnectionInterval);
      reconnectionInterval = -1;
    }
  }
  createReconnection() {
    if (!this.closed && reconnectionInterval === -1 && this.onReconnect()) {
      let count = 0;
      const url = this.url;
      reconnectionInterval = setInterval(function () {
        let delta = Date.now() - this.lastReceiveTime;
        // -1 means the WS went in error
        if (this.lastReceiveTime === -1 || delta >= this.reconnectTimeout) {
          if (count++ >= this.reconnectRetry) {
            console.warn(`Maximum reconnection retries attempted: ${this.reconnectRetry}`);
            clearInterval(reconnectionInterval);
          } else {
            let fullUrl = url;
            if (isDefined(this.extraUrl)) {
              fullUrl += this.extraUrl;
            }
            if (isDefined(this.queryString)) {
              fullUrl += '?' + this.queryString;
            }
            console.warn(`(${count}/${this.reconnectRetry}) trying to reconnect: ${fullUrl}`);
            this.init = false;
            this.connect();
          }
        }
      }.bind(this), this.reconnectTimeout);
    }
  }

  /**
   * Disconnects and close the websocket.
   */
  async disconnect() {
    // super.disconnect();
    this.init = false;
    this.closed = true;
    if (this.ws != null && this.ws.readyState !== WebSocket.CLOSED) {
      this.ws.close();
    }
  }

  /**
   * The onMessage method used by the websocket to callback the data
   * @param data the callback data
   * @event
   */
  async onMessage(data) {}
  isConnected() {
    return this.ws != null && this.ws.readyState === WebSocket.OPEN;
  }
}
/* harmony default export */ var connector_WebSocketConnector = (WebSocketConnector);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-reversed.js
var esnext_typed_array_to_reversed = __webpack_require__(3767);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-sorted.js
var esnext_typed_array_to_sorted = __webpack_require__(8585);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.with.js
var esnext_typed_array_with = __webpack_require__(8696);
// EXTERNAL MODULE: ../../osh-js/source/core/mqtt/mqtt.min.js
var mqtt_min = __webpack_require__(8475);
var mqtt_min_default = /*#__PURE__*/__webpack_require__.n(mqtt_min);
;// CONCATENATED MODULE: ../../osh-js/source/core/mqtt/MqttProvider.js




/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/



let mqttCallbacks = {};
class MqttProvider {
  /**
   * Build the MqttProvider.
   * @param {Object} properties - the object properties
   * @param {String} properties.endpoint - the mqtt endpoint[:port]
   * @param {String} properties.clientId - the clientId
   * @param {String} [properties.mqttPrefix='/api'] - a prefix to each topic
   * @param {Object} properties.options - the MQTT.js property options as defined  [mqtt.Client(streamBuilder, options)]{@link https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options}
   * Note that the credentials are passed in the object options as for the mqtt.js client.
   */
  constructor(properties) {
    this.properties = properties;
    if (!isDefined(properties)) {
      throw Error('endpoint and clientId are mandatory properties');
    }
    if (!isDefined(properties.endpoint)) {
      throw Error('endpoint is a mandatory property');
    }
    if (!isDefined(properties.clientId)) {
      throw Error('clientId is a mandatory property');
    }
    this.mqttPrefix = '/api';
    if (isDefined(properties.mqttPrefix)) {
      this.mqttPrefix = properties.mqttPrefix;
    }
    this.topics = [];
    let options = {
      reconnectPeriod: 30,
      connectTimeout: 30 * 1000,
      clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
      wsOptions: {
        binaryType: 'arraybuffer'
      }
    };

    // merge generic options
    if (isDefined(this.properties.options)) {
      options = {
        ...options,
        ...this.properties.options
      };
    }
    this.options = options;
    this.endpoint = properties.endpoint + '/mqtt';
    this.clientId = properties.clientId;
    this.client = null;
  }
  async subscribe(topic, callback) {
    if (topic in this.topics) {
      // already subscribed, skipping
      return;
    }
    if (!isDefined(this.client)) {
      throw Error('You must connect the client before subscribing any topic');
    }
    // waiting for the client gets connected
    let interval;
    const topicQuery = `${this.mqttPrefix}${topic}`;
    this.topics.push(topic);
    return new Promise((resolve, error) => {
      interval = setInterval(() => {
        if (this.client.connected) {
          try {
            // subscribe
            // store callback for this topic
            if (!(topicQuery in mqttCallbacks)) {
              mqttCallbacks[topicQuery] = [];
            }
            mqttCallbacks[topicQuery].push(callback);
            this.client.subscribe(`${topicQuery}`, function (err) {
              if (err) {
                callback(err);
                error(err);
              } else {
                console.warn(`Subscribed to ${topicQuery}`);
                resolve();
              }
            });
          } catch (exception) {
            console.error(exception);
          } finally {
            clearInterval(interval);
          }
        }
      }, 100);
    });
  }
  publish(topic, payload) {
    const topicQuery = `${this.mqttPrefix}${topic}`;
    this.client.publish(topicQuery, payload);
  }

  /**
   * Check to unsuscribe to any topic listened by this dsId
   * If the topic is only subscribed by the dsId, unsubscribe from broken
   * Otherwise, remove from the list of subscribe topic/dsId
   * @param topic
   */
  async unsubscribe(topic) {
    const topicQuery = `${this.mqttPrefix}${topic}`;
    return new Promise((resolve, error) => {
      this.client.unsubscribe(topicQuery, err => {
        delete mqttCallbacks[topicQuery];
        if (err) {
          const messageErr = `Cannot Unsubscribed topic: ${topicQuery} : ${err}`;
          console.error(messageErr);
          error(messageErr);
        } else {
          console.warn(`Unsubscribed topic: ${topicQuery}`);
          resolve();
        }
      });
    });
  }
  async unsubscribeAll() {
    // unsubscribe topic
    for (let topic of this.topics) {
      await this.unsubscribe(topic);
    }
    this.topics = [];
  }
  connect() {
    if (!isDefined(this.client)) {
      // connects to the broker specified by the given url and options and returns a Client.
      this.client = mqtt_min_default().connect(this.endpoint, {
        ...this.options
      });
      const that = this;
      this.client.on('connect', e => {
        console.info(`Mqtt client is connected to ${that.endpoint}`);
      });
      this.client.on('message', this.onMessage.bind(this));
      this.client.on('offline', e => {
        throw new Error(`The server ${that.endpoint} seems offline`);
      });
      this.client.on('error', e => {
        throw new Error(error);
      });
    }
  }
  async onMessage(topic, message) {
    // console.log(new DataView(message.buffer, message.byteOffset).getFloat64(0, false) * 1000)
    // console.log(new DataView(new Uint8Array(message).subarray(message.byteOffset).buffer).getFloat64(0, false) * 1000)
    // console.log(String.fromCharCode.apply(null, new Uint8Array(message)));
    if (topic in mqttCallbacks) {
      // callback for the corresponding topic
      for (let callbackFn of mqttCallbacks[topic]) {
        // callback to all subscription registered
        callbackFn(new Uint8Array(message).subarray(message.byteOffset).buffer);
      }
    }
  }
  disconnect() {
    if (!isDefined(this.client)) {
      throw Error('The client has not been created yet');
    }
    // close the client
    this.client.end();
    mqttCallbacks = {};
    this.client = null;
  }
  isConnected() {
    return isDefined(this.client) && this.client.connected;
  }
}
/* harmony default export */ var mqtt_MqttProvider = (MqttProvider);
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/MqttConnector.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/







/**
 * Defines the MqttConnector to connect to a remote server by creating a Mqtt channel.
 * @extends DataConnector
 * @example
 * import MqttConnector from 'osh-js/dataconnector/MqttConnector.js';
 *
 * let url = ...;
 * let connector = new MqttConnector(url);
 *
 * // connect
 * connector.connect();
 *
 * // disconnect
 * connector.disconnect();
 *
 * // close
 * connector.close();
 *
 */

// TODO: Useless in WebWorker since the WebWorker has its own context.
const mqttProviders = {};
class MqttConnector extends connector_DataConnector {
  /**
   *
   * @param properties -
   */
  constructor(url, properties) {
    super(url, {
      mqttPrefix: properties.mqttOpts && properties.mqttOpts.prefix || '/api',
      ...properties
    });
    this.interval = -1;
  }
  getMqttProvider() {
    let fullUrl = this.getUrl();

    // only 1 provider by URL
    if (!(fullUrl in mqttProviders)) {
      let options = {
        reconnectPeriod: this.reconnectTimeout,
        connectTimeout: 30 * 1000
      };
      if (isDefined(this.properties.mqttOpts)) {
        options = {
          ...options,
          ...this.properties.mqttOpts
        };
      }
      mqttProviders[fullUrl] = new mqtt_MqttProvider({
        endpoint: fullUrl,
        clientId: randomUUID(),
        options: options,
        mqttPrefix: this.properties.mqttPrefix
      });
      console.warn(`Stored MQTT provider into cache: ${fullUrl}`);
      mqttProviders[fullUrl].connect();
      mqttProviders[fullUrl].checkStatus = this.checkStatus;
      this.checkStatus(Status.CONNECTED);
    } else {
      console.warn(`Getting MQTT provider from cache: ${fullUrl}`);
    }
    return mqttProviders[fullUrl];
  }
  checkStatus(status) {
    this.onChangeStatus(status);
    this.status = status;
  }

  /**
   * Connect to the Mqtt broker.
   */
  doRequest(topic = '', queryString = undefined) {
    const mqttProvider = this.getMqttProvider();
    mqttProvider.subscribe(`${topic}?${queryString}`, this.onMessage).then(() => {
      this.onChangeStatus(Status.CONNECTED);
    });
  }
  publishRequest(topic, payload) {
    const mqttProvider = this.getMqttProvider();
    mqttProvider.publish(topic, payload);
  }

  /**
   * Disconnects and close the mqtt client.
   */
  async disconnect() {
    // does not call super to avoid reconnection logic and use the one of the mqtt.js lib
    // this.checkStatus(Status.DISCONNECTED);
    // this.init = false;
    // this.closed = true;
    // find the client
    const client = mqttProviders[this.getUrl()];
    if (isDefined(client) && client.isConnected()) {
      // unsubscribe all topics
      await client.unsubscribeAll();
      // client.disconnect();
    }
    //delete mqttProviders[this.getUrl()];
    //console.warn(`Disconnected from ${this.getUrl()}`);
  }

  connect() {
    this.doRequest(this.properties.topic || '');
  }

  /**
   * The onMessage method used by the mqtt client to callback the data
   * @param data the callback data
   * @event
   */
  onMessage(data) {}
  isConnected() {
    return isDefined(mqttProviders[this.getUrl()]) && mqttProviders[this.getUrl()].isConnected();
  }
  reset() {
    this.disconnect();
    console.log(`Remove provider from cache: ${this.getUrl()}`);
    delete mqttProviders[this.getUrl()];
  }
}
/* harmony default export */ var connector_MqttConnector = (MqttConnector);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/SensorWebApi.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/




class SensorWebApi {
  /**
   * @param {Object} [networkProperties={}]
   * @param {String} networkProperties.endpointUrl - defines the Http(s) endpoint URL
   * @param {Boolean} networkProperties.tls - defines is use Http or Https secure protocol for fetching data
   * @param {String} [networkProperties.streamProtocol='ws'] - the Stream protocol to use: 'ws' pr 'mqtt'
   * @param {Object} [networkProperties.mqttOpts={}] - the Mqtt options if stream protocol is 'mqtt'
   * @param {String} networkProperties.mqttOpts.prefix - the Mqtt prefix value
   * @param {String} networkProperties.mqttOpts.endpointUrl - the Mqtt specific endpointUrl
   * @param {Object} networkProperties.connectorOpts - Specific connector options
   */
  constructor(networkProperties) {
    assertDefined(networkProperties.endpointUrl, 'endpointUrl');
    this.networkProperties = networkProperties;
    let endpoint = networkProperties.endpointUrl;
    if (endpoint.endsWith('/')) {
      endpoint = endpoint.substring(0, endpoint.length - 1);
    }
    const tls = networkProperties.tls ? 's' : '';
    this.url = 'http' + tls + '://' + endpoint;
    this._network = {};
    if (isDefined(networkProperties.connector)) {
      this._network.stream = {
        connector: networkProperties.connector
      };
    } else if (isDefined(networkProperties.streamProtocol)) {
      this._network.stream = {
        connector: this.createStreamConnector(networkProperties)
      };
    } else {
      // default Stream to WS
      this._network.stream = {
        connector: this.createStreamConnector({
          ...networkProperties,
          streamProtocol: 'ws'
        })
      };
    }
  }
  baseUrl() {
    return this.url;
  }
  stream() {
    return this._network.stream.connector;
  }
  createStreamConnector(networkProperties) {
    assertDefined(networkProperties.streamProtocol, 'streamProtocol');
    let endpoint = networkProperties.endpointUrl;
    if (networkProperties.streamProtocol === 'mqtt' && isDefined(networkProperties.mqttOpts)) {
      endpoint = networkProperties.mqttOpts.endpointUrl;
    }
    if (endpoint.endsWith('/')) {
      endpoint = endpoint.substring(0, endpoint.length - 1);
    }
    const tls = networkProperties.tls ? 's' : '';
    const url = networkProperties.streamProtocol + tls + '://' + endpoint;
    if (networkProperties.streamProtocol === 'mqtt') {
      return new connector_MqttConnector(url, networkProperties);
    } else if (networkProperties.streamProtocol === 'ws') {
      return new connector_WebSocketConnector(url);
    }
  }
  connect() {
    this._network.stream.connector.connect();
  }
  getHeaders() {
    const headers = {};
    if ('connectorOpts' in this.networkProperties) {
      if ('username' in this.networkProperties.connectorOpts && 'password' in this.networkProperties.connectorOpts) {
        headers['Authorization'] = 'Basic ' + btoa(this.networkProperties.connectorOpts.username + ":" + this.networkProperties.connectorOpts.password);
      } else {
        for (let key in this.networkProperties.connectorOpts) {
          headers[key] = this.networkProperties.connectorOpts[key];
        }
      }
    }
    return headers;
  }
  fetchAsJson(apiUrl, queryString) {
    const fullUrl = this.baseUrl() + apiUrl + '?' + queryString;
    const headers = this.getHeaders();
    return fetch(fullUrl, {
      method: 'GET',
      headers: headers
    }).then(function (response) {
      if (!response.ok) {
        const err = new Error(`Got ${response.status} response from ${this.baseUrl()}`);
        err.response = response;
        throw err;
      }
      return response.json();
    });
  }
  postAsJson(apiUrl, jsonPayload) {
    const fullUrl = this.baseUrl() + apiUrl;
    const headers = this.getHeaders();
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';
    fetch(fullUrl, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: jsonPayload
    }).then(function (response) {
      if (!response.ok) {
        const err = new Error(`Got ${response.status} response from ${fullUrl}`);
        err.response = response;
        throw err;
      }
    });
  }
}
/* harmony default export */ var sweapi_SensorWebApi = (SensorWebApi);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/command/CommandFilter.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class CommandFilter extends Filter {
  /**
   *
   * @param {Object} properties - object properties
   * @param {string[]} [properties.q=undefined] - Comma separated keywords used for full-text search
   * @param {string[]} [properties.actuableProperty=undefined] - Comma separated list of actuable property URIs to filter command streams
   * @param {string[]} [properties.select=undefined] - Comma separated list of properties to include or exclude from results (use "!" prefix to exclude)
   * @param {string} [properties.format='application/json'] - Mime type designating the format to use to encode the response.
   * @param {string} [properties.issueTime=undefined] - ISO 8601 time range to filter commands on their issue time. When this parameter is omitted,
   * no filtering on "issueTime" is applied.
   * @param {string} [properties.executionTime=undefined] - ISO 8601 time range to filter commands on their execution time.
   * When this parameter is omitted, no filtering on "executionTime" is applied
   * @param {string} [properties.reportTime=undefined] - ISO 8601 time range to filter status messages on their report time. When this parameter is omitted,
   * no filtering on "reportTime" is applied.
   * @param {string[]} [properties.statusCode=undefined] - Comma separated list of status codes: PENDING, ACCEPTED, REJECTED, SCHEDULED, UPDATED, CANCELED, EXECUTING, FAILED, COMPLETED
   */
  constructor(properties) {
    super({
      q: undefined,
      actuableProperty: undefined,
      select: undefined,
      format: 'application/json',
      issueTime: undefined,
      executionTime: undefined,
      reportTime: undefined,
      statusCode: undefined,
      ...properties // merge defined properties
    });
    //TODO: assertions
  }
}

/* harmony default export */ var command_CommandFilter = (CommandFilter);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/collection/SweCollectionDataParser.js



class SweCollectionDataParser {
  constructor(format = 'application/json') {
    this.format = format;
  }
  parseData(data) {
    if (this.format === 'application/om+json' || this.format === 'application/json') {
      return this.parseOmJsonData(data);
    } else if (this.format === 'application/swe+json') {
      return this.parseSweJsonData(data);
    } else if (this.format === 'application/swe+csv') {
      return this.parseSweCsv(data);
    } else if (this.format === 'application/swe+xml') {
      return this.parseSweXml(data);
    } else {
      throw Error(`Unsupported collection format ${this.format}`);
    }
  }
  parseOmJsonData(data) {
    return data instanceof ArrayBuffer ? JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data))).items : data.items;
  }
  parseSweJsonData(data) {
    return data instanceof ArrayBuffer ? JSON.parse(String.fromCharCode.apply(null, new Uint8Array(data))) : data;
  }
  parseSweCsv(data) {
    let content = data instanceof ArrayBuffer ? String.fromCharCode.apply(null, new Uint8Array(data)) : data;
    return content.split('\n');
  }
  parseSweXml(data) {
    return data instanceof ArrayBuffer ? String.fromCharCode.apply(null, new Uint8Array(data)) : data;
  }
}
/* harmony default export */ var collection_SweCollectionDataParser = (SweCollectionDataParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/Collection.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class Collection {
  /**
   *
   */
  constructor(url, filter, pageSize, parser, responseFormat = 'json') {
    this.url = url;
    this.filter = filter;
    this.pageSize = pageSize;
    this.parser = parser;
    this.pageOffset = 0;
    this.init = false;
    this.total = 0;
    this.collectionDataParser = new collection_SweCollectionDataParser(filter.props.format);
    this.responseFormat = responseFormat;
    this.currentPage = -1;
  }

  /**
   * Check if has next page
   * @return {boolean}
   */
  hasNext() {
    return this.pageOffset !== -1;
  }
  async fetchData(offset) {
    const queryString = `${this.filter.toQueryString()}&offset=${offset}&limit=${this.pageSize}`;
    const fullUrl = this.url + '?' + queryString;
    const jsonResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {}
    }).then(response => {
      if (!response.ok) {
        const err = new Error(`Got ${response.status} response from ${fullUrl}`);
        err.response = response;
        throw err;
      }
      if (this.responseFormat === 'json') {
        return response.json();
      } else if (this.responseFormat === 'arraybuffer') {
        return response.arrayBuffer();
      }
    });
    return this.parseResponse(jsonResponse);
  }
  async parseResponse(jsonResponse) {
    const items = this.collectionDataParser.parseData(jsonResponse);
    const data = [];
    if (Array.isArray(items)) {
      for (let item of items) {
        data.push(this.parser.parseData(item));
      }
    } else {
      data.push(items);
    }
    return data;
  }

  /**
   * Fetches next page.
   * @param page - the number of page to fetch
   * @return {Promise<Array>}
   */
  async nextPage() {
    if (this.hasNext()) {
      this.currentPage++;
      this.pageOffset = this.currentPage * this.pageSize;
      const data = await this.fetchData(this.pageOffset);
      if (data.length === 0 || data.length < this.pageSize) {
        this.pageOffset = -1;
      }
      return data;
    } else {
      throw Error('Has no more pages');
    }
  }
  async page(page) {
    this.currentPage = page;
    this.pageOffset = this.currentPage * this.pageSize;
    const data = await this.fetchData(this.pageOffset);
    if (data.length === 0 || data.length < this.pageSize) {
      this.pageOffset = -1;
    }
    return data;
  }

  /**
   * Fetches previous page.
   * @param page - the number of page to fetch
   * @return {Promise<Array>}
   */
  async previousPage() {
    if (this.hasPrevious()) {
      this.currentPage--;
      this.pageOffset = this.currentPage * this.pageSize;
      return this.fetchData(this.pageOffset);
    } else {
      throw Error('Has no more pages');
    }
  }

  /**
   * Check if has previous page
   * @return {boolean}
   */
  hasPrevious() {
    return this.currentPage > 0;
  }
}
/* harmony default export */ var sweapi_Collection = (Collection);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/routes.conf.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/

const API = {
  datastreams: {
    search: '/datastreams',
    by_id: '/datastreams/{id}',
    observations: '/datastreams/{id}/observations',
    schema: '/datastreams/{id}/schema'
  },
  systems: {
    search: '/systems',
    by_id: '/systems/{sysid}',
    details: '/systems/{sysid}/details',
    fois: '/systems/{sysid}/featuresOfInterest',
    members: '/systems/{sysid}/members',
    datastreams: '/systems/{sysid}/datastreams',
    history_ver: '/systems/{sysid}/history/{ver}',
    control_by_id: '/systems/{sysid}/controls/{dsid}',
    controls: '/systems/{sysid}/controls',
    events: '/systems/{sysid}/events',
    history: '/systems/{sysid}/history'
  },
  controls: {
    commands: '/systems/{sysid}/controls/{dsid}/commands',
    command_by_id: '/systems/{sysid}/controls/{dsid}/commands/{cmdid}',
    status: '/systems/{sysid}/controls/{dsid}/status',
    schema: '/systems/{sysid}/controls/{dsid}/schema'
  },
  commands: {
    status: '/systems/{sysid}/controls/{dsid}/commands/{cmdid}/status'
  },
  observations: {
    search: '/observations',
    by_id: '/observations/{id}'
  },
  fois: {
    search: '/featuresOfInterest',
    by_id: '/featuresOfInterest/{id}'
  }
};
/* harmony default export */ var routes_conf = (API);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/ObservationsCollection.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2021 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class ObservationsCollection extends sweapi_Collection {
  /**
   *
   */
  constructor(url, filter, pageSize, parser) {
    super(url, filter, pageSize, parser, 'arraybuffer');
  }
  async parseResponse(encodedResponse) {
    return this.parser.parseDataBlock(encodedResponse, this.filter.props.format);
  }
}
/* harmony default export */ var sweapi_ObservationsCollection = (ObservationsCollection);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/collection/SweApiCollectionObjectParser.js
class SweApiCollectionObjectParser {
  constructor(networkProperties) {
    this.networkProperties = networkProperties;
  }
  parseData(data) {}
}
/* harmony default export */ var collection_SweApiCollectionObjectParser = (SweApiCollectionObjectParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/AbstractParser.js


class AbstractParser {
  constructor() {
    this.stack = [];
    this.time = undefined;
    this.idRef = undefined;
  }
  init(element, props, path) {
    this.props = props;
    this.name = element.name;
    this.path = path;
    this.checkTime(element);
    this.checkId(element);
    this.build(element);
  }
  parseElement(element, path) {
    let parser;
    if (isDefined(path)) {
      this.path = path;
    }
    if (isDefined(this.path) && this.path in this.props.refs) {
      parser = new RefParser(this.props.refs[this.path]);
    } else if (element.name in this.props.refs) {
      parser = new RefParser(this.props.refs[element.name]);
    } else if (element.type in this.props.registeredParser) {
      parser = this.props.registeredParser[element.type]();
    } else if (element.hasOwnProperty('href')) {
      if ('href' in this.props.registeredParser) {
        parser = this.props.registeredParser['href']();
      } else {
        parser = new HRefParser();
      }
    } else if (element.type === 'DataRecord') {
      parser = new DataRecordParser(element, this.props);
    } else if (element.type === 'Vector') {
      parser = new VectorParser(element, this.props);
    } else if (element.type === 'DataArray') {
      parser = new DataArrayParser(element, this.props);
    }
    if (parser) {
      parser.init(element, this.props, this.path);
      this.stack.push(parser);
    }
  }
  build(element) {}
  parse(dataTypeParser, props, resultParent) {
    for (let parser of this.stack) {
      parser.parse(dataTypeParser, props, resultParent);
    }
  }
  checkId(element) {
    if ('id' in element) {
      this.idRef = element['id'];
      this.props.nodesId[this.idRef] = this;
    }
  }
  checkIdValue(value) {
    if (this.idRef) {
      this.props.nodesIdValue[this.idRef] = value;
    }
  }

  // To be overridden by Time parser
  checkTime(element) {}
  getTimePropertyName() {
    if (!this.time) {
      // sub element, first level
      for (let parser of this.stack) {
        this.time = parser.getTimePropertyName();
        if (this.time) {
          break;
        }
      }
    }
    return this.time;
  }
  splitRefName(ref) {
    const split = ref.split('/');
    if (split.length > 0) {
      return split[split.length - 1];
    } else {
      return ref;
    }
  }
}
class RefParser extends AbstractParser {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  build(element) {
    if (this.parser && this.parser.name) {
      this.name = this.parser.name;
    }
  }
  parse(dataTypeParser, props, resultParent) {
    this.parser.parse(dataTypeParser, props, resultParent);
  }
}
class DataRecordParser extends AbstractParser {
  build(element) {
    // DataRecords + fields
    let fieldName = undefined;
    if (element.hasOwnProperty('fields')) {
      fieldName = 'fields';
    } else if (element.hasOwnProperty('field')) {
      fieldName = 'field';
    }
    if (!fieldName) {
      return;
    }
    let currentPath = this.path ? this.path + '/' : '/';
    if (Array.isArray(element[fieldName])) {
      for (let field of element[fieldName]) {
        this.parseElement(field, currentPath + field.name);
      }
    } else {
      this.parseElement(element[fieldName], currentPath + element[fieldName].name);
    }
  }
  parse(dataTypeParser, props, resultParent) {
    if (!this.name) {
      super.parse(dataTypeParser, props, resultParent);
    } else {
      // parse size of the array
      const result = {};
      for (let parser of this.stack) {
        parser.parse(dataTypeParser, props, result);
      }
      resultParent[this.name] = result;
    }
  }
}
class DataArrayParser extends AbstractParser {
  build(element) {
    // find elementCount parser
    this.parseElement(element['elementCount']);
    this.parseElement(element['elementType']);
  }
  parse(dataTypeParser, props, resultParent) {
    // parse size of the array
    const objectSize = {};
    this.stack[0].parse(dataTypeParser, props, objectSize);
    const size = Object.values(objectSize)[0];
    const elementTypeParser = this.stack[1];
    let dataarrayResults = [];
    for (let i = 0; i < size; i++) {
      const subResult = {};
      elementTypeParser.parse(dataTypeParser, props, subResult);
      dataarrayResults.push(subResult);
    }
    resultParent[this.name] = dataarrayResults;
  }
}
class VectorParser extends AbstractParser {
  build(element) {
    // Vector + coordinate
    let coordinatePropertyName = 'coordinates';
    if ('coordinate' in element) {
      coordinatePropertyName = 'coordinate';
    }
    let currentPath = this.path ? this.path + '/' : '/';
    for (let coordinate of element[coordinatePropertyName]) {
      this.parseElement(coordinate, currentPath + coordinate.name);
    }
  }
  parse(dataTypeParser, props, resultParent) {
    // parse size of the array
    const coordinates = {};
    for (let parser of this.stack) {
      parser.parse(dataTypeParser, props, coordinates);
    }
    resultParent[this.name] = coordinates;
  }
}
class HRefParser extends AbstractParser {
  build(element) {
    // find into href tree
    const hashLink = element.href;
    if (hashLink[0] !== '#') {
      throw Error(`Href should start with #: ${hashLink}`);
    }
    // remove first #
    const id = hashLink.slice(1);
    if (!(id in this.props.nodesId)) {
      throw Error(`id ${id} not found in the id Tree`);
    }
    this.id = id;
    this.parser = this.props.nodesId[id];
  }
  parse(dataTypeParser, props, resultParent) {
    // if (!(this.id in this.props.nodesIdValue)) {
    //     throw Error(`id ${this.id} not found in the idValue Tree`);
    // }
    // resultParent[this.parser.name] = this.props.nodesIdValue[this.id];
    if (this.id in this.props.nodesIdValue) {
      resultParent[this.parser.name] = this.props.nodesIdValue[this.id];
    } else {
      this.parser.parse(dataTypeParser, props, resultParent);
    }
  }
}
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/TraverseParser.js

class TraverseParser extends AbstractParser {}
/* harmony default export */ var common_TraverseParser = (TraverseParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/RootParser.js

class RootParser extends AbstractParser {
  build(element) {
    this.parseElement(element);
  }
}
/* harmony default export */ var common_RootParser = (RootParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/GenericParser.js

class GenericParser {
  constructor(rootElement, props) {
    this.textDecoder = new TextDecoder();
    this.nodesId = {};
    this.parsers = [];
    this.count = 0;
    this.props = props;
    this.parser = new common_RootParser();
  }
  decode(input) {
    if (input instanceof ArrayBuffer) {
      return JSON.parse(this.textDecoder.decode(input));
    } else {
      try {
        return JSON.parse(input);
      } catch (e) {
        return input;
      }
    }
  }
}
/* harmony default export */ var parsers_GenericParser = (GenericParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/TimeParser.js

class TimeParser extends AbstractParser {
  parse(dataTypeParser, props, resultParent) {
    let token = dataTypeParser.nextToken(this.path);
    resultParent[this.name] = new Date(token).toISOString();
  }
  checkTime(element) {
    if ('definition' in element && (element['definition'] === 'http://www.opengis.net/def/property/OGC/0/SamplingTime' || element['definition'] === 'http://www.opengis.net/def/property/OGC/0/PhenomenonTime')) {
      this.time = this.name;
    }
  }
}
/* harmony default export */ var common_TimeParser = (TimeParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/JsonDataParser.js



class JsonDataParser extends parsers_GenericParser {
  constructor(rootElement, properties = {
    timeShift: 0
  }) {
    super(rootElement, {
      nodesId: {},
      nodesIdValue: {},
      registeredParser: {
        'Time': () => new common_TimeParser(),
        'Category': () => new common_TraverseParser(),
        'Quantity': () => new common_TraverseParser(),
        'Count': () => new common_TraverseParser(),
        'Boolean': () => new common_TraverseParser(),
        'DataChoice': () => new common_TraverseParser()
      },
      refs: {},
      ...properties
    });
    this.parser.init(rootElement, this.props);
  }
  getTimeField() {
    return this.parser.getTimePropertyName();
  }
  parseDataBlock(input) {
    let jsonData;
    if (input instanceof ArrayBuffer) {
      jsonData = JSON.parse(this.textDecoder.decode(input));
    } else {
      try {
        jsonData = JSON.parse(input);
      } catch (e) {
        jsonData = input;
      }
    }
    if (Array.isArray(jsonData)) {
      for (let d of jsonData) {
        d['timestamp'] = new Date(d[this.getTimeField()]).getTime() + this.props.timeShift;
      }
      return jsonData;
    } else {
      jsonData['timestamp'] = new Date(jsonData[this.getTimeField()]).getTime() + this.props.timeShift;
      return [jsonData];
    }
  }
}
/* harmony default export */ var parsers_JsonDataParser = (JsonDataParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/common/OmJsonParser.parser.js

class OmJsonParser extends parsers_JsonDataParser {
  constructor(rootElement) {
    super(rootElement);
  }
  getTimeField() {
    return 'phenomenonTime';
  }
}
/* harmony default export */ var OmJsonParser_parser = (OmJsonParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/observations/SweApiResult.parser.js


class SweApiResultParser {
  constructor(dataObject) {
    this.dataObject = dataObject;
    this.parsers = {
      'application/om+json': {
        schemaPromise: undefined,
        parser: undefined
      },
      'application/swe+json': {
        schemaPromise: undefined,
        parser: undefined
      },
      'application/swe+xml': {
        schemaPromise: undefined,
        parser: undefined
      },
      'application/swe+csv': {
        schemaPromise: undefined,
        parser: undefined
      },
      'application/swe+binary': {
        schemaPromise: undefined,
        parser: undefined
      }
    };
  }
  async checkParser(format) {
    if (!(format in this.parsers)) {
      throw new Error(`Not support format ${format}`);
    }
    const parser = this.parsers[format];
    if (!isDefined(parser.parser)) {
      if (!isDefined(parser.schemaPromise)) {
        this.parsers[format].schemaPromise = new Promise(async (resolve, reject) => {
          try {
            const jsonSchema = await this.dataObject.getSchema(new Filter({
              obsFormat: format
            }));
            this.init(jsonSchema, format);
            resolve();
          } catch (ex) {
            console.error(ex);
            reject(ex);
          }
        });
      }
      await parser.schemaPromise;
      return this.parsers[format].parser;
    } else {
      return parser.parser;
    }
  }
  init(schema, format) {
    throw new Error('Unsupported Operation');
  }
  async parseDataBlock(arrayBuffer, format = 'application/om+json') {
    const parser = await this.checkParser(format);
    return parser.parseDataBlock(arrayBuffer);
  }
}
/* harmony default export */ var SweApiResult_parser = (SweApiResultParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/common/SweJsonParser.parser.js

class SweJsonParser extends parsers_JsonDataParser {
  constructor(rootElement) {
    super(rootElement);
  }
}
/* harmony default export */ var SweJsonParser_parser = (SweJsonParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/SkipParser.js

class SkipParser extends AbstractParser {
  build(element) {}
  parseElement(element) {}
  parse(dataTypeParser, props, resultParent) {}
  init(element, props, path) {}
}
/* harmony default export */ var common_SkipParser = (SkipParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/BinaryEncodingParser.js

class BinaryEncodingParser extends AbstractParser {
  build(element) {
    // iterate over member
    // old SOS property name
    let memberPropertyName = 'member';

    // new SWE property name
    if ('members' in element) {
      memberPropertyName = 'members';
    }
    for (let member of element[memberPropertyName]) {
      this.parseElement(member);
    }
  }
}
/* harmony default export */ var binary_BinaryEncodingParser = (BinaryEncodingParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/MemberParser.js

class MemberParser extends AbstractParser {
  build(element) {
    this.parseElement(element);
  }
}
/* harmony default export */ var binary_MemberParser = (MemberParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryDoubleDataTypeDecoder.js
// http://www.opengis.net/def/dataType/OGC/0/double
class BinaryDoubleDataTypeDecoder {
  decode(dataView, offset, littleEndian = false) {
    return dataView.getFloat64(offset, littleEndian);
  }
  length() {
    return 8;
  }
}
/* harmony default export */ var dataType_BinaryDoubleDataTypeDecoder = (BinaryDoubleDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryIntegerDataTypeDecoder.js
//http://www.opengis.net/def/dataType/OGC/0/signedInt
class BinaryIntegerDataTypeDecoder {
  decode(dataView, offset, littleEndian = false) {
    return dataView.getUint32(offset, littleEndian);
  }
  length() {
    return 4;
  }
}
/* harmony default export */ var dataType_BinaryIntegerDataTypeDecoder = (BinaryIntegerDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryShortDataTypeDecoder.js
//http://www.opengis.net/def/dataType/OGC/0/signedShort
class BinaryShortDataTypeDecoder {
  decode(dataView, offset, littleEndian = false) {
    return dataView.getInt16(offset, littleEndian);
  }
  length() {
    return 2;
  }
}
/* harmony default export */ var dataType_BinaryShortDataTypeDecoder = (BinaryShortDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryFloat32DataTypeDecoder.js
//http://www.opengis.net/def/dataType/OGC/0/float32
class BinaryFloat32DataTypeDecoder {
  decode(dataView, offset, littleEndian = false) {
    return dataView.getFloat32(offset, littleEndian);
  }
  length() {
    return 4;
  }
}
/* harmony default export */ var dataType_BinaryFloat32DataTypeDecoder = (BinaryFloat32DataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/ComponentParser.js





class ComponentParser extends AbstractParser {
  constructor(binaryDataTypeDecoder) {
    super();
    this.refs = {};
    this.binaryDataTypeDecoder = binaryDataTypeDecoder;
  }
  build(element) {
    this.name = this.splitRefName(element.ref);
    if (element.dataType === 'http://www.opengis.net/def/dataType/OGC/0/double') {
      this.refs[element.ref] = new dataType_BinaryDoubleDataTypeDecoder();
    } else if (element.dataType === 'http://www.opengis.net/def/dataType/OGC/0/signedInt') {
      this.refs[element.ref] = new dataType_BinaryIntegerDataTypeDecoder();
    } else if (element.dataType === 'http://www.opengis.net/def/dataType/OGC/0/signedShort') {
      this.refs[element.ref] = new dataType_BinaryShortDataTypeDecoder();
    } else if (element.dataType === 'http://www.opengis.net/def/dataType/OGC/0/float32') {
      this.refs[element.ref] = new dataType_BinaryFloat32DataTypeDecoder();
    }
    if (element.ref in this.refs) {
      this.binaryDataTypeDecoder.addRef(element.ref, this.refs[element.ref]);
    }
  }
}
/* harmony default export */ var binary_ComponentParser = (ComponentParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryBlockDataTypeDecoder.js



class BinaryBlockDataTypeDecoder {
  decode(dataView, offset, littleEndian = false) {
    const pktLength = dataView.getUint32(offset, littleEndian);
    // integer | 4 bytes | 32 bits
    const data = new Uint8Array(dataView.buffer.slice(offset + 4, offset + 4 + pktLength));
    this.length = () => pktLength + 4;
    return data;
  }
  length() {
    return 0;
  }
}
/* harmony default export */ var dataType_BinaryBlockDataTypeDecoder = (BinaryBlockDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/BlockParser.js


class BlockParser extends AbstractParser {
  constructor(binaryDataTypeDecoder) {
    super();
    this.binaryDataTypeDecoder = binaryDataTypeDecoder;
  }
  build(element) {
    this.staticProps = {};
    // check for static props
    for (let prop in element) {
      if (prop !== 'ref' && prop !== 'type') {
        this.staticProps[prop] = element[prop];
      }
    }
    this.name = this.splitRefName(element.ref);
    this.path = element.ref;
    this.props.refs[element.ref] = this;
    this.binaryDataTypeDecoder.addRef(element.ref, new dataType_BinaryBlockDataTypeDecoder());
    this.binaryDataTypeDecoder.hasBlock = true;
  }
  parse(dataTypeParser, props, resultParent) {
    // everytime a binaryblock is defined in the binary encoding, there will be a 4-bytes length field before it
    const block = {
      data: dataTypeParser.nextToken(this.path)
    };
    for (let prop in this.staticProps) {
      block[prop] = this.staticProps[prop];
    }
    resultParent[this.name] = block;
  }
}
/* harmony default export */ var binary_BlockParser = (BlockParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/AbstractDataTypeDecoder.js
class AbstractDataTypeDecoder {
  constructor(props) {
    this.props = props;
  }
  init() {}
  setData(data) {
    this.data = data;
    this.init();
  }
  checkInit() {
    throw Error('Unsupported Operation');
  }
  nextToken() {
    throw Error('Unsupported Operation');
  }
  hasNextBlock() {
    throw Error('Unsupported Operation');
  }
}
/* harmony default export */ var parsers_AbstractDataTypeDecoder = (AbstractDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/dataType/BinaryDataTypeDecoder.js

class BinaryDataTypeDecoder extends parsers_AbstractDataTypeDecoder {
  constructor(props) {
    super(props);
    this.decoders = {};
    this.componentsLength = 0;
  }
  init() {
    this.data = new DataView(this.data);
    this.componentIdx = 0;
    this.tokenOffset = 0;
  }
  nextToken(path) {
    let decoder = this.decoders[path];
    // block Offset + token Offset
    const token = decoder.decode(this.data, this.tokenOffset, this.props.littleEndian);
    this.tokenOffset += decoder.length();
    return token;
  }
  hasNextBlock() {
    return this.tokenOffset < this.data.buffer.byteLength;
  }
  addRef(ref, decoder) {
    this.decoders[ref] = decoder;
    this.componentsLength += decoder.length();
  }
}
/* harmony default export */ var dataType_BinaryDataTypeDecoder = (BinaryDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/StringParser.js

class StringParser extends AbstractParser {
  parse(dataTypeParser, props, resultParent) {
    resultParent[this.name] = dataTypeParser.nextToken(this.path);
  }
}
/* harmony default export */ var common_StringParser = (StringParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/DecimalParser.js

class DecimalParser extends AbstractParser {
  parse(dataTypeParser, props, resultParent) {
    let token = dataTypeParser.nextToken(this.path);
    let val;
    if ("INF" === token || "+INF" === token) val = Number.POSITIVE_INFINITY;else if ("-INF" === token) val = Number.NEGATIVE_INFINITY;else val = parseFloat(token);
    resultParent[this.name] = val;
  }
}
/* harmony default export */ var common_DecimalParser = (DecimalParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/CountParser.js

class CountParser extends AbstractParser {
  build(element) {
    if ('value' in element) {
      this.value = parseInt(element['value']);
    }
  }
  parse(dataTypeParser, props, resultParent) {
    let value = this.value ? this.value : parseInt(dataTypeParser.nextToken(this.path));
    super.checkIdValue(value);
    resultParent[this.name] = value;
  }
}
/* harmony default export */ var common_CountParser = (CountParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/BooleanParser.js

class BooleanParser extends AbstractParser {
  parse(dataTypeParser, props, resultParent) {
    let token = dataTypeParser.nextToken(this.path);
    resultParent[this.name] = token === '0' || token.toLowerCase() === 'true';
  }
}
/* harmony default export */ var common_BooleanParser = (BooleanParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/AbstractDataChoiceParser.js

class AbstractDataChoiceParser extends AbstractParser {
  build(element) {
    let itemName = undefined;
    if (element.hasOwnProperty('items')) {
      itemName = 'items';
    } else if (element.hasOwnProperty('item')) {
      itemName = 'item';
    }
    this.itemToParserMap = {};
    for (let item of element[itemName]) {
      this.parseElement(item);
    }
    // index parser depending on input name
    for (let parser of this.stack) {
      this.itemToParserMap[parser.name] = parser;
    }
  }
  parse(dataTypeParser, props, resultParent) {
    throw new Error('Unsupported Operation');
  }
}
/* harmony default export */ var common_AbstractDataChoiceParser = (AbstractDataChoiceParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/common/DataChoiceParser.js

class DataChoiceParser extends common_AbstractDataChoiceParser {
  parse(dataTypeParser, props, resultParent) {
    let itemName = dataTypeParser.nextToken(this.path);
    this.itemToParserMap[itemName].parse(dataTypeParser, props, resultParent);
  }
}
/* harmony default export */ var common_DataChoiceParser = (DataChoiceParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/binary/BinaryTimeParser.js

class BinaryTimeParser extends common_TimeParser {
  constructor() {
    super();
  }
  parse(dataTypeParser, props, resultParent) {
    let token = dataTypeParser.nextToken(this.path);
    resultParent[this.name] = new Date(token * 1000).toISOString();
  }
}
/* harmony default export */ var binary_BinaryTimeParser = (BinaryTimeParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/BinaryDataParser.js















class BinaryDataParser extends parsers_GenericParser {
  constructor(rootElement, encoding, properties = {
    timeShift: 0
  }) {
    super(rootElement, {
      nodesId: {},
      nodesIdValue: {},
      registeredParser: {},
      refs: {},
      ...properties
    });
    this.resultEncoding = encoding;
    this.binaryDataTypeDecoder = new dataType_BinaryDataTypeDecoder({
      ...encoding,
      littleEndian: encoding.byteOrder === 'littleEndian'
    });
    const propsEncoding = {
      nodesId: {},
      nodesIdValue: {},
      registeredParser: {
        'member': () => new binary_MemberParser(),
        'Component': () => new binary_ComponentParser(this.binaryDataTypeDecoder),
        'Block': () => new binary_BlockParser(this.binaryDataTypeDecoder),
        'BinaryEncoding': () => new binary_BinaryEncodingParser()
      },
      refs: {}
    };
    // parse ResultEncoding
    const rootElementEncoding = new common_RootParser();
    rootElementEncoding.init(encoding, propsEncoding);

    // parse schema
    this.props.registeredParser = {
      'Time': () => new binary_BinaryTimeParser(),
      'Category': () => new common_StringParser(),
      'Quantity': () => new common_DecimalParser(),
      'Count': () => new common_CountParser(),
      'Boolean': () => new common_BooleanParser(),
      'DataChoice': () => new common_DataChoiceParser(),
      'href': () => new common_SkipParser()
    };
    //
    this.parser.init(rootElement, {
      ...this.props,
      refs: propsEncoding.refs
    }, '');
  }
  parseDataBlock(arrayBuffer) {
    this.binaryDataTypeDecoder.setData(arrayBuffer);
    let results = [];
    while (this.binaryDataTypeDecoder.hasNextBlock()) {
      const res = {};
      this.parser.parse(this.binaryDataTypeDecoder, {}, res);
      res['timestamp'] = new Date(res[this.parser.getTimePropertyName()]).getTime() + this.props.timeShift;
      results.push(res);
    }
    return results;
  }
}
/* harmony default export */ var parsers_BinaryDataParser = (BinaryDataParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/common/SweBinaryParser.parser.js

class SweBinaryParser extends parsers_BinaryDataParser {
  constructor(rootElement, encoding) {
    super(rootElement, encoding);
  }
}
/* harmony default export */ var SweBinaryParser_parser = (SweBinaryParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/text/TextDataTypeDecoder.js

class TextDataTypeDecoder extends parsers_AbstractDataTypeDecoder {
  constructor(props) {
    super({
      blockSeparator: ' ',
      collapseWhiteSpaces: true,
      decimalSeparator: '.',
      tokenSeparator: ',',
      ...props
    });
    this.init();
  }
  init() {
    this.blocks = [];
    this.blocksIdx = -1;
    this.tokens = [];
    this.tokensIdx = 0;
  }
  checkInit() {
    if (this.blocksIdx === -1) {
      // split
      this.blocks = this.data.split(this.props.blockSeparator);
      this.blocksIdx = 0;
    }
  }
  nextToken() {
    this.checkInit();
    // if no more token in current block
    if (this.tokensIdx >= this.tokens.length) {
      // if no more block
      if (this.blocks.length === 0 || this.blocksIdx >= this.blocks.length) {
        return null;
      }
      // parse new token
      this.tokens = this.blocks[this.blocksIdx++].split(this.props.tokenSeparator);
      this.tokensIdx = 0;
    }
    return this.tokens[this.tokensIdx++];
  }
  hasNextBlock() {
    this.checkInit();
    return this.blocks.length > 0 && this.blocksIdx < this.blocks.length && this.blocks[this.blocksIdx] !== '';
  }
}
/* harmony default export */ var text_TextDataTypeDecoder = (TextDataTypeDecoder);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/TextDataParser.js









class TextDataParser extends parsers_GenericParser {
  constructor(rootElement, encoding, properties = {
    timeShift: 0
  }) {
    super(rootElement, {
      nodesId: {},
      nodesIdValue: {},
      registeredParser: {},
      refs: {},
      ...properties
    });
    this.resultEncoding = encoding;
    this.textDataTypeDecoder = new text_TextDataTypeDecoder(this.resultEncoding);
    this.props.registeredParser = {
      'Time': () => new common_TimeParser(),
      'Category': () => new common_StringParser(),
      'Quantity': () => new common_DecimalParser(),
      'Count': () => new common_CountParser(),
      'Boolean': () => new common_BooleanParser(),
      'DataChoice': () => new common_DataChoiceParser()
    };
    this.parser.init(rootElement, this.props, '');
  }
  parseDataBlock(input) {
    let dataBlocks;
    if (input instanceof ArrayBuffer) {
      dataBlocks = this.textDecoder.decode(input);
    } else {
      dataBlocks = input;
    }
    this.textDataTypeDecoder.setData(dataBlocks);
    let results = [];
    while (this.textDataTypeDecoder.hasNextBlock()) {
      const res = {};
      this.parser.parse(this.textDataTypeDecoder, {}, res);
      res['timestamp'] = new Date(res[this.parser.getTimePropertyName()]).getTime() + this.props.timeShift;
      results.push(res);
    }
    return results;
  }
}
/* harmony default export */ var parsers_TextDataParser = (TextDataParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/common/SweCsvParser.parser.js

class SweCsvParser extends parsers_TextDataParser {
  constructor(rootElement, encoding) {
    super(rootElement, encoding);
  }
}
/* harmony default export */ var SweCsvParser_parser = (SweCsvParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/observations/SweApiResult.control.parser.js





class SweApiResultControlParser extends SweApiResult_parser {
  constructor(dataObject) {
    super(dataObject);
  }
  init(schema, format) {
    if (format === 'application/om+json') {
      //resultSchema
      this.parsers[format].parser = new OmJsonParser_parser(schema.commandSchema);
    } else if (format === 'application/swe+json') {
      //recordSchema
      this.parsers[format].parser = new SweJsonParser_parser(schema.commandSchema);
    } /*else if(format === 'application/swe+xml') {
        //recordSchema
        this.parsers[format].parser = new SweXmlParser(schema.recordSchema);
      }*/else if (format === 'application/swe+binary') {
      //recordSchema
      this.parsers[format].parser = new SweBinaryParser_parser(schema.commandSchema, schema.commandEncoding);
    } else if (format === 'application/swe+csv') {
      //recordSchema
      this.parsers[format].parser = new SweCsvParser_parser(schema.commandSchema, schema.commandEncoding);
    } else {
      throw Error(`Not supported parser format: ${format}`);
    }
  }
}
/* harmony default export */ var SweApiResult_control_parser = (SweApiResultControlParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/command/Command.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/







class Command extends sweapi_SensorWebApi {
  /**
   * @param {Object} properties - the properties of the object
   * @param {Object} [networkProperties={}]
   * @param {String} networkProperties.endpointUrl - defines the Http(s) endpoint URL
   * @param {Boolean} networkProperties.tls - defines is use Http or Https secure protocol for fetching data
   * @param {String} [networkProperties.streamProtocol='ws'] - the Stream protocol to use: 'ws' pr 'mqtt'
   * @param {Object} [networkProperties.mqttOpts={}] - the Mqtt options if stream protocol is 'mqtt'
   * @param {String} networkProperties.mqttOpts.prefix - the Mqtt prefix value
   * @param {String} networkProperties.mqttOpts.endpointUrl - the Mqtt specific endpointUrl
   */
  constructor(properties, networkProperties) {
    super(networkProperties); // network properties
    this.properties = properties;
    this.jsonParser = new collection_SweCollectionDataParser(networkProperties);
    this.sweParser = new SweApiResult_control_parser(this);
  }

  /**
   * Get all status messages associated to a specific command
   * route: /systems/{sysid}/controls/{dsid}/commands/{cmdid}/status
   * @param {CommandFilter} [commandFilter== new CommandFilter()] - default Command filter
   * @param {Number} [pageSize=10] - default page size
   * @return {Promise<Collection<JSON>>} - response as JSON
   */
  async searchStatus(commandFilter = new command_CommandFilter(), pageSize = 10) {
    return new sweapi_Collection(this.baseUrl() + routes_conf.commands.status.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties['control@id']).replace('{cmdid}', this.properties.id), commandFilter, pageSize, this.jsonParser);
  }

  /**
   * Stream all status messages associated to a specific command
   * route: /systems/{sysid}/controls/{dsid}/commands/{cmdid}/status
   * @param {CommandFilter} [commandFilter== new CommandFilter()] - default Command filter
   * @param {Function} callback
   */
  streamStatus(commandFilter = new command_CommandFilter(), callback = function () {}) {
    this.stream().onMessage = async message => {
      const dataBlock = await this.sweParser.parseDataBlock(message, commandFilter.props.format);
      callback(dataBlock);
    };
    this.stream().doRequest(routes_conf.commands.status.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties['control@id']).replace('{cmdid}', this.properties.id), commandFilter.toQueryString(), 'arraybuffer');
  }
}
/* harmony default export */ var command_Command = (Command);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/collection/SweApiFetchCommand.parser.js


class SweApiFetchCommandParser extends collection_SweApiCollectionObjectParser {
  constructor(networkProperties, systemId) {
    super(networkProperties);
    this.systemId = systemId;
  }
  parseData(data) {
    return new command_Command({
      ...data,
      systemId: this.systemId
    }, this.networkProperties);
  }
}
/* harmony default export */ var SweApiFetchCommand_parser = (SweApiFetchCommandParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/observations/SweApiResult.collection.control.parser.js

class SweApiResultCollectionControlParser extends SweApiResult_control_parser {
  constructor(dataObject) {
    super(dataObject);
  }
  init(schema, format) {
    if (format === 'application/swe+binary') {
      //resultSchema
      throw new Error(`Format not supported ${format}`);
    } else if (format === 'application/swe+xml') {
      //resultSchema
      throw new Error(`Format not supported ${format}`);
    } else {
      super.init(schema, format);
    }
  }
}
/* harmony default export */ var SweApiResult_collection_control_parser = (SweApiResultCollectionControlParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/collection/SweApiControlStatus.parser.js

class SweApiControlStatus extends collection_SweApiCollectionObjectParser {
  constructor(networkProperties) {
    super(networkProperties);
    this.textDecoder = new TextDecoder();
  }
  parseData(data, format) {
    let res;
    if (format === 'arraybuffer') {
      res = this.textDecoder.decode(data);
    } else {
      res = JSON.parse(data);
    }
    return JSON.parse(res);
  }
}
/* harmony default export */ var SweApiControlStatus_parser = (SweApiControlStatus);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/control/Control.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/











class Control extends sweapi_SensorWebApi {
  /**
   * @param {Object} properties - the properties of the object
   * @param {Object} [networkProperties={}]
   * @param {String} networkProperties.endpointUrl - defines the Http(s) endpoint URL
   * @param {Boolean} networkProperties.tls - defines is use Http or Https secure protocol for fetching data
   * @param {String} [networkProperties.streamProtocol='ws'] - the Stream protocol to use: 'ws' pr 'mqtt'
   * @param {Object} [networkProperties.mqttOpts={}] - the Mqtt options if stream protocol is 'mqtt'
   * @param {String} networkProperties.mqttOpts.prefix - the Mqtt prefix value
   * @param {String} networkProperties.mqttOpts.endpointUrl - the Mqtt specific endpointUrl
   */
  constructor(properties, networkProperties) {
    super(networkProperties); // network properties
    this.properties = properties;
    this.commandParser = new SweApiFetchCommand_parser(networkProperties, this.properties['system@id']);
    this.sweApiResultCollectionControlParser = new SweApiResult_collection_control_parser(this);
    this.sweApiResultControlParser = new SweApiResult_control_parser(this);
    this.sweApiControlStatusParser = new SweApiControlStatus_parser();
  }

  /**
   * Get the list of commands received by a particular control interface
   * route: /systems/{sysid}/controls/{dsid}/commands
   * @param {CommandFilter} [commandFilter=new CommandFilter()] - default Command filter
   * @param {Number} [pageSize=10] - default page size
   * @return {Promise<Collection<JSON>>} - result as JSON
   */
  async searchCommands(commandFilter = new command_CommandFilter(), pageSize = 10) {
    return new sweapi_ObservationsCollection(this.baseUrl() + routes_conf.controls.commands.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id), commandFilter, pageSize, this.sweApiResultCollectionControlParser);
  }

  /**
   * Stream all commands received by a particular control interface
   * route: /systems/{sysid}/controls/{dsid}/commands
   * @param {ControlFilter} [controlFilter= new ControlFilter()] - default Control filter
   * @param {Function} callback - A callback to get observations
   */
  streamCommands(controlFilter = new control_ControlFilter(), callback = function () {}) {
    this.stream().onMessage = async message => {
      const dataBlock = await this.sweApiResultControlParser.parseDataBlock(message, controlFilter.props.format);
      callback(dataBlock);
    };
    this.stream().doRequest(routes_conf.controls.commands.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id), controlFilter.toQueryString(), 'arraybuffer');
  }

  /**
   * Get a specific command resource by ID.
   * route: /systems/{sysid}/controls/{dsid}/commands/{cmdid}
   * @param {String} commandId - the ID of the Command resource
   * @param {CommandFilter} [commandFilter=new CommandFilter()] - default Command filter
   * @returns {Promise<Command>} - The corresponding Command
   */
  async getCommandById(commandId, commandFilter = new command_CommandFilter()) {
    const apiUrl = routes_conf.controls.command_by_id.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id).replace('{cmdid}', commandId);
    const queryString = commandFilter.toQueryString(['select', 'obsFormat']); //TODO: check useless obsFormat
    const jsonData = await this.fetchAsJson(apiUrl, queryString);
    return this.commandParser.parseData(jsonData);
  }

  /**
   *  Send a new command to this control interface
   *  route: /systems/{sysid}/controls/{dsid}/commands
   * @param {JSON} jsonPayload - the JSON payload
   * @param {CommandFilter} [commandFilter=new CommandFilter()] - default Command filter specifying the 'sysid' and 'dsid'
   */
  postCommand(jsonPayload, commandFilter = new command_CommandFilter()) {
    const apiUrl = routes_conf.controls.commands.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id);
    this.postAsJson(apiUrl, jsonPayload);
  }

  /**
   * Send a new command to this control interface using streaming protocol such like WS or MQTT
   * route: /systems/{sysid}/controls/{dsid}/commands
   * @param {JSON} jsonPayload - the JSON payload
   * @param {CommandFilter} [commandFilter=new CommandFilter()] - default Command filter specifying the 'sysid' and 'dsid'
   */
  publishCommand(payload, commandFilter = new command_CommandFilter()) {
    this.stream().publishRequest(routes_conf.controls.commands.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id), payload);
  }

  /**
   * Get all status messages sent by this control interface
   * route: /systems/{sysid}/controls/{dsid}/status
   * @param {ControlFilter} [controlFilter=new ControlFilter()] - default Control filter
   * @param {Number} [pageSize=10] - default page size
   * @return {Promise<Collection<JSON>>} - A Collection of JSON
   */
  async searchStatus(controlFilter = new control_ControlFilter(), pageSize = 10) {
    return new sweapi_Collection(this.baseUrl() + routes_conf.controls.status.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id), controlFilter, pageSize, this.sweApiControlStatusParser);
  }

  /**
   * Stream all status messages sent by this control interface
   * route: /systems/{sysid}/controls/{dsid}/status
   * @param {ControlFilter} [controlFilter= new ControlFilter()] - default Control filter
   * @param {Function} callback - A callback to get observations
   */
  streamStatus(controlFilter = new control_ControlFilter(), callback = function () {}) {
    this.stream().onMessage = async message => {
      const dataBlock = await this.sweApiControlStatusParser.parseData(message, 'arraybuffer');
      callback(dataBlock);
    };
    this.stream().doRequest(routes_conf.controls.status.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id), controlFilter.toQueryString(), 'arraybuffer');
  }

  /**
   * Get the detailed schema of command messages in a command stream
   * route: /systems/{sysid}/controls/{dsid}/schema
   * @param {ControlFilter} [controlFilter= new ControlFilter()] - default Control filter, using 'commandFormat' to select response format
   * @returns {Promise<JSON>} - The schema as JSON
   */
  async getSchema(controlFilter = new control_ControlFilter()) {
    const apiUrl = routes_conf.controls.schema.replace('{sysid}', this.properties['system@id']).replace('{dsid}', this.properties.id);
    const queryString = controlFilter.toQueryString(['select', 'commandFormat']);
    return this.fetchAsJson(apiUrl, queryString);
  }
}
/* harmony default export */ var control_Control = (Control);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/datastream/DataStreamFilter.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/


class DataStreamFilter extends Filter {
  /**
   *
   * @param {Object} properties - object properties
   * @param {string[]} [properties.q=undefined] - Comma separated keywords used for full-text search
   * @param {number[]} [properties.bbox=undefined] - BBOX to filter resources on their location
   * @param {string} [properties.location=undefined] - WKT geometry and operator to filter resources on their location or geometry
   * @param {string[]} [properties.observedProperty=undefined] - Comma separated list of observed property URIs to get observations for
   * @param {string[]} [properties.featureOfInterest=undefined] - Comma separated list of feature of interest IDs to get observations for
   * @param {string[]} [properties.select=undefined] - Comma separated list of properties to include or exclude from results (use "!" prefix to exclude)
   * @param {string} [properties.format='application/json'] - Mime type designating the format to use to encode the response.
   * @param {string} [properties.validTime=undefined] - validTime - ISO 8601 time range to filter resources on their validity time.
   * When this parameter is omitted, the implicit value is "now", except for "history" collections where the absence of this parameter means no filtering is applied.
   * @param {string} [properties.resultTime=undefined] - validTime - ISO 8601 time range to filter observations on their result time.
   * When this parameter is omitted, no filtering on "resultTime" is applied.
   * @param {string} [properties.phenomenonTime=undefined] - validTime - ISO 8601 time range to filter observations on the phenomenon time.
   * When this parameter is omitted, no filtering on "phenomenonTime" is applied.
   */
  constructor(properties) {
    super({
      q: undefined,
      bbox: undefined,
      location: undefined,
      observedProperty: undefined,
      featureOfInterest: undefined,
      select: undefined,
      format: 'application/json',
      obsFormat: 'application/om+json',
      validTime: undefined,
      phenomenonTime: undefined,
      resultTime: undefined,
      ...properties // merge defined properties
    });
    //TODO: assertions
  }
}

/* harmony default export */ var datastream_DataStreamFilter = (DataStreamFilter);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/observations/SweApiResult.datastream.parser.js






class SweApiResultDatastreamParser extends SweApiResult_parser {
  constructor(dataObject) {
    super(dataObject);
  }
  init(schema, format) {
    if (format in this.parsers && isDefined(this.parsers[format].parser)) {
      return this.parsers[format].parser;
    }
    if (format === 'application/om+json') {
      //resultSchema
      this.parsers[format].parser = new OmJsonParser_parser(schema.resultSchema);
    } else if (format === 'application/swe+json') {
      //recordSchema
      this.parsers[format].parser = new SweJsonParser_parser(schema.recordSchema);
    } /*else if(format === 'application/swe+xml') {
        //recordSchema
        this.parsers[format].parser = new SweXmlParser(schema.recordSchema);
      }*/else if (format === 'application/swe+binary') {
      //recordSchema
      this.parsers[format].parser = new SweBinaryParser_parser(schema.recordSchema, schema.recordEncoding);
    } else if (format === 'application/swe+csv') {
      //recordSchema
      this.parsers[format].parser = new SweCsvParser_parser(schema.recordSchema, schema.recordEncoding);
    } else {
      throw Error(`Not supported parser format: ${format}`);
    }
  }
}
/* harmony default export */ var SweApiResult_datastream_parser = (SweApiResultDatastreamParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/collection/CollectionOmJsonParser.parser.js


class OmJsonCollectionParser extends OmJsonParser_parser {
  constructor(rootElement) {
    super(rootElement);
  }
  getTimeField() {
    return 'phenomenonTime';
  }
  parseDataBlock(arrayBuffer) {
    let dataBlock = this.textDecoder.decode(arrayBuffer);
    const jsonData = JSON.parse(dataBlock);
    const result = [];
    for (let d of jsonData.items) {
      d['timestamp'] = new Date(d[this.getTimeField()]).getTime();
      result.push(d);
    }
    return result;
  }
}
/* harmony default export */ var CollectionOmJsonParser_parser = (OmJsonCollectionParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sweapi/observations/SweApiResult.collection.datastream.parser.js


class SweApiResultCollectionDatastreamParser extends SweApiResult_datastream_parser {
  constructor(dataObject) {
    super(dataObject);
  }
  init(schema, format) {
    if (format === 'application/om+json') {
      //resultSchema
      this.parsers[format].parser = new CollectionOmJsonParser_parser(schema.resultSchema);
    } else if (format === 'application/swe+xml') {
      //resultSchema
      throw new Error(`Format not supported ${format}`);
    } else {
      super.init(schema, format);
    }
  }
}
/* harmony default export */ var SweApiResult_collection_datastream_parser = (SweApiResultCollectionDatastreamParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/sweapi/datastream/DataStream.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/








class DataStream extends sweapi_SensorWebApi {
  /**
   * @param {Object} properties - the properties of the object
   * @param {Object} [networkProperties={}]
   * @param {String} networkProperties.endpointUrl - defines the Http(s) endpoint URL
   * @param {Boolean} networkProperties.tls - defines is use Http or Https secure protocol for fetching data
   * @param {String} [networkProperties.streamProtocol='ws'] - the Stream protocol to use: 'ws' pr 'mqtt'
   * @param {Object} [networkProperties.mqttOpts={}] - the Mqtt options if stream protocol is 'mqtt'
   * @param {String} networkProperties.mqttOpts.prefix - the Mqtt prefix value
   * @param {String} networkProperties.mqttOpts.endpointUrl - the Mqtt specific endpointUrl
   */
  constructor(properties, networkProperties) {
    super(networkProperties); // network properties
    this.properties = properties;
    this.sweApiResultParser = new SweApiResult_datastream_parser(this);
    this.sweApiResultCollectionDatastreamParser = new SweApiResult_collection_datastream_parser(this);
  }

  /**
   * Retrieve historical observations from a datastream
   * route: /datastreams/{id}/observations
   * @param {ObservationFilter} [observationFilter=new ObservationFilter()] - default ObservationFilter
   * @param {Function} callback - A callback to get observations
   */
  streamObservations(observationFilter = new observation_ObservationFilter(), callback = function () {}) {
    this.stream().onMessage = async message => {
      const dataBlock = await this.sweApiResultParser.parseDataBlock(message, observationFilter.props.format);
      callback(dataBlock);
    };
    return this.stream().doRequest(routes_conf.datastreams.observations.replace('{id}', this.properties.id), observationFilter.toQueryString([], ['phenomenonTime']), 'arraybuffer');
  }

  /**
   * Retrieve historical observations from a datastream
   * route: /datastreams/{id}/observations
   * @param {ObservationFilter} [observationFilter=new ObservationFilter()] - default ObservationFilter
   * @param {Number} [pageSize=10] - default page size
   * @param {DataSourceParser} [parser=new SweApiResultParser()] - default observations parser
   * @return {Collection<JSON>} - result observations as JSON
   */
  async searchObservations(observationFilter = new observation_ObservationFilter(), pageSize = 10, parser = this.sweApiResultParser) {
    return new sweapi_ObservationsCollection(this.baseUrl() + routes_conf.datastreams.observations.replace('{id}', this.properties.id), observationFilter, pageSize, this.sweApiResultCollectionDatastreamParser);
  }

  /**
   * Get the schema of a datastream
   * route: /datastreams/{id}/schema
   * @param {DataStreamFilter} [dataStreamFilter=new DataStreamFilter()] - default datastream filter
   * @return {Promise<JSON>} - the JSON schema
   */
  async getSchema(dataStreamFilter = new datastream_DataStreamFilter()) {
    const apiUrl = routes_conf.datastreams.schema.replace('{id}', this.properties.id);
    const queryString = dataStreamFilter.toQueryString(['select', 'obsFormat']);
    return this.fetchAsJson(apiUrl, queryString);
  }
}
/* harmony default export */ var datastream_DataStream = (DataStream);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sweapi/context/SweApi.realtime.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/





class SweApiRealTimeContext extends SweApi_context {
  init(properties) {
    this.properties = properties;
    const networkProperties = {
      ...properties,
      streamProtocol: properties.protocol
    };
    let filter;
    let regex = new RegExp('\\/systems\\/(.*)\\/controls\\/(.*)\\/status');
    this.streamObject = undefined;

    // check control status
    if (regex.test(properties.resource)) {
      filter = this.createControlFilter(properties);
      // is observation streaming
      const match = regex.exec(properties.resource);
      this.streamObject = new control_Control({
        id: match[2],
        'system@id': match[1]
      }, networkProperties);
      this.streamFunction = function () {
        this.streamObject.streamStatus(filter, messages => this.onStreamMessage(messages, filter.props.format));
      };
    } else {
      // check for datastream observations
      regex = new RegExp('\\/(.*\\/)(.*)\\/observations'); // /datastreams/abc13/observations
      if (regex.test(properties.resource)) {
        filter = this.createObservationFilter(properties);
        // is observation streaming
        const match = regex.exec(properties.resource);
        this.streamObject = new datastream_DataStream({
          id: match[2]
        }, networkProperties);
        this.streamFunction = function () {
          this.streamObject.streamObservations(filter, messages => this.onStreamMessage(messages, filter.props.format));
        };
      }
    }
    this.streamObject.stream().onChangeStatus = this.onChangeStatus.bind(this);
  }
  onStreamMessage(messages, format) {
    // in case of om+json ,we have to add the timestamp which is not included for each record but at the root level
    let results = messages;
    let version = this.properties.version;
    for (let message of messages) {
      message.version = version;
    }
    this.handleData(results, format);
  }
  connect() {
    this.streamFunction();
  }
  async disconnect() {
    if (isDefined(this.streamObject)) {
      this.streamObject.stream().disconnect();
    }
  }
  isConnected() {
    return this.streamObject.stream().status;
  }
}
/* harmony default export */ var SweApi_realtime_context = (SweApiRealTimeContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sweapi/context/SweApi.replay.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/





class SweApiReplayContext extends SweApi_context {
  init(properties) {
    this.collection = undefined;
    this.relativeStartTimestamp = undefined;
    this.properties = properties;
    this.replayFunction = undefined;
    const networkProperties = {
      ...properties
    };
    let filter;
    let regex = new RegExp('\\/systems\\/(.*)\\/controls\\/(.*)\\/status');

    // check control status
    if (regex.test(properties.resource)) {
      filter = this.createControlFilter(properties);
      // is observation streaming
      const match = regex.exec(properties.resource);
      let control = new control_Control({
        id: match[2],
        'system@id': match[1]
      }, networkProperties);
      this.replayFunction = function (props, startTimestamp, endTimestamp) {
        const controlFilter = this.createControlFilter({
          ...properties,
          ...props,
          startTime: new Date(startTimestamp).toISOString(),
          endTime: new Date(endTimestamp).toISOString()
        });
        return control.searchStatus(controlFilter, 1);
      };
    } else {
      // check for datastream observations
      regex = new RegExp('\\/(.*\\/)(.*)\\/observations'); // /datastreams/abc13/observations
      if (regex.test(properties.resource)) {
        // is observation streaming
        const match = regex.exec(properties.resource);
        let dataStream = new datastream_DataStream({
          id: match[2]
        }, networkProperties);
        this.dataStream = dataStream;
        this.replayFunction = function (props, startTime, endTime) {
          const obsFilter = this.createObservationFilter({
            ...properties,
            ...props,
            replaySpeed: undefined,
            startTime: startTime,
            endTime: endTime
          });
          return dataStream.searchObservations(obsFilter, properties.prefetchBatchSize);
        };
      }
    }
  }
  async disconnect() {
    this.collection = undefined;
    this.relativeStartTimestamp = undefined;
    this.replayFunction = undefined;
  }
  async nextBatch(properties, masterTimestamp, status = {
    cancel: false
  }) {
    let version = this.properties.version;
    return new Promise(async (resolve, reject) => {
      try {
        let data;
        let results = [];
        const moveTimeCursor = async () => {
          let relativeStartTime;
          if (isDefined(this.relativeStartTimestamp)) {
            relativeStartTime = new Date(this.relativeStartTimestamp + 1).toISOString();
          } else {
            //TOCHECK: ISO or timestamp
            relativeStartTime = new Date(this.properties.startTime).toISOString();
          }
          console.warn(`fetching ${relativeStartTime} -> ` + `${this.properties.endTime} for datasource ${this.properties.dataSourceId}`);
          // if disconnected, replay function is reset
          if (this.replayFunction) {
            this.collection = await this.replayFunction(properties, relativeStartTime, this.properties.endTime);
          }
        };
        const fetchNext = async () => {
          data = await this.collection.nextPage();
          if (status.cancel) {
            reject('Status has been cancelled');
          }
          if (data.length > 0) {
            results = data;
            for (let d of results) {
              d.version = version;
            }
            if (status.cancel) {
              reject('Status has been cancelled');
            } else {
              // start startTime cursor
              this.relativeStartTimestamp = results[results.length - 1].timestamp;
              resolve(data);
            }
          }
        };
        await moveTimeCursor();
        await fetchNext();
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
/* harmony default export */ var SweApi_replay_context = (SweApiReplayContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sweapi/handler/SweApi.handler.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/





class SweApiHandler extends TimeSeries_handler {
  createContext(properties) {
    if (properties.mode === Mode.REPLAY || properties.mode === Mode.BATCH) {
      return new SweApi_replay_context();
    } else {
      return new SweApi_realtime_context();
    }
  }
}
/* harmony default export */ var SweApi_handler = (SweApiHandler);
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/WebSocketFetchConnector.js

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






/**
 * Defines the WebSocketConnector to connect to a remote server by creating a WebSocket channel.
 * @extends DataConnector
 * @example
 * import WebSocketConnector from 'osh-js/dataconnector/WebSocketConnector.js';
 *
 * let url = ...;
 * let connector = new WebSocketConnector(url);
 *
 * // connect
 * connector.connect();
 *
 * // disconnect
 * connector.disconnect();
 *
 * // close
 * connector.close();
 *
 */

class WebSocketFetchConnector extends connector_WebSocketConnector {
  /**
   * Connect to the webSocket. If the system supports WebWorker, it will automatically creates one otherwise use
   * the main thread.
   */
  doRequest(extraUrl = this.extraUrl, queryString = this.queryString) {
    return new Promise(async (resolve, reject) => {
      this.extraUrl = extraUrl;
      this.queryString = queryString;
      let fullUrl = this.getUrl() + extraUrl;
      console.log(fullUrl);
      if (isDefined(queryString)) {
        fullUrl += '?' + queryString;
      }
      this.closed = false;
      this.init = true;
      //creates Web Socket
      this.ws = new WebSocket(fullUrl);
      this.ws.binaryType = 'arraybuffer';
      this.checkStatus(Status.CONNECTING);
      console.warn('WebSocket stream connecting');
      const results = [];
      this.ws.onopen = function (event) {
        this.checkAndClearReconnection();
        this.checkStatus(Status.CONNECTED);
        console.warn('WebSocket stream connected');
      }.bind(this);
      this.ws.onmessage = function (event) {
        this.lastReceiveTime = Date.now();
        //callback data on message received
        if (event.data.byteLength > 0) {
          // this.onMessage(event.data);
          results.push(event.data);
        }
      }.bind(this);

      // closes socket if any errors occur
      this.ws.onerror = function (event) {
        console.error('WebSocket stream error');
        this.checkStatus(Status.CLOSED_ERROR);
        this.init = false;
        this.lastReceiveTime = -1;
        this.createReconnection();
        this.onError(event);
        reject(`onError WS: ${event}`);
      }.bind(this);
      this.ws.onclose = event => {
        console.warn('WebSocket stream closed: ', event.reason, event.code);
        if (event.code !== 1000 && !this.closed) {
          this.checkStatus(Status.CLOSED_ERROR);
          this.createReconnection();
        }
        this.onClose(event.code);
        resolve(results);
      };
      if (this.reconnectionInterval !== -1) {
        clearInterval(this.reconnectionInterval);
        this.reconnectionInterval = -1;
      }
    });
  }
}
/* harmony default export */ var connector_WebSocketFetchConnector = (WebSocketFetchConnector);
;// CONCATENATED MODULE: ../../osh-js/source/core/connector/HttpConnector.js
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





/**
 * Defines the AjaxConnector to connect to a remote server by making AjaxRequest.
 * @extends DataConnector
 * @example
 * import Ajax from 'core/protocol/Ajax.js';
 *
 * let request = ...;
 * let protocol = new Ajax(url);
 *
 * // handle onSuccess
 * protocol.onSuccess = function(event) {
 *  // does something
 * }
 *
 * protocol.onError = function(event) {
 *  // does something
 * }
 *
 * // send request
 * protocol.sendRequest(request);
 *
 */
class HttpConnector extends connector_DataConnector {
  /**
   * Creates Ajax.
   * @param {String} url -
   * @param {Object} properties -
   * @param {String} properties.method -
   * @param {String} properties.headers -
   */
  constructor(url, properties) {
    super(url, properties);
    this.method = "POST";
    if (isDefined(properties)) {
      if (properties.method) {
        this.method = properties.method;
      }
      if (properties.headers) {
        this.headers = properties.headers;
      }
    }
  }

  /**
   * Sends the request to the defined server.
   * @param {String} extraUrl - extra url to append to the url
   * @param {String} queryString - get query parameters
   */
  async doRequest(extraUrl = '', queryString = undefined, responseType = undefined) {
    let domain = this.getUrl();
    let fullUrl = domain + extraUrl;
    if (isDefined(queryString)) {
      fullUrl += '?' + queryString;
    }
    const that = this;
    // default
    const promiseResponse = fetch(fullUrl, {
      method: this.method,
      headers: this.headers
    }).then(function process(response) {
      if (!response.ok) {
        const err = new Error(`Got ${response.status} response from ${domain}`);
        err.response = response;
        throw err;
      }
      // if(responseTypeVar === 'application/json') {
      //     return response.json();
      // } else if(responseTypeVar === 'plain/text'){
      //     return response.text();
      // } else {
      return response.arrayBuffer();
      // const reader = response.body.getReader();
      // reader.read().then(function processText({ done, value }) {
      //     console.log(value);
      //     return reader.read().then(processText)
      // });
    })
    // Create a new response out of the stream
    .catch(err => console.error(err));
    const response = await promiseResponse;
    this.onMessage(response);
    return response;
  }
  async postRequest(extraUrl = '', payload = {}, responseType = undefined) {
    let fullUrl = this.getUrl() + extraUrl;
    // default
    await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        ...this.headers
      },
      body: payload
    });
  }

  /**
   * This is the callback method in case of getting error connection.
   * @param event The error details
   * @event
   */
  onError(event) {}

  /**
   * This is the callback method in case of getting success connection.
   * @param event
   * @event
   */
  onMessage(event) {}
  async disconnect() {}

  /**
   * Sends the request
   * @private
   */
  connect() {
    return this.doRequest();
  }
  isConnected() {
    return false;
  }
}
/* harmony default export */ var connector_HttpConnector = (HttpConnector);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/Sos.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/






class SosContext extends DataSource_context {
  constructor(parser) {
    super();
    this.parser = parser;
  }
  async init(properties) {
    this.parser.init(properties);
    return super.init(properties);
  }
  async checkInit() {}
  async createDataConnector(properties) {
    const tls = properties.tls ? 's' : '';

    // issue with SOS < 1.4, binary data cannot be fetch as HTTP in octet-stream, must use WebSocket as workaround
    await this.checkInit();
    if (this.parser.parser instanceof parsers_BinaryDataParser) {
      const url = 'ws' + tls + '://' + properties.endpointUrl;
      return new connector_WebSocketFetchConnector(url, properties);
    } else {
      //
      const url = 'http' + tls + '://' + properties.endpointUrl;
      return new connector_HttpConnector(url, {
        ...properties,
        method: 'GET'
      });
    }
  }

  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.protocol the protocol protocol
   * @param {String} properties.endpointUrl the endpoint url
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Object} properties.customUrlParams - the encoding options
   * @param {Number} properties.customUrlParams.video_bitrate - define a custom bitrate (in b/s)
   * @param {Number} properties.customUrlParams.video_scale - define a custom scale, 0.0 < value < 1.0
   * @param {Number} properties.customUrlParams.video_width - define a custom width
   * @param {Number} properties.customUrlParams.video_height - define a custom height
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = "";

    // adds service
    queryString = "service=" + properties.service;

    // adds version
    queryString += "&version=2.0";

    // adds responseFormat (optional)
    if (properties.responseFormat) {
      queryString += "&responseFormat=" + properties.responseFormat;
    }
    if (isDefined(properties.customUrlParams) && Object.keys(properties.customUrlParams).length > 0) {
      queryString += '&';
      for (let key in properties.customUrlParams) {
        queryString += key + '=' + properties.customUrlParams[key] + '&';
      }
      if (url.endsWith('&')) {
        queryString = url.slice(0, -1);
      }
    }
    return queryString;
  }
}
/* harmony default export */ var Sos_context = (SosContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/SWEXmlStreamParser.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2020 Sensia Software LLC. All Rights Reserved.

 Author: Alex Robin <alex.robin@sensiasoft.com>

 ******************************* END LICENSE BLOCK ***************************/

const entityMap = {
  lt: '<',
  gt: '>',
  amp: '&',
  quot: '"',
  apos: "'",
  Agrave: "À",
  Aacute: "Á",
  Acirc: "Â",
  Atilde: "Ã",
  Auml: "Ä",
  Aring: "Å",
  AElig: "Æ",
  Ccedil: "Ç",
  Egrave: "È",
  Eacute: "É",
  Ecirc: "Ê",
  Euml: "Ë",
  Igrave: "Ì",
  Iacute: "Í",
  Icirc: "Î",
  Iuml: "Ï",
  ETH: "Ð",
  Ntilde: "Ñ",
  Ograve: "Ò",
  Oacute: "Ó",
  Ocirc: "Ô",
  Otilde: "Õ",
  Ouml: "Ö",
  Oslash: "Ø",
  Ugrave: "Ù",
  Uacute: "Ú",
  Ucirc: "Û",
  Uuml: "Ü",
  Yacute: "Ý",
  THORN: "Þ",
  szlig: "ß",
  agrave: "à",
  aacute: "á",
  acirc: "â",
  atilde: "ã",
  auml: "ä",
  aring: "å",
  aelig: "æ",
  ccedil: "ç",
  egrave: "è",
  eacute: "é",
  ecirc: "ê",
  euml: "ë",
  igrave: "ì",
  iacute: "í",
  icirc: "î",
  iuml: "ï",
  eth: "ð",
  ntilde: "ñ",
  ograve: "ò",
  oacute: "ó",
  ocirc: "ô",
  otilde: "õ",
  ouml: "ö",
  oslash: "ø",
  ugrave: "ù",
  uacute: "ú",
  ucirc: "û",
  uuml: "ü",
  yacute: "ý",
  thorn: "þ",
  yuml: "ÿ",
  nbsp: " ",
  iexcl: "¡",
  cent: "¢",
  pound: "£",
  curren: "¤",
  yen: "¥",
  brvbar: "¦",
  sect: "§",
  uml: "¨",
  copy: "©",
  ordf: "ª",
  laquo: "«",
  not: "¬",
  shy: "­­",
  reg: "®",
  macr: "¯",
  deg: "°",
  plusmn: "±",
  sup2: "²",
  sup3: "³",
  acute: "´",
  micro: "µ",
  para: "¶",
  middot: "·",
  cedil: "¸",
  sup1: "¹",
  ordm: "º",
  raquo: "»",
  frac14: "¼",
  frac12: "½",
  frac34: "¾",
  iquest: "¿",
  times: "×",
  divide: "÷",
  forall: "∀",
  part: "∂",
  exist: "∃",
  empty: "∅",
  nabla: "∇",
  isin: "∈",
  notin: "∉",
  ni: "∋",
  prod: "∏",
  sum: "∑",
  minus: "−",
  lowast: "∗",
  radic: "√",
  prop: "∝",
  infin: "∞",
  ang: "∠",
  and: "∧",
  or: "∨",
  cap: "∩",
  cup: "∪",
  'int': "∫",
  there4: "∴",
  sim: "∼",
  cong: "≅",
  asymp: "≈",
  ne: "≠",
  equiv: "≡",
  le: "≤",
  ge: "≥",
  sub: "⊂",
  sup: "⊃",
  nsub: "⊄",
  sube: "⊆",
  supe: "⊇",
  oplus: "⊕",
  otimes: "⊗",
  perp: "⊥",
  sdot: "⋅",
  Alpha: "Α",
  Beta: "Β",
  Gamma: "Γ",
  Delta: "Δ",
  Epsilon: "Ε",
  Zeta: "Ζ",
  Eta: "Η",
  Theta: "Θ",
  Iota: "Ι",
  Kappa: "Κ",
  Lambda: "Λ",
  Mu: "Μ",
  Nu: "Ν",
  Xi: "Ξ",
  Omicron: "Ο",
  Pi: "Π",
  Rho: "Ρ",
  Sigma: "Σ",
  Tau: "Τ",
  Upsilon: "Υ",
  Phi: "Φ",
  Chi: "Χ",
  Psi: "Ψ",
  Omega: "Ω",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  zeta: "ζ",
  eta: "η",
  theta: "θ",
  iota: "ι",
  kappa: "κ",
  lambda: "λ",
  mu: "μ",
  nu: "ν",
  xi: "ξ",
  omicron: "ο",
  pi: "π",
  rho: "ρ",
  sigmaf: "ς",
  sigma: "σ",
  tau: "τ",
  upsilon: "υ",
  phi: "φ",
  chi: "χ",
  psi: "ψ",
  omega: "ω",
  thetasym: "ϑ",
  upsih: "ϒ",
  piv: "ϖ",
  OElig: "Œ",
  oelig: "œ",
  Scaron: "Š",
  scaron: "š",
  Yuml: "Ÿ",
  fnof: "ƒ",
  circ: "ˆ",
  tilde: "˜",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  lrm: "‎",
  rlm: "‏",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  dagger: "†",
  Dagger: "‡",
  bull: "•",
  hellip: "…",
  permil: "‰",
  prime: "′",
  Prime: "″",
  lsaquo: "‹",
  rsaquo: "›",
  oline: "‾",
  euro: "€",
  trade: "™",
  larr: "←",
  uarr: "↑",
  rarr: "→",
  darr: "↓",
  harr: "↔",
  crarr: "↵",
  lceil: "⌈",
  rceil: "⌉",
  lfloor: "⌊",
  rfloor: "⌋",
  loz: "◊",
  spades: "♠",
  clubs: "♣",
  hearts: "♥",
  diams: "♦"
};
/**
 * Javascript binding for SWE requests
 *
 */
class SWEXmlStreamParser {
  /**
   *
   * @param {String} xml -
   */
  constructor(xml = 'undefined') {
    this.originalXml = xml;
  }

  /**
   * Sets the xml file to parse.
   * @param {String} xml -
   */
  setXml(xml) {
    this.originalXml = xml;
  }

  /**
   * @private
   * @return {Set<string>}
   */
  static get arrayNodeSet() {
    return new Set(['featureMember', 'offering', 'observableProperty', 'field', 'coordinate', 'item', 'quality', 'member', 'interval', 'AllowedValues/value']);
  }

  /**
   * @private
   * @return {Set<string>}
   */
  static get numericalNodeSet() {
    return new Set(['nilValue', 'paddingBytes-after', 'paddingBytes-before', 'byteLength', 'significantBits', 'bitLength', 'Time/value', 'Quantity/value', 'Count/value']);
  }

  /**
   * Gets the result of the parsing as Json object.
   * @return {Object} The JSON result
   */
  toJson() {
    var options = {};
    var S = this.originalXml;
    var pos = options.pos || 0;
    var openBracket = "<";
    var openBracketCC = "<".charCodeAt(0);
    var closeBracket = ">";
    var closeBracketCC = ">".charCodeAt(0);
    var minus = "-";
    var minusCC = "-".charCodeAt(0);
    var slash = "/";
    var slashCC = "/".charCodeAt(0);
    var exclamation = '!';
    var exclamationCC = '!'.charCodeAt(0);
    var singleQuote = "'";
    var singleQuoteCC = "'".charCodeAt(0);
    var doubleQuote = '"';
    var doubleQuoteCC = '"'.charCodeAt(0);
    var arrayNodeSet = SWEXmlStreamParser.arrayNodeSet;
    var numericalNodeSet = SWEXmlStreamParser.numericalNodeSet;
    function isArray(name) {
      return arrayNodeSet.has(name);
    }

    /**
     * parsing a list of entries
     */
    function parseChildren(node) {
      while (S[pos]) {
        if (S.charCodeAt(pos) == openBracketCC) {
          if (S.charCodeAt(pos + 1) === slashCC) {
            pos = S.indexOf(closeBracket, pos);
            if (pos + 1) pos += 1;
            return;
          } else if (S.charCodeAt(pos + 1) === exclamationCC) {
            if (S.charCodeAt(pos + 2) == minusCC) {
              //comment support
              while (pos !== -1 && !(S.charCodeAt(pos) === closeBracketCC && S.charCodeAt(pos - 1) == minusCC && S.charCodeAt(pos - 2) == minusCC && pos != -1)) {
                pos = S.indexOf(closeBracket, pos + 1);
              }
              if (pos === -1) {
                pos = S.length;
              }
            } else {
              // doctypesupport
              pos += 2;
              while (S.charCodeAt(pos) !== closeBracketCC && S[pos]) {
                pos++;
              }
            }
            pos++;
            continue;
          }
          var child = parseNode();
          var childName = child.type;
          if (childName === 'type')
            // don't override special 'type' attribute!
            continue;
          var isProperty = childName.charAt(0) == childName.charAt(0).toLowerCase(); //Object.keys(child).length == 2;
          if (isProperty && child.hasOwnProperty('value')) {
            if (isArray(childName)) {
              if (!node.hasOwnProperty(childName)) node[childName] = [];
              node[childName].push(child.value);
            } else {
              node[childName] = child.value;
            }
          } else {
            // skip one level if child is an OGC property
            if (isProperty) {
              delete child.type;
              for (var k in child) {
                if (typeof child[k] === 'object' && k !== 'name') {
                  Object.assign(child, child[k]);
                  delete child[k];
                }
              }
            }
            if (isArray(childName)) {
              if (!node.hasOwnProperty(childName)) node[childName] = [];
              node[childName].push(child);
            } else {
              node[childName] = child;
            }
          }
        } else {
          var text = parseText();
          if (text.trim().length > 0) {
            if (numericalNodeSet.has(node.type)) node.value = parseFloat(text);else node.value = text;
          }
          pos++;
        }
      }
    }

    /**
     *    returns the text outside of texts until the first '<'
     */
    function parseText() {
      var start = pos;
      pos = S.indexOf(openBracket, pos) - 1;
      if (pos === -2) pos = S.length;
      return S.slice(start, pos + 1);
    }

    /**
     *    returns text until the first nonAlphebetic letter
     */
    var nameSpacer = '\n\t>/= ';
    function parseName() {
      var start = pos;
      while (nameSpacer.indexOf(S[pos]) === -1 && S[pos]) {
        pos++;
      }
      return S.slice(start, pos);
    }
    function getLocalName(qname) {
      var nsEnd = qname.indexOf(':');
      if (nsEnd > 0) return qname.substring(nsEnd + 1);else return qname;
    }
    function fixedFromCharCode(code) {
      // String.prototype.fromCharCode does not supports
      // > 2 bytes unicode chars directly
      if (code > 0xffff) {
        code -= 0x10000;
        const surrogate1 = 0xd800 + (code >> 10),
          surrogate2 = 0xdc00 + (code & 0x3ff);
        return String.fromCharCode(surrogate1, surrogate2);
      } else {
        return String.fromCharCode(code);
      }
    }
    function entityReplacer(a) {
      const k = a.slice(1, -1);
      if (k in entityMap) {
        return entityMap[k];
      } else if (k.charAt(0) === '#') {
        return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
      } else {
        throw Error('entity not found:' + a);
        return a;
      }
    }
    function parseNode() {
      var node = {};
      pos++;
      node.type = getLocalName(parseName());

      // parsing attributes
      while (S.charCodeAt(pos) !== closeBracketCC && S[pos]) {
        var c = S.charCodeAt(pos);
        if (c > 64 && c < 91 || c > 96 && c < 123) {
          //if('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(S[pos])!==-1 ){
          var qname = parseName();
          var name = getLocalName(qname);
          // search beginning of the string
          var code = S.charCodeAt(pos);
          while (code && code !== singleQuoteCC && code !== doubleQuoteCC && !(code > 64 && code < 91 || code > 96 && code < 123) && code !== closeBracketCC) {
            pos++;
            code = S.charCodeAt(pos);
          }
          if (code === singleQuoteCC || code === doubleQuoteCC) {
            var value = parseString();
            if (pos === -1) {
              return node;
            }
          } else {
            value = null;
            pos--;
          }
          if (!qname.startsWith('xmlns:')) node[name] = value.replace(/&#?\w+;/g, entityReplacer);
        }
        pos++;
      }

      // optional parsing of children
      if (S.charCodeAt(pos - 1) !== slashCC) {
        pos++;
        parseChildren(node);
      } else {
        pos++;
      }
      return node;
    }

    /**
     *    is parsing a string, that starts with a char and with the same usually  ' or "
     */

    function parseString() {
      var startChar = S[pos];
      var startpos = ++pos;
      pos = S.indexOf(startChar, startpos);
      return S.slice(startpos, pos);
    }
    var out = parseNode();
    out.pos = pos;
    return out;
  }
}
/* harmony default export */ var parsers_SWEXmlStreamParser = (SWEXmlStreamParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sos/SosGetFois.parser.js


class SosGetFoisParser {
  constructor() {
    this.textDecoder = new TextDecoder();
  }
  init(properties) {}
  /**
  * Extract data from the message. The message is in XML format following the OGC specification
  * @param {Object} data - the data to parse
  * @return {Object} the parsed data
  * @example
     <?xml version='1.0' encoding='UTF-8'?>
     <sos:GetFeatureOfInterestResponse xmlns:sos="http://www.opengis.net/sos/2.0"
                                       xmlns:gml="http://www.opengis.net/gml/3.2"
                                       xmlns:xlink="http://www.w3.org/1999/xlink"
                                       xmlns:ns1="http://www.opengis.net/sensorml/2.0">
         <sos:featureMember>
             <ns1:PhysicalSystem gml:id="FE12">
                 <gml:description>Vehicle FE12 from Huntsville Fire Department</gml:description>
                 <gml:identifier codeSpace="uid">urn:core:sensor:avl:911:fleet:FE12</gml:identifier>
                 <gml:name>FE12</gml:name>
             </ns1:PhysicalSystem>
         </sos:featureMember>
         <sos:featureMember>
             <ns1:PhysicalSystem gml:id="FE4">
                 <gml:description>Vehicle FE4 from Huntsville Fire Department</gml:description>
                 <gml:identifier codeSpace="uid">urn:core:sensor:avl:911:fleet:FE4</gml:identifier>
                 <gml:name>FE4</gml:name>
             </ns1:PhysicalSystem>
         </sos:featureMember>
     </sos:GetFeatureOfInterestResponse>
  */
  async parseDataBlock(data) {
    let rec = data;
    if (data instanceof ArrayBuffer) {
      rec = this.textDecoder.decode(data);
    }
    let sweXmlParser = new parsers_SWEXmlStreamParser(rec);
    sweXmlParser.setXml(rec);
    const json = sweXmlParser.toJson();
    assertDefined(json.GetFeatureOfInterestResponse, 'json.GetFeatureOfInterestResponse does not exist');
    assertDefined(json.GetFeatureOfInterestResponse.featureMember, 'json.GetFeatureOfInterestResponse.featureMember does not exist');
    return json.GetFeatureOfInterestResponse.featureMember;
  }
}
/* harmony default export */ var SosGetFois_parser = (SosGetFoisParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/SosGetFois.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/




class SosGetFoisContext extends Sos_context {
  constructor() {
    super(new SosGetFois_parser());
  }

  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.protocol the protocol protocol
   * @param {String} properties.endpointUrl the endpoint url
   * @param {String} properties.service the service
   * @param {String} properties.procedureId the foi procedure id
   * @param {String} [properties.responseFormat=application/xml] the response format (e.g video/mp4)
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = super.getQueryString({
      responseFormat: 'application/xml',
      ...properties
    });
    // adds request
    queryString += "&request=GetFeatureOfInterest";

    // adds foiURN if any
    if (isDefined(properties.procedureId)) {
      queryString += '&procedure=' + properties.procedureId;
    }
    return queryString;
  }
  async parseData(messages) {
    return this.parser.parseDataBlock(messages);
  }
  connect() {
    if (isDefined(this.connector)) {
      this.connector.doRequest('', this.getQueryString(this.properties)).then(async encodedData => {
        const decodedData = await this.parseData(encodedData);
        this.handleData(decodedData);
      });
    } else {
      throw Error('there is no connector defined');
    }
  }
}
/* harmony default export */ var SosGetFois_context = (SosGetFoisContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/handler/SosGetFois.handler.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/



class SosGetFoisHandler extends DataSource_handler {
  createContext(properties) {
    return new SosGetFois_context();
  }
}
/* harmony default export */ var SosGetFois_handler = (SosGetFoisHandler);
;// CONCATENATED MODULE: ../../osh-js/source/core/parsers/sos/SosGetResult.parser.js





class SosGetResultParser {
  constructor() {
    this.templatePromise = undefined;
  }
  init(properties) {
    this.properties = properties;
  }
  async fetchGetResultTemplate(properties) {
    assertDefined(this.properties, 'Properties are not defined, the parser has not been initialized');
    const getResultTemplateUrl = this.buildGetResultTemplateUrl(properties);
    const response = await fetch(getResultTemplateUrl);
    const template = await response.text();

    //
    if ('responseFormat' in properties && properties.responseFormat === 'application/json') {
      this.parser = new parsers_JsonDataParser(JSON.parse(template), {
        timeShift: this.properties.timeShift || 0
      });
    } else {
      let sweXmlParser = new parsers_SWEXmlStreamParser(template);
      const json = sweXmlParser.toJson();
      let respSchema;
      // Retro compatibility
      if (isDefined(json.GetResultTemplateResponse)) {
        respSchema = json.GetResultTemplateResponse;
      } else {
        respSchema = json;
      }
      let resultEncoding = respSchema.resultEncoding;
      let rootElement = respSchema.resultStructure;
      if (resultEncoding && resultEncoding.type === 'TextEncoding') {
        this.parser = new parsers_TextDataParser(rootElement, resultEncoding, {
          timeShift: this.properties.timeShift || 0
        });
      } else if (resultEncoding && resultEncoding.type === 'BinaryEncoding') {
        this.parser = new parsers_BinaryDataParser(rootElement, resultEncoding, {
          timeShift: this.properties.timeShift || 0
        });
      } else {
        throw Error('Not supported parser format');
      }
    }
  }
  async checkInit() {
    if (!this.initialized) {
      if (!isDefined(this.templatePromise)) {
        this.templatePromise = this.fetchGetResultTemplate(this.properties);
      }
      await this.templatePromise;
      this.initialized = true;
    }
  }
  async parseDataBlock(arrayBuffer) {
    await this.checkInit();
    return this.parser.parseDataBlock(arrayBuffer);
  }

  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.protocol the protocol protocol
   * @param {String} properties.endpointUrl the endpoint url
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {String} properties.foiId the foiId
   * @param {String} properties.startTime the start time (ISO format)
   * @param {String} properties.endTime the end time (ISO format)
   * @param {Number} properties.replaySpeed the replay factor
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Date} properties.lastTimeStamp - the last timestamp to start at this time (ISO String)
   * @param {Object} properties.customUrlParams - the encoding options
   * @return {String} the full url
   */
  buildUrl(properties) {
    let url = super.buildUrl({
      ...properties
    });

    // adds feature of interest urn
    if (properties.foiId && properties.of !== '') {
      url += '&featureOfInterest=' + properties.foiId;
    }
    return url;
  }
  buildGetResultTemplateUrl(properties) {
    let url = '';
    const protocol = properties.tls ? 'https' : 'http';
    url += protocol + '://' + properties.endpointUrl + '?';
    url += "service=SOS";
    url += "&version=2.0";

    // adds request
    url += "&request=GetResultTemplate";

    // adds offering
    url += "&offering=" + properties.offeringID;

    // adds observedProperty
    url += "&observedProperty=" + properties.observedProperty;
    if ('responseFormat' in properties) {
      url += "&responseFormat=" + properties.responseFormat;
    }
    return url;
  }
}
/* harmony default export */ var SosGetResult_parser = (SosGetResultParser);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/SosGetResult.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/



class SosGetResultContext extends Sos_context {
  constructor() {
    super(new SosGetResult_parser());
  }

  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {String} properties.startTime the start time (ISO format)
   * @param {String} properties.endTime the end time (ISO format)
   * @param {Number} properties.replaySpeed the replay factor
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Object} properties.customUrlParams - the encoding options
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = super.getQueryString(properties);

    // adds request
    queryString += "&request=GetResult";

    // adds offering
    queryString += "&offering=" + properties.offeringID;

    // adds observedProperty
    queryString += "&observedProperty=" + properties.observedProperty;
    return queryString;
  }
}
/* harmony default export */ var SosGetResult_context = (SosGetResultContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/SosGetResult.realtime.context.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/





class SosGetResultRealTimeContext extends SosGetResult_context {
  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {String} properties.startTime the start time (ISO format)
   * @param {String} properties.endTime the end time (ISO format)
   * @param {Number} properties.replaySpeed the replay factor
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Object} properties.customUrlParams - the encoding options
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = super.getQueryString(properties);

    // adds temporalFilter
    queryString += "&temporalFilter=phenomenonTime,now/2055-01-01Z";
    return queryString;
  }
  createDataConnector(properties) {
    const tls = properties.tls ? 's' : '';
    const url = properties.protocol + tls + '://' + properties.endpointUrl;
    let connector;

    // if we switch of protocol
    if (properties.protocol === 'ws') {
      connector = new connector_WebSocketConnector(url, properties);
    } else if (properties.protocol === 'mqtt') {
      const tls = properties.tls ? 's' : '';
      const url = properties.protocol + tls + '://' + properties.mqttOpts.endpointUrl;
      connector = new connector_MqttConnector(url, properties);
    } else {
      throw Error(`Unsupported connector ${properties.protocol}`);
    }
    return connector;
  }
  async onMessage(messages, format) {
    const data = await this.parseData(messages);
    const version = this.properties.version;
    if (Array.isArray(data)) {
      for (let d of data) {
        d.version = version;
      }
    } else {
      data.version = version;
    }
    this.handleData(data);
  }
  connect() {
    if (isDefined(this.connector)) {
      this.connector.doRequest('', this.getQueryString(this.properties));
    } else {
      throw Error('there is no connector defined');
    }
  }
  async disconnect() {
    this.connector.disconnect();
  }
  async parseData(messages) {
    return this.parser.parseDataBlock(messages);
  }
  onChangeStatus(status) {
    console.log(status);
  }
}
/* harmony default export */ var SosGetResult_realtime_context = (SosGetResultRealTimeContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/SosGetResult.replay.context.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/



class SosGetResultReplayContext extends SosGetResult_context {
  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {String} properties.startTime the start time (ISO format)
   * @param {String} properties.endTime the end time (ISO format)
   * @param {Number} properties.replaySpeed the replay factor
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Object} properties.customUrlParams - the encoding options
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = super.getQueryString(properties);
    const startTime = properties.startTime;
    const endTime = properties.endTime;

    // adds temporalFilter
    queryString += "&temporalFilter=phenomenonTime," + startTime + "/" + endTime;
    // queryString += `&replaySpeed=${properties.replaySpeed}`;

    // TODO: server issue, waiting for fix
    // queryString += "&responseFormat=application/octet-stream";

    return queryString;
  }
  async checkInit() {
    return this.parser.checkInit();
  }
  async init(properties) {
    this.startTimestamp = new Date(properties.startTime).getTime();
    this.endTimestamp = new Date(properties.endTime).getTime();
    this.relativeDate = undefined;
    return super.init(properties);
  }
  async disconnect() {
    this.relativeDate = undefined;
  }
  async nextBatch(properties, masterTimestamp, status = {
    cancel: false
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        let fetchDuration = this.properties.prefetchBatchDuration;
        const moveTimeCursor = async () => {
          return new Promise(async (resolve, reject) => {
            if (isDefined(this.relativeDate)) {
              // move cursor ahead
              this.relativeDate = new Date(this.relativeDate.getTime() + fetchDuration);
            } else {
              this.relativeDate = new Date(this.properties.startTime);
            }
            resolve();
          });
        };
        const fetchNext = async (startTime, endTime) => {
          const version = this.properties.version;
          return new Promise(async (resolve, reject) => {
            console.warn(`fetching ${startTime} -> ` + `${endTime} for datasource ${this.properties.dataSourceId}`);
            let data = await this.connector.doRequest('', this.getQueryString({
              ...this.properties,
              ...properties,
              startTime: startTime,
              endTime: endTime
            }));
            let results = [];

            // this is because binary < 1.4 issue and the use of WS. In case in using WS, the data are provided in an array
            if (Array.isArray(data)) {
              for (let d of data) {
                const parsedData = await this.parseData(d);
                parsedData.map(elt => {
                  elt.version = version;
                  return elt;
                });
                results.push(...parsedData);
              }
            } else {
              const parsedData = await this.parseData(data);
              parsedData.map(elt => {
                elt.version = version;
                return elt;
              });
              results.push(...parsedData);
            }
            if (status.cancel) {
              reject('Status=canceled');
            } else {
              resolve(results);
            }
          });
        };
        let data;
        do {
          await moveTimeCursor();
          data = await fetchNext(this.relativeDate.toISOString(), new Date(this.relativeDate.getTime() + fetchDuration).toISOString());
        } while (data.length === 0 && this.relativeDate.getTime() < this.endTimestamp);
        resolve(data);
      } catch (ex) {
        reject(ex);
      }
    });
  }
  async parseData(messages) {
    return this.parser.parseDataBlock(messages);
  }
  isConnected() {
    return isDefined(this.connector) && this.connector.isConnected();
  }
  async disconnect() {}
}
/* harmony default export */ var SosGetResult_replay_context = (SosGetResultReplayContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/context/SosGetResult.batch.context.js

/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/



class SosGetResultBatchContext extends SosGetResult_context {
  /**
   * Builds the full url.
   * @protected
   * @param {Object} properties
   * @param {String} properties.service the service
   * @param {String} properties.offeringID the offeringID
   * @param {String} properties.observedProperty the observed property
   * @param {String} properties.startTime the start time (ISO format)
   * @param {String} properties.endTime the end time (ISO format)
   * @param {Number} properties.replaySpeed the replay factor
   * @param {Number} properties.responseFormat the response format (e.g video/mp4)
   * @param {Object} properties.customUrlParams - the encoding options
   * @return {String} the full url
   */
  getQueryString(properties) {
    let queryString = super.getQueryString(properties);
    const startTime = properties.startTime;
    const endTime = properties.endTime;

    // adds temporalFilter
    queryString += "&temporalFilter=phenomenonTime," + startTime + "/" + endTime;
    // TODO: server issue, waiting for fix
    // queryString += "&responseFormat=application/octet-stream";

    return queryString;
  }
  async checkInit() {
    return this.parser.checkInit();
  }
  async init(properties) {
    this.startTimestamp = new Date(properties.startTime).getTime();
    this.endTimestamp = new Date(properties.endTime).getTime();
    this.relativeDate = undefined;
    return super.init(properties);
  }
  async disconnect() {
    this.relativeDate = undefined;
  }
  async nextBatch(properties, startTime, endTime, status = {
    cancel: false
  }) {
    return new Promise(async (resolve, reject) => {
      try {
        const results = [];
        await this.parser.templatePromise;
        const data = await this.connector.doRequest('', this.getQueryString({
          ...this.properties,
          ...properties,
          startTime: startTime,
          endTime: endTime
        }));
        if (status.cancel) {
          reject();
        } else {
          // this is because binary < 1.4 issue and the use of WS. In case in using WS, the data are provided in a array
          if (Array.isArray(data)) {
            for (let d of data) {
              results.push(...(await this.parseData(d)));
            }
          } else {
            results.push(...(await this.parseData(data)));
          }
          if (status.cancel) {
            reject('Status=canceled');
          }
          resolve(results);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }
  async parseData(messages) {
    return this.parser.parseDataBlock(messages);
  }
  isConnected() {
    return isDefined(this.connector) && this.connector.isConnected();
  }
}
/* harmony default export */ var SosGetResult_batch_context = (SosGetResultBatchContext);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/sos/handler/SosGetResult.handler.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/






class SosGetResultHandler extends TimeSeries_handler {
  createContext(properties) {
    if (properties.mode === Mode.REAL_TIME) {
      return new SosGetResult_realtime_context();
    } else if (properties.mode === Mode.REPLAY) {
      return new SosGetResult_replay_context();
    } else if (properties.mode === Mode.BATCH) {
      return new SosGetResult_batch_context();
    }
    throw Error(`Not supported mode=${properties.mode}`);
  }
}
/* harmony default export */ var SosGetResult_handler = (SosGetResultHandler);
;// CONCATENATED MODULE: ../../osh-js/source/core/datasource/worker/DataSource.worker.js
/***************************** BEGIN LICENSE BLOCK ***************************

 The contents of this file are subject to the Mozilla Public License, v. 2.0.
 If a copy of the MPL was not distributed with this file, You can obtain one
 at http://mozilla.org/MPL/2.0/.

 Software distributed under the License is distributed on an "AS IS" basis,
 WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 for the specific language governing rights and limitations under the License.

 Copyright (C) 2015-2022 Georobotix Inc. All Rights Reserved.

 Author: Mathieu Dhainaut <mathieu.dhainaut@gmail.com>

 ******************************* END LICENSE BLOCK ***************************/






let dataSourceHandler = undefined;

self.onmessage = async (event) => {
    handleMessage(event);
};

async function handleMessage(event) {
    let resp = {};
    if (event.data.ackId) {
        resp.ackId = event.data.ackId;
    }
    let returnValue;
    const eventData = event.data;

    try {
        if (!isDefined(dataSourceHandler)) {
            if (eventData.message === 'init') {
                dataSourceHandler = createHandlerFromProperties(eventData.properties);
                await dataSourceHandler.init(eventData.properties, eventData.topics, eventData.id);
                console.log(dataSourceHandler.delegateHandler);
                returnValue = dataSourceHandler.isInitialized();
            }
        } else {
            if (eventData.message === 'connect') {
                await dataSourceHandler.connect(eventData.startTime, eventData.version);
            } else if (eventData.message === 'disconnect') {
                await dataSourceHandler.disconnect();
            } else if (eventData.message === 'topics') {
                dataSourceHandler.setTopics(eventData.topics);
            } else if (eventData.message === 'update-properties') {
                dataSourceHandler.updateProperties(eventData.data);
            } else if (eventData.message === 'is-connected') {
                returnValue = dataSourceHandler.isConnected();
            } else if (eventData.message === 'is-init') {
                returnValue = dataSourceHandler.isInitialized();
            }
        }
    } catch (ex) {
        console.error(ex);
        resp.error = ex;
    } finally {
        resp.data = returnValue;
        self.postMessage(resp);
    }
}

function createHandlerFromProperties(properties) {
    if (properties.type === 'SosGetResult') {
        return new SosGetResult_handler();
    } else if (properties.type === 'SosGetFois') {
        return new SosGetFois_handler();
    } else if (properties.type === 'SweApiStream') {
        return new SweApi_handler();
    } else {
        throw Error('Unsupported SOS service Error');
    }
}

}();
/******/ })()
;
//# sourceMappingURL=DataSource.worker.99fcd24d.worker.js.map