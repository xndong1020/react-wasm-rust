```rust
cargo new wasm-lib --lib
```

step 2: update wasm-lib/Cargo.toml file

```toml
[package]
name = "rusty-react"
version = "1.0.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
```

step 3: to download packages & build

```
cargo build
```

step 4:
This build in-itself did not do much for us, we’ll need to add a useful taraget for our builds. To add a new target for Rust, we can run the following command:

```
rustup target add wasm32-unknown-unknown
```

This will give us the appropriate target for our compiled Rust code, allowing us to add it to our React application.

output:

```
info: downloading component 'rust-std' for 'wasm32-unknown-unknown'
info: installing component 'rust-std' for 'wasm32-unknown-unknown'
```

step 5: add a new func

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn add_test() {
    assert_eq!(1 + 1, add(1, 1));
}
```

step 6: Build as Wasm library with wasm-pack

By using wasm-bindgen, you can build Rust as Wasm. However, To load and run Wasm from JavaScript, You need some JavaScript boilerplate codes (like WebAssembly.instantiate).

To do that, you can use wasm-pack!

```
cargo install wasm-pack
```

step 7: add a npm script

```
"build:wasm": "cd wasm-lib && wasm-pack build --target web --out-dir pkg"
```

run `yarn build:wasm` will generate a `wasm-lib\pkg` folder, which contains

```
pkg
├── package.json
├── wasm_lib.d.ts
├── wasm_lib.js
├── wasm_lib_bg.wasm
└── wasm_lib_bg.wasm.d.ts
```

From the `wasm_lib.d.ts`, it has a `init` function, and a `add` function

```ts
/* tslint:disable */
/* eslint-disable */
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a: number, b: number): number;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly add: (a: number, b: number) => number;
}

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function init(
  module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>;
```

step 8:
So you can install the Wasm library to other project easily. Let’s install it to the React app.

```
npm i ./wasm-lib/pkg
```

this package will be installed as `"wasm-lib": "file:wasm-lib/pkg",`

step 9: Call the Wasm function from the React app.

App.tsx
```tsx
import React, { useState, useEffect } from "react";
import init, { add } from "wasm-lib";
import "./App.css";

function App() {
  const [ans, setAns] = useState(0);
  useEffect(() => {
    init().then(() => {
      setAns(add(1, 1));
    });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>1 + 1 = {ans}</p>
      </header>
    </div>
  );
}

export default App;
```
