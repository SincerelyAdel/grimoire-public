**`static`** — shared storage

For a variable in a subroutine, one copy is shared by every call. For a class member, one copy is shared by every object and it can be used without creating an object.

```systemverilog
class packet;
  static int count;
  function new();
    count++;
  endfunction
endclass
```
