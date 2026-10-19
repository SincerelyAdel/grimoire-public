**`this`** — handle to the current object

Inside a class method, refers to the object the method was called on. Use it to reach a property hidden by an argument of the same name, or to pass the current object to another method.

```systemverilog
class reg_model;
  int size;
  function new(int size);
    this.size = size;
  endfunction
endclass
```
