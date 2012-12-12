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

		int firstQuote = message.indexOf("\"") + 1;
		int secondQuote = message.indexOf("\"", firstQuote);
		String command = message.substring(firstQuote, secondQuote);
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
				String keys = ((JSONString) commandObj.getItem("keys").getValue()).getValue();
				connection.commandKeys(keys);
			} else if (command.equals("ls"))
			{
			    String dir = ((JSONString) commandObj.getItem("ls").getValue()).getValue();
			    ws.send(connection.commandLs(dir));
			}
		}
	}

	public void onClose(WebSocket ws, int code, String reason, boolean remote)
	{
		Connection connection = this.connections.get(ws);
		if (connection != null)
		{
			connection.disconnect();
		}
	}

	public void onError(WebSocket ws, Exception ex)
	{
		ex.printStackTrace();
	}

	public static void main(String[] argv)
	{
		ServerMain server = new ServerMain(new InetSocketAddress(8001));
		server.start();
	}
}

