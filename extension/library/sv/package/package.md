**`package`** — shared namespace of declarations

Holds types, parameters, functions and tasks so that several modules can share them. Members are reached with `import` or with the `pkg::name` scope operator. Ends with `endpackage`.

```systemverilog
package bus_pkg;
  typedef logic [7:0] byte_t;
  localparam int TIMEOUT = 100;
endpackage
```
