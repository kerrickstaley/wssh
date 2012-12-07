package wssh.io;

import java.io.InputStream;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SSHInputStream extends InputStream
{
	private ConcurrentLinkedQueue<Byte> toSend;

	public SSHInputStream()
	{
		this.toSend = new ConcurrentLinkQueue<Byte>();
	}

	/** @Override */
	synchronized public int read()
	{
		while (toSend.isEmpty())
		{
			this.wait();
		}

		return toSend.poll().intValue();
	}

	synchronized public void write(String input)
	{
		boolean wasEmpty = this.isEmpty();
		for(int i = 0; i < input.length(); i++)
		{
			char strChar = str.charAt(i);
			this.toSend.offer(Byte.valueOf((byte) ((strChar&0xFF00)>>8)));
			this.toSend.offer(Byte.valueOf((byte) (strChar&0x00FF))); 
		}

		if (wasEmpty)
		{
			this.notify();
		}
	}
}

