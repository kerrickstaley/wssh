package wssh.io;

import java.io.OutputStream;
import java.io.StringWriter;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.java_websocket.WebSocket;

public class SSHOutputStream extends OutputStream
{
	private WebSocket ws;

	public SSHOutputStream(WebSocket ws)
	{
		this.ws = ws;
	}

	/** @Override */
	public void write(int b)
	{
		String character = SSHOutputStream.escapeString("" + ((char) b));
		String token = "{\"output\": \"" + character + "\"}";
		ws.send(token);
	}

	// Based off of code in Apache Commons StringEscapeUtils::escapeJavaStyleString
	protected static String escapeString(String str)
	{
		StringWriter writer = new StringWriter(str.length() * 2);

		int size = str.length();
		for (int i = 0; i < size; i += 1)
		{
			char ch = str.charAt(i);

			if (ch > 0xff)
			{
				writer.write("\\u" + Integer.toHexString(ch).toUpperCase(Locale.ENGLISH));
			}
			else if (ch > 0xff)
			{
				writer.write("\\u0" + Integer.toHexString(ch).toUpperCase(Locale.ENGLISH));
			}
			else if (ch > 0x7f)
			{
					writer.write("\\u00" + Integer.toHexString(ch).toUpperCase(Locale.ENGLISH));
			}
			else if (ch < 32)
			{
				if (ch == '\b')
				{
					writer.write('\\');
					writer.write('b');
				}
				else if (ch == '\n')
				{
					writer.write('\\');
					writer.write('n');
				}
				else if (ch == '\t')
				{
					writer.write('\\');
					writer.write('t');
				}
				else if (ch == '\f')
				{
					writer.write('\\');
					writer.write('f');
				}
				else if (ch == '\r')
				{
					writer.write('\\');
					writer.write('r');
				}
				else 
				{
					if (ch > 0xf)
					{
						writer.write("\\u00" + Integer.toHexString(ch).toUpperCase(Locale.ENGLISH));
					}
					else
					{
						writer.write("\\u000" + Integer.toHexString(ch).toUpperCase(Locale.ENGLISH));
					}
				}
			}
			else
			{
				if (ch == '"')
				{
					writer.write('\\');
					writer.write('"');
				}
				else if (ch == '\\')
				{
					writer.write('\\');
					writer.write('\\');
				}
				else
				{
					writer.write(ch);
				}
			}
		}

		return writer.toString();
	}
}

