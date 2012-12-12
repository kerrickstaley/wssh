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
		System.out.println("SSHInputStream - begin reading byte");
		while (toSend.isEmpty())
		{
			System.out.println("SSHInputStream - thread waits for input");
			try
			{
				this.wait();
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
			System.out.println("SSHInputStream - thread notified");
		}

		System.out.println("SSHInputStream - thread reads input: " + toSend.peek().intValue() + "(" + ((char) toSend.peek().intValue()) + ")");

		return this.toSend.poll().intValue();
	}

	synchronized public void write(String input)
	{
		System.out.println("SSHInputStream - begin insert to byte array");
		boolean wasEmpty = this.toSend.isEmpty();
		for (int i = 0; i < input.length(); i++)
		{
			char strChar = input.charAt(i);
			this.toSend.offer(Byte.valueOf((byte) ((strChar&0xFF00)>>8)));
			this.toSend.offer(Byte.valueOf((byte) (strChar&0x00FF))); 
		}

		if (wasEmpty)
		{
			System.out.println("SSHInputStream - Waking up waiting threads, if any");
			this.notify();
		}
		System.out.println("SSHInputStream - end insert to byte array");
	}
}

