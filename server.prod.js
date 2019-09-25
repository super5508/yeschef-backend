module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "hot/" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "hot/" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "46e297e633a7fb977ae4";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const production = {\n  \"mongo\": {\n    \"url\": \"mongodb+srv://yc-be:LHxTBQ6xWfWq4PL@yeschef-users-jjwej.mongodb.net/test?retryWrites=true&w=majority\"\n  }\n};\nconst development = {\n  \"mongo\": {\n    \"url_\": \"mongodb+srv://yc-be-dev:W26Fbq9G2Xq92dH@dev-nppzv.mongodb.net/test?retryWrites=true&w=majority\",\n    \"url\": \"mongodb+srv://yc-be-dev:6Fbq9G2Xq92dH@dev-nppzv.mongodb.net/test?retryWrites=true&w=majority\"\n  }\n};\nmodule.exports = {\n  production,\n  development\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb25maWcuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb25maWcuanM/YTFiYyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwcm9kdWN0aW9uID0ge1xyXG4gICAgXCJtb25nb1wiOiB7XHJcbiAgICAgICAgXCJ1cmxcIjogXCJtb25nb2RiK3NydjovL3ljLWJlOkxIeFRCUTZ4V2ZXcTRQTEB5ZXNjaGVmLXVzZXJzLWpqd2VqLm1vbmdvZGIubmV0L3Rlc3Q/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5XCJcclxuICAgIH1cclxufTtcclxuY29uc3QgZGV2ZWxvcG1lbnQgPSB7XHJcbiAgICBcIm1vbmdvXCI6IHtcclxuICAgICAgICBcInVybF9cIjogXCJtb25nb2RiK3NydjovL3ljLWJlLWRldjpXMjZGYnE5RzJYcTkyZEhAZGV2LW5wcHp2Lm1vbmdvZGIubmV0L3Rlc3Q/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5XCIsXHJcbiAgICAgICAgXCJ1cmxcIjogXCJtb25nb2RiK3NydjovL3ljLWJlLWRldjo2RmJxOUcyWHE5MmRIQGRldi1ucHB6di5tb25nb2RiLm5ldC90ZXN0P3JldHJ5V3JpdGVzPXRydWUmdz1tYWpvcml0eVwiXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcHJvZHVjdGlvbixcclxuICAgIGRldmVsb3BtZW50XHJcbn0iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFPQTtBQUNBO0FBQ0E7QUFGQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./config.js\n");

/***/ }),

/***/ "./modules/Admin.js":
/*!**************************!*\
  !*** ./modules/Admin.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {\n  admin,\n  isAdmin\n} = __webpack_require__(/*! ./FBAdmin */ \"./modules/FBAdmin.js\").admin;\n\nconst UsersMongo = __webpack_require__(/*! ./MongoImpl/UsersMongo */ \"./modules/MongoImpl/UsersMongo.js\");\n\nconst docsMongo = __webpack_require__(/*! ./MongoImpl/DocsMongo */ \"./modules/MongoImpl/DocsMongo.js\");\n\nconst adminUpdateUser = async (req, res) => {\n  const body = req.body;\n\n  if (isAdmin(body.authToken)) {\n    const userRecord = await admin.auth().getUserByEmail(req.params.email);\n    const id = userRecord.uid;\n    UsersMongo.updateUserDataMongo(id, body.data);\n    res.send('');\n  } else {\n    res.status(401).end();\n  }\n};\n\nconst adminGetUser = async (req, res) => {\n  const body = req.body;\n\n  if (isAdmin(body.authToken)) {\n    const userRecord = await admin.auth().getUserByEmail(req.params.email);\n    const id = userRecord.uid;\n    const user = await UsersMongo.getUserDataMongo(id);\n    res.end(JSON.stringify(user));\n  } else {\n    res.status(401).end();\n  }\n};\n\nconst adminDocsUpdate = async (req, res) => {\n  const body = req.body;\n\n  if (isAdmin(body.authToken)) {\n    docsMongo.replaceDocsMongo(body.db, body.collection, body.docIdKey, body.data);\n  } else {\n    res.status(401).end();\n  }\n};\n\nmodule.exports = {\n  adminUpdateUser,\n  adminGetUser,\n  adminDocsUpdate\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL0FkbWluLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9BZG1pbi5qcz83MmM1Il0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgYWRtaW4sIGlzQWRtaW4gfSA9IHJlcXVpcmUoJy4vRkJBZG1pbicpLmFkbWluO1xyXG5jb25zdCBVc2Vyc01vbmdvID0gcmVxdWlyZSgnLi9Nb25nb0ltcGwvVXNlcnNNb25nbycpO1xyXG5jb25zdCBkb2NzTW9uZ28gPSByZXF1aXJlKCcuL01vbmdvSW1wbC9Eb2NzTW9uZ28nKTtcclxuXHJcbmNvbnN0IGFkbWluVXBkYXRlVXNlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgaWYgKGlzQWRtaW4oYm9keS5hdXRoVG9rZW4pKSB7XHJcbiAgICAgICAgY29uc3QgdXNlclJlY29yZCA9IGF3YWl0IGFkbWluLmF1dGgoKS5nZXRVc2VyQnlFbWFpbChyZXEucGFyYW1zLmVtYWlsKTtcclxuICAgICAgICBjb25zdCBpZCA9IHVzZXJSZWNvcmQudWlkO1xyXG4gICAgICAgIFVzZXJzTW9uZ28udXBkYXRlVXNlckRhdGFNb25nbyhpZCwgYm9keS5kYXRhKTtcclxuICAgICAgICByZXMuc2VuZCgnJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgYWRtaW5HZXRVc2VyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICBpZiAoaXNBZG1pbihib2R5LmF1dGhUb2tlbikpIHtcclxuICAgICAgICBjb25zdCB1c2VyUmVjb3JkID0gYXdhaXQgYWRtaW4uYXV0aCgpLmdldFVzZXJCeUVtYWlsKHJlcS5wYXJhbXMuZW1haWwpO1xyXG4gICAgICAgIGNvbnN0IGlkID0gdXNlclJlY29yZC51aWQ7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXJzTW9uZ28uZ2V0VXNlckRhdGFNb25nbyhpZCk7XHJcbiAgICAgICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeSh1c2VyKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgYWRtaW5Eb2NzVXBkYXRlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICBjb25zdCBib2R5ID0gcmVxLmJvZHk7XHJcbiAgICBpZiAoaXNBZG1pbihib2R5LmF1dGhUb2tlbikpIHtcclxuICAgICAgICBkb2NzTW9uZ28ucmVwbGFjZURvY3NNb25nbyhib2R5LmRiLCBib2R5LmNvbGxlY3Rpb24sIGJvZHkuZG9jSWRLZXksIGJvZHkuZGF0YSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBhZG1pblVwZGF0ZVVzZXIsXHJcbiAgICBhZG1pbkdldFVzZXIsXHJcbiAgICBhZG1pbkRvY3NVcGRhdGVcclxufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./modules/Admin.js\n");

/***/ }),

/***/ "./modules/Chefs.js":
/*!**************************!*\
  !*** ./modules/Chefs.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let esClient;\n\nconst init = _esClient => {\n  esClient = _esClient;\n};\n\nconst getInfo = async (req, res) => {\n  res.set(\"Cache-Control\", \"max-age=86400\");\n  let response;\n\n  try {\n    const getChefResponse = await esClient.get({\n      index: \"chefs\",\n      id: req.params.id\n    });\n    response = JSON.stringify(getChefResponse.body._source);\n  } catch (e) {\n    console.warn(\"error in getting chef's data\");\n    console.warn(e);\n    response = \"error in getting chef's data\";\n    res.status(500);\n  }\n\n  res.send(response);\n};\n\nmodule.exports = {\n  init,\n  getInfo\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL0NoZWZzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9DaGVmcy5qcz8yOWNmIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBlc0NsaWVudDtcclxuXHJcbmNvbnN0IGluaXQgPSAoX2VzQ2xpZW50KSA9PiB7XHJcbiAgICBlc0NsaWVudCA9IF9lc0NsaWVudDtcclxufVxyXG5cclxuY29uc3QgZ2V0SW5mbyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgcmVzLnNldChcIkNhY2hlLUNvbnRyb2xcIiwgXCJtYXgtYWdlPTg2NDAwXCIpO1xyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBnZXRDaGVmUmVzcG9uc2UgPSBhd2FpdCBlc0NsaWVudC5nZXQoe1xyXG4gICAgICAgICAgICBpbmRleDogXCJjaGVmc1wiLFxyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5pZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXNwb25zZSA9IEpTT04uc3RyaW5naWZ5KGdldENoZWZSZXNwb25zZS5ib2R5Ll9zb3VyY2UpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcImVycm9yIGluIGdldHRpbmcgY2hlZidzIGRhdGFcIik7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgIHJlc3BvbnNlID0gXCJlcnJvciBpbiBnZXR0aW5nIGNoZWYncyBkYXRhXCI7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApXHJcbiAgICB9XHJcblxyXG4gICAgcmVzLnNlbmQocmVzcG9uc2UpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBpbml0LFxyXG4gICAgZ2V0SW5mb1xyXG59Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/Chefs.js\n");

/***/ }),

