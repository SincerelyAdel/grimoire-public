**`implements`** — class promises the methods of interface classes

`class c implements ifc_a, ifc_b;` declares that the class provides every pure virtual method of the listed interface classes. Lets unrelated classes share an API without sharing a base class.

```systemverilog
interface class printable;
  pure virtual function void print();
endclass

class packet implements printable;
  virtual function void print(); $display("packet"); endfunction
endclass
```
