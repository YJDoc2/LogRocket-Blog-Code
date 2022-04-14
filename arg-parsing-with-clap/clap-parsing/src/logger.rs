use std::fmt::Display;

pub struct DummyLogger {
    verbosity: usize,
}

impl DummyLogger {
    pub fn new(verbosity: usize) -> Self {
        DummyLogger { verbosity }
    }

    pub fn log<T: Display>(&self, msg: T) {
        println!("{}", msg);
    }

    pub fn extra<T: Display>(&self, msg: T) {
        if self.verbosity > 0 {
            println!("{}", msg);
        }
    }

    pub fn debug<T: Display>(&self, msg: T) {
        if self.verbosity > 1 {
            println!("{}", msg);
        }
    }
}
