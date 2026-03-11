use pulldown_cmark::{Parser, Options, html};

pub fn parse_markdown(markdown: &str) -> String {
    let mut option = Options::empty();
    option.insert(Options::ENABLE_TABLES);
    
    let parser = Parser::new_ext(markdown, option);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    
    html_output
}
    