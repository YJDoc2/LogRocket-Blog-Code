use std::sync::OnceLock;

static LOG_LEVEL: OnceLock<String> = OnceLock::new();

fn get_log_level() -> String {
    match std::env::var("LOG_LEVEL") {
        Ok(s) => s,
        Err(_) => "WARN".to_string(),
    }
}

pub fn _main() {
    let log_level = LOG_LEVEL.get_or_init(get_log_level);
    println!("{}", log_level);
}