/***/ "./modules/Classes.js":
/*!****************************!*\
  !*** ./modules/Classes.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let esClient;\nlet LessonsModule;\n\nexports.init = (_esClient, _lessonsModule) => {\n  esClient = _esClient;\n  LessonsModule = _lessonsModule;\n};\n\nexports.getClassList = async (req, res) => {\n  res.set(\"Cache-Control\", \"max-age=86400\");\n  let response;\n\n  try {\n    const classesResponse = await esClient.search({\n      index: \"classes\",\n      size: 500,\n      body: {\n        query: {\n          bool: {\n            must: [],\n            filter: [{\n              bool: {\n                must_not: {\n                  multi_match: {\n                    type: \"best_fields\",\n                    query: \"isStaging = true\",\n                    lenient: true\n                  }\n                }\n              }\n            }]\n          }\n        }\n      }\n    });\n    const classesArray = classesResponse.body.hits.hits;\n    response = JSON.stringify(classesArray.map(_class => {\n      const {\n        chefName,\n        classTitle,\n        chefImg,\n        comingSoon\n      } = _class._source;\n      return {\n        id: _class._id,\n        chefName,\n        classTitle,\n        chefImg,\n        comingSoon: comingSoon || false\n      };\n    }));\n    console.log(response);\n  } catch (e) {\n    const errMsg = \"error in getting class List data\";\n    console.warn(errMsg);\n    console.warn(e);\n    response = errMsg;\n    res.status(500);\n  }\n\n  res.send(response);\n};\n\nexports.getInfo = async (req, res) => {\n  res.set(\"Cache-Control\", \"max-age=86400\");\n  let response;\n\n  try {\n    const getClassResponse = await esClient.get({\n      index: 'classes',\n      id: req.params.id\n    });\n    const classInfoObj = getClassResponse.body._source;\n    const lessonsList = await LessonsModule.getLiteLessonsByIdList(classInfoObj.lessons);\n    response = JSON.stringify({ ...classInfoObj,\n      lessons: lessonsList\n    });\n  } catch (e) {\n    const errMsg = \"error in getting class's data\";\n    console.warn(errMsg);\n    console.warn(e);\n    response = errMsg;\n    res.status(500);\n  }\n\n  res.send(response);\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL0NsYXNzZXMuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tb2R1bGVzL0NsYXNzZXMuanM/YjA1OCJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZXNDbGllbnQ7XHJcbmxldCBMZXNzb25zTW9kdWxlO1xyXG5cclxuZXhwb3J0cy5pbml0ID0gKF9lc0NsaWVudCwgX2xlc3NvbnNNb2R1bGUpID0+IHtcclxuICAgIGVzQ2xpZW50ID0gX2VzQ2xpZW50O1xyXG4gICAgTGVzc29uc01vZHVsZSA9IF9sZXNzb25zTW9kdWxlO1xyXG59XHJcblxyXG5leHBvcnRzLmdldENsYXNzTGlzdCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgcmVzLnNldChcIkNhY2hlLUNvbnRyb2xcIiwgXCJtYXgtYWdlPTg2NDAwXCIpO1xyXG4gICAgbGV0IHJlc3BvbnNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjbGFzc2VzUmVzcG9uc2UgPSBhd2FpdCBlc0NsaWVudC5zZWFyY2goe1xyXG4gICAgICAgICAgICBpbmRleDogXCJjbGFzc2VzXCIsXHJcbiAgICAgICAgICAgIHNpemU6IDUwMCxcclxuICAgICAgICAgICAgYm9keToge1xyXG4gICAgICAgICAgICAgICAgcXVlcnk6IHtcclxuICAgICAgICAgICAgICAgICAgICBib29sOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG11c3Q6IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29sOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVzdF9ub3Q6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXVsdGlfbWF0Y2g6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiYmVzdF9maWVsZHNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXJ5OiBcImlzU3RhZ2luZyA9IHRydWVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmllbnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCBjbGFzc2VzQXJyYXkgPSBjbGFzc2VzUmVzcG9uc2UuYm9keS5oaXRzLmhpdHM7XHJcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeShjbGFzc2VzQXJyYXkubWFwKF9jbGFzcyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgY2hlZk5hbWUsIGNsYXNzVGl0bGUsIGNoZWZJbWcsIGNvbWluZ1Nvb24gfSA9IF9jbGFzcy5fc291cmNlO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IF9jbGFzcy5faWQsXHJcbiAgICAgICAgICAgICAgICBjaGVmTmFtZSxcclxuICAgICAgICAgICAgICAgIGNsYXNzVGl0bGUsXHJcbiAgICAgICAgICAgICAgICBjaGVmSW1nLFxyXG4gICAgICAgICAgICAgICAgY29taW5nU29vbjogY29taW5nU29vbiB8fCBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zdCBlcnJNc2cgPSBcImVycm9yIGluIGdldHRpbmcgY2xhc3MgTGlzdCBkYXRhXCI7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGVyck1zZyk7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgIHJlc3BvbnNlID0gZXJyTXNnO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKVxyXG4gICAgfVxyXG4gICAgcmVzLnNlbmQocmVzcG9uc2UpO1xyXG59XHJcblxyXG5leHBvcnRzLmdldEluZm8gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHJlcy5zZXQoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT04NjQwMFwiKTtcclxuICAgIGxldCByZXNwb25zZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZ2V0Q2xhc3NSZXNwb25zZSA9IGF3YWl0IGVzQ2xpZW50LmdldCh7XHJcbiAgICAgICAgICAgIGluZGV4OiAnY2xhc3NlcycsXHJcbiAgICAgICAgICAgIGlkOiByZXEucGFyYW1zLmlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzSW5mb09iaiA9IGdldENsYXNzUmVzcG9uc2UuYm9keS5fc291cmNlO1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbnNMaXN0ID0gYXdhaXQgTGVzc29uc01vZHVsZS5nZXRMaXRlTGVzc29uc0J5SWRMaXN0KGNsYXNzSW5mb09iai5sZXNzb25zKTtcclxuXHJcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeSh7IC4uLmNsYXNzSW5mb09iaiwgbGVzc29uczogbGVzc29uc0xpc3QgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc3QgZXJyTXNnID0gXCJlcnJvciBpbiBnZXR0aW5nIGNsYXNzJ3MgZGF0YVwiO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlcnJNc2cpO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgICByZXNwb25zZSA9IGVyck1zZztcclxuICAgICAgICByZXMuc3RhdHVzKDUwMClcclxuICAgIH1cclxuICAgIHJlcy5zZW5kKHJlc3BvbnNlKTtcclxufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFEQTtBQURBO0FBREE7QUFGQTtBQURBO0FBREE7QUFIQTtBQXVCQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFFQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./modules/Classes.js\n");

/***/ }),

