package wssh.connection.ssh;

import wssh.connection.OneShot;

public class SSHConnection
{
	private SSHInputStream toSHH;
	private SSHPrintStream fromSSH;

	public SSHConnection(String host, String username, String password)
	{
		this(host, username, password, 22);
	}

	public SSHConnection(String host, String username, String password, int port)
	{
		this.toSSH = new SSHInputStream();
		this.fromSSH = new PrintStream(new SSHOutputStream());
	}

	synchronized public void write(String input)
	{
		this.toSSH.input(input);
	}

	synchronized public String read()
	{
		return this.fromSSH.read();
	}
}

