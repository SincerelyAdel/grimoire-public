**`super`** — reach the parent class

Inside a derived class, `super.method()` calls the parent's version of an overridden method and `super.prop` reaches a parent property. In a constructor, `super.new(...)` must come first.

```systemverilog
class my_driver extends base_driver;
  function new(string name);
    super.new(name);
  endfunction
  task run();
    super.run();
    extra_checks();
  endtask
endclass
```
