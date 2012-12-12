package wssh.io;

import java.io.InputStream;
import java.io.StringWriter;
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

	// Based off of Apache Commons StringEscapeUtils::unescapeJava
	protected static String unescapeString(String str)
	{
		int size = str.length();
		StringWriter writer = new StringWriter(size);
		StringBuffer unicode = new StringBuffer(4);

		boolean hadSlash = false;
		boolean inUnicode = false;

		for (int i = 0; i < size; i += 1)
		{
			char ch = str.charAt(i);

			// We've already started reading unicode character
			if (inUnicode)
			{
				unicode.append(ch);

				// We've read all four hex values
				if (unicode.length() == 4)
				{
					try
					{
						int value = Integer.parseInt(unicode.toString(), 16);
						writer.write((char) value);

						unicode.setLength(0);
						inUnicode = false;
						hadSlash = false;
					}
					catch (NumberFormatException e)
					{
						e.printStackTrace();
					}
				}

				continue;
			}

			// Handle escaped value
			if (hadSlash)
			{
				hadSlash = false;

				if (ch == '\\')
				{
					writer.write('\\');
				}
				else if (ch == '\'')
				{
					writer.write('\'');
				}
				else if (ch == '\"')
				{
					writer.write('"');
				}
				else if (ch == 'r')
				{
					writer.write('\r');
				}
				else if (ch == 'f')
				{
					writer.write('\f');
				}
				else if (ch == 't')
				{
					writer.write('\t');
				}
				else if (ch == 'n')
				{
					writer.write('\n');
				}
				else if (ch == 'b')
				{
					writer.write('\b');
				}
				else if (ch == 'u')
				{
					// Unicode parsing
					inUnicode = true;
				}
				else
				{
					writer.write(ch);
				}

				continue;
			}
			else if (ch == '\\')
			{
				hadSlash = true;
				continue;
			}

			writer.write(ch);
		}

		// Slash (\) at the end of string. Output it
		if (hadSlash)
		{
			writer.write('\\');
		}

		return writer.toString();
	}
}