/***/ "./modules/FBAdmin.js":
/*!****************************!*\
  !*** ./modules/FBAdmin.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const admin = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n\nconst UsersMongo = __webpack_require__(/*! ./MongoImpl/UsersMongo */ \"./modules/MongoImpl/UsersMongo.js\");\n\nvar serviceAccount = {\n  \"type\": \"service_account\",\n  \"project_id\": \"yeschef-7b155\",\n  \"private_key_id\": \"606b52dfa45531697a3a6b794f365ba3ba036fd0\",\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3V2Rc9z5O08N2\\n48iordergZqK8pqQJkSlzmoc/zA8qIk6ClKhX3bKp+h37aw19qOkcv01gQ9SmvqV\\nAwSBFmxUjjv90XYra9Pr+Wup10WYPx6VvPXw9wk6z5lznjAgJdk7ZyHd3ZVwBXbd\\nzPQpcFYahV7sq347uxl2G9OaEP31Wlt5eBtPpLJRhPBWc9OCGtHJh+AnjKIZCDjj\\nyAud5EqKxTO/hxv5MPxDiAggGu6T0trCyIrGQJzh4BpfmMsKgdrK0Os7KwKGbpid\\nSkOYMb3wkwK88b3jh/XUQtUqIdlmdVaPETArStKcKe0y844fEnF6bXqZEjqPR/N6\\niSRQ/ayhAgMBAAECggEAAZJOciyNXGwcwg1gSC/bSCVPf47mS8OENZ6gErkOPwrb\\nyENT4323vTN0vuhq4DiJvQxeRsHhMX5SFQpmVLvuOEhS09Fij6s4MQ7dgSJu/ofV\\n+YcZ3ZOkgNxMLq1FsNTaOJPg+q+eSwxE8VBDLILBvi7z+hfbOGRZasWAyhKItrxo\\njke29ACIPGLLMPOgHJQmDDCmTRe7HQPArJqLjvePhgz9vQXJO65KdFQROTGdC8yK\\nghdtigwPYEJutTXxMnOyN3BwuzJPzgjuvWchsqUtLu7TpCPzYe6T2FZSQeHUaeeu\\nZzAPSWgJ4yP0bTE1XrbM2fBMzFkP1kx6YWWSOgjJtQKBgQDvaSNMkXG1obSeM/Qo\\nQ0XRAMS/EoyLSbKuFlnrjL6DHl3849SpEfTSNRn6I5PVgZE3xZQrkpY1ggkZWfko\\nGB16EZP1cImETcsO7wpQNmR60+ZC469ZSyeBfeCsmkCjnEyGqh70NUBo5BrdZ3d9\\nKnqvHrq9xBigt0vdXwsTZh2WjQKBgQDEC6ad4d2owgdteuC1Sso8cWb20U+++N2a\\nIm+ITp2F+h/9i5fmjpY4lcS7RLg0y87iKN5oyIbHYqlVQ8LE1QwBaqtHwi4yEnpl\\n3iipxW8BqqBpRu6HvTG7IGs6z95XSr4lvjoiryReeOZbuA4YgpXoEvEtU7qDdouO\\nXDn+aawjZQKBgQCE5B1d8RXnNj1l23zZpI3qd7y+OvOclWoDTBDZuSQ+7+pH58cx\\nmfAFhshGmt0ClIshJCEdFp8eUHHwiorNAKXMDlnM0YzjzbK7NWDKKYcYzupvkqbQ\\nr/Db5h2CcZUTvDyWO3Q3Jh/8mTF4WGhxJ9U1w57wmxr4iwYneQxS1knyOQKBgQCn\\n3qofi2a4uNyPXKbJ1m7x7tESDA1TI9rtvwruFxM/w/xcqYm6vOHZNjWtfZyWaOaQ\\nNhqscvkmBk+lWU6QKTYMiIB+A8J20efJDsCXDx6MuMR/IWPjC5hn+cyYIaLr8G59\\n9zPku0BTPQdUBnjbeAZRINcvzwBozbuWfVaTiX0DGQKBgFNY5x6CqIxUrpBDNoli\\nhcGmQYAE6p+g2GnU5vJ5zlT6ePi42DMsN3siNTSRNQDF47UrgC9qiDxA+t6jeAf3\\n7dl+RJfvg30NlruJy2juB7E+20nzDPhVOJjZFL0d4NCRxI5VTwglex/MCxHy6zQt\\nCwFTza0mA+BEoJrg5JxpmuIa\\n-----END PRIVATE KEY-----\\n\",\n  \"client_email\": \"firebase-adminsdk-2whvt@yeschef-7b155.iam.gserviceaccount.com\",\n  \"client_id\": \"101763017722239239477\",\n  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2whvt%40yeschef-7b155.iam.gserviceaccount.com\"\n};\nadmin.initializeApp({\n  credential: admin.credential.cert(serviceAccount),\n  databaseURL: \"https://yeschef-7b155.firebaseio.com/\"\n});\n\nconst isAdmin = async authToken => {\n  const decodedToken = await admin.auth().verifyIdToken(authToken);\n  const executingUser = UsersMongo.getUserDataMongo(decodedToken.user_id);\n  return executingUser.isAdmin;\n};\n\nmodule.exports = {\n  admin,\n  isAdmin\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL0ZCQWRtaW4uanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tb2R1bGVzL0ZCQWRtaW4uanM/NmM0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhZG1pbiA9IHJlcXVpcmUoJ2ZpcmViYXNlLWFkbWluJyk7XHJcbmNvbnN0IFVzZXJzTW9uZ28gPSByZXF1aXJlKCcuL01vbmdvSW1wbC9Vc2Vyc01vbmdvJyk7XHJcblxyXG52YXIgc2VydmljZUFjY291bnQgPSB7XHJcbiAgICBcInR5cGVcIjogXCJzZXJ2aWNlX2FjY291bnRcIixcclxuICAgIFwicHJvamVjdF9pZFwiOiBcInllc2NoZWYtN2IxNTVcIixcclxuICAgIFwicHJpdmF0ZV9rZXlfaWRcIjogXCI2MDZiNTJkZmE0NTUzMTY5N2EzYTZiNzk0ZjM2NWJhM2JhMDM2ZmQwXCIsXHJcbiAgICBcInByaXZhdGVfa2V5XCI6IFwiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXFxuTUlJRXZnSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2d3Z2dTa0FnRUFBb0lCQVFDM1YyUmM5ejVPMDhOMlxcbjQ4aW9yZGVyZ1pxSzhwcVFKa1Nsem1vYy96QThxSWs2Q2xLaFgzYktwK2gzN2F3MTlxT2tjdjAxZ1E5U212cVZcXG5Bd1NCRm14VWpqdjkwWFlyYTlQcitXdXAxMFdZUHg2VnZQWHc5d2s2ejVsem5qQWdKZGs3WnlIZDNaVndCWGJkXFxuelBRcGNGWWFoVjdzcTM0N3V4bDJHOU9hRVAzMVdsdDVlQnRQcExKUmhQQldjOU9DR3RISmgrQW5qS0laQ0RqalxcbnlBdWQ1RXFLeFRPL2h4djVNUHhEaUFnZ0d1NlQwdHJDeUlyR1FKemg0QnBmbU1zS2dkckswT3M3S3dLR2JwaWRcXG5Ta09ZTWIzd2t3Szg4YjNqaC9YVVF0VXFJZGxtZFZhUEVUQXJTdEtjS2UweTg0NGZFbkY2YlhxWkVqcVBSL042XFxuaVNSUS9heWhBZ01CQUFFQ2dnRUFBWkpPY2l5TlhHd2N3ZzFnU0MvYlNDVlBmNDdtUzhPRU5aNmdFcmtPUHdyYlxcbnlFTlQ0MzIzdlROMHZ1aHE0RGlKdlF4ZVJzSGhNWDVTRlFwbVZMdnVPRWhTMDlGaWo2czRNUTdkZ1NKdS9vZlZcXG4rWWNaM1pPa2dOeE1McTFGc05UYU9KUGcrcStlU3d4RThWQkRMSUxCdmk3eitoZmJPR1JaYXNXQXloS0l0cnhvXFxuamtlMjlBQ0lQR0xMTVBPZ0hKUW1ERENtVFJlN0hRUEFySnFManZlUGhnejl2UVhKTzY1S2RGUVJPVEdkQzh5S1xcbmdoZHRpZ3dQWUVKdXRUWHhNbk95TjNCd3V6SlB6Z2p1dldjaHNxVXRMdTdUcENQelllNlQyRlpTUWVIVWFlZXVcXG5aekFQU1dnSjR5UDBiVEUxWHJiTTJmQk16RmtQMWt4NllXV1NPZ2pKdFFLQmdRRHZhU05Na1hHMW9iU2VNL1FvXFxuUTBYUkFNUy9Fb3lMU2JLdUZsbnJqTDZESGwzODQ5U3BFZlRTTlJuNkk1UFZnWkUzeFpRcmtwWTFnZ2taV2Zrb1xcbkdCMTZFWlAxY0ltRVRjc083d3BRTm1SNjArWkM0NjlaU3llQmZlQ3Nta0NqbkV5R3FoNzBOVUJvNUJyZFozZDlcXG5LbnF2SHJxOXhCaWd0MHZkWHdzVFpoMldqUUtCZ1FERUM2YWQ0ZDJvd2dkdGV1QzFTc284Y1diMjBVKysrTjJhXFxuSW0rSVRwMkYraC85aTVmbWpwWTRsY1M3UkxnMHk4N2lLTjVveUliSFlxbFZROExFMVF3QmFxdEh3aTR5RW5wbFxcbjNpaXB4VzhCcXFCcFJ1Nkh2VEc3SUdzNno5NVhTcjRsdmpvaXJ5UmVlT1pidUE0WWdwWG9FdkV0VTdxRGRvdU9cXG5YRG4rYWF3alpRS0JnUUNFNUIxZDhSWG5OajFsMjN6WnBJM3FkN3krT3ZPY2xXb0RUQkRadVNRKzcrcEg1OGN4XFxubWZBRmhzaEdtdDBDbElzaEpDRWRGcDhlVUhId2lvck5BS1hNRGxuTTBZemp6Yks3TldES0tZY1l6dXB2a3FiUVxcbnIvRGI1aDJDY1pVVHZEeVdPM1EzSmgvOG1URjRXR2h4SjlVMXc1N3dteHI0aXdZbmVReFMxa255T1FLQmdRQ25cXG4zcW9maTJhNHVOeVBYS2JKMW03eDd0RVNEQTFUSTlydHZ3cnVGeE0vdy94Y3FZbTZ2T0haTmpXdGZaeVdhT2FRXFxuTmhxc2N2a21CaytsV1U2UUtUWU1pSUIrQThKMjBlZkpEc0NYRHg2TXVNUi9JV1BqQzVobitjeVlJYUxyOEc1OVxcbjl6UGt1MEJUUFFkVUJuamJlQVpSSU5jdnp3Qm96YnVXZlZhVGlYMERHUUtCZ0ZOWTV4NkNxSXhVcnBCRE5vbGlcXG5oY0dtUVlBRTZwK2cyR25VNXZKNXpsVDZlUGk0MkRNc04zc2lOVFNSTlFERjQ3VXJnQzlxaUR4QSt0NmplQWYzXFxuN2RsK1JKZnZnMzBObHJ1SnkyanVCN0UrMjBuekRQaFZPSmpaRkwwZDROQ1J4STVWVHdnbGV4L01DeEh5NnpRdFxcbkN3RlR6YTBtQStCRW9Kcmc1SnhwbXVJYVxcbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cXG5cIixcclxuICAgIFwiY2xpZW50X2VtYWlsXCI6IFwiZmlyZWJhc2UtYWRtaW5zZGstMndodnRAeWVzY2hlZi03YjE1NS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwiLFxyXG4gICAgXCJjbGllbnRfaWRcIjogXCIxMDE3NjMwMTc3MjIyMzkyMzk0NzdcIixcclxuICAgIFwiYXV0aF91cmlcIjogXCJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aFwiLFxyXG4gICAgXCJ0b2tlbl91cmlcIjogXCJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlblwiLFxyXG4gICAgXCJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmxcIjogXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHNcIixcclxuICAgIFwiY2xpZW50X3g1MDlfY2VydF91cmxcIjogXCJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2ZpcmViYXNlLWFkbWluc2RrLTJ3aHZ0JTQweWVzY2hlZi03YjE1NS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbVwiXHJcbn1cclxuXHJcbmFkbWluLmluaXRpYWxpemVBcHAoe1xyXG4gICAgY3JlZGVudGlhbDogYWRtaW4uY3JlZGVudGlhbC5jZXJ0KHNlcnZpY2VBY2NvdW50KSxcclxuICAgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8veWVzY2hlZi03YjE1NS5maXJlYmFzZWlvLmNvbS9cIlxyXG59KTtcclxuXHJcbmNvbnN0IGlzQWRtaW4gPSBhc3luYyAoYXV0aFRva2VuKSA9PiB7XHJcbiAgICBjb25zdCBkZWNvZGVkVG9rZW4gPSBhd2FpdCBhZG1pbi5hdXRoKCkudmVyaWZ5SWRUb2tlbihhdXRoVG9rZW4pO1xyXG4gICAgY29uc3QgZXhlY3V0aW5nVXNlciA9IFVzZXJzTW9uZ28uZ2V0VXNlckRhdGFNb25nbyhkZWNvZGVkVG9rZW4udXNlcl9pZCk7XHJcbiAgICByZXR1cm4gZXhlY3V0aW5nVXNlci5pc0FkbWluO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHsgYWRtaW4sIGlzQWRtaW4gfTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBYUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./modules/FBAdmin.js\n");

/***/ }),

