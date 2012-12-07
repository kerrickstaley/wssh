package wssh.io;

import java.io.InputStream;
import java.util.concurrent.ConcurrentLinkedQueue;

public class SSHInputStream extends InputStream
{
	private ConcurrentLinkedQueue<Byte> toSend;

	public SSHInputStream()
	{
		this.toSend = new ConcurrentLinkedQueue<Byte>();
	}

	/** @Override */
	synchronized public int read()
	{
		while (toSend.isEmpty())
		{
			try
			{
				this.wait();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		return toSend.poll().intValue();
	}

	synchronized public void write(String input)
	{
		boolean wasEmpty = toSend.isEmpty();
		for (int i = 0; i < input.length(); i++)
		{
			char strChar = input.charAt(i);
			this.toSend.offer(Byte.valueOf((byte) ((strChar&0xFF00)>>8)));
			this.toSend.offer(Byte.valueOf((byte) (strChar&0x00FF))); 
		}

		if (wasEmpty)
		{
			this.notify();
		}
	}
}

