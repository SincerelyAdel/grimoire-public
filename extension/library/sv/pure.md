**`pure`** — method with no body

`pure virtual` declares a method that has no implementation and must be overridden. Allowed in `virtual` (abstract) classes and interface classes. Also `pure constraint`, which derived classes must define.

```systemverilog
virtual class shape;
  pure virtual function real area();
endclass
```
