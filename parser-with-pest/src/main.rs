use pest::Parser;
use pest_derive::Parser;

#[allow(dead_code)]
mod document;

const HTML: &str = r#"
<html lang="en" l="abc"> 
<head> 
</head> 
<body> 
    <div class="c1" id="id1"> 
        Hello 
        <img src="path"/> 
    </div> 
    <div>
        <p>
            <p>
                abc
    </div>
    <p>
        jkl
    </p>
    <img/>
    </p> 
    </div>
</body> 
</html>"#;

#[derive(Parser)]
#[grammar = "html.pest"]
pub struct HtmlParser;

fn main() {
    let parse = HtmlParser::parse(Rule::document, HTML).unwrap();
    let mut nodes = Vec::new();
    for pair in parse.into_iter() {
        match pair.as_rule() {
            Rule::document => {
                for tag in pair.into_inner() {
                    if matches!(tag.as_rule(), Rule::tag) {
                        nodes.push(document::Node::TagNode(document::parse_tag(tag)));
                    } else if matches!(tag.as_rule(), Rule::text) {
                        nodes.push(document::Node::TextNode(tag.as_span().as_str().to_string()));
                    }
                }
            }
            _ => unreachable!(), // as we are parsing the document rule, if it is successful, no other rule will be returned
        }
    }
    let doc = document::parse(nodes);
    doc.print_tree();
}