/***/ "./modules/Lessons.js":
/*!****************************!*\
  !*** ./modules/Lessons.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let esClient;\n\nexports.init = _esClient => {\n  esClient = _esClient;\n};\n\nexports.getLiteLessonsByIdList = async lessonIdsList => {\n  const docs = lessonIdsList.map(lessonId => {\n    return {\n      _index: \"lessons\",\n      _type: \"_doc\",\n      _id: lessonId\n    };\n  });\n\n  try {\n    const getLessonResponse = await esClient.mget({\n      body: {\n        docs\n      }\n    });\n    response = getLessonResponse.body.docs.map(lessonObj => {\n      return lessonObj._source;\n    });\n  } catch (e) {\n    const errMsg = \"error in getting lessons data by list of ids\";\n    console.warn(errMsg);\n    console.warn(e);\n    response = [];\n  }\n\n  return response;\n};\n\nexports.getInfoByClassAndIndex = async (req, res) => {\n  res.set(\"Cache-Control\", \"max-age=86400\");\n\n  try {\n    //get class Data\n    const getClassResponse = await esClient.get({\n      index: 'classes',\n      id: req.params.classId\n    });\n    const classInfoObj = getClassResponse.body._source;\n    const lessonId = classInfoObj.lessons[parseInt(req.params.lessonIndex)];\n    const getLessonResponse = await esClient.get({\n      index: 'lessons',\n      id: lessonId\n    });\n\n    if (getLessonResponse.body._source.filter) {\n      response = JSON.stringify(getLessonResponse.body._source.filter(lesson => !!lesson));\n    }\n  } catch (e) {\n    const errMsg = \"error in getting lesson's data by class and index\";\n    console.warn(errMsg);\n    console.warn(e);\n    response = errMsg;\n    res.status(500);\n  }\n\n  res.send(response);\n};\n\nexports.getInfo = async (req, res) => {\n  res.set(\"Cache-Control\", \"max-age=86400\");\n  let response;\n\n  try {\n    const getClassResponse = await esClient.get({\n      index: 'classes',\n      id: req.params.id\n    });\n    const classInfoObj = getClassResponse.body._source;\n    const lessonsList = await LessonsModule.getLiteLessonsByIdList(classInfoObj.lessons);\n    response = JSON.stringify({ ...classInfoObj,\n      lessons: lessonsList\n    });\n  } catch (e) {\n    const errMsg = \"error in getting class's data\";\n    console.warn(errMsg);\n    console.warn(e);\n    response = errMsg;\n    res.status(500);\n  }\n\n  res.send(response);\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL0xlc3NvbnMuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tb2R1bGVzL0xlc3NvbnMuanM/ZTRhNiJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZXNDbGllbnQ7XHJcblxyXG5leHBvcnRzLmluaXQgPSAoX2VzQ2xpZW50KSA9PiB7XHJcbiAgICBlc0NsaWVudCA9IF9lc0NsaWVudDtcclxufVxyXG5cclxuZXhwb3J0cy5nZXRMaXRlTGVzc29uc0J5SWRMaXN0ID0gYXN5bmMgKGxlc3Nvbklkc0xpc3QpID0+IHtcclxuICAgIGNvbnN0IGRvY3MgPSBsZXNzb25JZHNMaXN0Lm1hcChsZXNzb25JZCA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgX2luZGV4OiBcImxlc3NvbnNcIixcclxuICAgICAgICAgICAgX3R5cGU6IFwiX2RvY1wiLFxyXG4gICAgICAgICAgICBfaWQ6IGxlc3NvbklkXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGdldExlc3NvblJlc3BvbnNlID0gYXdhaXQgZXNDbGllbnQubWdldCh7XHJcbiAgICAgICAgICAgIGJvZHk6IHtcclxuICAgICAgICAgICAgICAgIGRvY3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc3BvbnNlID0gZ2V0TGVzc29uUmVzcG9uc2UuYm9keS5kb2NzLm1hcChsZXNzb25PYmogPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbGVzc29uT2JqLl9zb3VyY2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc3QgZXJyTXNnID0gXCJlcnJvciBpbiBnZXR0aW5nIGxlc3NvbnMgZGF0YSBieSBsaXN0IG9mIGlkc1wiO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlcnJNc2cpO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgICByZXNwb25zZSA9IFtdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG59XHJcblxyXG5leHBvcnRzLmdldEluZm9CeUNsYXNzQW5kSW5kZXggPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHJlcy5zZXQoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT04NjQwMFwiKTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy9nZXQgY2xhc3MgRGF0YVxyXG4gICAgICAgIGNvbnN0IGdldENsYXNzUmVzcG9uc2UgPSBhd2FpdCBlc0NsaWVudC5nZXQoe1xyXG4gICAgICAgICAgICBpbmRleDogJ2NsYXNzZXMnLFxyXG4gICAgICAgICAgICBpZDogcmVxLnBhcmFtcy5jbGFzc0lkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzSW5mb09iaiA9IGdldENsYXNzUmVzcG9uc2UuYm9keS5fc291cmNlO1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbklkID0gY2xhc3NJbmZvT2JqLmxlc3NvbnNbcGFyc2VJbnQocmVxLnBhcmFtcy5sZXNzb25JbmRleCldO1xyXG5cclxuICAgICAgICBjb25zdCBnZXRMZXNzb25SZXNwb25zZSA9IGF3YWl0IGVzQ2xpZW50LmdldCh7XHJcbiAgICAgICAgICAgIGluZGV4OiAnbGVzc29ucycsXHJcbiAgICAgICAgICAgIGlkOiBsZXNzb25JZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChnZXRMZXNzb25SZXNwb25zZS5ib2R5Ll9zb3VyY2UuZmlsdGVyKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5zdHJpbmdpZnkoZ2V0TGVzc29uUmVzcG9uc2UuYm9keS5fc291cmNlLmZpbHRlcigobGVzc29uKSA9PiAhIWxlc3NvbikpO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zdCBlcnJNc2cgPSBcImVycm9yIGluIGdldHRpbmcgbGVzc29uJ3MgZGF0YSBieSBjbGFzcyBhbmQgaW5kZXhcIjtcclxuICAgICAgICBjb25zb2xlLndhcm4oZXJyTXNnKTtcclxuICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICAgcmVzcG9uc2UgPSBlcnJNc2c7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApXHJcbiAgICB9XHJcbiAgICByZXMuc2VuZChyZXNwb25zZSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLmdldEluZm8gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHJlcy5zZXQoXCJDYWNoZS1Db250cm9sXCIsIFwibWF4LWFnZT04NjQwMFwiKTtcclxuICAgIGxldCByZXNwb25zZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZ2V0Q2xhc3NSZXNwb25zZSA9IGF3YWl0IGVzQ2xpZW50LmdldCh7XHJcbiAgICAgICAgICAgIGluZGV4OiAnY2xhc3NlcycsXHJcbiAgICAgICAgICAgIGlkOiByZXEucGFyYW1zLmlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNsYXNzSW5mb09iaiA9IGdldENsYXNzUmVzcG9uc2UuYm9keS5fc291cmNlO1xyXG4gICAgICAgIGNvbnN0IGxlc3NvbnNMaXN0ID0gYXdhaXQgTGVzc29uc01vZHVsZS5nZXRMaXRlTGVzc29uc0J5SWRMaXN0KGNsYXNzSW5mb09iai5sZXNzb25zKTtcclxuXHJcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnN0cmluZ2lmeSh7IC4uLmNsYXNzSW5mb09iaiwgbGVzc29uczogbGVzc29uc0xpc3QgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc3QgZXJyTXNnID0gXCJlcnJvciBpbiBnZXR0aW5nIGNsYXNzJ3MgZGF0YVwiO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlcnJNc2cpO1xyXG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgICByZXNwb25zZSA9IGVyck1zZztcclxuICAgICAgICByZXMuc3RhdHVzKDUwMClcclxuICAgIH1cclxuICAgIHJlcy5zZW5kKHJlc3BvbnNlKTtcclxufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBRUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/Lessons.js\n");

/***/ }),

