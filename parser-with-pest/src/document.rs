use std::collections::VecDeque;

use crate::Rule;
use pest::iterators::Pair;

// Stores individual text or tag node
#[derive(Debug)]
pub enum Node {
    TagNode(Tag),
    TextNode(String),
}

// For storing attribute info
#[derive(Debug)]
pub struct Attr {
    name: String,
    value: String,
}

// Represents a html tag
#[derive(Debug)]
pub struct Tag {
    typ: TagType,
    name: String,
    attrs: Vec<Attr>,
}

// represents what kind of tag it is
#[derive(Debug, PartialEq, Eq)]
pub enum TagType {
    Start,
    End,
    SelfClosing,
}

// represents a document tree
#[derive(Debug)]
pub struct NodeTree {
    root: Node,
    children: Vec<NodeTree>,
}

impl NodeTree {
    fn new(node: Node) -> Self {
        Self {
            root: node,
            children: Vec::new(),
        }
    }
    fn _print_indent(indent: u8) {
        for _ in 0..indent {
            print!(" ");
        }
    }
    fn _print(tree: &Vec<Self>, indent: u8) {
        for node in tree {
            NodeTree::_print_indent(indent);
            NodeTree::_print_node(&node.root);
            NodeTree::_print(&node.children, indent + 2)
        }
    }
    fn _print_node(node: &Node) {
        match node {
            Node::TagNode(tag) => {
                print!("- {}", tag.name);
            }
            Node::TextNode(s) => {
                print!("- text({})", s);
            }
        }
        print!("\n");
    }
    pub fn print_tree(&self) {
        NodeTree::_print_node(&self.root);
        NodeTree::_print(&self.children, 2);
    }
}

// this will parse a tag to convert from Pest representation to our representation
pub fn parse_tag(pair: Pair<Rule>) -> Tag {
    // as tag will always have on inner , because the way we have defined the rule
    let tag = pair.into_inner().next().unwrap();

    // map the rule to tag type
    let tag_type = match tag.as_rule() {
        Rule::start_tag => TagType::Start,
        Rule::end_tag => TagType::End,
        Rule::self_closing_tag => TagType::SelfClosing,
        _ => unreachable!(),
    };

    let mut tag_data = tag.into_inner();
    
    // extract name
    let name = tag_data.next().unwrap().as_str().to_owned();


    let mut attributes = Vec::new();

    // parse all attributes on a tag, 
    for attr in tag_data {
        if !matches!(attr.as_rule(), Rule::attr) {
            unreachable!("as per syntax, the tag name is followed by zero or more attr only");
        }
        let mut temp = attr.into_inner();
        // as per the parsing rule, attr has first the name, then the value
        let attr_name = temp.next().unwrap().as_str();
        let attr_val = temp.next().unwrap().as_str();
        attributes.push(Attr {
            name: attr_name.to_owned(),
            value: attr_val.to_owned(),
        });
    }

    Tag {
        typ: tag_type,
        name: name,
        attrs: attributes,
    }
}

// parses the list of tags into a document tree
pub fn parse(nodes: Vec<Node>) -> NodeTree {
    let mut stack = VecDeque::new();
    let mut crr: Option<NodeTree> = None;

    // iterate over the nodes
    for node in nodes {
        match node {
            // if it is text, then simply push it as a child of current active node 
            Node::TextNode(_) => {
                crr.as_mut().unwrap().children.push(NodeTree::new(node));
            }
            // else check what kind of tag it is
            Node::TagNode(ref tag) => match tag.typ {
                // if tag is starting, then push current active tag into stack,
                // and set this tag as current active
                TagType::Start => {
                    if crr.is_some() {
                        stack.push_back(crr.unwrap());
                    }
                    crr = Some(NodeTree::new(node));
                }
                // if tag is self closing, add it as child of current active node
                TagType::SelfClosing => {
                    crr.as_mut().unwrap().children.push(NodeTree::new(node));
                }
                // if it is end tag, we have to take care of some cases
                TagType::End => {
                    // get name of current active tag
                    let crr_tag_name = match crr.as_ref().unwrap().root {
                        Node::TagNode(ref tag) => tag.name.clone(),
                        _ => unreachable!(), // as text is always pushed as child, current has to be a tag
                    };
                    // if closing tag corresponds to current active tag,
                    // pop tag from stack, add current active as its child,
                    // and set it as current active
                    if tag.name == crr_tag_name {
                        if let Some(mut temp) = stack.pop_back() {
                            temp.children.push(crr.unwrap());
                            crr = Some(temp);
                        }
                    } else {
                        // this is a rouge closing tag.
                        // Either we have skipped some closing tag, and thus this is 
                        // closing some ancestor tag, eg closing div in '<div><p><p></div>'
                        // or this closing tag had no  corresponding opening tag. eg <p></div>
                        let mut exists = false;
                        // we first find if corresponding opening tag exists
                        for node in &stack {
                            match &node.root {
                                Node::TagNode(t) => {
                                    if t.name == tag.name {
                                        exists = true;
                                    }
                                }
                                _ => unreachable!(),
                            }
                        }
                        // if we don't have corresponding opening tag, we can ignore this closing tag
                        if !exists {
                            continue;
                        }

                        // We have some corresponding opening tag
                        // keep popping trees from stack, set current as children of popped
                        // and set the popped as current
                        while let Some(mut tree) = stack.pop_back() {
                            let match_found = match tree.root {
                                Node::TagNode(ref ttag) => ttag.name == tag.name,
                                _ => false,
                            };
                            tree.children.push(crr.unwrap());
                            crr = Some(tree);

                            // as the matched tag is closed, we have to do another pop
                            // to set correct current tag
                            if match_found {
                                let mut tree = stack.pop_back().unwrap();
                                tree.children.push(crr.unwrap());
                                crr = Some(tree);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return crr.unwrap();
}
