package wssh.io;

import java.io.OutputStream;

import org.java_websocket.WebSocket;

public class SSHOutputStream extends OutputStream
{
	private WebSocket ws;

	public SSHOutputStream(WebSocket ws)
	{
		this.ws = ws;
	}

	/** @Override */
	public void write(int b)
	{
		String character = "" + ((char) b);
		ws.send("{\"output\": \"" + character + "\"}");
		//System.out.println(((char) b));
	}
}

