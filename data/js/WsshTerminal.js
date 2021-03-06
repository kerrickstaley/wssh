function extend(subClass, baseClass) {
	function inheritance() { }
	inheritance.prototype          = baseClass.prototype;
	subClass.prototype             = new inheritance();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superClass  = baseClass.prototype;
};

function WsshTerminal(container) {
	this.superClass.constructor.call(this, container);
}
extend(WsshTerminal, VT100);

WsshTerminal.prototype.keysPressed = function(keys) {
	send({keys: keys.replace(/\r/, '\n')});
}

WsshTerminal.prototype.vt100 = function(data) {
       this.superClass.vt100.call(this, data.replace(/\n/, '\r\n'));
}
