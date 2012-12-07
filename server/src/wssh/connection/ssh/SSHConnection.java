package wssh.connection.ssh;

import wssh.connection.OneShot;
import wssh.io.SSHInputStream;
import wssh.io.SSHOutputStream;

public class SSHConnection
{
	private SSHInputStream toSSH;
	private SSHOutputStream fromSSH;

	public SSHConnection(String host, String username, String password)
	{
		this(host, username, password, 22);
	}

	public SSHConnection(String host, String username, String password, int port)
	{
		this.toSSH = new SSHInputStream();
		this.fromSSH = new SSHOutputStream();
	}

	public void disconnect()
	{

	}

	synchronized public void write(String input)
	{
		this.toSSH.write(input);
	}

	synchronized public String read()
	{
		return this.fromSSH.read();
	}
}

