# 1 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
# 1 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
# 2 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 3 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 4 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 5 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 6 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 7 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino" 2
# 18 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
int _relaisState = 0x0; // State used to set the relais
unsigned int _intervalOff = 5000; // Default interval to toggle the relasi for "Klemme 15" => 1s
unsigned int _intervalOn = 1000;
unsigned long _previousMillis = 0; // Will store the last switch time

ESP8266WebServer server = ESP8266WebServer(80); // WebServer to connect to


/**

 * @brief: Send a command to the robot and reads an incomming serial from the reboot

 * 

 * After a command is send to the robot a return value is send to the serial interface. 

 * This function reads outgoing message and sends it as answer via the REsT-Interface. 

 */
# 32 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void set() {
  if (server.args() == 1) {
  if (server.argName(0) == "intervaloff") {
      _intervalOff = server.argName(0).toInt();
      server.send(200, "text/html", "Interval was set to: " + server.argName(0));
    } else if (server.argName(0) == "intervalon") {
    _intervalOn = server.argName(0).toInt();
      server.send(200, "text/html", "Interval was set to: " + server.argName(0));
    } else {
      handleNotFound();
    }
  } else {
    handleNotFound();
  }
}

/**

 * @brief: Simple WiFi setup or reconfiguration 

 * 

 * The function sends a simple HTML site for configuring the access point and the password. 

 * The password is never displayed for safety reasons. If no SSID is configured the SSID field will show "SSID"

 */
# 54 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void setupSwitch() {
  char ssid[256];
  File ssid_file = SPIFFS.open("etc/ssid" /* Path to the SSID file */, "r");

  if(!ssid_file) {
    strcpy(ssid, "SSID");
  } else {
    ssid_file.readString().toCharArray(ssid, 256);
    ssid_file.close();
  }

  server.send(200, "text/html", String() +
  "<!DOCTYPE html><html> <body>" +
  "<form action=\"\" method=\"post\" style=\"display: inline;\">" +
  "Access Point SSID:<br />" +
  "<input type=\"text\" name=\"ssid\" value=\"" + ssid + "\"> <br />" +
  "WPA2 Password:<br />" +
  "<input type=\"password\" name=\"password\" value= *** \"> <br />" +
  "<br />" +
  "<input type=\"submit\" value=\"Submit\"> </form>" +
  "<form action=\"http://" + "connectedrideswitch" /* Initial or fallback access point SSID*/ + ".local/reboot\" style=\"display: inline;\">" +
  "<input type=\"submit\" value=\"Reboot\" />" +
  "</form>" +
  "<p>Enter the details for your access point. After you submit, the controller will reboot to apply the settings.</p>" +
  "</body></html>\n");
}

/**

 * @brief: Save AP credentails to ESP8266 file system

 * 

 * The function will save the credentials of the access point (SSID and password) to the file system. 

 * If saving could not be executed correctly an error page will be send out displaying the error. 

 */
# 87 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void saveAccessPointCredentials() {
  String user_ssid = server.arg("ssid");
  String user_password = server.arg("password");
  SPIFFS.format();

  if(user_ssid != "" && user_password != "") {

    // SSID
    if (!saveToFileSystem("etc/ssid" /* Path to the SSID file */, user_ssid)) {
      server.send(400, "text/html", "<!DOCTYPE html><html> <body> Setting Access Point SSID failed!</body> </html>");
        return;
    }

    // Passwd
    if (!saveToFileSystem("etc/pass" /* Path to the password filfe*/, user_password)) {
      server.send(400, "text/html", "<!DOCTYPE html><html> <body> Setting Access Point password failed!</body> </html>");
      return;
    }

    server.send(200, "text/html", String() +
    "<!DOCTYPE html><html> <body>" +
    "Setting Access Point SSID / password was successful! <br />" +
    "<br />SSID was set to \"" + user_ssid + "\" with the password *** \". <br />" +
    "<br /> The controller will now reboot. Please re-connect to your Wi-Fi network.<br />" +
    "If the SSID or password was incorrect, the controller will return to Access Point mode." +
    "</body> </html>");

    ESP.reset();
  } else {
    server.send(400, "text/html", "<!DOCTYPE html><html> <body> Please provide a password and a SSID.</body> </html>");
  }
}

/**

 * @brief: Save a string to the file system

 * 

 * The function will save a given string to the file system. If it fails the funtions returns false, true otherwise. 

 * @param: String file - The filesystem to be saved to

 * @param: String content - The content to be saved to the filesystme

 * @return: false on error, true otherwise

 */
# 128 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
boolean saveToFileSystem(String file, String content) {

    File passwd_file = SPIFFS.open(file, "w");
    if (!passwd_file) {
      return false;
    }

    passwd_file.print(content);
    passwd_file.close();

    return true;
}

