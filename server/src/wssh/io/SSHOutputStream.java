package wssh.io;

import java.io.OutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.java_websocket.WebSocket;

public class SSHOutputStream extends OutputStream
{
	private WebSocket ws;
	private Pattern escapeExpression;

	public SSHOutputStream(WebSocket ws)
	{
		this.ws = ws;

		this.escapeExpression = Pattern.compile("(\"|\\\\u)");
	}

	/** @Override */
	public void write(int b)
	{
		//String character = this.escapeExpression.matcher("" + ((char) b)).replaceAll("\\\\$1");
		String character = "" + ((char) b);
		System.out.println(character);
		String token = "{\"output\": \"" + character + "\"}";
		System.out.println(token);
		ws.send(token);
		//System.out.println(((char) b));
	}
}

