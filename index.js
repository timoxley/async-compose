var clone = require('clone')
var async = require('async.js')
var nextTick = require('next-tick')

module.exports = function compose(fns) {
  return function(obj, done) {
    async.reduce(fns, obj, function(obj, fn, callback){
      fn = requireCallback(fn)
      fn(obj, callback)
    }, function(err, results) {
      nextTick(function() {
        done(err, results)
      })
    })
  }
}

/**
 * Require function to return results in callback.
 *
 * @param fn
 * @return {Function}
 * @api private
 */

function requireCallback(fn) {
  if (fn.length !== 1) return fn
  return function(obj, next) {
    next(null, fn(obj))
  }
}
