**`protected`** — visible to the class and its children

A `protected` property or method can be used inside the class and in classes derived from it, but not from outside. In source files, `` `protect``/`protected` blocks also mark encrypted IP.

```systemverilog
class base;
  protected int id;
endclass

class child extends base;
  function int get_id(); return id; endfunction
endclass
```
