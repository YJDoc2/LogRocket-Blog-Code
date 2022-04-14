use clap::{Parser, Subcommand};
use logger::DummyLogger;
use std::collections::VecDeque;
use std::fs;
use std::path::PathBuf;
mod logger;

fn validate_package_name(name: &str) -> Result<(), String> {
    if name.trim().len() != name.len() {
        Err(String::from(
            "package name cannot have leading and trailing space",
        ))
    } else {
        Ok(())
    }
}

#[derive(Parser, Debug)]
#[clap(author = "Author Name", version, about)]
/// A Very simple Package Hunter
struct Arguments {
    #[clap(default_value_t=usize::MAX,short, long)]
    /// maximum depth to which sub-directories should be explored
    max_depth: usize,
    #[clap(short, long, parse(from_occurrences))]
    verbosity: usize,
    #[clap(subcommand)]
    cmd: SubCommand,
}

#[derive(Subcommand, Debug)]
enum SubCommand {
    /// Count how many times the package is used
    Count {
        #[clap(forbid_empty_values = true, validator = validate_package_name)]
        /// Name of the package to search
        package_name: String,
    },
    /// list all the projects
    Projects {
        #[clap(short, long, default_value_t = String::from("."),forbid_empty_values = true, validator = validate_package_name)]
        /// directory to start exploring from
        start_path: String,
        #[clap(short, long, multiple_values = true, value_delimiter = ':')]
        /// paths to exclude when searching
        exclude: Vec<String>,
    },
}

/// Not the dracula
fn count(name: &str, max_depth: usize, logger: &logger::DummyLogger) -> std::io::Result<usize> {
    let mut count = 0;
    logger.debug("Initializing queue");
    // queue to store next dirs to explore
    let mut queue = VecDeque::new();
    logger.debug("Adding current dir to queue");
    // start with current dir
    queue.push_back((PathBuf::from("."), 0));
    logger.extra("starting");
    loop {
        if queue.is_empty() {
            logger.extra("queue empty");
            break;
        }
        let (path, crr_depth) = queue.pop_back().unwrap();
        logger.debug(format!("path :{:?}, depth :{}", path, crr_depth));
        if crr_depth > max_depth {
            continue;
        }
        logger.extra(format!("exploring {:?}", path));
        for dir in fs::read_dir(path)? {
            let dir = dir?;
            // we are concerned only if it is a directory
            if dir.file_type()?.is_dir() {
                if dir.file_name() == name {
                    logger.log(format!("match found at {:?}", dir.path()));
                    // we have a match, so stop exploring further
                    count += 1;
                } else {
                    logger.debug(format!("adding {:?} to queue", dir.path()));
                    // not a match so check its sub-dirs
                    queue.push_back((dir.path(), crr_depth + 1));
                }
            }
        }
    }
    logger.extra("search completed");
    return Ok(count);
}

fn projects(
    start: &str,
    max_depth: usize,
    exclude: &[String],
    logger: &DummyLogger,
) -> std::io::Result<()> {
    logger.debug("Initializing queue");
    // queue to store next dirs to explore
    let mut queue = VecDeque::new();
    logger.debug("Adding start dir to queue");
    // start with current dir
    queue.push_back((PathBuf::from(start), 0));
    logger.extra("starting");
    loop {
        if queue.is_empty() {
            logger.extra("queue empty");
            break;
        }
        let (path, crr_depth) = queue.pop_back().unwrap();
        logger.debug(format!("path :{:?}, depth :{}", path, crr_depth));
        if crr_depth > max_depth {
            continue;
        }
        logger.extra(format!("exploring {:?}", path));
        // we label the loop so we can continue it from inner loop
        'outer: for dir in fs::read_dir(path)? {
            let dir = dir?;
            let _path = dir.path();
            let temp_path = _path.to_string_lossy();
            for p in exclude {
                if temp_path.contains(p) {
                    // this specifies that it should continue the 'outer loop
                    // not the for p in exclude loop
                    // I originally had bug where I just used continue, and was wondering why
                    // the projects weren't getting filtered!
                    continue 'outer;
                }
            }
            // we are concerned only if it is a directory
            if dir.file_type()?.is_dir() {
                if dir.file_name() == ".git" {
                    logger.log(format!("project found at {:?}", dir.path()));
                    // we have a match, so stop exploring further
                    println!("{:?}", dir.path());
                } else {
                    logger.debug(format!("adding {:?} to queue", dir.path()));
                    // not a match so check its sub-dirs
                    queue.push_back((dir.path(), crr_depth + 1));
                }
            }
        }
    }
    logger.extra("search completed");
    return Ok(());
}

fn main() {
    let args = Arguments::parse();
    let logger = logger::DummyLogger::new(args.verbosity);
    match args.cmd {
        SubCommand::Count { package_name } => match count(&package_name, args.max_depth, &logger) {
            Ok(c) => println!("{} uses found", c),
            Err(e) => eprintln!("error in processing : {}", e),
        },
        SubCommand::Projects {
            start_path,
            exclude,
        } => match projects(&start_path, args.max_depth, &exclude, &logger) {
            Ok(_) => {}
            Err(e) => eprintln!("error in processing : {}", e),
        },
    }
}
