package wssh.connection.ssh;

import org.java_websocket.WebSocket;

import wssh.connection.OneShot;
import wssh.io.SSHInputStream;
import wssh.io.SSHOutputStream;

public class SSHConnection
{
	private SSHInputStream toSSH;
	private SSHOutputStream fromSSH;

	public SSHConnection(WebSocket ws, String host, String username, String password)
	{
		this(ws, host, username, password, 22);
	}

	public SSHConnection(WebSocket ws, String host, String username, String password, int port)
	{
		this.toSSH = new SSHInputStream();
		this.fromSSH = new SSHOutputStream(ws);
	}

	public void disconnect()
	{

	}

	synchronized public void write(String input)
	{
		this.toSSH.write(input);
	}
}

