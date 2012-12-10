package wssh;

import java.net.InetSocketAddress;
import java.util.HashMap;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import JavaJSON.JSONObject;

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

		String command = message.substring(1, message.indexOf(":"));
		System.out.println(command);
		JSONObject commandObj = new JSONObject(message);
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

