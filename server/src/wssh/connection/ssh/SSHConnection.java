package wssh.connection.ssh;

import java.io.PrintStream;

import com.jcraft.jsch.ChannelShell;
import com.jcraft.jsch.JSchException;

import org.java_websocket.WebSocket;

import wssh.io.SSHInputStream;
import wssh.io.SSHOutputStream;

public class SSHConnection
{
	private ChannelShell shellChannel;
	private SSHInputStream toSSH;
	private SSHOutputStream fromSSH;

	public SSHConnection(WebSocket ws, ChannelShell shellChannel)
	{
		this.toSSH = new SSHInputStream();
		this.fromSSH = new SSHOutputStream(ws);
		this.shellChannel = shellChannel;

		shellChannel.setInputStream(this.toSSH);
		shellChannel.setOutputStream(new PrintStream(this.fromSSH));

		try
		{
			shellChannel.connect();
		}
		catch (JSchException e)
		{
			e.printStackTrace();
		}
	}

	public void disconnect()
	{
		this.shellChannel.disconnect();
	}

	synchronized public void write(String input)
	{
		System.out.println("SSHConnection - writing input: " + input);
		this.toSSH.write(input);
	}
}

