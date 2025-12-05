#[cfg_attr(mobile, tauri::mobile_entry_point)]
use std::io::{Read, Write};

#[tauri::command]
fn remote_proxy(server_url: String, token: String, command: String) -> Result<String, String> {
  let url = server_url.trim();
  let mut rest = url;
  if let Some(stripped) = url.strip_prefix("http://") {
    rest = stripped;
  } else if let Some(stripped) = url.strip_prefix("https://") {
    return Err("https scheme not supported without deps".to_string());
  }

  let (host_port, path) = match rest.split_once('/') {
    Some((hp, p)) => (hp, format!("/{}", p)),
    None => (rest, "/".to_string()),
  };

  let (host, port) = match host_port.split_once(':') {
    Some((h, pr)) => (h.to_string(), pr.parse::<u16>().unwrap_or(80)),
    None => (host_port.to_string(), 80u16),
  };

  let body = format!("{{\"token\":\"{}\",\"command\":\"{}\"}}", token, command);
  let req = format!(
    "POST {} HTTP/1.1\r\nHost: {}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
    path,
    host,
    body.len(),
    body
  );

  let addr = format!("{}:{}", host, port);
  let mut stream = std::net::TcpStream::connect(addr).map_err(|e| e.to_string())?;
  stream.write_all(req.as_bytes()).map_err(|e| e.to_string())?;
  stream.flush().ok();

  let mut buf = String::new();
  stream.read_to_string(&mut buf).map_err(|e| e.to_string())?;

  // Extract body after headers
  if let Some(idx) = buf.find("\r\n\r\n") {
    let body = &buf[idx + 4..];
    return Ok(body.to_string());
  }
  Err("invalid response".to_string())
}

pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![remote_proxy])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
