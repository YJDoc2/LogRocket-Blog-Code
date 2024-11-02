mod lazy_static_example;
mod native_lazy_example;
mod native_once_example;
mod once_cell_example;

fn main() {
    lazy_static_example::_main();
    once_cell_example::_main();
    native_lazy_example::_main();
    native_once_example::_main();
}
