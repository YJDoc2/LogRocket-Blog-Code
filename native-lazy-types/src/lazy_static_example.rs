use lazy_static::lazy_static;

lazy_static! {
    static ref LOG_LEVEL: String = get_log_level();
}

fn get_log_level() -> String {
    match std::env::var("LOG_LEVEL") {
        Ok(s) => s,
        Err(_) => "WARN".to_string(),
    }
}

pub fn _main() {
    println!("{}", *LOG_LEVEL);
}
