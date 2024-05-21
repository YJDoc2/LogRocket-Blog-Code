use crossterm::{
    event::{self, KeyCode, KeyEventKind},
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
    ExecutableCommand,
};
use ratatui::{prelude::*, widgets::*};
use std::{
    io::{stdout, Result},
    path::PathBuf,
};

fn main() -> Result<()> {
    stdout().execute(EnterAlternateScreen)?;
    enable_raw_mode()?;
    let mut terminal = Terminal::new(CrosstermBackend::new(stdout()))?;
    terminal.clear()?;

    let mut cwd = PathBuf::from(".");
    let mut selected = 0;
    let mut state = ListState::default();
    let mut entries: Vec<String> = std::fs::read_dir(cwd.clone())
        .unwrap()
        .map(|entry| entry.unwrap().file_name())
        .map(|s| s.into_string().unwrap())
        .collect::<Vec<_>>();

    loop {
        if event::poll(std::time::Duration::from_millis(16))? {
            if let event::Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('q') => {
                            break;
                        }
                        KeyCode::Up => selected = (entries.len() + selected - 1) % entries.len(),
                        KeyCode::Down => selected = (selected + 1) % entries.len(),
                        KeyCode::Enter => {
                            cwd = cwd.join(entries[selected].clone());
                            entries = std::fs::read_dir(cwd.clone())
                                .unwrap()
                                .map(|entry| entry.unwrap().file_name())
                                .map(|s| s.into_string().unwrap())
                                .collect::<Vec<_>>();
                            selected = 0;
                        }
                        _ => {}
                    }
                }
            }
        }
        let list = List::new(entries.clone())
            .block(Block::bordered().title("Directory Entries"))
            .style(Style::default().fg(Color::White))
            .highlight_style(
                Style::default()
                    .add_modifier(Modifier::BOLD)
                    .bg(Color::White)
                    .fg(Color::Black),
            )
            .highlight_symbol(">");

        terminal.draw(|frame| {
            let area = frame.size();
            state.select(Some(selected));
            frame.render_stateful_widget(list, area, &mut state);
        })?;
    }

    stdout().execute(LeaveAlternateScreen)?;
    disable_raw_mode()?;
    Ok(())
}