/**

 * @brief: Reboot the ESP8266

 * 

 * The function will send a message the webserver explaining the reboot. Afterwards the esp8266 is rebooted.

 */
# 146 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void rebootEvent() {
  server.send(200, "text/html", String() +
  "<!DOCTYPE html><html> <body>" +
  "The controller will now reboot.<br />" +
  "If the SSID or password is set but is incorrect, the controller will return to Access Point mode." +
  "</body> </html>");
  ESP.reset();
}


/**

 * @brief: Display an error page if the command was not found.

 * 

 * If an enpoint is triggerd that is not implemented an error page is displayed showing the wrong input paramters. 

 */
# 161 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void handleNotFound() {
 String message = "Command not found\n\n";
 message += "URI: ";
 message += server.uri();
 message += "\nMethod: ";
 message += (server.method() == HTTP_GET) ? "GET" : "POST";
 message += "\nArguments: ";
 message += server.args();
 message += "\n";

 for (uint8_t i = 0; i < server.args(); i++) {
  message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
 }

 server.send(404, "text/plain", message);
}


/**

 * @brief Start service connectedrideswitch.local 

 * 

 * This function sets a MDS for the esp8266 to be reachable via connectedrideswitch.local. 

 */
# 184 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void startMDS() {
  if (!MDNS.begin("connectedrideswitch" /* Initial or fallback access point SSID*/)) {
    ESP.reset(); // if MDNS fail => restart and try over
  }

  MDNS.addService("http", "tcp", 80);
}

/**

 * @brief. Set up server endpoints

 * 

 * All server endpoints a configurated via this function. 

 */
# 197 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void setServerEndpoints() {
  //server.on("/console", serverEvent);
  server.on("/set", set);
  server.on("/", HTTP_POST, saveAccessPointCredentials);
  server.on("/", HTTP_GET, setupSwitch);
  server.on("/reboot", HTTP_GET, rebootEvent);
  server.onNotFound(handleNotFound);
}

/**

* @brief: Mount the file system

*

* This function will mount the file system. If it fails, it formats the storage and will initialize the filesystem

*/
# 211 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void mountFileSystem() {
  if(!SPIFFS.begin()) {
    SPIFFS.format();
    SPIFFS.begin();
  }
}


/**

 * @brief: Initialize the WiFi connection

 * 

 * Check if a SSID and PW was set correctly. If not boot up an AP for further configuration.

 */
# 224 "c:\\Daten\\workspace\\esp8266\\klemme15\\klemme15.ino"
void initWiFiConnection() {
 if(SPIFFS.exists("etc/ssid" /* Path to the SSID file */) && SPIFFS.exists("etc/pass" /* Path to the password filfe*/)) {

    // Load SSID
    File ssid_file = SPIFFS.open("etc/ssid" /* Path to the SSID file */, "r");
    char ssid[256];
    ssid_file.readString().toCharArray(ssid, 256);
    ssid_file.close();

    // Load password
    File passwd_file = SPIFFS.open("etc/pass" /* Path to the password filfe*/, "r");
    char passwd[256];
    passwd_file.readString().toCharArray(passwd, 256);
    passwd_file.close();

    // attempt station connection
    WiFi.disconnect();
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, passwd);

    // Wait some seconds to connect to local WiFi
    for(int i = 0; i < 30 /* Timeout time for connecting to the access point*/ * 20 && WiFi.status() != WL_CONNECTED; i++) {
      delay(50);
    }
  }

  //start AP mode if either the AP / password do not exist, or cannot be connected to within CONNECT_TIMEOUT_SECS seconds.
  if(WiFi.status() != WL_CONNECTED) {
    WiFi.disconnect();
    WiFi.mode(WIFI_AP);

    if(!WiFi.softAP("connectedrideswitch" /* Initial or fallback access point SSID*/, "connectedride" /* Initial or fallback password for the access point */)) {
      ESP.reset(); //reset because there's no good reason for setting up an AP to fail
    }
  }
}

// General Arduino setup routine 
void setup() {

  // Setup relais pin
  pinMode(5 /* Pin number of the relais switch */, 0x01);
 digitalWrite(5 /* Pin number of the relais switch */, _relaisState);

  mountFileSystem();

  initWiFiConnection();

  setServerEndpoints();
  server.begin();

  startMDS();
}

// General Arduino loop  routine 
void loop() {
  server.handleClient();
  delay(1);

  // Toogle relais
  digitalWrite(5 /* Pin number of the relais switch */, _relaisState);

  unsigned long currentMillis = millis();

  if (currentMillis - _previousMillis >= _intervalOff) {
    _previousMillis = currentMillis;
    _relaisState = 0x0;
  }

  if (_relaisState == 0x0 && currentMillis - _previousMillis >= _intervalOn) {
    _previousMillis = currentMillis;
    _relaisState = 0x1;
  }

  digitalWrite(5 /* Pin number of the relais switch */, _relaisState);
}
