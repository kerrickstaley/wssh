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
}
extend(WsshTerminal, VT100);
