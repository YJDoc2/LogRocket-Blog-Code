import os
from textual.app import App 
from textual.widgets import Header, Footer, Button, Static


def create_id(s:str):
    return s.replace(".","_").replace("@","_")

class DirDisplay(Static):
    directory = "."
    dir_list = [Button(x,id=x) for x in os.listdir(".")]

    def on_button_pressed(self, event):
        self.directory = os.path.join(self.directory,str(event.button.label))
        self.dir_list = [];
        for dir in os.listdir(self.directory):
            self.dir_list.append(Button(dir,id=create_id(dir)))
        self.remove_children()
        self.mount_all(self.dir_list)
    
    def compose(self):
       return self.dir_list 

class Explorer(App):

   def compose(self):
        yield Header()
        yield DirDisplay()
        yield Footer()

if __name__ == "__main__":
    # print(os.listdir("."))
    app = Explorer()
    app.run()