/***/ "./modules/MongoImpl/DocsMongo.js":
/*!****************************************!*\
  !*** ./modules/MongoImpl/DocsMongo.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const MongoClient = __webpack_require__(/*! mongodb */ \"mongodb\").MongoClient;\n\nlet config = __webpack_require__(/*! ../../config */ \"./config.js\");\n\nconfig = config[Object({\"NODE_ENV\":\"development\"}).CONFIG_ENV || \"development\"];\nconst uri = config.mongo.url;\nconst client = new MongoClient(uri, {\n  useNewUrlParser: true\n});\n\nconst getConnection = () => {\n  return new Promise(function (resolve, reject) {\n    if (!client.isConnected()) {\n      client.connect(err => {\n        if (err) {\n          reject(err);\n          return;\n        }\n\n        resolve(client);\n      });\n    } else {\n      resolve(client);\n    }\n  });\n};\n\nconst replaceDocsMongo = async (db, collectionName, docIdKey, dataArray) => {\n  return new Promise(async (resolve, reject) => {\n    const client = await getConnection();\n    const collection = client.db(db).collection(collectionName);\n    const replacePromisesArr = [];\n    dataArray.forEach(dataRow => {\n      // perform actions on the collection object\n      const query = {};\n      query[docIdKey] = dataRow[docIdKey];\n      collection.findOneAndReplace(query, {\n        $set: { ...dataRow\n        }\n      }, {\n        upsert: true\n      });\n    });\n    Promise.all(replacePromisesArr).then(values => {\n      resolve(values);\n    }).catch(error => {\n      reject(error);\n    });\n  });\n};\n\nconst getDocMongo = userId => {\n  return new Promise(function (resolve, reject) {\n    getConnection().then(client => {\n      const usersCollection = client.db(\"runtime\").collection(\"users\"); // perform actions on the collection object\n\n      usersCollection.findOne({\n        userId\n      }).then(results => {\n        resolve(results);\n      }).catch(err => {\n        reject(err);\n      });\n    });\n  });\n};\n\nmodule.exports = {\n  replaceDocsMongo\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL01vbmdvSW1wbC9Eb2NzTW9uZ28uanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tb2R1bGVzL01vbmdvSW1wbC9Eb2NzTW9uZ28uanM/N2M2NCJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBNb25nb0NsaWVudCA9IHJlcXVpcmUoJ21vbmdvZGInKS5Nb25nb0NsaWVudDtcclxubGV0IGNvbmZpZyA9IHJlcXVpcmUoJy4uLy4uL2NvbmZpZycpO1xyXG5jb25maWcgPSBjb25maWdbcHJvY2Vzcy5lbnYuQ09ORklHX0VOViB8fCBcImRldmVsb3BtZW50XCJdO1xyXG5jb25zdCB1cmkgPSBjb25maWcubW9uZ28udXJsO1xyXG5jb25zdCBjbGllbnQgPSBuZXcgTW9uZ29DbGllbnQodXJpLCB7IHVzZU5ld1VybFBhcnNlcjogdHJ1ZSB9KTtcclxuY29uc3QgZ2V0Q29ubmVjdGlvbiA9ICgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKCFjbGllbnQuaXNDb25uZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICBjbGllbnQuY29ubmVjdChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoY2xpZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShjbGllbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KTtcclxufVxyXG5cclxuY29uc3QgcmVwbGFjZURvY3NNb25nbyA9IGFzeW5jIChkYiwgY29sbGVjdGlvbk5hbWUsIGRvY0lkS2V5LCBkYXRhQXJyYXkpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgY2xpZW50ID0gYXdhaXQgZ2V0Q29ubmVjdGlvbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjbGllbnQuZGIoZGIpLmNvbGxlY3Rpb24oY29sbGVjdGlvbk5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHJlcGxhY2VQcm9taXNlc0FyciA9IFtdO1xyXG5cclxuICAgICAgICBkYXRhQXJyYXkuZm9yRWFjaChkYXRhUm93ID0+IHtcclxuICAgICAgICAgICAgLy8gcGVyZm9ybSBhY3Rpb25zIG9uIHRoZSBjb2xsZWN0aW9uIG9iamVjdFxyXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHt9O1xyXG4gICAgICAgICAgICBxdWVyeVtkb2NJZEtleV0gPSBkYXRhUm93W2RvY0lkS2V5XTtcclxuICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kT25lQW5kUmVwbGFjZShxdWVyeSxcclxuICAgICAgICAgICAgICAgIHsgJHNldDogeyAuLi5kYXRhUm93IH0gfSxcclxuICAgICAgICAgICAgICAgIHsgdXBzZXJ0OiB0cnVlIH0pO1xyXG4gICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICBQcm9taXNlLmFsbChyZXBsYWNlUHJvbWlzZXNBcnIpLnRoZW4odmFsdWVzID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZXMpO1xyXG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0RG9jTW9uZ28gPSAodXNlcklkKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGdldENvbm5lY3Rpb24oKS50aGVuKChjbGllbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdXNlcnNDb2xsZWN0aW9uID0gY2xpZW50LmRiKFwicnVudGltZVwiKS5jb2xsZWN0aW9uKFwidXNlcnNcIik7XHJcbiAgICAgICAgICAgIC8vIHBlcmZvcm0gYWN0aW9ucyBvbiB0aGUgY29sbGVjdGlvbiBvYmplY3RcclxuICAgICAgICAgICAgdXNlcnNDb2xsZWN0aW9uLmZpbmRPbmUoeyB1c2VySWQgfSkudGhlbigocmVzdWx0cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVwbGFjZURvY3NNb25nb1xyXG59XHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/MongoImpl/DocsMongo.js\n");

/***/ }),

/***/ "./modules/MongoImpl/UsersMongo.js":
/*!*****************************************!*\
  !*** ./modules/MongoImpl/UsersMongo.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const MongoClient = __webpack_require__(/*! mongodb */ \"mongodb\").MongoClient;\n\nlet config = __webpack_require__(/*! ../../config */ \"./config.js\");\n\nconfig = config[Object({\"NODE_ENV\":\"development\"}).CONFIG_ENV || \"development\"];\nconst uri = config.mongo.url;\nconst client = new MongoClient(uri, {\n  useNewUrlParser: true\n});\n\nconst getConnection = () => {\n  return new Promise(function (resolve, reject) {\n    if (!client.isConnected()) {\n      client.connect(err => {\n        if (err) {\n          reject(err);\n          return;\n        }\n\n        resolve(client);\n      });\n    } else {\n      resolve(client);\n    }\n  });\n};\n\nconst updateUserDataMongo = (req, userId, data) => {\n  return new Promise(function (resolve, reject) {\n    getConnection().then(client => {\n      const usersCollection = client.db(\"runtime\").collection(\"users\"); // perform actions on the collection object\n\n      usersCollection.updateOne({\n        userId\n      }, {\n        $set: { ...data\n        }\n      }, {\n        upsert: true\n      }).then(result => {\n        resolve(result);\n      }).catch(err => {\n        reject(err);\n      });\n    });\n  });\n};\n\nconst getUserDataMongo = userId => {\n  return new Promise(function (resolve, reject) {\n    getConnection().then(client => {\n      const usersCollection = client.db(\"runtime\").collection(\"users\"); // perform actions on the collection object\n\n      usersCollection.findOne({\n        userId\n      }).then(results => {\n        resolve(results);\n      }).catch(err => {\n        reject(err);\n      });\n    });\n  });\n};\n\nmodule.exports = {\n  updateUserDataMongo,\n  getUserDataMongo\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL01vbmdvSW1wbC9Vc2Vyc01vbmdvLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9Nb25nb0ltcGwvVXNlcnNNb25nby5qcz8zMjUxIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE1vbmdvQ2xpZW50ID0gcmVxdWlyZSgnbW9uZ29kYicpLk1vbmdvQ2xpZW50O1xyXG5sZXQgY29uZmlnID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnJyk7XHJcbmNvbmZpZyA9IGNvbmZpZ1twcm9jZXNzLmVudi5DT05GSUdfRU5WIHx8IFwiZGV2ZWxvcG1lbnRcIl07XHJcblxyXG5jb25zdCB1cmkgPSBjb25maWcubW9uZ28udXJsO1xyXG5jb25zdCBjbGllbnQgPSBuZXcgTW9uZ29DbGllbnQodXJpLCB7IHVzZU5ld1VybFBhcnNlcjogdHJ1ZSB9KTtcclxuY29uc3QgZ2V0Q29ubmVjdGlvbiA9ICgpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgaWYgKCFjbGllbnQuaXNDb25uZWN0ZWQoKSkge1xyXG4gICAgICAgICAgICBjbGllbnQuY29ubmVjdChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc29sdmUoY2xpZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzb2x2ZShjbGllbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuY29uc3QgdXBkYXRlVXNlckRhdGFNb25nbyA9IChyZXEsIHVzZXJJZCwgZGF0YSkgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBnZXRDb25uZWN0aW9uKCkudGhlbigoY2xpZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJzQ29sbGVjdGlvbiA9IGNsaWVudC5kYihcInJ1bnRpbWVcIikuY29sbGVjdGlvbihcInVzZXJzXCIpO1xyXG4gICAgICAgICAgICAvLyBwZXJmb3JtIGFjdGlvbnMgb24gdGhlIGNvbGxlY3Rpb24gb2JqZWN0XHJcbiAgICAgICAgICAgIHVzZXJzQ29sbGVjdGlvbi51cGRhdGVPbmUoeyB1c2VySWQgfSxcclxuICAgICAgICAgICAgICAgIHsgJHNldDogeyAuLi5kYXRhIH0gfSxcclxuICAgICAgICAgICAgICAgIHsgdXBzZXJ0OiB0cnVlIH0pLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0VXNlckRhdGFNb25nbyA9ICh1c2VySWQpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZ2V0Q29ubmVjdGlvbigpLnRoZW4oKGNsaWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1c2Vyc0NvbGxlY3Rpb24gPSBjbGllbnQuZGIoXCJydW50aW1lXCIpLmNvbGxlY3Rpb24oXCJ1c2Vyc1wiKTtcclxuICAgICAgICAgICAgLy8gcGVyZm9ybSBhY3Rpb25zIG9uIHRoZSBjb2xsZWN0aW9uIG9iamVjdFxyXG4gICAgICAgICAgICB1c2Vyc0NvbGxlY3Rpb24uZmluZE9uZSh7IHVzZXJJZCB9KS50aGVuKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgdXBkYXRlVXNlckRhdGFNb25nbyxcclxuICAgIGdldFVzZXJEYXRhTW9uZ29cclxufVxyXG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/MongoImpl/UsersMongo.js\n");

/***/ }),

