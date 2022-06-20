use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: f32, b: f32) -> f32 {
    a + b
}

#[test]
pub fn add_test() {
    assert_eq!(2.05, add(1.02, 1.03));
}