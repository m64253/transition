## Transition

A naive and simple solution to do css transitions with 
javascript without the use of 30k of javascript framework.
And with the, to me, important feature that the style properties 
are updated and the finished/completed callback is called even
if css transitions is not supported be the current browser.

#### Sample usage
```javascript
document.body.style.position = 'absolute';
document.body.style.top = '0px';

transition(document.body, { top: '5%' });

transition(document.body, { top: '10%' }, {
	duration: 5000, // in milliseconds
	callback: function () {
		document.body.style.background = 'red';
	}
});
```