/***/ "./modules/Users.js":
/*!**************************!*\
  !*** ./modules/Users.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {\n  admin,\n  isAdmin\n} = __webpack_require__(/*! ./FBAdmin */ \"./modules/FBAdmin.js\").admin;\n\nconst UsersMongo = __webpack_require__(/*! ./MongoImpl/UsersMongo */ \"./modules/MongoImpl/UsersMongo.js\");\n\nconst updateUserData = (uid, data) => {\n  try {\n    let id = uid;\n    console.log('updating the user doc id=' + id);\n    admin.database().ref('/users/' + id).update(data);\n  } catch (e) {\n    console.log(\"error in updating user data\");\n    console.log(e);\n  }\n};\n\nconst adminUpdateUser = async (req, res) => {\n  const body = req.body;\n\n  if (isAdmin(body.authToken)) {\n    const userRecord = await admin.auth().getUserByEmail(req.params.email);\n    const id = userRecord.uid;\n    UsersMongo.updateUserDataMongo(id, body.data);\n    res.send('');\n  } else {\n    res.status(401).end();\n  }\n};\n\nconst adminGetUser = async (req, res) => {\n  const body = req.body;\n\n  if (isAdmin(body.authToken)) {\n    const userRecord = await admin.auth().getUserByEmail(req.params.email);\n    const id = userRecord.uid;\n    const user = await UsersMongo.getUserDataMongo(id);\n    res.end(JSON.stringify(user));\n  } else {\n    res.status(401).end();\n  }\n};\n\nconst update = async (req, res) => {\n  const body = req.body;\n  const tokenId = body.authToken;\n  const decodedToken = await admin.auth().verifyIdToken(tokenId);\n  UsersMongo.updateUserDataMongo(decodedToken.user_id, body);\n  res.send('');\n};\n\nconst getUserData = async (req, res) => {\n  const decodedToken = await admin.auth().verifyIdToken(req.header('authToken'));\n  const id = decodedToken.user_id;\n  console.log('Going to get user data for userId ' + id);\n  const snapshot = await UsersMongo.getUserDataMongo(id); //const snapshot = (await admin.database().ref('/users/' + id).once('value')).val();\n\n  res.end(JSON.stringify(snapshot));\n};\n\nmodule.exports = {\n  update,\n  updateUserData,\n  getUserData,\n  adminUpdateUser,\n  adminGetUser\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL1VzZXJzLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbW9kdWxlcy9Vc2Vycy5qcz8wMmIxIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgYWRtaW4sIGlzQWRtaW4gfSA9IHJlcXVpcmUoJy4vRkJBZG1pbicpLmFkbWluO1xyXG5jb25zdCBVc2Vyc01vbmdvID0gcmVxdWlyZSgnLi9Nb25nb0ltcGwvVXNlcnNNb25nbycpO1xyXG5cclxuY29uc3QgdXBkYXRlVXNlckRhdGEgPSAodWlkLCBkYXRhKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBpZCA9IHVpZDtcclxuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRpbmcgdGhlIHVzZXIgZG9jIGlkPScgKyBpZClcclxuICAgICAgICBhZG1pbi5kYXRhYmFzZSgpLnJlZignL3VzZXJzLycgKyBpZCkudXBkYXRlKGRhdGEpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgaW4gdXBkYXRpbmcgdXNlciBkYXRhXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBhZG1pblVwZGF0ZVVzZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIGNvbnN0IGJvZHkgPSByZXEuYm9keTtcclxuICAgIGlmIChpc0FkbWluKGJvZHkuYXV0aFRva2VuKSkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJSZWNvcmQgPSBhd2FpdCBhZG1pbi5hdXRoKCkuZ2V0VXNlckJ5RW1haWwocmVxLnBhcmFtcy5lbWFpbCk7XHJcbiAgICAgICAgY29uc3QgaWQgPSB1c2VyUmVjb3JkLnVpZDtcclxuICAgICAgICBVc2Vyc01vbmdvLnVwZGF0ZVVzZXJEYXRhTW9uZ28oaWQsIGJvZHkuZGF0YSk7XHJcbiAgICAgICAgcmVzLnNlbmQoJycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGFkbWluR2V0VXNlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgaWYgKGlzQWRtaW4oYm9keS5hdXRoVG9rZW4pKSB7XHJcbiAgICAgICAgY29uc3QgdXNlclJlY29yZCA9IGF3YWl0IGFkbWluLmF1dGgoKS5nZXRVc2VyQnlFbWFpbChyZXEucGFyYW1zLmVtYWlsKTtcclxuICAgICAgICBjb25zdCBpZCA9IHVzZXJSZWNvcmQudWlkO1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2Vyc01vbmdvLmdldFVzZXJEYXRhTW9uZ28oaWQpO1xyXG4gICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkodXNlcikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHVwZGF0ZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3QgYm9keSA9IHJlcS5ib2R5O1xyXG4gICAgY29uc3QgdG9rZW5JZCA9IGJvZHkuYXV0aFRva2VuXHJcbiAgICBjb25zdCBkZWNvZGVkVG9rZW4gPSBhd2FpdCBhZG1pbi5hdXRoKCkudmVyaWZ5SWRUb2tlbih0b2tlbklkKTtcclxuXHJcbiAgICBVc2Vyc01vbmdvLnVwZGF0ZVVzZXJEYXRhTW9uZ28oZGVjb2RlZFRva2VuLnVzZXJfaWQsIGJvZHkpO1xyXG4gICAgcmVzLnNlbmQoJycpO1xyXG59XHJcblxyXG5jb25zdCBnZXRVc2VyRGF0YSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3QgZGVjb2RlZFRva2VuID0gYXdhaXQgYWRtaW4uYXV0aCgpLnZlcmlmeUlkVG9rZW4ocmVxLmhlYWRlcignYXV0aFRva2VuJykpO1xyXG4gICAgY29uc3QgaWQgPSBkZWNvZGVkVG9rZW4udXNlcl9pZDtcclxuICAgIGNvbnNvbGUubG9nKCdHb2luZyB0byBnZXQgdXNlciBkYXRhIGZvciB1c2VySWQgJyArIGlkKVxyXG5cclxuICAgIGNvbnN0IHNuYXBzaG90ID0gYXdhaXQgVXNlcnNNb25nby5nZXRVc2VyRGF0YU1vbmdvKGlkKTtcclxuICAgIC8vY29uc3Qgc25hcHNob3QgPSAoYXdhaXQgYWRtaW4uZGF0YWJhc2UoKS5yZWYoJy91c2Vycy8nICsgaWQpLm9uY2UoJ3ZhbHVlJykpLnZhbCgpO1xyXG4gICAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShzbmFwc2hvdCkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHVwZGF0ZSxcclxuICAgIHVwZGF0ZVVzZXJEYXRhLFxyXG4gICAgZ2V0VXNlckRhdGEsXHJcbiAgICBhZG1pblVwZGF0ZVVzZXIsXHJcbiAgICBhZG1pbkdldFVzZXJcclxufSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./modules/Users.js\n");

