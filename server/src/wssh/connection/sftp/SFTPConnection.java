package wssh.connection.sftp;

import java.util.Vector;

import com.jcraft.jsch.ChannelSftp; 
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

import wssh.connection.OneShot;

public class SFTPConnection
{
	private Session sftpSession;
	private ChannelSftp sftp;

	public SFTPConnection(String host, String username, String password)
	{
		this(host, username, password, 22);
	}

	public SFTPConnection(String host, String username, String password, int port)
	{
		try
		{
			this.sftpSession = (new OneShot()).openSFTP(username + "@" + host, port, password);
			this.sftp = (ChannelSftp) this.sftpSession.openChannel("sftp");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}

	public void disconnect()
	{
		this.sftp.disconnect();
		this.sftpSession.disconnect();
	}

	public String[] ls(String dir) throws SftpException
	{
		Vector<LsEntry> entries = this.sftp.ls(dir);
		String[] ret = new String[entries.size()];

		int i = 0;
		for (LsEntry entry : entries)
		{
			ret[i++] = entry.getFilename();
		}

		return ret;
	}
}

