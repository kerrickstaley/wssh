package wssh;

import java.net.InetSocketAddress;
import java.util.HashMap;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import JavaJSON.JSONArray;
import JavaJSON.JSONInteger;
import JavaJSON.JSONObject;
import JavaJSON.JSONString;

import wssh.connection.Connection;

// TODO remove
import java.io.PrintStream;
import wssh.connection.ssh.SSHConnection;
import wssh.io.SSHOutputStream;

public class ServerMain extends WebSocketServer
{
	HashMap<WebSocket, Connection> connections;

	public ServerMain(InetSocketAddress address)
	{
		super(address);
		this.connections = new HashMap<WebSocket, Connection>();
	}

	public void onOpen(WebSocket ws, ClientHandshake handshake)
	{

	}

	public void onMessage(WebSocket ws, String message)
	{
		Connection connection = this.connections.get(ws);

		int firstQuote = message.indexOf("\"");
		int secondQuote = message.indexOf("\"", firstQuote + 1);
		String command = message.substring(firstQuote, secondQuote - firstQuote + 1);
		System.out.println(command);
		JSONObject commandObj = new JSONObject(message);

		if (command.equals("connect"))
		{
			JSONArray connParams = (JSONArray) (commandObj.getItem("connect")).getValue();
			Connection conn = new Connection(
					ws,
					((JSONString) connParams.getItem(2)).getValue(),
					((JSONString) connParams.getItem(0)).getValue(),
					((JSONString) connParams.getItem(1)).getValue(),
					((JSONInteger) connParams.getItem(3)).getValue().intValue()
				);

			this.connections.put(ws, conn);
		}
		else if (connection != null)
		{
			if (command.equals("keys"))
			{
				connection.commandKeys(((JSONString) commandObj.getItem("keys").getValue()).getValue());
			}
		}
	}

	public void onClose(WebSocket ws, int code, String reason, boolean remote)
	{
		Connection connection = this.connections.get(ws);
		connection.disconnect();
	}

	public void onError(WebSocket ws, Exception ex)
	{
		ex.printStackTrace();
	}

	public static void main(String[] argv)
	{
		ServerMain server = new ServerMain(new InetSocketAddress(8001));
		server.start();

//		SSHConnection ssh = new SSHConnection("cyle@localhost:20", "cjdubuntuserver18", System.in, new PrintStream(new SSHOutputStream()));
	}
}

