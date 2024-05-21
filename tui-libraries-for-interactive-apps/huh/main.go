package main

import (
	"errors"
	"fmt"
	"github.com/charmbracelet/huh"
	"log"
)

func validateVersion(v string) error {
	if v == "test" {
		return errors.New("Test Error")
	}
	return nil
}

func main() {
	var name string
	version := "*"
	var registry string
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title("Package name to search for").
				CharLimit(100).
				Value(&name),
			huh.NewInput().
				Title("Version").
				CharLimit(100).
				Validate(validateVersion).
				Value(&version),
			huh.NewSelect[string]().
				Title("Select Registry to search in").
				Options(
					huh.NewOption("Registry 1", "https://reg1.com"),
					huh.NewOption("Registry 2", "https://reg2.com"),
					huh.NewOption("Registry 3", "https://reg3.com"),
				).
				Value(&registry),
		),
	)
	err := form.Run()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(name, version, registry)
}
