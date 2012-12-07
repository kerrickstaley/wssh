package wssh.io;

import java.io.OutputStream;

public class SSHOutputStream extends OutputStream
{
	/** @Override */
	public void write(int b)
	{
		System.out.println(((char) b));
	}

	public String read()
	{
		return "";
	}
}

