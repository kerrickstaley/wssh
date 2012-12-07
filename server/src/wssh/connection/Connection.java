package wssh.connection;

import com.jcraft.jsch.SftpException;

import org.java_websocket.WebSocket;

import wssh.connection.sftp.SFTPConnection;
import wssh.connection.ssh.SSHConnection;

public class Connection
{
	private WebSocket ws;
	private SSHConnection ssh;
	private SFTPConnection sftp;

	public Connection(WebSocket ws, String host, String username, String password)
	{
		this(ws, host, username, password, 22);
	}

	public Connection(WebSocket ws, String host, String username, String password, int port)
	{
		this.ws = ws;
		this.ssh = new SSHConnection(host, username, password, port);
		this.sftp = new SFTPConnection(host, username, password, port);
	}

	public void disconnect()
	{
		this.ssh.disconnect();
		this.sftp.disconnect();
	}

	public void sendSSHKey(String key)
	{
		this.ssh.write(key);
	}

	public String getDirectoryContents(String dir)
	{
		String token = "{command: \"ls\", return: [\"";
		String[] files;

		try
		{
			files = this.sftp.ls(dir);
		}
		catch (SftpException e)
		{
			files = new String[0];
			e.printStackTrace();
		}

		for (String filename : files)
		{
			token += filename + "\", \"";
		}
		token = token.substring(0, token.length() - 3) + "]}";

		return token;
	}
}

