**`const`** — value that cannot change

A `const` variable gets its value at declaration and cannot be written afterwards. In a class, a `const` property can instead be set once in the constructor. `const ref` passes an argument by reference without allowing the callee to modify it.

```systemverilog
const int MAX = 64;

class packet;
  const int id;
  function new(int id); this.id = id; endfunction
endclass
```
