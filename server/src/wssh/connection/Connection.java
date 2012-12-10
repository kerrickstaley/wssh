package wssh.connection;

import com.jcraft.jsch.SftpException;

import org.java_websocket.WebSocket;

import wssh.connection.sftp.SFTPConnection;
import wssh.connection.ssh.SSHConnection;

public class Connection
{
	private SSHConnection ssh;
	private SFTPConnection sftp;

	public Connection(WebSocket ws, String host, String username, String password)
	{
		this(ws, host, username, password, 22);
	}

	public Connection(WebSocket ws, String host, String username, String password, int port)
	{
		this.ssh = new SSHConnection(ws, host, username, password, port);
		this.sftp = new SFTPConnection(host, username, password, port);
	}

	public void disconnect()
	{
		this.ssh.disconnect();
		this.sftp.disconnect();
	}

	public void commandKeys(String key)
	{
		this.ssh.write(key);
	}

	public String commandLs(String dir)
	{
		String token = "{\"ls\": [{";
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
			String type = filename.substring(0, 1);
			token += "\"name\": \"" + filename.substring(1) + "\", \"isdir\": " + String.valueOf(type.equals("d")) + "}, {";
		}
		token = token.substring(0, token.length() - 3) + "]}";

		return token;
	}
}

