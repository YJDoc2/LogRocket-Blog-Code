use std::collections::VecDeque;
use std::fs;
use std::path::PathBuf;

#[derive(Default)]
struct Arguments {
    package_name: String,
    max_depth: usize,
}

fn get_arguments() -> Arguments {
    let args: Vec<_> = std::env::args().collect();
    if args.len() < 3 {
        eprintln!("filename is a required argument");
        std::process::exit(1);
    }

    let mut ret = Arguments::default();
    ret.max_depth = usize::MAX;

    if args[1] == "-f" {
        ret.package_name = args[2].clone();
    } else {
        ret.max_depth = args[2].parse().unwrap();
    }

    // now one argument is parsed, time for seconds

    if args.len() > 4 {
        if args[3] == "-f" {
            ret.package_name = args[4].clone();
        } else {
            ret.max_depth = args[4].parse().unwrap();
        }
    }

    return ret;
}

/// Not the dracula
fn count(name: &str, max_depth: usize) -> std::io::Result<usize> {
    let mut count = 0;
    // queue to store next dirs to explore
    let mut queue = VecDeque::new();
    // start with current dir
    queue.push_back((PathBuf::from("."), 0));
    loop {
        if queue.is_empty() {
            break;
        }
        let (path, crr_depth) = queue.pop_back().unwrap();
        if crr_depth > max_depth {
            continue;
        }

        for dir in fs::read_dir(path)? {
            let dir = dir?;
            // we are concerned only if it is a directory
            if dir.file_type()?.is_dir() {
                if dir.file_name() == name {
                    // we have a match, so stop exploring further
                    count += 1;
                } else {
                    // not a match so check its sub-dirs
                    queue.push_back((dir.path(), crr_depth + 1));
                }
            }
        }
    }

    return Ok(count);
}

fn main() {
    let args = get_arguments();
    match count(&args.package_name, args.max_depth) {
        Ok(c) => println!("{} uses found", c),
        Err(e) => eprintln!("error in processing : {}", e),
    }
}
