**`local`** — visible only inside the class

A `local` property or method can be used only within the class that declares it, not in derived classes or from outside. Compare `protected`, which allows derived classes. In inline constraints, `local::name` refers to a variable in the calling scope rather than in the object.

```systemverilog
class account;
  local int balance;
  function void deposit(int v); balance += v; endfunction
endclass
```
