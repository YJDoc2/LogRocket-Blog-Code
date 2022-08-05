use std::marker::PhantomData;

struct Low;
struct Medium;
struct High;

struct Heater<State> {
    state: PhantomData<State>,
}

impl Heater<Low> {
    fn turn_to_medium(self) -> Heater<Medium> {
        Heater { state: PhantomData }
    }
}

impl<T> Heater<T> {}

fn only_for_medium_heater(h: &mut Heater<Medium>) {}

struct Wrapper<DataType> {
    data: DataType,
}

struct Ref<'a> {
    reference: &'a u8,
}

fn sort<Sortable: Ord + Eq>(a: Sortable, b: Sortable) -> bool {
    a < b
}
fn sort2<T>(a: T, b: T) -> bool
where
    T: Ord + Eq,
{
    a < b
}

fn return_reference<'a, 'b>(in1: &'a [usize], in2: &'b [usize]) -> &'a usize {
    &in1[0]
}

fn return_reference2<'a, 'b: 'a>(in1: &'a [usize], in2: &'b [usize]) -> &'a usize {
    &in2[0]
}

fn main() {
    println!("Hello, world!");
    let c: Vec<usize> = [1, 2, 3].into_iter().collect();
    let c: Vec<_> = [1, 2, 3].into_iter().collect();
    let d1 = Wrapper { data: 5 };
    let d2 = Wrapper {
        data: "data".to_owned(),
    };

    let t1: Heater<Low> = Heater { state: PhantomData };
}