/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\nmodule.exports = function (updatedModules, renewedModules) {\n  var unacceptedModules = updatedModules.filter(function (moduleId) {\n    return renewedModules && renewedModules.indexOf(moduleId) < 0;\n  });\n\n  var log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n  if (unacceptedModules.length > 0) {\n    log(\"warning\", \"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)\");\n    unacceptedModules.forEach(function (moduleId) {\n      log(\"warning\", \"[HMR]  - \" + moduleId);\n    });\n  }\n\n  if (!renewedModules || renewedModules.length === 0) {\n    log(\"info\", \"[HMR] Nothing hot updated.\");\n  } else {\n    log(\"info\", \"[HMR] Updated modules:\");\n    renewedModules.forEach(function (moduleId) {\n      if (typeof moduleId === \"string\" && moduleId.indexOf(\"!\") !== -1) {\n        var parts = moduleId.split(\"!\");\n        log.groupCollapsed(\"info\", \"[HMR]  - \" + parts.pop());\n        log(\"info\", \"[HMR]  - \" + moduleId);\n        log.groupEnd(\"info\");\n      } else {\n        log(\"info\", \"[HMR]  - \" + moduleId);\n      }\n    });\n    var numberIds = renewedModules.every(function (moduleId) {\n      return typeof moduleId === \"number\";\n    });\n    if (numberIds) log(\"info\", \"[HMR] Consider using the NamedModulesPlugin for module names.\");\n  }\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLWFwcGx5LXJlc3VsdC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8od2VicGFjaykvaG90L2xvZy1hcHBseS1yZXN1bHQuanM/ZTUyZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1cGRhdGVkTW9kdWxlcywgcmVuZXdlZE1vZHVsZXMpIHtcblx0dmFyIHVuYWNjZXB0ZWRNb2R1bGVzID0gdXBkYXRlZE1vZHVsZXMuZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0cmV0dXJuIHJlbmV3ZWRNb2R1bGVzICYmIHJlbmV3ZWRNb2R1bGVzLmluZGV4T2YobW9kdWxlSWQpIDwgMDtcblx0fSk7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0aWYgKHVuYWNjZXB0ZWRNb2R1bGVzLmxlbmd0aCA+IDApIHtcblx0XHRsb2coXG5cdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFwiW0hNUl0gVGhlIGZvbGxvd2luZyBtb2R1bGVzIGNvdWxkbid0IGJlIGhvdCB1cGRhdGVkOiAoVGhleSB3b3VsZCBuZWVkIGEgZnVsbCByZWxvYWQhKVwiXG5cdFx0KTtcblx0XHR1bmFjY2VwdGVkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKG1vZHVsZUlkKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1vZHVsZUlkID09PSBcInN0cmluZ1wiICYmIG1vZHVsZUlkLmluZGV4T2YoXCIhXCIpICE9PSAtMSkge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBtb2R1bGVJZC5zcGxpdChcIiFcIik7XG5cdFx0XHRcdGxvZy5ncm91cENvbGxhcHNlZChcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIHBhcnRzLnBvcCgpKTtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0XHRsb2cuZ3JvdXBFbmQoXCJpbmZvXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nKFwiaW5mb1wiLCBcIltITVJdICAtIFwiICsgbW9kdWxlSWQpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHZhciBudW1iZXJJZHMgPSByZW5ld2VkTW9kdWxlcy5ldmVyeShmdW5jdGlvbihtb2R1bGVJZCkge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJudW1iZXJcIjtcblx0XHR9KTtcblx0XHRpZiAobnVtYmVySWRzKVxuXHRcdFx0bG9nKFxuXHRcdFx0XHRcImluZm9cIixcblx0XHRcdFx0XCJbSE1SXSBDb25zaWRlciB1c2luZyB0aGUgTmFtZWRNb2R1bGVzUGx1Z2luIGZvciBtb2R1bGUgbmFtZXMuXCJcblx0XHRcdCk7XG5cdH1cbn07XG4iXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/log-apply-result.js\n");

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var logLevel = \"info\";\n\nfunction dummy() {}\n\nfunction shouldLog(level) {\n  var shouldLog = logLevel === \"info\" && level === \"info\" || [\"info\", \"warning\"].indexOf(logLevel) >= 0 && level === \"warning\" || [\"info\", \"warning\", \"error\"].indexOf(logLevel) >= 0 && level === \"error\";\n  return shouldLog;\n}\n\nfunction logGroup(logFn) {\n  return function (level, msg) {\n    if (shouldLog(level)) {\n      logFn(msg);\n    }\n  };\n}\n\nmodule.exports = function (level, msg) {\n  if (shouldLog(level)) {\n    if (level === \"info\") {\n      console.log(msg);\n    } else if (level === \"warning\") {\n      console.warn(msg);\n    } else if (level === \"error\") {\n      console.error(msg);\n    }\n  }\n};\n/* eslint-disable node/no-unsupported-features/node-builtins */\n\n\nvar group = console.group || dummy;\nvar groupCollapsed = console.groupCollapsed || dummy;\nvar groupEnd = console.groupEnd || dummy;\n/* eslint-enable node/no-unsupported-features/node-builtins */\n\nmodule.exports.group = logGroup(group);\nmodule.exports.groupCollapsed = logGroup(groupCollapsed);\nmodule.exports.groupEnd = logGroup(groupEnd);\n\nmodule.exports.setLogLevel = function (level) {\n  logLevel = level;\n};\n\nmodule.exports.formatError = function (err) {\n  var message = err.message;\n  var stack = err.stack;\n\n  if (!stack) {\n    return message;\n  } else if (stack.indexOf(message) < 0) {\n    return message + \"\\n\" + stack;\n  } else {\n    return stack;\n  }\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvbG9nLmpzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvbG9nLmpzPzFhZmQiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGxvZ0xldmVsID0gXCJpbmZvXCI7XG5cbmZ1bmN0aW9uIGR1bW15KCkge31cblxuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24obGV2ZWwsIG1zZykge1xuXHRcdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0XHRsb2dGbihtc2cpO1xuXHRcdH1cblx0fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsZXZlbCwgbXNnKSB7XG5cdGlmIChzaG91bGRMb2cobGV2ZWwpKSB7XG5cdFx0aWYgKGxldmVsID09PSBcImluZm9cIikge1xuXHRcdFx0Y29uc29sZS5sb2cobXNnKTtcblx0XHR9IGVsc2UgaWYgKGxldmVsID09PSBcIndhcm5pbmdcIikge1xuXHRcdFx0Y29uc29sZS53YXJuKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJlcnJvclwiKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKG1zZyk7XG5cdFx0fVxuXHR9XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnMgKi9cbnZhciBncm91cCA9IGNvbnNvbGUuZ3JvdXAgfHwgZHVtbXk7XG52YXIgZ3JvdXBDb2xsYXBzZWQgPSBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIHx8IGR1bW15O1xudmFyIGdyb3VwRW5kID0gY29uc29sZS5ncm91cEVuZCB8fCBkdW1teTtcbi8qIGVzbGludC1lbmFibGUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zICovXG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwID0gbG9nR3JvdXAoZ3JvdXApO1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cENvbGxhcHNlZCA9IGxvZ0dyb3VwKGdyb3VwQ29sbGFwc2VkKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBFbmQgPSBsb2dHcm91cChncm91cEVuZCk7XG5cbm1vZHVsZS5leHBvcnRzLnNldExvZ0xldmVsID0gZnVuY3Rpb24obGV2ZWwpIHtcblx0bG9nTGV2ZWwgPSBsZXZlbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmZvcm1hdEVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG5cdHZhciBtZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cdHZhciBzdGFjayA9IGVyci5zdGFjaztcblx0aWYgKCFzdGFjaykge1xuXHRcdHJldHVybiBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKHN0YWNrLmluZGV4T2YobWVzc2FnZSkgPCAwKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2UgKyBcIlxcblwiICsgc3RhY2s7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHN0YWNrO1xuXHR9XG59O1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/log.js\n");

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\n/*globals __resourceQuery */\nif (true) {\n  var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;\n\n  var log = __webpack_require__(/*! ./log */ \"./node_modules/webpack/hot/log.js\");\n\n  var checkForUpdate = function checkForUpdate(fromUpdate) {\n    if (module.hot.status() === \"idle\") {\n      module.hot.check(true).then(function (updatedModules) {\n        if (!updatedModules) {\n          if (fromUpdate) log(\"info\", \"[HMR] Update applied.\");\n          return;\n        }\n\n        __webpack_require__(/*! ./log-apply-result */ \"./node_modules/webpack/hot/log-apply-result.js\")(updatedModules, updatedModules);\n\n        checkForUpdate(true);\n      }).catch(function (err) {\n        var status = module.hot.status();\n\n        if ([\"abort\", \"fail\"].indexOf(status) >= 0) {\n          log(\"warning\", \"[HMR] Cannot apply update.\");\n          log(\"warning\", \"[HMR] \" + log.formatError(err));\n          log(\"warning\", \"[HMR] You need to restart the application!\");\n        } else {\n          log(\"warning\", \"[HMR] Update failed: \" + log.formatError(err));\n        }\n      });\n    }\n  };\n\n  setInterval(checkForUpdate, hotPollInterval);\n} else {}\n/* WEBPACK VAR INJECTION */}.call(this, \"?1000\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvd2VicGFjay9ob3QvcG9sbC5qcz8xMDAwLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9ob3QvcG9sbC5qcz81NjUwIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKmdsb2JhbHMgX19yZXNvdXJjZVF1ZXJ5ICovXG5pZiAobW9kdWxlLmhvdCkge1xuXHR2YXIgaG90UG9sbEludGVydmFsID0gK19fcmVzb3VyY2VRdWVyeS5zdWJzdHIoMSkgfHwgMTAgKiA2MCAqIDEwMDA7XG5cdHZhciBsb2cgPSByZXF1aXJlKFwiLi9sb2dcIik7XG5cblx0dmFyIGNoZWNrRm9yVXBkYXRlID0gZnVuY3Rpb24gY2hlY2tGb3JVcGRhdGUoZnJvbVVwZGF0ZSkge1xuXHRcdGlmIChtb2R1bGUuaG90LnN0YXR1cygpID09PSBcImlkbGVcIikge1xuXHRcdFx0bW9kdWxlLmhvdFxuXHRcdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24odXBkYXRlZE1vZHVsZXMpIHtcblx0XHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0XHRpZiAoZnJvbVVwZGF0ZSkgbG9nKFwiaW5mb1wiLCBcIltITVJdIFVwZGF0ZSBhcHBsaWVkLlwiKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vbG9nLWFwcGx5LXJlc3VsdFwiKSh1cGRhdGVkTW9kdWxlcywgdXBkYXRlZE1vZHVsZXMpO1xuXHRcdFx0XHRcdGNoZWNrRm9yVXBkYXRlKHRydWUpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdFx0aWYgKFtcImFib3J0XCIsIFwiZmFpbFwiXS5pbmRleE9mKHN0YXR1cykgPj0gMCkge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIENhbm5vdCBhcHBseSB1cGRhdGUuXCIpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFlvdSBuZWVkIHRvIHJlc3RhcnQgdGhlIGFwcGxpY2F0aW9uIVwiKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9nKFwid2FybmluZ1wiLCBcIltITVJdIFVwZGF0ZSBmYWlsZWQ6IFwiICsgbG9nLmZvcm1hdEVycm9yKGVycikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fVxuXHR9O1xuXHRzZXRJbnRlcnZhbChjaGVja0ZvclVwZGF0ZSwgaG90UG9sbEludGVydmFsKTtcbn0gZWxzZSB7XG5cdHRocm93IG5ldyBFcnJvcihcIltITVJdIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnQgaXMgZGlzYWJsZWQuXCIpO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/webpack/hot/poll.js?1000\n");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\n\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\n\nconst app = express();\nconst port = Object({\"NODE_ENV\":\"development\"}).PORT || 8080;\n\nconst cors = __webpack_require__(/*! cors */ \"cors\"); // const axios = require('axios');\n\n\nconst Chefs = __webpack_require__(/*! ./modules/Chefs */ \"./modules/Chefs.js\");\n\nconst Classes = __webpack_require__(/*! ./modules/Classes */ \"./modules/Classes.js\");\n\nconst Lessons = __webpack_require__(/*! ./modules/Lessons */ \"./modules/Lessons.js\");\n\nconst Users = __webpack_require__(/*! ./modules/Users */ \"./modules/Users.js\");\n\nconst Admin = __webpack_require__(/*! ./modules/Admin */ \"./modules/Admin.js\");\n\nconst {\n  Client\n} = __webpack_require__(/*! @elastic/elasticsearch */ \"@elastic/elasticsearch\");\n\nstart = async () => {\n  const esClient = new Client({\n    cloud: {\n      id: 'yeschef:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbyRjMTcyZjdjYjVjYjY0YzUxYjE1MWYxNGE5Nzk0ODg3ZiQ3Yzc1OWFkYzVmOGQ0Mjk5YmYzYzRjNTQ5ZTFjYWE0Mw=='\n    },\n    auth: {\n      // apiKey: '8s1dqJAIS7KnUHdb5tfamg'\n      username: \"yc-be\",\n      password: \"wV27Znc5LHGRdiq\"\n    }\n  }); // Default config options\n  // const defaultOptions = {\n  //     baseURL: 'https://c172f7cb5cb64c51b151f14a9794887f.us-east-1.aws.found.io:9243',\n  //     headers: {\n  //         'Authorization': 'Basic eWMtYmU6d1YyN1puYzVMSEdSZGlx'\n  //     },\n  // };\n  // Create instance\n  // let axiosInstance = axios.create(defaultOptions);\n\n  Chefs.init(esClient);\n  Lessons.init(esClient);\n  Classes.init(esClient, Lessons);\n  const allowedOrigins = ['http://localhost:3000', 'https://yeschef.me']; // Automatically allow cross-origin requests\n\n  app.use(cors({\n    origin: (origin, callback) => {\n      // allow requests with no origin \n      // (like mobile apps or curl requests)\n      if (!origin) return callback(null, true);\n\n      if (allowedOrigins.indexOf(origin) === -1) {\n        var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';\n        return callback(new Error(msg), false);\n      }\n\n      return callback(null, true);\n    }\n  }));\n  app.use(bodyParser.json()); //End points\n\n  app.get('/chef/:id/info', Chefs.getInfo); // app.post('/checkout', Stripe.addCharge);\n\n  app.post('/user', Users.update);\n  app.get('/user', Users.getUserData);\n  app.get('/hc', (req, res) => {\n    res.end(\"I'm Alive!\");\n  });\n  app.get('/class/:id', Classes.getInfo);\n  app.get('/classes/', Classes.getClassList);\n  app.get('/class/:classId/lesson/:lessonIndex', Lessons.getInfoByClassAndIndex);\n  app.post('/docs/', Admin.adminDocsUpdate);\n  app.listen(port, () => console.log(`Example app listening on port ${port}!`));\n};\n\nstart();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zZXJ2ZXIuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zZXJ2ZXIuanM/MWQ2OSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpXHJcbmNvbnN0IGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpXHJcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKVxyXG5jb25zdCBwb3J0ID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCA4MDgwXHJcbmNvbnN0IGNvcnMgPSByZXF1aXJlKCdjb3JzJyk7XHJcbi8vIGNvbnN0IGF4aW9zID0gcmVxdWlyZSgnYXhpb3MnKTtcclxuY29uc3QgQ2hlZnMgPSByZXF1aXJlKCcuL21vZHVsZXMvQ2hlZnMnKVxyXG5jb25zdCBDbGFzc2VzID0gcmVxdWlyZSgnLi9tb2R1bGVzL0NsYXNzZXMnKVxyXG5jb25zdCBMZXNzb25zID0gcmVxdWlyZSgnLi9tb2R1bGVzL0xlc3NvbnMnKVxyXG5jb25zdCBVc2VycyA9IHJlcXVpcmUoJy4vbW9kdWxlcy9Vc2VycycpO1xyXG5jb25zdCBBZG1pbiA9IHJlcXVpcmUoJy4vbW9kdWxlcy9BZG1pbicpO1xyXG5cclxuY29uc3QgeyBDbGllbnQgfSA9IHJlcXVpcmUoJ0BlbGFzdGljL2VsYXN0aWNzZWFyY2gnKVxyXG5zdGFydCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGVzQ2xpZW50ID0gbmV3IENsaWVudCh7XHJcbiAgICAgICAgY2xvdWQ6IHtcclxuICAgICAgICAgICAgaWQ6ICd5ZXNjaGVmOmRYTXRaV0Z6ZEMweExtRjNjeTVtYjNWdVpDNXBieVJqTVRjeVpqZGpZalZqWWpZMFl6VXhZakUxTVdZeE5HRTVOemswT0RnM1ppUTNZemMxT1dGa1l6Vm1PR1EwTWprNVltWXpZelJqTlRRNVpURmpZV0UwTXc9PSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGF1dGg6IHtcclxuICAgICAgICAgICAgLy8gYXBpS2V5OiAnOHMxZHFKQUlTN0tuVUhkYjV0ZmFtZydcclxuICAgICAgICAgICAgdXNlcm5hbWU6IFwieWMtYmVcIixcclxuICAgICAgICAgICAgcGFzc3dvcmQ6IFwid1YyN1puYzVMSEdSZGlxXCJcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBEZWZhdWx0IGNvbmZpZyBvcHRpb25zXHJcbiAgICAvLyBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgIC8vICAgICBiYXNlVVJMOiAnaHR0cHM6Ly9jMTcyZjdjYjVjYjY0YzUxYjE1MWYxNGE5Nzk0ODg3Zi51cy1lYXN0LTEuYXdzLmZvdW5kLmlvOjkyNDMnLFxyXG4gICAgLy8gICAgIGhlYWRlcnM6IHtcclxuICAgIC8vICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmFzaWMgZVdNdFltVTZkMVl5TjFwdVl6Vk1TRWRTWkdseCdcclxuICAgIC8vICAgICB9LFxyXG4gICAgLy8gfTtcclxuICAgIC8vIENyZWF0ZSBpbnN0YW5jZVxyXG4gICAgLy8gbGV0IGF4aW9zSW5zdGFuY2UgPSBheGlvcy5jcmVhdGUoZGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgQ2hlZnMuaW5pdChlc0NsaWVudCk7XHJcbiAgICBMZXNzb25zLmluaXQoZXNDbGllbnQpO1xyXG4gICAgQ2xhc3Nlcy5pbml0KGVzQ2xpZW50LCBMZXNzb25zKTtcclxuXHJcbiAgICBjb25zdCBhbGxvd2VkT3JpZ2lucyA9IFsnaHR0cDovL2xvY2FsaG9zdDozMDAwJywgJ2h0dHBzOi8veWVzY2hlZi5tZSddO1xyXG5cclxuICAgIC8vIEF1dG9tYXRpY2FsbHkgYWxsb3cgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzXHJcbiAgICBhcHAudXNlKGNvcnMoe1xyXG4gICAgICAgIG9yaWdpbjogKG9yaWdpbiwgY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgLy8gYWxsb3cgcmVxdWVzdHMgd2l0aCBubyBvcmlnaW4gXHJcbiAgICAgICAgICAgIC8vIChsaWtlIG1vYmlsZSBhcHBzIG9yIGN1cmwgcmVxdWVzdHMpXHJcbiAgICAgICAgICAgIGlmICghb3JpZ2luKSByZXR1cm4gY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYWxsb3dlZE9yaWdpbnMuaW5kZXhPZihvcmlnaW4pID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1zZyA9ICdUaGUgQ09SUyBwb2xpY3kgZm9yIHRoaXMgc2l0ZSBkb2VzIG5vdCAnICtcclxuICAgICAgICAgICAgICAgICAgICAnYWxsb3cgYWNjZXNzIGZyb20gdGhlIHNwZWNpZmllZCBPcmlnaW4uJztcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IobXNnKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbiAgICBhcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKVxyXG5cclxuICAgIC8vRW5kIHBvaW50c1xyXG4gICAgYXBwLmdldCgnL2NoZWYvOmlkL2luZm8nLCBDaGVmcy5nZXRJbmZvKTtcclxuXHJcbiAgICAvLyBhcHAucG9zdCgnL2NoZWNrb3V0JywgU3RyaXBlLmFkZENoYXJnZSk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy91c2VyJywgVXNlcnMudXBkYXRlKTtcclxuICAgIGFwcC5nZXQoJy91c2VyJywgVXNlcnMuZ2V0VXNlckRhdGEpO1xyXG5cclxuICAgIGFwcC5nZXQoJy9oYycsIChyZXEsIHJlcykgPT4ge1xyXG4gICAgICAgIHJlcy5lbmQoXCJJJ20gQWxpdmUhXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYXBwLmdldCgnL2NsYXNzLzppZCcsIENsYXNzZXMuZ2V0SW5mbyk7XHJcbiAgICBhcHAuZ2V0KCcvY2xhc3Nlcy8nLCBDbGFzc2VzLmdldENsYXNzTGlzdCk7XHJcbiAgICBhcHAuZ2V0KCcvY2xhc3MvOmNsYXNzSWQvbGVzc29uLzpsZXNzb25JbmRleCcsIExlc3NvbnMuZ2V0SW5mb0J5Q2xhc3NBbmRJbmRleCk7XHJcblxyXG4gICAgYXBwLnBvc3QoJy9kb2NzLycsIEFkbWluLmFkbWluRG9jc1VwZGF0ZSk7XHJcblxyXG4gICAgYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiBjb25zb2xlLmxvZyhgRXhhbXBsZSBhcHAgbGlzdGVuaW5nIG9uIHBvcnQgJHtwb3J0fSFgKSk7XHJcbn1cclxuc3RhcnQoKTsiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBSkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFaQTtBQWNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQUEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./server.js\n");

/***/ }),

/***/ 0:
/*!**************************************************************!*\
  !*** multi webpack/hot/poll?1000 babel-polyfill ./server.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");
__webpack_require__(/*! babel-polyfill */"babel-polyfill");
module.exports = __webpack_require__(/*! C:\dev\YesChef\yeschef-be\server.js */"./server.js");


