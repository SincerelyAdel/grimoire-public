**`class`** — object-oriented type

Defines a type with properties and methods. Objects are created at run time with `new` and are reached through handles, which are `null` until assigned. Supports single inheritance with `extends`. Used for testbenches and not synthesizable. Ends with `endclass`.

```systemverilog
class packet;
  rand bit [7:0] len;
  function new(bit [7:0] len = 0);
    this.len = len;
  endfunction
endclass

packet p = new(4);
```
