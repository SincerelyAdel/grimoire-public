**`extends`** — derive a class or interface class

`class child extends parent;` inherits the parent's properties and methods; the child can add members and override virtual methods. A class extends at most one class, but can implement many interface classes. An interface class can extend several other interface classes.

```systemverilog
class burst_packet extends packet;
  rand int beats;
  constraint c_beats { beats inside {[2:16]}; }
endclass
```
