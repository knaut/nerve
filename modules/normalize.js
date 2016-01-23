module.exports = function(struct) {
	var normalized = [];

	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'array':
			for (var i = 0; struct.length > i; i++) {

				var obj = struct[i];

				for (var key in obj) {
					var parsed = this.parse.css.selector(key);
					parsed.inner = this.normalize(obj[key]);
				}

				normalized.push(parsed)
			}
			break;
		case 'object':
			var keys = Object.keys(struct);

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {
					var parsed = this.parse.css.selector(keyS);
					parsed.inner = this.normalize(struct[keyS]);
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			console.log('found a function', struct);

			// here we set the returned object as the result of whatever the function ran,
			// resulting in a structure that should also be normalized

			// we call this as the current context, assuming that this is a component
			normalized = this.normalize( struct.call(this) );

			break;
		case 'component':
			console.log('found a component');

			// for components we push a parent reference
			struct['parent'] = this;

			// we push to a children array for convenient references
			this.children.push(struct);

			// we push to the normalized template
			normalized.push( struct );

			break;
	}

	return normalized;
}