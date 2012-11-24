function extend(subClass, baseClass) {
	function inheritance() { }
	inheritance.prototype          = baseClass.prototype;
	subClass.prototype             = new inheritance();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superClass  = baseClass.prototype;
};

function WsshTerminal(container)
{
	this.superClass.constructor.call(this, container);
	this.sock = new WebSocket('ws://localhost:8001');
}
extend(WsshTerminal, VT100);

WsshTerminal.prototype.keysPressed = function(keys)
{
	this.superClass.keysPressed.call(this, keys);
	this.sock.send(JSON.stringify({ keys: keys }));
}
