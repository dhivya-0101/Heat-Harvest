/*
  HeatHarvest - ESP32 Data Transmitter
  Sends real-time energy monitoring data to the HeatHarvest Dashboard.
*/

#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Replace with your Laptop/Server IP address
const char* serverUrl = "http://192.168.1.XX:3000/api/data"; 

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Simulated Sensor Readings
    float temp = 75.5 + (random(0, 50) / 10.0);
    float voltage = 1.48 + (random(0, 20) / 100.0);
    int battery = 85;
    long rssi = WiFi.RSSI();

    String jsonPayload = "{\"temp\":" + String(temp) + 
                         ",\"voltage\":" + String(voltage) + 
                         ",\"battery\":" + String(battery) + 
                         ",\"signal\":" + String(rssi) + "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("Data Sent. Response: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending POST: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  delay(5000); // Send data every 5 seconds
}
