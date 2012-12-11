package wssh.connection.sftp;

import java.util.Vector;

import com.jcraft.jsch.ChannelSftp; 
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.SftpException;

import wssh.connection.OneShot;

public class SFTPConnection
{
	private ChannelSftp sftpChannel;

	public SFTPConnection(ChannelSftp sftpChannel)
	{
		this.sftpChannel = sftpChannel;
	}

	public void disconnect()
	{
		this.sftpChannel.disconnect();
	}

	public String[] ls(String dir) throws SftpException
	{
		Vector<LsEntry> entries = this.sftp.ls(dir);
		String[] ret = new String[entries.size()];

		int i = 0;
		for (LsEntry entry : entries)
		{
			String type = "f";
			if (entry.getAttrs().isDir())
			{
				type = "d";
			}
			ret[i++] = type + entry.getFilename();
		}

		return ret;
	}
}

