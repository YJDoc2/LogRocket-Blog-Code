use clap::{Parser, Subcommand};
use std::path::PathBuf;

fn parse_version(v: &str) -> Result<Version, String> {
    println!("version : {v}");
    return Ok(Version {
        major: 0,
        minor: 0,
        patch: 0,
    });
}
fn parse_url(url: &str) -> Result<String, String> {
    println!("url: {url}");
    return Ok(url.to_owned());
}

#[allow(dead_code)]
#[derive(Debug, Clone, Copy)]
struct Version {
    major: u16,
    minor: u16,
    patch: u16,
}

#[derive(Debug, Subcommand)]
enum Commands {
    /// Find a packge from name
    Find {
        /// name of the package to find
        name: String,
        /// specific version to find
        #[clap(long,short,value_parser=parse_version)]
        version: Option<Version>,
        /// name of the package to find
        #[clap(long,short,value_parser=parse_url)]
        registry: Option<String>,
    },
    Download {
        /// name of the package to find
        name: String,
        /// output path for the downloaded package
        output: PathBuf,
        /// display progress or not
        #[clap(long, short, default_value_t = false)]
        silent: bool,
        /// specific version to find
        #[clap(long,short,value_parser=parse_version)]
        version: Option<Version>,
        /// name of the package to find
        #[clap(long,short,value_parser=parse_url)]
        registry: Option<String>,
    },
}

#[derive(Parser, Debug)]
#[command(version,long_about = None)]
#[command(about = "An example of clap-rs for the blogpost on tuis")]
struct Args {
    #[command(subcommand)]
    cmd: Commands,
}

fn main() {
    let t = Args::parse();
    dbg!(t);
}
