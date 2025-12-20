use std::{io::Write, process::Stdio};

use comrak::{
    Arena, ComrakOptions, format_html,
    nodes::{AstNode, NodeHtmlBlock, NodeValue},
    parse_document,
};

// it would be neat if we could just write this in talk.
fn main() {
    let template = std::fs::read_to_string("../index.html.template").unwrap();
    let content = std::fs::read_to_string("../index.md").unwrap();
    let arena = Arena::new();
    let mut options = ComrakOptions::default();
    options.render.unsafe_ = true;

    let root = parse_document(&arena, &content, &options);
    replace_code_blocks(root);

    let mut compiled_html = Vec::new();
    format_html(root, &options, &mut compiled_html).unwrap();
    let compiled_html = String::from_utf8(compiled_html).unwrap();
    let result = template.replace("{CONTENT_GOES_HERE}", compiled_html.as_str());
    println!("{result}");
}

fn highlight(code: &str, is_editable: bool) -> String {
    let mut child = std::process::Command::new("/home/nakajima/apps/talk/target/release/talk")
        .arg("html")
        .arg("-")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();

    child
        .stdin
        .as_mut()
        .unwrap()
        .write_all(code.as_bytes())
        .unwrap();
    let output = child.wait_with_output().unwrap();

    if is_editable {
        format!(
            "<pre class='editable'>{}</pre>",
            String::from_utf8_lossy(&output.stdout)
        )
    } else {
        format!("<pre>{}</pre>", String::from_utf8_lossy(&output.stdout))
    }
}

fn runnable(code: &str) -> String {
    let code_str = highlight(code, true);
    format!(
        "<div class='runnable'>
            {code_str}
            <div class='actions'>
                <button type='button' class='run'>Run</button>
                <button type='button' class='run'>Lower</button>
                <button type='button' class='run'>Format</button>
            </div>
        </div>"
    )
}

fn replace_code_blocks<'a>(node: &'a AstNode<'a>) {
    for child in node.children() {
        replace_code_blocks(child);
    }

    let code = {
        let data = node.data.borrow();
        match &data.value {
            NodeValue::CodeBlock(block) => Some(block.literal.clone()),
            NodeValue::Code(code) => Some(code.literal.clone()),
            _ => None,
        }
    };

    if let Some(code) = code {
        node.data.borrow_mut().value = NodeValue::HtmlBlock(NodeHtmlBlock {
            block_type: 1,
            literal: runnable(code.trim()),
        });
    }
}