/***/ }),

/***/ "@elastic/elasticsearch":
/*!*****************************************!*\
  !*** external "@elastic/elasticsearch" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@elastic/elasticsearch\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQGVsYXN0aWMvZWxhc3RpY3NlYXJjaC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcIkBlbGFzdGljL2VsYXN0aWNzZWFyY2hcIj8zNGVhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIkBlbGFzdGljL2VsYXN0aWNzZWFyY2hcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///@elastic/elasticsearch\n");

/***/ }),

/***/ "babel-polyfill":
/*!*********************************!*\
  !*** external "babel-polyfill" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"babel-polyfill\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFiZWwtcG9seWZpbGwuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1wb2x5ZmlsbFwiPzYzNjIiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtcG9seWZpbGxcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///babel-polyfill\n");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS1wYXJzZXIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJib2R5LXBhcnNlclwiPzgxODgiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///body-parser\n");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImNvcnNcIj83ZTllIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcnNcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///cors\n");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImV4cHJlc3NcIj8yMmZlIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///express\n");

/***/ }),

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"firebase-admin\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWJhc2UtYWRtaW4uanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmaXJlYmFzZS1hZG1pblwiPzg5M2YiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZmlyZWJhc2UtYWRtaW5cIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///firebase-admin\n");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongodb\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29kYi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcIm1vbmdvZGJcIj9kZWZmIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1vbmdvZGJcIik7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///mongodb\n");

/***/ })

/******/ });