# talk talk

<span style="color: white;">talk talk</span> is a programming language. It kind of looks like Swift or Rust or Go if you squint.

It has some types you may have heard of before.

```tlk
123               // Ints
1.23              // Floats
true              // Booleans
"Hello 🗿"        // Strings
[1, 2, 3]         // Arrays
(true, 123)       // Tuples?
{ fizz: "buzz" }  // Records??
```

Here, have some arithmetic.

```tlk
2 * 3 + 4 / 2 // I can't do this in my head
```

Maybe you like assigning things. Like a variable?

```tlk
let a = 1
let b = 2
let c = a + b
c // => 3
```

Here’s how functions look to define and call.

```tlk
func add(x) {
	x + 1
}

add(1) // => 2 Wow. Imagine that
```

Maybe you like types? You can specify them if you want.

```tlk
let a: Int = 1
let b: Float = 2.0
let c = a + b // Uh oh, type error!
```

They’ll be checked. Otherwise talk talk tries to infer everything. Including generics.

```tlk
func identity(x) { x }
identity(1.23) // => 1.23 (Float)
identity(true) // => true (Bool)
```

You could write the function above explicitly too.

```tlk
// it's good to be explicit sometimes
func identity<T>(x: T) { x }
```

Maybe you like structs in other languages. talktalk has those.

```tlk
struct Person {
    let name: String

    func greet() {
        // Strings can be concat'd
        print("hey, i'm " + self.name)
    }
}

Person(name: "Pat").greet()
```

We've got sum types too:

```tlk
enum Response {
    case ok(String), redirect(String), other(Int)
}

let response = match Response.ok("It's cool") {
    .ok(data) -> print(data),
    .redirect(location) -> print("redirect " + location),
    .other(code) -> print(code)
}
```
