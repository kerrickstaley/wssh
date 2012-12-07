package wssh.connection.sftp;

import org.jcraft.jsch.ChannelSftp; 

import wssh.connection.OneShot;

public class SFTPConnection
{
	private ChannelSftp sftp;

	public SFTPConnection(String host, String username, String password)
	{
		this(host, username, password, 22);
	}

	public SFTPConnection(String host, String username, String password, int port)
	{
		this.sftp = (new OneShot).openSFTP(username + "@" + host, port, password);
	}
}

