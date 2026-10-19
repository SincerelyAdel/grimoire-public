**`new`** — constructor

In a class, `function new(...)` is the constructor, run when an object is created. `h = new(args);` allocates an object; `new[n]` sizes a dynamic array (`new[n](old)` copies the old contents). A class without `new` gets a default one. Calling `super.new(...)` must be the first statement in a derived constructor.

```systemverilog
class packet;
  int len;
  function new(int len = 4);
    this.len = len;
  endfunction
endclass

packet p = new(8);
int dyn[] = new[16];
```
