use std::collections::HashMap;
use wasm_bindgen::prelude::*;

// NOTE : This does not handle newlines or spaces or any other exceptions,
// but as the intention of post is to show connecting Rust and JS,
// we consider only ideal conditions and not errors for the parsing functions
#[wasm_bindgen]
pub fn parse(input: &str) -> JsValue {
    let mut ret: HashMap<String, Vec<f32>> = HashMap::new();
    let (keys, values) = input.split_once(';').unwrap();
    let keys: Vec<_> = keys.split(',').collect();
    let mut temp: Vec<Vec<f32>> = Vec::with_capacity(keys.len());
    for _ in 0..keys.len() {
        temp.push(Vec::new());
    }
    for row in values.split(';') {
        for (i, v) in row.split(',').enumerate() {
            temp[i].push(v.parse().unwrap());
        }
    }
    for (k, v) in keys.into_iter().zip(temp.into_iter()) {
        ret.insert(k.to_owned(), v);
    }
    JsValue::from_serde(&ret).unwrap()
}
