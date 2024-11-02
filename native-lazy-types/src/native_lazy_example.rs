use std::sync::LazyLock;

static LOG_LEVEL: LazyLock<String> = LazyLock::new(get_log_level);

fn get_log_level() -> String {
    match std::env::var("LOG_LEVEL") {
        Ok(s) => s,
        Err(_) => "WARN".to_string(),
    }
}

pub fn _main() {
    println!("{}", *LOG_LEVEL);
}
