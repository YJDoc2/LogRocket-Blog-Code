package main

import (
	"fmt"
	tea "github.com/charmbracelet/bubbletea"
	"log"
	"os"
)

type model struct {
	cwd      string
	entries  []string
	selected int
}

func initialModel() model {
	entries, err := os.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}
	var dirs = make([]string, len(entries))
	for i, e := range entries {
		dirs[i] = e.Name()
	}
	return model{
		cwd:      ".",
		entries:  dirs,
		selected: 0,
	}
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	case tea.KeyMsg:

		switch msg.String() {

		case "ctrl+c", "q":
			return m, tea.Quit

		case "up":
			if m.selected > 0 {
				m.selected--
			}

		case "down":
			if m.selected < len(m.entries)-1 {
				m.selected++
			}

		case "enter", " ":
			entry := m.entries[m.selected]
			m.selected = 0
			m.cwd = m.cwd + "/" + entry
			entries, err := os.ReadDir(m.cwd)
			if err != nil {
				log.Fatal(err)
			}
			var dirs = make([]string, len(entries))
			for i, e := range entries {
				dirs[i] = e.Name()
			}
			m.entries = dirs
		}
	}

	return m, nil
}

func (m model) View() string {
	s := "Directory List\n\n"

	for i, dir := range m.entries {

		cursor := " "
		if m.selected == i {
			cursor = ">"
		}

		s += fmt.Sprintf("%s %s\n", cursor, dir)
	}

	s += "\nPress q to quit.\n"

	return s
}

func main() {
	p := tea.NewProgram(initialModel())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Alas, there's been an error: %v", err)
		os.Exit(1)
	}
}
