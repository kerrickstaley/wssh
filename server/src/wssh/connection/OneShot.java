package wssh.connection;
/* -*-mode:java; c-basic-offset:2; indent-tabs-mode:nil -*- */

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.Iterator;
import java.util.Properties;
import java.util.Vector;

import com.jcraft.jsch.*;

import javax.swing.JOptionPane;
public class OneShot{
	
	
	
	public void StartShell(String host,String passwd, InputStream in, PrintStream out)
	{

//	Shell obj = new Shell("james@dwtj.me", "09300930a", System.in, System.out);
//		obj.createSession();
	
	 try{
	      JSch jsch=new JSch();

	      //jsch.setKnownHosts("/home/foo/.ssh/known_hosts");

	      

	      /*  host=JOptionPane.showInputDialog("Enter username@hostname",
	                                         System.getProperty("user.name")+
	                                         "@localhost"); 
	      */
	      String user=host.substring(0, host.indexOf('@'));
	      host=host.substring(host.indexOf('@')+1);

	      Session session=jsch.getSession(user, host, 22);

	      //String passwd = JOptionPane.showInputDialog("Enter password");
	      session.setPassword(passwd);

	      UserInfo ui = new MyUserInfo(){
	        public void showMessage(String message){
	          JOptionPane.showMessageDialog(null, message);
	        }
	        public boolean promptYesNo(String message){
	        	return true;
	        }

	        // If password is not given before the invocation of Session#connect(),
	        // implement also following methods,
	        //   * UserInfo#getPassword(),
	        //   * UserInfo#promptPassword(String message) and
	        //   * UIKeyboardInteractive#promptKeyboardInteractive()

	      };

	      session.setUserInfo(ui);

	      // It must not be recommended, but if you want to skip host-key check,
	      // invoke following,
	      // session.setConfig("StrictHostKeyChecking", "no");

	      //session.connect();
	      session.connect(30000);   // making a connection with timeout.

	      Channel channel=session.openChannel("shell");

	      // Enable agent-forwarding.
	      //((ChannelShell)channel).setAgentForwarding(true);

	      channel.setInputStream(in);
	      /*
	      // a hack for MS-DOS prompt on Windows.
	      channel.setInputStream(new FilterInputStream(System.in){
	          public int read(byte[] b, int off, int len)throws IOException{
	            return in.read(b, off, (len>1024?1024:len));
	          }
	        });
	       */

	      channel.setOutputStream(out);

	      /*
	      // Choose the pty-type "vt102".
	      ((ChannelShell)channel).setPtyType("vt102");
	      */

	      /*
	      // Set environment variable "LANG" as "ja_JP.eucJP".
	      ((ChannelShell)channel).setEnv("LANG", "ja_JP.eucJP");
	      */

	      //channel.connect();
	      channel.connect(3*1000);
	    }
	    catch(Exception e){
	      System.out.println(e);
	    }
	}
	
	
	public Session openSFTP(String host, int PORT, String passwd) throws Exception {
		//JSch.setLogger(new MyJschLogger());
		JSch jSch = new JSch();
	      String user=host.substring(0, host.indexOf('@'));
	      host=host.substring(host.indexOf('@')+1);

	      Session session=jSch.getSession(user, host, 22);

	      //String passwd = JOptionPane.showInputDialog("Enter password");
	      session.setPassword(passwd);

	      UserInfo ui = new MyUserInfo(){
	        public void showMessage(String message){
	          JOptionPane.showMessageDialog(null, message);
	        }
	        public boolean promptYesNo(String message){
	        	return true;
	        }

	        // If password is not given before the invocation of Session#connect(),
	        // implement also following methods,
	        //   * UserInfo#getPassword(),
	        //   * UserInfo#promptPassword(String message) and
	        //   * UIKeyboardInteractive#promptKeyboardInteractive()

	      };

	      session.setUserInfo(ui);
                // TODO: remove this line in real life. Work with known_hosts!
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config);

		session.connect();
/*		Channel channel = session.openChannel("sftp");
		ChannelSftp sftp = (ChannelSftp) channel;
		sftp.connect();

		final Vector files = sftp.ls(".");
		Iterator itFiles = files.iterator();
		while (itFiles.hasNext()) {
			System.out.println("Index: " + itFiles.next());
		}

		final ByteArrayInputStream in = new ByteArrayInputStream(
				"This is a sample text".getBytes());

		sftp.put(in, "test.txt", ChannelSftp.OVERWRITE);

		sftp.disconnect();
		session.disconnect();
*/
		return session;
	}	
	
	
	
	
	
	
	
	  public static abstract class MyUserInfo
      implements UserInfo, UIKeyboardInteractive{
public String getPassword(){ return null; }
public boolean promptYesNo(String str){ return false; }
public String getPassphrase(){ return null; }
public boolean promptPassphrase(String message){ return false; }
public boolean promptPassword(String message){ return false; }
public void showMessage(String message){ }
public String[] promptKeyboardInteractive(String destination,
                          String name,
                          String instruction,
                          String[] prompt,
                          boolean[] echo){
return null;
}
}
}