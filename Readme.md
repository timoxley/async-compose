# async-compose

  Compose a series of async functions together to manipulate an object.

	Similar to an async reduce function, but each iteration pops a
	function from a stack of transformations.

## Installation

    $ component install timoxley/async-transform

## Example

```js
var compose = require('async-compose')
var request = require('visionmedia-superagent')

function getInfo(user, next) {
	request
	.get('https://api.github.com/users/' + user.name)
	.end(function(res) {
		user.hireable = res.body.hireable
		user.avatar_url = res.body.avatar_url
		next(null, user)
	})
}

function getOrgs(user, next) {
	request
	.get('https://api.github.com/users/'+user.name+'/orgs')
	.end(function(res) {
		user.orgs = res.body
		next(null, user)
	})
}

var loadInfo = compose([getInfo, getOrgs])

loadInfo({name: 'timoxley'}, function(err, user) {
	console.log('User details: %o', user)
})

```

## License

MIT
