var Compose = require('async-compose')
var assert = require('timoxley-assert')

describe('compose', function() {
  describe('with no functions', function() {
    var result, target
    beforeEach(function(done) {
      target = {}
      var composed = Compose([])
      composed(target, function(err, res) {
        console.log(arguments)
        assert.ifError(err)
        result = res
        done()
      })
    })
    it('does not create a new object', function() {
      assert.strictEqual(result, target)
    })
    it('does not change object', function() {
      assert.deepEqual(result, target)
    })
  })

  describe('with functions', function() {
    var result, target, fns
    beforeEach(function(done) {
      target = {
        data: []
      }
      fns = [
        function(obj, next) {
          obj.data.push(1)
          next(null, obj)
        },
        function(obj, next) {
          obj.data.push(2)
          next(null, obj)
        }
      ]
      var composed = Compose(fns)
      composed(target, function(err, res) {
        assert.ifError(err)
        result = res
        done()
      })
    })

    it('executes tranformations in order', function() {
      assert.deepEqual([1, 2], result.data)
    })

    it('stops at first error', function(done) {
      function callbackWithError(obj, fn) { fn(new Error('Expected.')) }
      function shouldNeverRun(obj) { throw new Error('should not get here') }

      var composed = Compose([callbackWithError, shouldNeverRun])
      composed(0, function(err) {
        assert.ok(err)
        done()
      })
    })
  })
  describe('async/sync behaviour', function() {
    var result, target, fns
    it('is optionally async', function(done) {
      var obj = {
        data: []
      }

      fns = [
        function(obj, next) {
          obj.data.push(1)
          next(null, obj)
          obj.data.push(2)
        },
        function(obj, next) {
          setTimeout(function() {
            obj.data.push(3)
            next(null, obj)
          }, 0)
        }
      ]

      var composed = Compose(fns)
      composed(obj, function(err, res) {
        assert.ifError(err)
        result = res
        assert.deepEqual([1, 2, 3], result.data)
        done()
      })
    })

    it('can handle sync functions', function(done) {
      var add = function(obj) {obj++; return obj;} // note no callback
      var composed = Compose([add])
      composed(0, function(err, result) {
        assert.ifError(err)
        assert.strictEqual(result, 1)
        done()
      })
    })
  })
})



