package wssh.connection;

import org.java_websocket.WebSocket;

import wssh.connection.sftp.SFTPConnection;
import wssh.connection.ssh.SSHConnection;

class Connection
{
	private WebSocket ws;
	private SSHConnection ssh;
	private SFTPConnection sftp;

	public Connection(WebSocket ws, String host, String username, String password, int port = 22)
	{
		this.ws = ws;
		this.ssh = new SSHConnection(host, username, password, port);
		this.sftp = new SFTPConnection(host, username, password, port);
	}

	public void sendSSHKey(String key)
	{
		this.ssh.write(key);
	}

	public String getDirectoryContents(String dir)
	{
		String token = "{command: \"ls\", return: [\"";
		for (String filename : this.sftp.ls(dir))
		{
			token += filename + "\", \"";
		}
		token = token.substring(0, token.length() - 3) + "]}";

		return token;
	}
}

